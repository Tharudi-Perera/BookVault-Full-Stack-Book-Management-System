using System.Collections.Generic;
using Backend.Models;

namespace Backend.Services
{
    // Business logic for managing books
    public interface IBookService
    {
        IEnumerable<Book> GetAllBooks();
        Book? GetBookById(int id);
        Book CreateBook(Book book);
        bool UpdateBook(int id, Book book);
        bool DeleteBook(int id);
    }
}
