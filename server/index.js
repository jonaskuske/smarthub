import path from 'path'
import http from 'http'
import express from 'express'
import bodyParser from 'body-parser'
import socketIo from 'socket.io'
import { State } from './state'
import {
  REGISTER_CONTROLLER,
  ACTIONS,
  SERVER_UPDATES,
  SMARTHUB_UPDATES,
} from '../shared/event-types'

const isProd = process.env.NODE_ENV === 'production'
const fromRoot = rootPath => path.resolve(__dirname, '../', rootPath)
const log = console.log

const PORT = Number(process.env.PORT) || 3030
const CONTROLLER_ROOM = 'controller'

const app = express()
const server = http.createServer(app)

const io = socketIo(server)
const smarthubNamespace = io.of('/smarthub')

const state = new State({
  emitCallback: (event, data) => log(event, data) || smarthubNamespace.emit(event, data),
})

if (isProd) app.use(express.static(fromRoot('client/dist')))

app.use(bodyParser.json())

app.post('/emit', (req, res) => {
  const { body } = req

  if (Object.values(ACTIONS).includes(body.EVENT)) {
    log(`POST /emit: Received "${body.EVENT}", emitting to controller`)
    io.to(CONTROLLER_ROOM).emit(body.EVENT)
    res.send('OK')
  } else throw Error(`POST /emit: Received unknown event "${body.EVENT}"`)
})

function handleSmarthubConnection(socket) {
  socket.emit(SMARTHUB_UPDATES.ROOT, state.state)
  for (const action of Object.values(ACTIONS)) {
    socket.on(action, () => {
      io.to(CONTROLLER_ROOM).emit(action)
    })
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

server.listen(PORT, () => log(`Server running on ${PORT}.`))
