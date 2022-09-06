/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

'use strict';

const { getAllBooks, createBook } = require('../controllers/bookController.js');

module.exports = function (app) {
  app
    .route('/api/books')

    // GET request to /api/books returns JSON array of all Books
    .get(getAllBooks, (req, res) => {
      return res.json(res.locals.allBooks);
    })

    // POST request to /api/books creates a new Book document
    .post(createBook, (req, res) => {
      return res.json(res.locals.newBook);
      //response will contain new book object including atleast _id and title
    })

    .delete(function (req, res) {
      //if successful response will be 'complete delete successful'
    });

  app
    .route('/api/books/:id')
    .get(function (req, res) {
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })

    .post(function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
    })

    .delete(function (req, res) {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
    });
};
