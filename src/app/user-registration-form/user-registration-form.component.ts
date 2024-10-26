import { Component, OnInit, Input } from '@angular/core';

// You'll use this import to close the dialog on success
import { MatDialogRef } from '@angular/material/dialog';

// This import brings in the API calls we created in 6.2
import { UserRegistrationService } from '../fetch-api-data.service';

// This import is used to display notifications back to the user
import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * UserRegistrationFormComponent - Provides a form for user registration.
 * This component allows users to enter their information and register.
 */
@Component({
  selector: 'app-user-registration-form',
  templateUrl: './user-registration-form.component.html',
  styleUrls: ['./user-registration-form.component.scss']
})
export class UserRegistrationFormComponent implements OnInit {
  
  /**
   * Input object to capture user registration data.
   * @type {Object}
   * @property {string} Username - The username entered by the user.
   * @property {string} Password - The password entered by the user.
   * @property {string} Email - The email entered by the user.
   * @property {string} Birthday - The user's birthday.
   */
  @Input() userData = { Username: '', Password: '', Email: '', Birthday: '' };

/**
   * Injects required services for user registration.
   * @param {UserRegistrationService} fetchApiData - Service for API calls.
   * @param {MatDialogRef<UserRegistrationFormComponent>} dialogRef - Reference to close the dialog on successful registration.
   * @param {MatSnackBar} snackBar - Service to display feedback messages.
   */
constructor(
    public fetchApiData: UserRegistrationService,
    public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
    public snackBar: MatSnackBar) { }

ngOnInit(): void {
}

/**
   * Registers a new user by sending the form data to the backend API.
   * Closes the dialog and displays a success or error message upon completion.
   */
registerUser(): void {
    this.fetchApiData.userRegistration(this.userData).subscribe((result) => {
  // Logic for a successful user registration goes here! (To be implemented)
     this.dialogRef.close(); // This will close the modal on success!
     console.log(result);
     this.snackBar.open(result, 'OK', {
        duration: 2000
     });
    }, (result) => {
      console.log(result)
      this.snackBar.open(result, 'OK', {
        duration: 2000
      });
    });
  }

  }
