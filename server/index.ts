const Koa = require('koa');
const app = new Koa();
const cors = require('@koa/cors');
app.use(cors());

//Chat----

const server = require('http').createServer(app.callback());

server.listen(3001, () => {
  console.log('Application is starting on port 3001');
});


const io = require('socket.io')(server, {
  origin: 'http://localhost:3000',
});



let users = [];//take the user ids from frontend and store here
//after every connection take userId and socketId from user


io.on('connection', function (socket: any) {
  console.log('connected');

  socket.on('sendMessage', function (data: any) {
    io.emit('receiveMessage', data);
  }
  );
});





