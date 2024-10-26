import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { tap, catchError } from 'rxjs/operators';

// Declaring the API URL that will provide data for the client app
const apiUrl = 'https://my-movieflix-e95b2c0e9dda.herokuapp.com/';

@Injectable({
  providedIn: 'root'
})
export class UserRegistrationService {
  // Inject the HttpClient module into the constructor params
  constructor(private http: HttpClient) {}

  /**
   * Registers a new user.
   * @param {Object} userDetails - User details for registration.
   * @returns {Observable<any>} - Observable containing the registration response.
   */
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + 'users', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Logs in a user.
   * @param {Object} userDetails - User login details.
   * @returns {Observable<any>} - Observable containing the login response.
   */
  public userLogin(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + 'login', userDetails).pipe(
      catchError((error) => {
        console.error('Login error:', error); // Log any errors that occur
        if (error.error && error.error.message) {
            console.error('API Error Message:', error.error.message);
        }
        return throwError(error); // Rethrow the error for handling in the component
    })
    );
  }

  /**
   * Retrieves a list of all movies.
   * @returns {Observable<any>} - Observable containing the list of movies.
   */
  public getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies', {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Retrieves a single movie by its ID.
   * @param {string} movieId - ID of the movie to retrieve.
   * @returns {Observable<any>} - Observable containing movie details.
   */
 public getMovieById(movieId: string): Observable<any> {
  const token = localStorage.getItem('token');
  return this.http.get(apiUrl + `movies/${movieId}`, {
    headers: new HttpHeaders({
      Authorization: 'Bearer ' + token,
    })
  }).pipe(
    map(this.extractResponseData),
    catchError(error => {
      console.error(`Error fetching movie with ID ${movieId}:`, error); // Log the error for specific movie ID
      return throwError(error);
    })
  );
}

  /**
   * Retrieves information about a director.
   * @param {string} directorName - Name of the director.
   * @returns {Observable<any>} - Observable containing director details.
   */
  public getDirector(directorName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + `directors/${directorName}`, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

   /**
   * Retrieves information about a genre.
   * @param {string} genreName - Name of the genre.
   * @returns {Observable<any>} - Observable containing genre details.
   */
  public getGenre(genreName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + `genres/${genreName}`, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

   /**
   * Retrieves user information by username.
   * @param {string} username - Username of the user.
   * @returns {Observable<any>} - Observable containing user details.
   */
  public getUser(username: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + `users/${username}`, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

/**
* Retrieves a user's list of favorite movies.
* @returns {Observable<any>} - Observable containing favorite movies.
*/
public getFavoriteMovies(): Observable<any> {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}'); // Parse user object
  const username = user.Username; // Extract username

  console.log('Fetching favorite movies for username:', username);

  return this.http.get(apiUrl + `users/${username}/movies`, {
    headers: new HttpHeaders({
      Authorization: 'Bearer ' + token,
    })
  }).pipe(
    map(this.extractResponseData),
    catchError(this.handleError)
  );
}

/**
* Adds a movie to the user's list of favorites.
* @param {string} movieId - ID of the movie to add.
* @returns {Observable<any>} - Observable containing updated user data.
*/
public addFavoriteMovie(movieId: string): Observable<any> {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}'); // Parse the user object
  const username = user.Username; // Extract only the username

  return this.http.post(`${apiUrl}users/${username}/movies/${movieId}`, {}, {
    headers: new HttpHeaders({
      Authorization: 'Bearer ' + token,
    })
  }).pipe(
    map(this.extractResponseData),
    catchError(this.handleError)
  );
}

/**
  * Updates user information.
  * @param {Object} userDetails - Updated user details.
  * @returns {Observable<any>} - Observable containing updated user data.
  */
public editUser(userDetails: any): Observable<any> {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}'); // Retrieve user details
  const username = user.Username; // Extract username from user details

  // Construct the request body according to API requirements
  const updatedData: any = {
      Email: userDetails.Email,
      Username: userDetails.Username,
      Birthday: userDetails.Birthday,
      FavoriteMovies: userDetails.FavoriteMovies
  };

  // Only include the password if it is provided and not empty
  if (userDetails.Password && userDetails.Password.trim() !== '') {
      updatedData.Password = userDetails.Password; // Include the password if provided
  }

  // Make the HTTP PUT request
  return this.http.put(apiUrl + `users/${username}`, updatedData, {
      headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
      })
  }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
  );
}

/**
   * Deletes a user by username.
   * @param {string} username - Username of the user to delete.
   * @returns {Observable<any>} - Observable containing deletion confirmation.
   */
public deleteUser(username: string): Observable<any> {
  const token = localStorage.getItem('token');
  return this.http.delete(`${apiUrl}users/${username}`, {
    headers: new HttpHeaders({
      Authorization: `Bearer ${token}`
    }),
    responseType: 'text' // Expect text response to handle plain string messages from the server
  }).pipe(
    tap(response => {
      console.log('User deleted successfully:', response);
    }),
    catchError((error) => {
      console.error('Error deleting user:', error);
      // Customize the error message based on known scenarios
      const errorMessage = error.status === 200 
        ? 'Unexpected response format; check API response structure.' 
        : 'Something went wrong; please try again later.';
      return throwError(() => new Error(errorMessage));
    })
  );
}

/**
   * Deletes a movie from the user's list of favorites.
   * @param {string} movieId - ID of the movie to delete.
   * @returns {Observable<any>} - Observable containing updated user data.
   */
public deleteFavoriteMovie(movieId: string): Observable<any> {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}'); // Parse the user object
  const username = user.Username; // Extract only the username

  return this.http.delete(`${apiUrl}users/${username}/movies/${movieId}`, {
    headers: new HttpHeaders({
      Authorization: 'Bearer ' + token,
    })
  }).pipe(
    map(this.extractResponseData),
    catchError(this.handleError)
  );
}

  /**
   * Extracts data from an HTTP response.
   * @param {any} res - HTTP response data.
   * @returns {any} - The extracted response data.
   */
  private extractResponseData(res: any): any {
    return res || {};
  }

  /**
   * Handles HTTP errors.
   * @param {HttpErrorResponse} error - HTTP error response.
   * @returns {Observable<Error>} - Observable that throws an error message.
   */
  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else {
      console.error(
        `Error Status code ${error.status}, ` +
        `Error body is: ${error.error}`
      );
    }
    return throwError(
      'Something bad happened; please try again later.'
    );
  }
}