const express = require('express');
const { Server } = require('socket.io');
const http = require('http');
const cors = require('cors');
const {connectToDatabase} = require('../lib/connectToDatabase');
const { clientele } = require('pos/lexicon');
const { ObjectId } = require('mongodb');


const app = express();
app.use(cors())
const server = https.createServer({
  key: fs.readFileSync('/etc/letsencrypt/live/reson.app/key.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/reson.app/cert.pem'),
}, app);
const io = new Server(server, {
  cors: {
    origin: "https://reson.app", // Replace this with your Next.js app URL
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

  socket.on('readMessage', async (message) => {
    const messageId = new ObjectId(message._id);
    const updateMessage = await(await messagesCollection()).updateOne(
      { _id: messageId },
      { $set: { read: true } }
    )
    
    console.log(updateMessage)
  })

  socket.on('sendMessage', async (message) => {
    await(await messagesCollection()).insertOne(message);
    io.emit('newMessage', message);
  });

  socket.on('callUser', async (data) => {
    console.log(`Calling user: ${data.to}`);
    // socket.to(data.to).emit('callUser', { signal: data.signal, from: socket.id });
    io.emit('callUser', { signal: data.signal, from: data.from, to: data.to });

  });

  socket.on('acceptCall', async (data) => {
    console.log(`Accept call from: ${data.to}`);
    // socket.to(data.to).emit('acceptCall', { signal: data.signal });
    io.emit('acceptCall', { signal: data.signal, to: data.to });
  });

});

server.listen(4000, () => {
  console.log('Server listening on port 4000');
});