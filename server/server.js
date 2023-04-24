const express = require('express');
const { Server } = require('socket.io');
const http = require('http');
const cors = require('cors');


const app = express();
app.use(cors())
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Replace this with your Next.js app URL
    methods: ["GET", "POST"],
  },
});

io.on('connection', (socket) => {
  console.log('User connected!');

  socket.on('disconnect', () => {
    console.log('User disconnected!');
  });

  socket.on('sendMessage', (message) => {
    io.emit('newMessage', message);
  });
});

server.listen(4000, () => {
  console.log('Server listening on port 4000');
});