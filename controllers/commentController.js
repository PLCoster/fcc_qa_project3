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

module.exports = commentController;
