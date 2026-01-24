const { MongoClient } = require('mongodb');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/medbook';
const DB_NAME = 'medbook';

let db = null;

async function connectToMongo() {
  if (db) return db;

  const client = new MongoClient(MONGO_URI);
  await client.connect();
  console.log('Connected to MongoDB');

  db = client.db(DB_NAME);
  return db;
}

function getDb() {
  if (!db) {
    throw new Error('Database not initialized. Call connectToMongo() first.');
  }
  return db;
}

module.exports = {
  connectToMongo,
  getDb
};
