import { Component, OnInit, Input } from '@angular/core';

// You'll use this import to close the dialog on success
import { MatDialogRef } from '@angular/material/dialog';

// This import brings in the API calls we created in 6.2
import { UserRegistrationService } from '../fetch-api-data.service';

// This import is used to display notifications back to the user
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrl: './user-login-form.component.scss'
})
export class UserLoginFormComponent {
  @Input() userData = { Username: '', Password: ''};

constructor(
    public fetchApiData: UserRegistrationService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar) { }

ngOnInit(): void {
}

// This is the function responsible for sending the form inputs to the backend
loginUser(): void {
  this.fetchApiData.userLogin(this.userData).subscribe((result) => {
// Logic for a successful user registration goes here! (To be implemented)
   localStorage.setItem("user", JSON.stringify(result.user));
   localStorage.setItem("token", result.token);
   this.dialogRef.close(); // This will close the modal on success!
   this.snackBar.open(`Login Successful, Hello ${result.user.Username}`, 'OK', {
      duration: 2000
   });
  }, (result) => {
    this.snackBar.open("login unsuccessful, please try again", 'OK', {
      duration: 2000
      });
    });
  }

  }

