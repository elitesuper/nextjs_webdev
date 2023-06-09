const express = require('express');
const { Server } = require('socket.io');
const https = require('https');
const fs = require('fs');
const cors = require('cors');
const {connectToDatabase} = require('../lib/connectToDatabase');
const { clientele } = require('pos/lexicon');
const { ObjectId } = require('mongodb');


const app = express();
app.use(cors());

const server = https.createServer({
	cert: fs.readFileSync('/etc/letsencrypt/live/reson.app/cert.pem'),
	key: fs.readFileSync('/etc/letsencrypt/live/reson.app/privkey.pem'),
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
  socket.on('disconnect', () => {
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
  })

  socket.on('sendMessage', async (message) => {
    await(await messagesCollection()).insertOne(message);
    io.emit('newMessage', message);
  });

  socket.on('callUser', async (data) => {
    // socket.to(data.to).emit('callUser', { signal: data.signal, from: socket.id });
    io.emit('callUser', { signal: data.signal, from: data.from, to: data.to });

  });

  socket.on('acceptCall', async (data) => {
    // socket.to(data.to).emit('acceptCall', { signal: data.signal });
    io.emit('acceptCall', { signal: data.signal, to: data.to });
  });

});

server.listen(4000, () => {
  
});