const { MongoClient } = require('mongodb');

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME =
  process.env.NODE_ENV === 'test'
    ? process.env.TEST_DB_NAME
    : process.env.DB_NAME;

const dbClient = new MongoClient(MONGO_URI);

// Ensure connection to DB works:
dbClient
  .connect()
  .then(() => console.log('Connected to Database'))
  .catch((err) =>
    console.error('Error when trying to connect to Database: ', err),
  );

const bookCollection = dbClient.db(DB_NAME).collection('issues');

// Create TTL index to expire Book documents after X seconds
// https://www.mongodb.com/docs/manual/tutorial/expire-data/
bookCollection.createIndex(
  { expireXSecondsFrom: 1 },
  { expireAfterSeconds: 86400 }, // Expire records after 1 day
);

const bookController = {};

// Gets all Books, return an array of Book documents
// Array of all Books is stored in res.locals.allBooks
bookController.getAllBooks = async (req, res, next) => {
  try {
    const allBooks = await bookCollection.find({}).toArray();
    res.locals.allBooks = allBooks;
    return next();
  } catch (err) {
    console.error(
      'Error in bookController.getAll Books when trying to get all books: ',
      err,
    );
    return next(err);
  }
};

module.exports = bookController;
