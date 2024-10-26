import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserRegistrationService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent implements OnInit {
  movies: any[] = [];
  showFavoritesOnly = false; // Toggle for "My Favorites" filter
  filteredMovies: any[] = []; // Array for filtered movies based on favorites

  constructor(
    public fetchApiData: UserRegistrationService,
    private snackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.getMovies();
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      this.applyFilter(); // Apply the filter based on the current toggle setting
    });
  }

  // Toggle to filter between all movies and favorite movies
  toggleFavoritesFilter(): void {
    this.showFavoritesOnly = !this.showFavoritesOnly;
    this.applyFilter(); // Reapply filter on toggle
  }

  // Apply the filter to show either all movies or only favorites
  applyFilter(): void {
    if (this.showFavoritesOnly) {
      const userFavorites = JSON.parse(localStorage.getItem('user') || '{}').FavoriteMovies || [];
      this.filteredMovies = this.movies.filter(movie => userFavorites.includes(movie._id));
    } else {
      this.filteredMovies = this.movies;
    }
  }

  openDialog(title: string, name: string, content: string): void {
    this.dialog.open(GenericDialog, {
      width: '600px', // Set a larger width for the modal
      height: '200px', // Set height for the modal
      data: { title, name, content },
    });
  }

  addToFavorites(movieId: string): void {
    this.fetchApiData.addFavoriteMovie(movieId).subscribe(() => {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      user.FavoriteMovies = [...(user.FavoriteMovies || []), movieId]; // Update favorite movies
      localStorage.setItem('user', JSON.stringify(user)); // Save updated user data in localStorage
  
      this.snackBar.open("Movie added to favorites", 'OK', { duration: 2000 });
      this.applyFilter(); // Reapply filter after updating favorites
      this.cdr.detectChanges(); // Trigger change detection
    });
  }
  
  removeFromFavorites(movieId: string): void {
    this.fetchApiData.deleteFavoriteMovie(movieId).subscribe(() => {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      user.FavoriteMovies = (user.FavoriteMovies || []).filter((id: string) => id !== movieId); // Remove movie from favorites
      localStorage.setItem('user', JSON.stringify(user)); // Save updated user data in localStorage
  
      this.snackBar.open("Movie removed from favorites", 'OK', { duration: 2000 });
      this.applyFilter(); // Reapply filter after updating favorites
      this.cdr.detectChanges(); // Trigger change detection
    });
  }

  isFavorite(movieId: string): boolean {
    const userFavorites = JSON.parse(localStorage.getItem('user') || '{}').FavoriteMovies || [];
    return userFavorites.includes(movieId);
  }

  myProfile(): void {
    this.router.navigate(['profile']);
  }
}

@Component({
  selector: 'generic-dialog',
  template: `
    <div class="dialog-container">
      <h2 class="dialog-title">
        {{ data.title }}
        <button class="close-button" (click)="dialogRef.close()">X</button>
      </h2>
      <h4 class="dialog-name">
        {{ data.name }}
      </h4>
      <div class="dialog-content">
        <p *ngIf="data.name">{{ data.name }}</p>
        <p>{{ data.content }}</p>
      </div>
    </div>
  `,
  styles: [`
    .dialog-container {
      padding: 20px; /* Padding for the modal */
      max-width: 500px; /* Set width for the modal */
      height: auto; /* Auto height for the modal */
      background-color: #f5f5f5; /* Light background for contrast */
      border-radius: 8px; /* Rounded corners */
      position: relative; /* Position for close button */
    }
    .dialog-title {
      font-size: 1.5em; /* Title size */
      margin-bottom: 5px;
      color: #3f51b5; /* Primary color for the title */
      display: flex;
      justify-content: space-between; /* Space between title and close button */
      align-items: center; /* Center align items vertically */
    }
    .dialog-name {
      font-size: 1em; 
      margin-bottom: 5px;
      color: #3f51b5; /* Primary color for the title */
      display: flex;
      justify-content: space-between; /* Space between title and close button */
      align-items: center; /* Center align items vertically */
    }
    .dialog-content {
      font-size: 0.8em; /* Smaller font size for the content */
      margin: 10px 0;
      color: #333;
      max-height: 300px; /* Limit content height */
      overflow-y: auto; /* Enable scrolling if content exceeds height */
    }
    .close-button {
      background: none; /* No background */
      border: none; /* No border */
      color: #3f51b5; /* Match primary color */
      font-size: 1em; /* Size of close button */
      cursor: pointer; /* Cursor pointer for interactivity */
    }
    .close-button:hover {
      color: #c62828; /* Change color on hover */
    }
  `]
})
export class GenericDialog {
  constructor(
    public dialogRef: MatDialogRef<GenericDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; name?: string; content: string }
  ) {}
}