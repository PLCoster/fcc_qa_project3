/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *
 */

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function () {
  // Wait 1s to ensure DB connected before running tests
  this.beforeAll((done) => {
    setTimeout(() => done(), 1000);
  });

  suite('Routing tests', function () {
    let insertedBookID; // Hold ID of book inserted in first test
    suite(
      'POST /api/books with title => create book object/expect book object',
      function () {
        test('Test POST /api/books with title', function (done) {
          const title = 'Test Book 1';
          const expectedBody = { title, commentcount: 0 };

          chai
            .request(server)
            .post('/api/books')
            .send({ title })
            .then((res) => {
              assert.equal(res.status, 200, 'Response should have 200 status');
              assert.equal(
                res.type,
                'application/json',
                'Response type should be application/json',
              );
              assert.isObject(res.body, 'Response body should be an object');
              assert.include(
                res.body,
                expectedBody,
                'Response Book should have correct title and 0 comments',
              );
              assert.property(
                res.body,
                '_id',
                'Response Book should have _id property',
              );

              insertedBookID = res.body._id;
              done();
            })
            .catch((err) => done(err));
        });

        test('Test POST /api/books with no title given', function (done) {
          const expectedBody = 'missing required field title';

          chai
            .request(server)
            .post('/api/books')
            .send({})
            .then((res) => {
              assert.equal(res.status, 400, 'Response should have 400 status');
              assert.equal(
                res.type,
                'application/json',
                'Response type should be application/json',
              );
              assert.isString(res.body, 'Response body should be a string');
              assert.equal(
                res.body,
                expectedBody,
                'Response Error String should match Expected String',
              );
              done();
            })
            .catch((err) => done(err));
        });
      },
    );

    suite('GET /api/books => array of books', function () {
      test('Test GET /api/books', function (done) {
        // This book is inserted in the previous POST test
        const title = 'Test Book 1';
        const expectedBook = { title, commentcount: 0 };

        chai
          .request(server)
          .get('/api/books')
          .then((res) => {
            assert.equal(res.status, 200, 'Response should have 200 status');
            assert.equal(
              res.type,
              'application/json',
              'Response type should be application/json',
            );
            assert.isArray(res.body, 'response should be an array');
            assert.isObject(
              res.body[0],
              'Response body array should contain a Book object',
            );
            assert.include(
              res.body[0],
              expectedBook,
              'Returned Book in array should be expected Book',
            );
            assert.property(
              res.body[0],
              '_id',
              'Response Book should have _id property',
            );

            done();
          })
          .catch((err) => done(err));
      });
    });

    suite('GET /api/books/[id] => book object with [id]', function () {
      test('Test GET /api/books/[id] with id not in db', function (done) {
        const _id = 123; // Unlikely to ever be an existing ID
        const expectedResponse = 'no book exists';

        // Request book details by _id
        chai
          .request(server)
          .get(`/api/books/${_id}`)
          .then((res) => {
            assert.equal(res.status, 400, 'Response should have 400 status');
            assert.equal(
              res.type,
              'application/json',
              'Response type should be application/json',
            );
            assert.isString(res.body, 'Response body should be a string');
            assert.equal(
              res.body,
              expectedResponse,
              'Response string should be expected error string',
            );
            done();
          })
          .catch((err) => done(err));
      });

      test('Test GET /api/books/[id] with valid id in db', function (done) {
        const _id = insertedBookID; // ID of book inserted in first test
        const title = 'Test Book 1';
        const expectedResponse = { _id, title, comments: [] };

        // Request book details by _id
        chai
          .request(server)
          .get(`/api/books/${_id}`)
          .then((res) => {
            assert.equal(res.status, 200, 'Response should have 200 status');
            assert.equal(
              res.type,
              'application/json',
              'Response type should be application/json',
            );
            assert.isObject(
              res.body,
              'Response body should contain a Book object',
            );
            assert.deepEqual(
              res.body,
              expectedResponse,
              'Returned Book should have expected fields and values',
            );
            done();
          })
          .catch((err) => done(err));
      });
    });

    suite(
      'POST /api/books/[id] => add comment/expect book object with id',
      function () {
        test('Test POST /api/books/[id] with comment', function (done) {
          const _id = insertedBookID;
          const title = 'Test Book 1';
          const comment = 'Test Comment!';
          const expectedResult = { _id, title, comments: [comment] };
          chai
            .request(server)
            .post(`/api/books/${_id}`)
            .send({ comment })
            .then((res) => {
              assert.equal(res.status, 200, 'Response should have 200 status');
              assert.equal(
                res.type,
                'application/json',
                'Response type should be application/json',
              );
              assert.isObject(
                res.body,
                'Response body should contain a Book object',
              );
              assert.deepEqual(
                res.body,
                expectedResult,
                'Returned Book should have expected fields and values, with new Comment added',
              );
              done();
            })
            .catch((err) => done(err));
        });

        test('Test POST /api/books/[id] without comment field', function (done) {
          const _id = insertedBookID;

          const expectedResult = 'missing required field comment';
          chai
            .request(server)
            .post(`/api/books/${_id}`)
            .send({})
            .then((res) => {
              assert.equal(res.status, 400, 'Response should have 400 status');
              assert.equal(
                res.type,
                'application/json',
                'Response type should be application/json',
              );
              assert.isString(
                res.body,
                'Response body should be an error string',
              );
              assert.equal(
                res.body,
                expectedResult,
                'Returned Result should be "missing required field comment" error message',
              );
              done();
            })
            .catch((err) => done(err));
        });

        test('Test POST /api/books/[id] with comment, id not in db', function (done) {
          const _id = 123; // Non-existent book _id
          const expectedResult = 'no book exists';

          chai
            .request(server)
            .post(`/api/books/${_id}`)
            .send({})
            .then((res) => {
              assert.equal(res.status, 400, 'Response should have 400 status');
              assert.equal(
                res.type,
                'application/json',
                'Response type should be application/json',
              );
              assert.isString(
                res.body,
                'Response body should be an error string',
              );
              assert.equal(
                res.body,
                expectedResult,
                'Returned Result should be "no book exists" error message',
              );
              done();
            })
            .catch((err) => done(err));
        });
      },
    );

    suite('DELETE /api/books/[id] => delete book object id', function () {
      test('Test DELETE /api/books/[id] with valid id in db', function (done) {
        const _id = insertedBookID;

        const expectedResult = 'delete successful';
        chai
          .request(server)
          .delete(`/api/books/${_id}`)
          .then((res) => {
            assert.equal(res.status, 200, 'Response should have 200 status');
            assert.equal(
              res.type,
              'application/json',
              'Response type should be application/json',
            );
            assert.isString(
              res.body,
              'Response body should be a success string',
            );
            assert.equal(
              res.body,
              expectedResult,
              'Returned Result should be "delete successful" message',
            );
            done();
          })
          .catch((err) => done(err));
      });

      test('Test DELETE /api/books/[id] with  id not in db', function (done) {
        const _id = 123; // Invalid id

        const expectedResult = 'no book exists';

        chai
          .request(server)
          .delete(`/api/books/${_id}`)
          .then((res) => {
            assert.equal(res.status, 400, 'Response should have 400 status');
            assert.equal(
              res.type,
              'application/json',
              'Response type should be application/json',
            );
            assert.isString(res.body, 'Response body should be a error string');
            assert.equal(
              res.body,
              expectedResult,
              'Returned Result should be "no book exists" message',
            );
            done();
          })
          .catch((err) => done(err));
      });
    });

    suite('DELETE /api/books => delete all books', function () {
      test('Test DELETE /api/books', function (done) {
        const expectedResponse = 'complete delete successful';

        chai
          .request(server)
          .delete('/api/books')
          .then((res) => {
            assert.equal(res.status, 200, 'Response status should be 200');
            assert.equal(
              res.type,
              'application/json',
              'Response type should be application/json',
            );
            assert.isString(res.body, 'Response body should be success string');
            assert.equal(
              res.body,
              expectedResponse,
              'Returned Result should be "complete delete successful" message',
            );
            done();
          })
          .catch((err) => done(err));
      });
    });
  });
});
