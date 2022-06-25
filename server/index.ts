const Koa = require('koa');
const app = new Koa();
const cors = require('@koa/cors');


const server = require('http').createServer(app.callback());
const io = require('socket.io')(server, {
  origin: 'http://localhost:3000',
});

app.use(cors());


io.on('connection', function (socket: any) {
  console.log('connected');
  socket.on('chat', function (msg: any) {
    console.log(msg);
    io.emit('chat', msg + '222222');
  });
});
server.listen(3001, () => {
  console.log('Application is starting on port 3001');
});
