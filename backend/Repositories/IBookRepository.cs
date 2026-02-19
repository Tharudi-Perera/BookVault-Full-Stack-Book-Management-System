using System.Collections.Generic;
using Backend.Models;

namespace Backend.Repositories
{
    // Defines data access operations for books
    public interface IBookRepository
    {
        IEnumerable<Book> GetAll();
        Book? GetById(int id);
        Book Add(Book book);
        void Update(Book book);
        void Delete(int id);
    }
}
