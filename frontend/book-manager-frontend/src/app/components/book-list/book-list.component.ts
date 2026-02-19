import { Component, OnInit, Inject } from '@angular/core';
import { Book } from '../../models/book';
import { BookService } from '../../services/book.service';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common'; 
import { CommonModule } from '@angular/common';


// Component responsible for displaying and managing the list of books
@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})

export class BookListComponent implements OnInit {

  // List of books loaded from the backend
  books: Book[] = [];

  // Model for the form (used for both add and edit)
  currentBook: Book = this.getEmptyBook();

  // Flag to know if we are editing an existing book
  isEditMode = false;

  constructor(@Inject(BookService) private bookService: BookService) { }

  ngOnInit(): void {
    // Load books when component is initialized
    this.loadBooks();
  }

  // Helper to create an empty book object
  private getEmptyBook(): Book {
    return {
      title: '',
      author: '',
      isbn: '',
      publicationDate: ''
    };
  }

  // Load all books from the backend
  loadBooks(): void {
    this.bookService.getBooks().subscribe({
      next: (data) => this.books = data,
      error: (err) => console.error('Error loading books', err)
    });
  }

  // Called when the form is submitted
  onSubmit(): void {
    if (this.isEditMode && this.currentBook.id) {
      // Update existing book
      this.bookService.updateBook(this.currentBook.id, this.currentBook).subscribe({
        next: () => {
          this.resetForm();
          this.loadBooks();
        },
        error: (err) => console.error('Error updating book', err)
      });
    } else {
      // Create new book
      this.bookService.addBook(this.currentBook).subscribe({
        next: () => {
          this.resetForm();
          this.loadBooks();
        },
        error: (err) => console.error('Error adding book', err)
      });
    }
  }

  // Prepare form for editing a selected book
  editBook(book: Book): void {
    this.isEditMode = true;
    // Create a copy to avoid modifying the list directly
    this.currentBook = { ...book };
    // Convert date to yyyy-MM-dd for input[type=date]
    this.currentBook.publicationDate = book.publicationDate.substring(0, 10);
  }

  // Delete a book by ID
  deleteBook(book: Book): void {
    if (!book.id) return;

    const confirmed = confirm(`Are you sure you want to delete "${book.title}"?`);
    if (!confirmed) return;

    this.bookService.deleteBook(book.id).subscribe({
      next: () => this.loadBooks(),
      error: (err) => console.error('Error deleting book', err)
    });
  }

  // Reset form to initial state
  resetForm(): void {
    this.isEditMode = false;
    this.currentBook = this.getEmptyBook();
  }
}
