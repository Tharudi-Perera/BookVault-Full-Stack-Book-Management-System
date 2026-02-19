using System.Collections.Generic;
using Backend.Models;
using Backend.Repositories;

namespace Backend.Services
{
    // Implements business rules on top of the repository
    public class BookService : IBookService
    {
        private readonly IBookRepository _repository;

        public BookService(IBookRepository repository)
        {
            _repository = repository;
        }

        public IEnumerable<Book> GetAllBooks()
        {
            return _repository.GetAll();
        }

        public Book? GetBookById(int id)
        {
            return _repository.GetById(id);
        }

        public Book CreateBook(Book book)
        {
            // Here we could add validation rules if needed
            return _repository.Add(book);
        }

        public bool UpdateBook(int id, Book book)
        {
            var existing = _repository.GetById(id);
            if (existing == null)
            {
                return false;
            }

            // Ensure the ID is consistent
            book.Id = id;
            _repository.Update(book);
            return true;
        }

        public bool DeleteBook(int id)
        {
            var existing = _repository.GetById(id);
            if (existing == null)
            {
                return false;
            }

            _repository.Delete(id);
            return true;
        }
    }
}
