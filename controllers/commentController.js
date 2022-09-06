const { commentCollection } = require('../dbConnection');

const commentController = {};

commentController.getCommentsByBookID = async (req, res, next) => {
  const book_id = res.locals.book._id;

  // If no book_id, something has gone wrong
  if (!book_id) {
    return next(
      'Error in commentController.getCommentsByBookID: No book_id on res.locals',
    );
  }

  // Otherwise get all comments for this book:
  try {
    const bookComments = await commentCollection
      .find({ book_id }, { _id: -1, comment: 1 })
      .toArray();
    res.locals.bookComments = bookComments;
    return next();
  } catch (err) {
    return next(
      `Error in commentController.getCommentsByBookID when trying to get comments from DB: ${err}`,
    );
  }
};

// Creates a new comment for a given Book _id
// Requires bookController.getBookByID and commentController.getCommentsByBookID to have been called first
// Pushes created Comment into res.locals.bookComments array
commentController.createCommentByBookID = async (req, res, next) => {
  const book_id = res.locals.book._id;

  // If no book_id, something has gone wrong
  if (!book_id) {
    return next(
      'Error in commentController.getCommentsByBookID: No book_id on res.locals',
    );
  }

  // If no comment, notify user:
  const { comment } = req.body;

  if (!comment) {
    return res.status(400).json('missing required field comment');
  }

  // Otherwise create a new comment for this book:
  try {
    const commentInfo = await commentCollection.insertOne({ book_id, comment });

    res.locals.bookComments.push({ comment });
    return next();
  } catch (err) {
    return next(
      `Error in commentController.createCommentByBookID when trying to create a comment: ${err}`,
    );
  }
};

module.exports = commentController;
