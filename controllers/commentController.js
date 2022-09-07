const { commentCollection } = require('../dbConnection');

const commentController = {};

// Gets all the comments for a single Book by its _id
// Requires bookController.getBookByID to be called first
// Adds array of comments to res.locals.bookComments
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

    if (!commentInfo.acknowledged) {
      throw new Error('Comment creation not acknowledged by DB');
    }

    // Add new comment to array of book comments
    res.locals.bookComments.push({
      _id: commentInfo.insertedId,
      book_id,
      comment,
    });

    return next();
  } catch (err) {
    return next(
      `Error in commentController.createCommentByBookID when trying to create a comment: ${err}`,
    );
  }
};

// Deletes all comments for a given Book by its _id
// Requires bookController.deleteBookByID to have been called first
commentController.deleteAllCommentsByBookID = async (req, res, next) => {
  const book_id = res.locals.deletedID;

  // If no book_id, something has gone wrong
  if (!book_id) {
    return next(
      'Error in commentController.deleteAllCommentsByBookID: No book_id on res.locals',
    );
  }

  try {
    const commentDeletionInfo = await commentCollection.deleteMany({ book_id });

    if (!commentDeletionInfo.acknowledged) {
      throw new Error('Comment deletion was not acknowledged by Database');
    }

    return next();
  } catch (err) {
    return next(`Error in commentController.deleteAllCommentsByBookID: ${err}`);
  }
};

module.exports = commentController;
