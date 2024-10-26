import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserRegistrationService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

/**
 * MovieCardComponent - Displays a list of movies with options to add or remove from favorites.
 * Allows users to view all movies or filter to show only their favorite movies.
 */
@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent implements OnInit {
  /**
   * Array of movies retrieved from the backend API.
   * @type {Array}
   */
  movies: any[] = [];

  showFavoritesOnly = false; // Toggle for "My Favorites" filter
  filteredMovies: any[] = []; // Array for filtered movies based on favorites

  /**
   * Injects required services for fetching movies, displaying snackbars, routing, and opening dialogs.
   * @param {UserRegistrationService} fetchApiData - Service for API calls.
   * @param {MatSnackBar} snackBar - Service for displaying feedback messages.
   * @param {Router} router - Service for navigation.
   * @param {MatDialog} dialog - Service for opening dialogs.
   * @param {ChangeDetectorRef} cdr - Service to detect changes in the component.
   */
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

  /**
   * Fetches the list of all movies from the API and applies the favorites filter.
   */
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      this.applyFilter(); // Apply the filter based on the current toggle setting
    });
  }

  /**
   * Toggles the view to show either all movies or only the user's favorite movies.
   * Reapplies the filter based on the current toggle setting.
   */
  toggleFavoritesFilter(): void {
    this.showFavoritesOnly = !this.showFavoritesOnly;
    this.applyFilter(); // Reapply filter on toggle
  }

  /**
   * Applies the filter to display either all movies or only those marked as favorites.
   */
  applyFilter(): void {
    if (this.showFavoritesOnly) {
      const userFavorites = JSON.parse(localStorage.getItem('user') || '{}').FavoriteMovies || [];
      this.filteredMovies = this.movies.filter(movie => userFavorites.includes(movie._id));
    } else {
      this.filteredMovies = this.movies;
    }
  }

  /**
   * Opens a dialog to display detailed information about a movie.
   * @param {string} title - The title of the dialog.
   * @param {string} name - The name associated with the content, like director or genre.
   * @param {string} content - The content to be displayed in the dialog.
   */
  openDialog(title: string, name: string, content: string): void {
    this.dialog.open(GenericDialog, {
      width: '600px', // Set a larger width for the modal
      height: '200px', // Set height for the modal
      data: { title, name, content },
    });
  }

  /**
   * Adds a movie to the user's list of favorite movies, updates local storage, and re-applies the filter.
   * @param {string} movieId - The ID of the movie to add to favorites.
   */
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

  /**
   * Removes a movie from the user's list of favorite movies, updates local storage, and re-applies the filter.
   * @param {string} movieId - The ID of the movie to remove from favorites.
   */  
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

  /**
   * Checks if a movie is in the user's list of favorite movies.
   * @param {string} movieId - The ID of the movie to check.
   * @returns {boolean} - Returns true if the movie is a favorite, false otherwise.
   */
  isFavorite(movieId: string): boolean {
    const userFavorites = JSON.parse(localStorage.getItem('user') || '{}').FavoriteMovies || [];
    return userFavorites.includes(movieId);
  }

  /**
   * Navigates the user to their profile page.
   */
  myProfile(): void {
    this.router.navigate(['profile']);
  }
}

/**
 * GenericDialog - A reusable dialog component for displaying additional information about a movie.
 */
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
  /**
   * Injects MatDialogRef to control dialog state and MAT_DIALOG_DATA to access the dialog's input data.
   * @param {MatDialogRef<GenericDialog>} dialogRef - Reference to the current dialog instance.
   * @param {Object} data - Data passed to the dialog.
   * @param {string} data.title - Title of the dialog.
   * @param {string} [data.name] - Optional name associated with the dialog content.
   * @param {string} data.content - Content to display in the dialog.
   */
  constructor(
    public dialogRef: MatDialogRef<GenericDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; name?: string; content: string }
  ) {}
}