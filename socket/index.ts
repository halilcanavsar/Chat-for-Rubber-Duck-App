// const reactPORT = process.env.REACT_PORT || 3000;
// const { Server } = require('socket.io');
// const server = require('../server/index') // create a http server at the backend and import it


// const io = new Server(server, {
//   cors: {
//     origin: `http://localhost:${reactPORT}`,
//   }
// })



// io.on('connection', (socket: { on: (arg0: string, arg1: () => void) => void; id: any; }) => {
//   console.log(`a user connected with id: ${socket.id}`);
//   socket.on('disconnect', () => {
//     console.log('user disconnected', socket.id)
//   })
// }
// )
