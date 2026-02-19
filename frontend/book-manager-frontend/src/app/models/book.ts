// Represents a book entity
export interface Book {
  id?: number; // optional when creating a new book
  title: string;
  author: string;
  isbn: string;
  publicationDate: string; // ISO string (e.g. '2024-01-01')
}
