import { Component, OnInit, Input } from '@angular/core';

// You'll use this import to close the dialog on success
import { MatDialogRef } from '@angular/material/dialog';

// This import brings in the API calls we created in 6.2
import { UserRegistrationService } from '../fetch-api-data.service';

// This import is used to display notifications back to the user
import { MatSnackBar } from '@angular/material/snack-bar';

import { Router } from '@angular/router';

/**
 * UserLoginFormComponent - Provides a form for user login.
 * This component allows users to log into their account.
 */
@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrl: './user-login-form.component.scss'
})
export class UserLoginFormComponent {
  /**
   * Input object to capture user login data.
   * @type {Object}
   * @property {string} Username - The username entered by the user.
   * @property {string} Password - The password entered by the user.
   */
  @Input() userData = { Username: '', Password: ''};

/**
   * Injects required services for user login.
   * @param {UserRegistrationService} fetchApiData - Service for API calls.
   * @param {MatDialogRef<UserLoginFormComponent>} dialogRef - Reference to close the dialog on successful login.
   * @param {Router} router - Service for navigation.
   * @param {MatSnackBar} snackBar - Service to display feedback messages.
   */
constructor(
    public fetchApiData: UserRegistrationService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public router: Router,
    public snackBar: MatSnackBar) { }

ngOnInit(): void {
}

/**
   * Logs in a user by sending form data to the backend API.
   * On success, stores user data and token in local storage,
   * closes the dialog, displays a success message, and navigates to the movies page.
   * On failure, displays an error message.
   */
loginUser(): void {
  this.fetchApiData.userLogin(this.userData).subscribe(
    (result) => {
      console.log("Login result:", result); // Log the full result
      const { user, token } = result; 

      localStorage.setItem("user", JSON.stringify(user)); // Store user details
      localStorage.setItem("token", token); // Store token

      this.dialogRef.close();
      this.snackBar.open(`Login Successful, Hello ${user.Username}`, 'OK', {
        duration: 2000
      });

      this.router.navigate(['movies']);
    },
    (error) => {
      console.error("Login error:", error);
      this.snackBar.open("Login unsuccessful, please try again", 'OK', {
        duration: 2000
      });
    }
  );
}
}

