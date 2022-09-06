const { MongoClient } = require('mongodb');

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME =
  process.env.NODE_ENV === 'test'
    ? process.env.TEST_DB_NAME
    : process.env.DB_NAME;

const dbClient = new MongoClient(MONGO_URI);

let connectionTested = false;

if (!connectionTested) {
  connectionTested = true;
  // Ensure connection to DB works:
  dbClient
    .connect()
    .then(() => console.log('Connected to Database'))
    .catch((err) => {
      console.error('Error when trying to connect to Database: ', err);
      throw new Error('Database connection failed');
    });
}

const bookCollection = dbClient.db(DB_NAME).collection('issues');

// Create TTL index to expire Book documents after X seconds
// https://www.mongodb.com/docs/manual/tutorial/expire-data/
bookCollection.createIndex(
  { expireXSecondsFrom: 1 },
  { expireAfterSeconds: 86400 }, // Expire records after 1 day
);

const commentCollection = dbClient.db(DB_NAME).collection('comments');

// Create TTL index to expire Comment documents after X seconds
// https://www.mongodb.com/docs/manual/tutorial/expire-data/
commentCollection.createIndex(
  { expireXSecondsFrom: 1 },
  { expireAfterSeconds: 86400 }, // Expire records after 1 day
);

module.exports = { bookCollection, commentCollection };
