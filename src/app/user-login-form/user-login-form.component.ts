import { Component, OnInit, Input } from '@angular/core';

// You'll use this import to close the dialog on success
import { MatDialogRef } from '@angular/material/dialog';

// This import brings in the API calls we created in 6.2
import { UserRegistrationService } from '../fetch-api-data.service';

// This import is used to display notifications back to the user
import { MatSnackBar } from '@angular/material/snack-bar';

import { Router } from '@angular/router';

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
    public router: Router,
    public snackBar: MatSnackBar) { }

ngOnInit(): void {
}

// This is the function responsible for sending the form inputs to the backend
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

