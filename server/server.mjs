import path from 'path'
import { fileURLToPath } from 'url'
import http from 'http'
import express from 'express'
import history from 'connect-history-api-fallback'
import * as socketIo from 'socket.io'
import { State } from './state.mjs'
import * as notificationService from './notifications.mjs'
import { createProxyMiddleware } from 'http-proxy-middleware'
import * as ipAddress from './ip-address.mjs'
import chalk from 'chalk-template'
import {
  REGISTER_CONTROLLER,
  CONTROLLER_ACTIONS,
  SERVER_UPDATES,
  SMARTHUB_UPDATES,
} from '../shared/event-types.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const isProd = process.env.NODE_ENV === 'production'
const fromRoot = (rootPath) => path.resolve(__dirname, '../', rootPath)
const info = console.log

const PORT = Number(process.env.PORT) || 8080
const CONTROLLER_ROOM = 'controller'

const app = express()
const server = http.createServer(app)
const io = new socketIo.Server(server, {
  allowEIO3: true, // controllers use the old socket.io v2 protocol
})

const smarthubNamespace = io.of('/smarthub')

const state = new State({
  onUpdate(event, ...data) {
    smarthubNamespace.emit(event, ...data)
  },
})

app.use(express.json())

// Handle POST requests to /emit so Web Hooks/Google Assistant can send actions to the controller.
app.post('/emit', (req, res) => {
  const { EVENT } = req.body

  if (Object.values(CONTROLLER_ACTIONS).includes(EVENT)) {
    io.to(CONTROLLER_ROOM).emit(EVENT)
    res.sendStatus(200)
  } else res.status(400).send(`Unknown event: ${EVENT}`)
})

// Serve the client application.
if (isProd) {
  // In prod, use history middleware (to allow client-side routing) & statically serve the compiled app.
  app.use(history())
  app.use(
    express.static(fromRoot('client/dist'), {
      maxAge: '1y',
      setHeaders(res, path) {
        if (path.endsWith('.html')) {
          res.set('Cache-Control', 'public, max-age=0')
        }
      },
    }),
  )
} else {
  // In dev, proxy to localhost:8081 where the Parcel development server is running.
  const proxyOptions = { target: 'http://localhost:8081', changeOrigin: true, logLevel: 'warn' }
  app.use(createProxyMiddleware(proxyOptions))
}

function handleSmarthubConnection(socket) {
  // Emit current state so client can set its initial state
  socket.emit(SMARTHUB_UPDATES.ROOT, state.state)

  // Attach listeners for push notification service
  notificationService.attachListeners(socket)

  // Forward emitted controller actions to the controller
  for (const action of Object.values(CONTROLLER_ACTIONS)) {
    socket.on(action, () => io.to(CONTROLLER_ROOM).emit(action))
  }
}

function handleControllerConnection(socket) {
  // Add the controller to a Socket.IO room so we can later target all controllers
  socket.join(CONTROLLER_ROOM)

  state.updateController({ online: true, connectionId: socket.id })

  socket.on('disconnect', () => {
    // Abort if connection has already changed
    // (because controller re-connected and "disconnect" event is delayed)
    if (state.state.controller.connectionId !== socket.id) return

    state.updateController({ online: false })
  })

  socket.on(SERVER_UPDATES.ROOM_TEMP, (temperature) => state.updateRoom({ temperature }))
  socket.on(SERVER_UPDATES.ROOM_HUMIDITY, (humidity) => state.updateRoom({ humidity }))

  socket.on(SERVER_UPDATES.ALARM_SILENT_MODE_STATE, (silentMode) => {
    state.updateDevice('Alarmanlage', { silentMode })
  })

  socket.on(SERVER_UPDATES.ALARM_STATE, async (alarmState) => {
    const deviceName = 'Alarmanlage'
    state.updateDevice(deviceName, { state: alarmState })

    if (alarmState === 'ringing') {
      notificationService.sendNotification({
        title: 'Alarm ausgelöst!',
        body: 'Die Alarmanlage hat eine Bewegung registriert und wurde ausgelöst. Warst das du?',
        image: '/images/door-image.png',
        actions: [
          { action: 'stop_alarm', title: 'Abschalten' },
          { action: 'close', title: 'Schließen' },
        ],
        data: { device: deviceName },
      })
    }
  })

  socket.on(SERVER_UPDATES.KETTLE_TEMP, (temperature) => {
    state.updateDevice('Wasserkocher', { temperature })
  })
  socket.on(SERVER_UPDATES.KETTLE_ACTIVE_STATE, (active) => {
    state.updateDevice('Wasserkocher', { active })
  })
}

smarthubNamespace.on('connection', handleSmarthubConnection)

io.on('connection', (socket) => {
  socket.on(REGISTER_CONTROLLER, () => handleControllerConnection(socket))
})

server.listen(PORT, () => {
  if (isProd) {
    info(chalk`Server running on port {bold ${PORT}}.`)
  } else {
    info(chalk`\nApp is running at {underline http://localhost:${PORT}}.`)

    const ip = ipAddress.local()
    if (ip) info(chalk`Controllers can connect to {bold ${ip}} on port {bold ${PORT}}.\n`)
    else info(`Controllers can connect to your local IP (failed to auto-detect) on port ${PORT}.`)
  }
})
