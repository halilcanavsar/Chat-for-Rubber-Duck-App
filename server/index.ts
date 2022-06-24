const Koa = require('koa');
const App = new Koa();
const parser = require('koa-bodyparser');
const cors = require('@koa/cors');
const PORT = process.env.PORT || 3002;

//for chat
const http = require('http');
const { Server } = require('socket.io');


App.use(parser()).use(cors());

App.listen(PORT, () => {
  console.log(`🚀 Server listening at http://127.0.0.1:${PORT}/ 🚀`);
});


const server = http.createServer(App); //create a http server
const io = new Server(server, {
  cors: {
    origin: `http://localhost:${PORT}`,
    allowMethods: 'GET,POST' //methods allowed in the request
  }
}); //create the io and set the cors







