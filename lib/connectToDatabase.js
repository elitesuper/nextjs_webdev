const { MongoClient } = require('mongodb');
require('dotenv').config();


const uri = process.env.MONGO_URI;

let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) {
    return Promise.resolve(cachedDb);
  }

  console.log("ddddddddddddddddd", uri);

  // Connect to MongoDB
  const client = await MongoClient.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  return client;
}

module.exports = { connectToDatabase };
