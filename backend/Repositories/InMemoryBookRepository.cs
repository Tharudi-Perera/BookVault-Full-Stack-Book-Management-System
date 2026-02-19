using System;
using System.Collections.Generic;
using System.Linq;
using Backend.Models;

namespace Backend.Repositories
{
    // Simple in-memory repository
    public class InMemoryBookRepository : IBookRepository
    {
        // Static list to persist data while the app is running
        private static readonly List<Book> _books = new List<Book>();
        private static int _nextId = 1;

        public InMemoryBookRepository()
        {
            // Seed with some sample data only once
            if (!_books.Any())
            {
                _books.Add(new Book
                {
                    Id = _nextId++,
                    Title = "Clean Code",
                    Author = "Robert C. Martin",
                    Isbn = "9780132350884",
                    PublicationDate = new DateTime(2008, 8, 1)
                });

                _books.Add(new Book
                {
                    Id = _nextId++,
                    Title = "The Pragmatic Programmer",
                    Author = "Andrew Hunt, David Thomas",
                    Isbn = "9780201616224",
                    PublicationDate = new DateTime(1999, 10, 30)
                });
            }
        }

        public IEnumerable<Book> GetAll()
        {
            // Return a copy to avoid external modifications
            return _books.ToList();
        }

        public Book? GetById(int id)
        {
            return _books.FirstOrDefault(b => b.Id == id);
        }

        public Book Add(Book book)
        {
            book.Id = _nextId++;
            _books.Add(book);
            return book;
        }

        public void Update(Book book)
        {
            var existing = GetById(book.Id);
            if (existing == null) return;

            existing.Title = book.Title;
            existing.Author = book.Author;
            existing.Isbn = book.Isbn;
            existing.PublicationDate = book.PublicationDate;
        }

        public void Delete(int id)
        {
            var existing = GetById(id);
            if (existing != null)
            {
                _books.Remove(existing);
            }
        }
    }
}
