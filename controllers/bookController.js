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
  .catch((err) => {
    console.error('Error when trying to connect to Database: ', err);
    throw new Error('Database connection failed');
  });

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
      'Error in bookController.getAllBooks when trying to get all books: ',
      err,
    );
    return next(err);
  }
};

// Creates a new Book, given a 'title' string field in body
//
bookController.createBook = async (req, res, next) => {
  const { title } = req.body;

  if (!title || typeof title !== 'string') {
    return res.status(400).json('missing required field title');
    // .json({ error: `Book title must be non-empty string, given: ${title}` });
  }

  // Otherwise create the book:
  try {
    const expireXSecondsFrom = new Date();
    const newBookInfo = await bookCollection.insertOne({
      title,
      expireXSecondsFrom,
      commentcount: 0,
    });

    if (!newBookInfo.acknowledged) {
      throw new error('New Book Creation not acknowledged');
    }

    // Get new book document to return (only _id, title and commentcount fields)
    const newBook = await bookCollection.findOne(
      {
        _id: newBookInfo.insertedId,
      },
      { title: 1, commentcount: 1 },
    );

    res.locals.newBook = newBook;

    return next();
  } catch (err) {
    console.error(
      'Error in bookController.createBook when trying to create a book: ',
      err,
    );

    return next(err);
  }
};

module.exports = bookController;
