using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using Backend.Services;

namespace Backend.Controllers
{
    // Route: /api/books
    [ApiController]
    [Route("api/[controller]")]
    public class BooksController : ControllerBase
    {
        private readonly IBookService _bookService;

        // Service is injected via constructor
        public BooksController(IBookService bookService)
        {
            _bookService = bookService;
        }

        // GET: api/books
        [HttpGet]
        public ActionResult<IEnumerable<Book>> GetAll()
        {
            var books = _bookService.GetAllBooks();
            return Ok(books);
        }

        // GET: api/books/{id}
        [HttpGet("{id}")]
        public ActionResult<Book> GetById(int id)
        {
            var book = _bookService.GetBookById(id);
            if (book == null)
            {
                return NotFound();
            }

            return Ok(book);
        }

        // POST: api/books
        [HttpPost]
        public ActionResult<Book> Create(Book book)
        {
            // Check for duplicate ISBN
            var existing = _bookService.GetAllBooks().FirstOrDefault(b => b.Isbn == book.Isbn);
            if (existing != null)
            {
                return Conflict(new { message = "A book with this ISBN already exists." });
            }
            var created = _bookService.CreateBook(book);
            // Returns 201 Created with location header
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        // PUT: api/books/{id}
        [HttpPut("{id}")]
        public IActionResult Update(int id, Book book)
        {
            var success = _bookService.UpdateBook(id, book);
            if (!success)
            {
                return NotFound();
            }

            return NoContent();
        }

        // DELETE: api/books/{id}
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var success = _bookService.DeleteBook(id);
            if (!success)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
