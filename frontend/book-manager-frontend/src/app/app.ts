import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BookListComponent } from './components/book-list/book-list.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BookListComponent],
  templateUrl: './app.html',
  styleUrl: './app.css' 
})
export class App {
  protected readonly title = signal('book-manager-frontend');
}
