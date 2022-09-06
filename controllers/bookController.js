const ObjectId = require('mongodb').ObjectId;

const { bookCollection } = require('../dbConnection');

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
// Created book is stored at res.locals.newBook if successful
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
    const newBook = await bookCollection.findOne({
      _id: newBookInfo.insertedId,
    });

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

// Gets a single Book by its _id field
// Found Book document is stored at res.locals.book
// If the Book does not exist, returns response with error message
bookController.getBookByID = async (req, res, next) => {
  const idString = req.params._id;

  try {
    const _id = ObjectId(idString); // This will error on bad idString - should be 24 hex chars
    const book = await bookCollection.findOne(
      { _id },
      // { projection: { title: 1 } },
    );

    res.locals.book = book;
    return next();
  } catch (err) {
    return res.status(400).json('no book exists');
  }
};

// Increments the count of comments for a book
// Requires bookController.getBookByID middleware to have been called first
bookController.incrementBookCommentCountByID = async (req, res, next) => {
  const { _id } = res.locals.book;

  try {
    const updateInfo = await bookCollection.updateOne(
      { _id },
      { $inc: { commentcount: 1 } },
    );

    if (!updateInfo.modifiedCount === 1) {
      throw new Error();
    }

    return next();
  } catch (err) {
    return res.status(400).json('unable to update book comments');
  }
};

module.exports = bookController;
