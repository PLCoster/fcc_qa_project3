// This script is loaded by index.html to handle form submission and updates on the UI View

// Helper function to make any displayed results HTML-safe
function replaceUnsafeChars(input) {
  if (typeof input !== 'string') {
    return input;
  }

  const charReplacements = {
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    '"': '&quot;',
    "'": '&#39;',
  };

  return input
    .split('')
    .map((char) => {
      if (char in charReplacements) {
        return charReplacements[char];
      }
      return char;
    })
    .join('');
}

// Function that fetches all books and displays them in UI
// If book_id is provided, that book is selected in display menu
function getAllBooks(book_id) {
  $.getJSON('/api/books', function (data) {
    const items = [];

    $('#display').html('');

    if (data.length === 0) {
      $('#display').html('<p>No Books to Display!</p>');
      return;
    }

    $.each(data, function (i, book) {
      items.push(
        `<li class="bookItem" data-id="${
          book._id
        }"><strong>${replaceUnsafeChars(book.title)}</strong> (${
          book.commentcount
        })</li>`,
      );
      return true;
    });

    $('<ul/>', {
      class: 'listWrapper',
      html: items.join(''),
    }).appendTo('#display');

    // Highlight currently selected book
    if (book_id) {
      $(`.bookItem[data-id=${book_id}]`).addClass('selected');
    }
  });
}

// Function that gets details of a specific book when selected
function getBookDetails() {
  const book_id = $(this).attr('data-id');

  // Highlight book as selected in book list
  document.querySelectorAll('.bookItem').forEach((bookItem) => {
    bookItem.classList.remove('selected');
  });

  this.classList.add('selected');

  // Get Book Details:
  $.getJSON(`/api/books/${book_id}`, function (data) {
    $('#detail-title').html(
      '<strong>' + replaceUnsafeChars(data.title) + '</strong>',
    );
    $('#detail-id').text(`(id: ${data._id})`);

    const comments = [];

    // Add comments to list
    $.each(data.comments, function (i, val) {
      comments.push('<li>' + replaceUnsafeChars(val) + '</li>');
    });

    if (comments.length === 0) {
      comments.push('No Comments Yet!');
    }

    $('#detail-comments').html(
      `<p>Comments:</p>
      <ul id="comments-list">${comments.join('')}</ul>`,
    );

    // Add comment forms for this book:
    $('#comment-control').html(`
      <br>
        <form id="newCommentForm">
          <input type="text" class="form-control form-control-sm" id="commentToAdd" name="comment" placeholder="New Comment" required>
          <button class="btn btn-success btn-sm addComment" data-id="${book_id}">Add Comment</button>
        </form>
        <hr>
        <button class="btn btn-danger deleteBook" data-id="${book_id}">Delete Book</button>
        `);
  });
}

// Function that flashes a message
function flashMessage(messageStr, type) {
  // Remove style classes from previous messages
  $('#fe-alert').removeClass('alert-success');
  $('#fe-alert').removeClass('alert-danger');

  // Add new message and styling, display
  $('#fe-alert').addClass(`alert-${type}`);
  $('#fe-alert-msg').html(messageStr);
  $('#fe-alert').css('display', 'block');
  $('#fe-alert').css('opacity', 100);
}

$(document).ready(function () {
  // Set up onclick view switches:
  $('#api-view-btn').on('click', () => {
    $('#api-view-btn').addClass('selected');
    $('#fe-view-btn').removeClass('selected');
    $('#api-view').css('display', 'block');
    $('#fe-view').css('display', 'none');
  });

  $('#fe-view-btn').on('click', () => {
    $('#fe-view-btn').addClass('selected');
    $('#api-view-btn').removeClass('selected');
    $('#fe-view').css('display', 'block');
    $('#api-view').css('display', 'none');
  });

  // Set up dismissal of flashed message
  $('#fe-alert-dismiss').on('click', () => {
    $('#fe-alert').css('opacity', 0);
    setTimeout(() => {
      $('#fe-alert').css('display', 'none');
    }, 1000);
  });

  getAllBooks();

  // Set up onclick effects to display book details:
  $('#display').on('click', 'li.bookItem', getBookDetails);

  // Set up onclick effect to delete a single book
  $('#book-detail').on('click', 'button.deleteBook', function () {
    const title = $('#detail-title').text();
    const book_id = $(this).attr('data-id');
    $.ajax({
      url: '/api/books/' + book_id,
      type: 'delete',
      success: function (data) {
        getAllBooks(book_id);
        flashMessage(
          `Book <strong>${replaceUnsafeChars(title)}</strong> was deleted`,
          'success',
        );
        $('#detail-comments').html(
          '<p style="color: red;">' + 'This Book has been Deleted' + '</p>',
        );
        $('#comment-control').html('');
      },
      error: function (data) {
        flashMessage(
          `Book could not be deleted: ${replaceUnsafeChars(data.responseJSON)}`,
          'danger',
        );
      },
    });
  });

  // Set up onclick effect to add a comment to a book
  $('#book-detail').on('click', 'button.addComment', function (e) {
    // Ensure form is complete
    if (!$('#commentToAdd').val()) {
      document.querySelector('#newCommentForm').reportValidity();
      return;
    }

    const postData = $('#newCommentForm').serialize();
    $('#commentToAdd').val('');
    const book_id = $(this).attr('data-id');

    $.ajax({
      url: '/api/books/' + book_id,
      type: 'post',
      dataType: 'json',
      data: postData,
      success: function (data) {
        flashMessage(
          `Added Comment for ${replaceUnsafeChars(data.title)}`,
          'success',
        );
        getAllBooks(book_id);

        // Update comments:
        const comments = [];
        $.each(data.comments, function (i, val) {
          comments.push('<li>' + replaceUnsafeChars(val) + '</li>');
        });

        if (comments.length === 0) {
          comments.push('No Comments Yet!');
        }

        $('#detail-comments').html(
          `<p>Comments:</p>
           <ul id="comments-list">${comments.join('')}</ul>`,
        );
      },
      error: function (data) {
        flashMessage(
          `Comment could not be added: ${replaceUnsafeChars(
            data.responseJSON,
          )}`,
          'danger',
        );
      },
    });
  });

  // On Click function to Create a New Book
  $('#newBook').click(function (e) {
    e.preventDefault();
    // Get current book id if any to re-highlight it on book refresh:
    const book_id = $('.addComment').attr('data-id');

    // Ensure form is complete
    if (!$('#bookTitleToAdd').val()) {
      document.querySelector('#newBookForm').reportValidity();
      return;
    }

    $.ajax({
      url: '/api/books',
      type: 'post',
      dataType: 'json',
      data: $('#newBookForm').serialize(),
      success: function (data) {
        $('#bookTitleToAdd').val('');
        flashMessage(
          `New Book Title Added: <strong>${replaceUnsafeChars(
            data.title,
          )}</strong>`,
          'success',
        );
        getAllBooks(book_id);
      },
    });
  });

  // On Click function to Delete all Books
  $('#deleteAllBooks').click(function () {
    $.ajax({
      url: '/api/books',
      type: 'delete',
      dataType: 'json',
      data: $('#newBookForm').serialize(),
      success: function (data) {
        flashMessage(`All Books Deleted`, 'success');
        getAllBooks();
        $('#detail-comments').html(
          '<p style="color: red;">' + 'All Books Have Been Deleted' + '</p>',
        );
        $('#comment-control').html('');
      },
    });
  });
});
