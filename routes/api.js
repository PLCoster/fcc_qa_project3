/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

'use strict';

const {
  getAllBooks,
  createBook,
  getBookByID,
  incrementBookCommentCountByID,
  deleteBookByID,
} = require('../controllers/bookController.js');

const {
  getCommentsByBookID,
  createCommentByBookID,
  deleteAllCommentsByBookID,
} = require('../controllers/commentController');

module.exports = function (app) {
  app
    .route('/api/books')

    // GET request to /api/books returns JSON array of all Books
    .get(getAllBooks, (req, res) => {
      return res.json(
        res.locals.allBooks.map(({ _id, title, commentcount }) => ({
          _id,
          title,
          commentcount,
        })),
      );
    })

    // POST request to /api/books creates a new Book document
    .post(createBook, (req, res) => {
      const { _id, title, commentcount } = res.locals.newBook;
      return res.json({ _id, title, commentcount });
    })

    .delete(function (req, res) {
      //if successful response will be 'complete delete successful'
    });

  app
    // Route for interacting with a single Book by its _id
    .route('/api/books/:_id')

    // GET request to /api/books/:_id returns the book and all its comments
    .get(getBookByID, getCommentsByBookID, (req, res) => {
      // Return found book with attached array of comment strings
      const { _id, title } = res.locals.book;
      return res.json({
        _id,
        title,
        comments: res.locals.bookComments.map(
          (commentDoc) => commentDoc.comment,
        ),
      });
    })

    // POST request to /api/books/:_id with a comment body adds a comment to the book
    .post(
      getBookByID,
      getCommentsByBookID,
      createCommentByBookID,
      incrementBookCommentCountByID,
      (req, res) => {
        const { _id, title } = res.locals.book;
        return res.json({
          _id,
          title,
          comments: res.locals.bookComments.map(
            (commentDoc) => commentDoc.comment,
          ),
        });
      },
    )
    // DELETE request to /api/books/:_id deletes the Book by its _id
    .delete(deleteBookByID, deleteAllCommentsByBookID, (req, res) => {
      return res.json('delete successful');
    });
};
