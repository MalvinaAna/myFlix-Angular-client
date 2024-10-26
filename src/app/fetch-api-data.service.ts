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

  // User Registration
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + 'users', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  // User Login
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

  // Get All Movies
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

 // Get One Movie by ID
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

  // Get Director
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

  // Get Genre
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

  // Get User
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

 // Get Favorite Movies for a User
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

  // Add a Movie to Favorite Movies
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

  // Edit User
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

  // Delete a Movie from Favorite Movies
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

  // Non-typed response extraction
  private extractResponseData(res: any): any {
    return res || {};
  }

  // Error handler
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