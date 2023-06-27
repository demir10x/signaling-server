const express = require('express');
const app = express();
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

app.use(
  cors({
    origin: '*',
  })
);

app.use('/health', () => {
  return 'ok';
});

io.on('connection', (socket) => {
  socket.emit('Hi sockets established');

  socket.on('join room', (roomId) => {
    console.log('socket room *' + roomId + '* created...');
    socket.join(roomId);
  });

  //emit recevied message to specified room
  socket.on('sending signal', (payload) => {
    console.log('sending signal coming:' + payload);
    io.to(payload.room).emit('received signal', payload.signal);
  });

  socket.on('returning signal', (payload) => {
    console.log('receiving signal coming:' + payload);
    io.to(payload.room).emit('returned signal', payload.signal);
  });
});

console.log('Signaling Sever Started at Port 3000');
