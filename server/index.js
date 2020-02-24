import path from 'path'
import http from 'http'
import express from 'express'
import bodyParser from 'body-parser'
import socketIo from 'socket.io'
import * as EVENT_TYPES from '../shared/event-types'

const PORT = Number(process.env.PORT) || 3030
const CONTROLLER_ROOM = 'controller'

const noop = () => {}
const log = process.env.NODE_ENV === 'production' ? noop : console.log

const app = express()
app.use(express.static(path.resolve(__dirname, '../client/dist')))
const server = http.createServer(app)

const io = socketIo(server)
const smarthubNamespace = io.of('/smarthub')

app.use(bodyParser.json())

// app.get('/', (req, res) => {
//   res.sendFile(path.resolve(__dirname, '../client/index.html'))
// })

app.post('/emit', (req, res) => {
  const { body } = req

  if (Object.values(EVENT_TYPES).includes(body.EVENT)) {
    log(`POST /emit: Received "${body.EVENT}", emitting to controller`)
    io.to(CONTROLLER_ROOM).emit(body.EVENT)
    res.send('OK')
  } else {
    throw Error(`POST /emit: Received unknown event "${body.EVENT}"`)
  }
})

function handleSmarthubConnection(smarthub) {
  log(`Smarthub connected! (${smarthub.id})`)

  smarthub.on('disconnect', () => console.log(`Smarthub disconnected! (${smarthub.id})`))

  smarthub.on(EVENT_TYPES.TURN_KETTLE_ON, () => {
    log(`Received "${EVENT_TYPES.TURN_KETTLE_ON}" from hub, emitting to controller.`)
    io.to(CONTROLLER_ROOM).emit(EVENT_TYPES.TURN_KETTLE_ON)
  })

  smarthub.on(EVENT_TYPES.DISABLE_ALARM, () => {
    log(`Received "${EVENT_TYPES.DISABLE_ALARM}" from hub, emitting to controller.`)
    io.to(CONTROLLER_ROOM).emit(EVENT_TYPES.DISABLE_ALARM)
  })

  smarthub.on(EVENT_TYPES.START_SYS, () => {
    log(`Received "${EVENT_TYPES.START_SYS}" from hub, emitting to controller.`)
    io.to(CONTROLLER_ROOM).emit(EVENT_TYPES.START_SYS)
  })
}

function handleControllerConnection(controller) {
  log(`Controller connected! (${controller.id})`)

  controller.on('disconnect', () => console.log(`Controller disconnected! (${controller.id})`))

  controller.on(EVENT_TYPES.TURN_KETTLE_ON_SUCCESS, () => {
    log(`Received ${EVENT_TYPES.TURN_KETTLE_ON_SUCCESS} from controller, emitting to smarthub.`)
    smarthubNamespace.emit(EVENT_TYPES.TURN_KETTLE_ON_SUCCESS)
  })

  controller.on(EVENT_TYPES.ALARM_TRIGGERED, () => {
    log(`Received ${EVENT_TYPES.ALARM_TRIGGERED} from controller, emitting to smarthub.`)
    smarthubNamespace.emit(EVENT_TYPES.ALARM_TRIGGERED)
  })

  controller.on(EVENT_TYPES.ALARM_DISABLED, () => {
    log(`Received ${EVENT_TYPES.ALARM_DISABLED} from controller, emitting to smarthub.`)
    smarthubNamespace.emit(EVENT_TYPES.ALARM_DISABLED)
  })

  controller.on(EVENT_TYPES.SYS_STARTED, () => {
    log(`Received ${EVENT_TYPES.SYS_STARTED} from controller, emitting to smarthub.`)
    smarthubNamespace.emit(EVENT_TYPES.SYS_STARTED)
  })

  controller.on(EVENT_TYPES.TEMPERATUR, () => {
    log(`Received ${EVENT_TYPES.TEMPERATUR} from controller, emitting to smarthub.`)
    smarthubNamespace.emit(EVENT_TYPES.TEMPERATUR)
  })
}

smarthubNamespace.on('connection', handleSmarthubConnection)

io.on('connection', client => {
  client.on(EVENT_TYPES.REGISTER_CONTROLLER, () => {
    client.join(CONTROLLER_ROOM, () => handleControllerConnection(client))
  })
})

server.listen(PORT, () => log(`Server running on ${PORT}.`))
