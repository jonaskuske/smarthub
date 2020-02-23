const path = require('path');
const http = require('http');
const express = require('express');
const socketIo = require('socket.io');
const log = console.log;

const PORT = Number(process.env.PORT) || 3030;

const EVENT_TYPES = {
  TURN_LED_ON: 'TURN_LED_ON',
  TURN_LED_ON_SUCCESS: 'TURN_LED_ON_SUCCESS',
};

const app = express();
const server = http.createServer(app);

const io = socketIo(server);
const smarthubSocket = io.of('/smarthub');

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/index.html'));
});

app.post('/led', (req, res) => {
  log(`Received "${EVENT_TYPES.TURN_LED_ON}" from HTTP endpoint!`);
  io.clients().emit(EVENT_TYPES.TURN_LED_ON);
  res.send('ok');
});

smarthubSocket.on('connection', client => {
  log(`Smarthub client connected! (${client.id})`);

  client.on(EVENT_TYPES.TURN_LED_ON, () => {
    log(`Received "${EVENT_TYPES.TURN_LED_ON}" from smarthub!`);
    io.clients().emit(EVENT_TYPES.TURN_LED_ON);
  });
});

io.on('connection', client => {
  log(`Generic client connected! (${client.id})`);

  client.on(EVENT_TYPES.TURN_LED_ON_SUCCESS, () => {
    smarthubSocket.clients().emit(EVENT_TYPES.TURN_LED_ON_SUCCESS);
    log('The LED is now on!');
  });
});

server.listen(PORT, () => log(`Server running on ${PORT}.`));
