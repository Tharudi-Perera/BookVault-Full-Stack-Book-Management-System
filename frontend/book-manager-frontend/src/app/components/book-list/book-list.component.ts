import { Component, OnInit, Inject } from '@angular/core';
import { Book } from '../../models/book';
import { BookService } from '../../services/book.service';
import { FormsModule, NgModel } from '@angular/forms';
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

  todayString: string = new Date().toISOString().split('T')[0];

  isbnExists: boolean = false;

  bookToDelete: Book | null = null;
  showDeleteModal = false;

  openDeleteModal(book: Book) {
    this.bookToDelete = book;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.bookToDelete = null;
  }

  confirmDelete() {
    if (!this.bookToDelete?.id) return;

    this.bookService.deleteBook(this.bookToDelete.id).subscribe({
      next: () => {
        this.closeDeleteModal();
        this.loadBooks();
      },
      error: (err) => {
        alert('Error deleting book');
        console.error('Error deleting book', err);
      }
    });
  }


  // Custom validator for publication date
  validatePublicationDate(pubDateInput: NgModel) {
    if (!pubDateInput.value) return null;
    return pubDateInput.value > this.todayString ? { max: true } : null;
  }
  // List of books loaded from the backend
  books: Book[] = [];

  // Check if ISBN is unique (client-side)
  checkIsbnUnique(isbn: string) {
    if (!isbn || isbn.length !== 13) {
      this.isbnExists = false;
      return;
    }
    // Exclude current book in edit mode
    this.isbnExists = this.books.some(b => b.isbn === isbn && (!this.isEditMode || b.id !== this.currentBook.id));
  }

  // Model for the form (used for both add and edit)
  currentBook: Book = this.getEmptyBook();

  // Flag to know if we are editing an existing book
  isEditMode = false;

  // Controls visibility of the add/edit form panel
  showForm = false;

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

  // Toggle the form panel open/closed
  toggleForm(): void {
    this.showForm = !this.showForm;
    // If closing the form while in edit mode, reset state
    if (!this.showForm && this.isEditMode) {
      this.isEditMode = false;
      this.currentBook = this.getEmptyBook();
    }
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
      if (this.isbnExists) return;
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
    this.showForm = true;
    // Create a copy to avoid modifying the list directly
    this.currentBook = { ...book };
    // Convert date to yyyy-MM-dd for input[type=date]
    this.currentBook.publicationDate = book.publicationDate.substring(0, 10);
  }

  // Reset form to initial state and close the panel
  resetForm(): void {
    this.isEditMode = false;
    this.showForm = false;
    this.currentBook = this.getEmptyBook();
  }
}