import { Component, OnInit } from '@angular/core';
import { UserRegistrationService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

/**
 * UserProfileComponent - Manages and displays the user profile, including
 * user data, favorite movies, and account settings.
 */
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  /**
   * Stores user data including Username, Password, Email, and Birthday.
   * @type {Object}
   */
  userData: any = { 
    Username: '',
    Password: '',
    Email: '',
    Birthday: ''
  };

  /**
   * List of favorite movies associated with the user.
   * @type {Array}
   */
  favoriteMoviesList: any[] = [];
  
  /**
   * Injects required services for fetching user data, routing, and displaying snackbars.
   * Initializes `userData` with stored user information from local storage.
   * @param {UserRegistrationService} fetchApiData - Service for API calls.
   * @param {Router} router - Service for navigation.
   * @param {MatSnackBar} snackBar - Service for displaying feedback messages.
   */
  constructor(
    public fetchApiData: UserRegistrationService,
    public router: Router,
    public snackBar: MatSnackBar
  ) { 
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    this.userData = {
      Username: storedUser.Username || '',
      Password: '',
      Email: storedUser.Email || '',
      Birthday: storedUser.Birthday || ''
    };
  }

  ngOnInit(): void {
    this.getUser();
    this.getFavoriteMovies();
  }

  /**
   * Fetches user data from the API and updates `userData` and `favoriteMoviesList`.
   */
  getUser(): void {
    this.fetchApiData.getUser(this.userData.Username).subscribe(
      (response: any) => {
        this.userData.Username = response.Username;
        this.userData.Email = response.Email;
        this.userData.Birthday = response.Birthday ? new Date(response.Birthday).toISOString().split('T')[0] : null;
        this.favoriteMoviesList = response.FavoriteMovies || [];
        console.log('User data fetched:', this.userData);
      },
      (error) => {
        console.error('Error fetching user data:', error);
      }
    );
  }

  /**
   * Updates the user data on the server with the current `userData`.
   * Updates local storage with the latest user data upon success.
   */
  editUser(): void {
    this.fetchApiData.editUser(this.userData).subscribe(
      (resp: any) => {
        console.log('User updated successfully:', resp);
        this.userData = resp;
        localStorage.setItem("user", JSON.stringify(this.userData));
      },
      (error) => {
        console.error("Error updating user:", error);
        alert("Please make sure you have filled in all the required fields and try again.");
      }
    );
  }

  /**
   * Fetches the user's favorite movies from the API and stores them in `favoriteMoviesList`.
   */
  getFavoriteMovies(): void {
    this.fetchApiData.getFavoriteMovies().subscribe((movies: any[]) => {
      this.favoriteMoviesList = movies; // Store the favorite movies
    });
  }

  /**
   * Adds or removes a movie from the user's favorites.
   * @param {string} movieId - The ID of the movie to add or remove.
   */
  handleFavoriteToggle(movieId: string): void {
    const isFavorite = this.favoriteMoviesList.some((movie) => movie.id === movieId);
    if (isFavorite) {
      this.fetchApiData.deleteFavoriteMovie(movieId).subscribe(() => {
        this.favoriteMoviesList = this.favoriteMoviesList.filter((movie) => movie.id !== movieId);
        this.snackBar.open('Movie removed from favorites', 'OK', { duration: 2000 });
      });
    } else {
      this.fetchApiData.addFavoriteMovie(movieId).subscribe((movie) => {
        this.favoriteMoviesList.push(movie);
        this.snackBar.open('Movie added to favorites', 'OK', { duration: 2000 });
      });
    }
  }

  /**
   * Deletes the user's account and logs them out.
   */
  deleteUser(): void {
    const username = this.userData.Username;
    this.fetchApiData.deleteUser(username).subscribe(
      (resp: any) => {
        console.log('User deleted successfully:', resp);
        this.logoutUser(); // Automatically log out after deletion
      },
      (error) => {
        console.error('Error deleting user:', error);
        this.snackBar.open('Error deleting account. Please try again later.', 'OK', { duration: 3000 });
      }
    );
  }
  
  /**
   * Logs out the user, clears local storage, and navigates to the welcome page.
   * Displays a confirmation message upon success.
   */
  logoutUser(): void {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    this.router.navigate(['welcome']);
    this.snackBar.open('Account deleted successfully. You have been logged out.', 'OK', { duration: 3000 });
  }

  /**
   * Navigates to the movies page.
   */
  allMovies(): void {
    this.router.navigate(['movies']);
  }
}