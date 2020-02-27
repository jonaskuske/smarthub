import path from 'path'
import http from 'http'
import express from 'express'
import bodyParser from 'body-parser'
import history from 'connect-history-api-fallback'
import socketIo from 'socket.io'
import { State } from './state'
import { createProxyMiddleware } from 'http-proxy-middleware'
import * as ipAddress from './ip-address'
import {
  REGISTER_CONTROLLER,
  ACTIONS,
  SERVER_UPDATES,
  SMARTHUB_UPDATES,
} from '../shared/event-types'

const isProd = process.env.NODE_ENV === 'production'
const fromRoot = rootPath => path.resolve(__dirname, '../', rootPath)
const log = console.log

const PORT = Number(process.env.PORT) || 8080
const CONTROLLER_ROOM = 'controller'

const app = express()
const server = http.createServer(app)
const io = socketIo(server)

const smarthubNamespace = io.of('/smarthub')

const state = new State({ onUpdate: smarthubNamespace.emit })

app.use(bodyParser.json())

// Handle POST requests to /emit so Web Hooks/Google Assistant can send actions.
app.post('/emit', (req, res) => {
  const { EVENT } = req.body

  if (Object.values(ACTIONS).includes(EVENT)) {
    io.to(CONTROLLER_ROOM).emit(EVENT)
    res.status(200).send('OK')
  } else res.status(400).send(`Unknown event: ${EVENT}`)
})

// Serve the client application.
// In prod, use history middleware to allow client-side routing & statically serve the compiled app.
// In dev, proxy to localhost:8081 where the Parcel development server is running.
if (isProd) {
  app.use(history())
  app.use(express.static(fromRoot('client/dist')))
} else {
  const proxyOptions = { target: 'http://localhost:8081', changeOrigin: true }
  app.use(createProxyMiddleware(proxyOptions))
}

function handleSmarthubConnection(socket) {
  // Emit current state to so client can set its initial state
  socket.emit(SMARTHUB_UPDATES.ROOT, state.state)

  // Forward emitted actions to the controller
  for (const action of Object.values(ACTIONS)) {
    socket.on(action, () => io.to(CONTROLLER_ROOM).emit(action))
  }
}

function handleControllerConnection(socket) {
  socket.join(CONTROLLER_ROOM, () => {
    state.updateController({ online: true })

    socket.on('disconnect', () => state.updateController({ online: false }))

    socket.on(SERVER_UPDATES.ROOM_TEMP, temperature => state.updateRoom({ temperature }))
    socket.on(SERVER_UPDATES.ROOM_HUMIDITY, humidity => state.updateRoom({ humidity }))

    socket.on(SERVER_UPDATES.ALARM_SILENT_MODE_STATE, silentMode => {
      state.updateDevice('Alarmanlage', { silentMode })
    })
    socket.on(SERVER_UPDATES.ALARM_STATE, alarmState => {
      state.updateDevice('Alarmanlage', { state: alarmState })
    })

    socket.on(SERVER_UPDATES.KETTLE_TEMP, temperature => {
      state.updateDevice('Wasserkocher', { temperature })
    })
    socket.on(SERVER_UPDATES.KETTLE_ACTIVE_STATE, active => {
      state.updateDevice('Wasserkocher', { active })
    })
  })
}

smarthubNamespace.on('connection', handleSmarthubConnection)

io.on('connection', socket => {
  socket.on(REGISTER_CONTROLLER, () => handleControllerConnection(socket))
})

server.listen(PORT, () => {
  if (isProd) {
    log(`Server running on port ${PORT}.`)
  } else {
    log(`\nApp is running at http://localhost:${PORT}.`)

    const ip = ipAddress.local()
    if (ip) log(`Controllers can connect to ${ip} on port ${PORT}.`)
    else log(`Controllers can connect to your local IP (failed to auto-detect) on port ${PORT}.`)
  }
})
