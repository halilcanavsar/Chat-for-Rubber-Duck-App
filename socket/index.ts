const server = require('../server/index');

const io = require('socket.io')(server, {
  origin: 'http://localhost:3000',
});

io.on('connection', function (socket: any) {
  console.log('connected');
  socket.on('chat', function (msg: any) {
    console.log(msg);
    io.emit('chat', msg + '222222');
  });
});