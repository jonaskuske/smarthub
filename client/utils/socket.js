import io from 'socket.io-client'

export const socketClient = io('http://localhost:3030/smarthub')
