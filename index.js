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

app.get('/', (req, res) => {
  res.send('Hello World');
});

io.on('connection', (socket) => {
  socket.emit('Hi sockets established');

  socket.on('join room', (roomId) => {
    console.log('socket room *' + roomId + '* created...');
    socket.join(roomId);
  });

  // socket.on('triggering', (payload) => {
  //   console.warn('triggering');
  //   io.to(payload.room).emit('triggered', payload);
  // });

  // //emit recevied message to specified room
  // socket.on('sending signal', (payload) => {
  //   console.log('sending signal coming:' + payload);
  //   io.to(payload.room).emit('received signal', payload.signal);
  // });

  // socket.on('returning signal', (payload) => {
  //   console.log('receiving signal coming:' + payload);
  //   io.to(payload.room).emit('returned signal', payload.signal);
  // });

  socket.on('send offer', (payload) => {
    console.warn('payload', payload);
    io.to(payload.room).emit('send offer', payload.offer);
  });

  socket.on('send answer', (payload) => {
    console.warn('payload', payload);
    io.to(payload.room).emit('send answer', payload.answer);
  });
});

// Comment the below 2 lines if you are pushing for Heroku
// io.listen(3000);
// console.log(`Signaling Sever Started at Port 3000`);

//Uncomment below lines if you are pushing for Heroku
io.listen(process.env.PORT || 5000);
console.log(`Signaling Sever Started at Port ${process.env.PORT || 5000}`);
