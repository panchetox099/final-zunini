const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017';
const dbName = 'clothing-store'; // Nombre de la base de datos

let db;

async function connectDB() {
  if (db) return db;
  const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
  db = client.db(dbName);
  return db;
}

module.exports = connectDB;
