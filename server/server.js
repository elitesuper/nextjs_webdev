const express = require('express');
const { Server } = require('socket.io');
const http = require('http');
const cors = require('cors');
const {connectToDatabase} = require('../lib/connectToDatabase');
const { clientele } = require('pos/lexicon');

const app = express();
app.use(cors())
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Replace this with your Next.js app URL
    methods: ["GET", "POST"],
  },
});

let client;
(async () => {
  client = await connectToDatabase();
})();

const messagesCollection = () => client.db().collection('messages');

io.on('connection', (socket) => {

  console.log('User connected!');

  socket.on('disconnect', () => {
    console.log('User disconnected!');
  });

  socket.on('getMessages', async (message) => {
    const { to, author } = message;
    const messages = await(await messagesCollection()).find({
      $or:[
        {author:author, to:to},
        {author:to, to:author},
      ],}).toArray();
    socket.emit('messages', messages);
  });

  socket.on('sendMessage', async (message) => {
    await(await messagesCollection()).insertOne(message);
    io.emit('newMessage', message);
  });

});

server.listen(4000, () => {
  console.log('Server listening on port 4000');
});