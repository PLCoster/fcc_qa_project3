# Free Code Camp: Quality Assurance Project 3 - Personal Library

## Personal Library

The aim of this project was to build a small web app with functionality similar to: https://personal-library.freecodecamp.rocks

- **HTML**
- **JavaScript** with **[Node.js](https://nodejs.org/en/) / [NPM](https://www.npmjs.com/)** for package management.
- **[Express](https://expressjs.com/)** web framework to build the web API.
- **[mongodb](https://www.npmjs.com/package/mongodb)** for interacting with a **[MongoDB Atlas](https://www.mongodb.com/atlas/database)** database.
- **[Bootstrap](https://getbootstrap.com/)** for styling with some custom **CSS**.
- **[FontAwesome](https://fontawesome.com/)** for icons.
- **[Mocha](https://mochajs.org/)** test framework with **[Chai](https://www.chaijs.com/)** assertions for testing.
- **[nodemon](https://nodemon.io/)** for automatic restarting of server during development.

### Project Requirements:

- **User Story #1:** You can send a `POST` request to `/api/books` with `title` as part of the form data to add a book. The returned response will be an object with the `title` and a unique `_id` as keys. If `title` is not included in the request, the returned response should be the string `missing required field title`.

- **User Story #2:** You can send a `GET` request to `/api/books` and receive a JSON response representing all the books. The JSON response will be an array of objects with each object (book) containing `title`, `_id`, and `commentcount` properties.

- **User Story #3:** You can send a `GET` request to `/api/books/{_id}` to retrieve a single object of a book containing the properties `title`, `_id`, and a `comments` array (empty array if no comments present). If no book is found, return the string `no book exists`.

- **User Story #4:** You can send a `POST` request containing `comment` as the form body data to `/api/books/{_id}` to add a comment to a book. The returned response will be the books object similar to `GET /api/books/{_id}` request in an earlier test. If `comment` is not included in the request, return the string `missing required field comment`. If no book is found, return the string `no book exists`.

- **User Story #5:** You can send a `DELETE` request to `/api/books/{_id}` to delete a book from the collection. The returned response will be the string `delete successful` if successful. If no book is found, return the string `no book exists`.

- **User Story #6:** You can send a `DELETE` request to `/api/books` to delete all books in the database. The returned response will be the string `complete delete successful` if successful.

- **User Story #7:** 11 Functional Tests covering all routes and methods with valid and invalid input are complete and passing:

  - Create a Book with a valid title: `POST /api/books`
  - Create a Book with no title given: `POST /api/books`
  - Get all Books: `GET /api/books`
  - Get a single Book's details with valid id: `GET /api/books/:id`
  - Get a single Book's details with invalid id: `GET /api/books/:id`
  - Add a Comment to a Book with valid id and comment: `POST /api/books/:id`
  - Add a Comment to a Book with valid id and no comment: `POST /api/books/:id`
  - Add a Comment to a Book with invalid id: `POST /api/books/:id`
  - Delete a Book with valid id: `DELETE /api/books/:id`
  - Delete a Book with invalid id: `DELETE /api/books/:id`
  - Delete all Books: `DELETE /api/books/:id`

### Project Writeup:

The third Free Code Camp: Quality Assurance Project is a simple Personal Library App and API. Users can:

- Add Books to the Library by submitting the relevant form on the API / UI view, or by sending a POST request to `/api/books` with a body containing a url encoded `title` field - the title of the book.

- Add Comments to a Book by submitting the relevant form on the API / UI view, or by sending a POST request to `/api/books/<BOOK _id>`, with a body containing a url encoded field of 'comment' - the comment for the book.

- View all Books in the library by using the UI view or sending a GET request to `/api/books`.

- View a single Book's details (title, \_id and comments) using the UI view or by sending a GET request to `/api/books/<BOOK _id>`.

- Delete a Book using the UI view or by sending a DELETE request to `/api/books/<BOOK _id>`.

- Delete all Books using the UI view or by sending a DELETE request to `/api/books`.

A test suite has been written for the app:

- `tests/2_functional-tests.js` contains functional tests of the application routes (GET, POST and DELETE requests to `/api/books/:book_id?`).

### Project Files:

- `server.js` - the main entry point of the application, an express web server handling the routes defined in the specification.

- `/routes/api.js` - contains the major API routes for the express web app.

- `/controllers` - contains the `bookController.js` and `commentController.js` middleware, with methods to carry out the Create, Read and Delete operations on Books / Comments as requested.

- `public/` - contains static files for the web app (stylesheet, logo, favicons etc), served by express using `express.static()`.

  - `client.js` contains `jQuery` scripts for handling updates to the UI view of the app, and is loaded by `index.html`.

- `views/` - contains the single html page for the web app, `index.html`, which is served by express on `GET` requests to `/

- `tests/` - contains the test suite for the application.

### Usage:

Requires Node.js / NPM in order to install required packages. After downloading the repo, install required dependencies with:

`npm install`

To run the app locally, a valid MongoDB database URI and a database name are required to be entered as environmental variables (`MONGO_URI`, `DB_NAME`), which can be done via a `.env` file (see sample.env). One possible MongoDB service is **[MongoDB Atlas](https://www.mongodb.com/atlas/database)**.

A development mode (with auto server restart on file save), can be started with:

`npm run dev`

The application can then be viewed at `http://localhost:3000/` in the browser.

To start the server without auto-restart on file save:

`npm start`

# Personal Library BoilerPlate

The initial boilerplate for this app can be found at https://github.com/freeCodeCamp/boilerplate-project-library

Instructions for building the project can be found at https://www.freecodecamp.org/learn/quality-assurance/quality-assurance-projects/personal-library
