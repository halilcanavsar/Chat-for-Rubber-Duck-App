const { Server } = require('socket.io');
const server = require('../server/index') // create a http server at the backend and import it





const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
  }
})

io.on('connection', (socket) => {
  console.log('a user connected')
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
}
)
