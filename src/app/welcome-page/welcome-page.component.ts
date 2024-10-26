import { Component, OnInit } from '@angular/core';
import { UserLoginFormComponent } from '../user-login-form/user-login-form.component';
import { UserRegistrationFormComponent } from '../user-registration-form/user-registration-form.component';
import { MatDialog } from '@angular/material/dialog';

/**
 * WelcomePageComponent - Displays the welcome page with options to log in or register.
 */
@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss']
})
export class WelcomePageComponent implements OnInit {
    /**
   * Injects the MatDialog service for opening dialog modals.
   * @param {MatDialog} dialog - The dialog service for opening dialogs.
   */
  constructor(public dialog: MatDialog) { }

  /**
   * Angular lifecycle hook that runs after the component's view has been initialized.
   */
  ngOnInit(): void {
  }

  /**
   * Opens a dialog for user registration.
   * The dialog contains the UserRegistrationFormComponent and is set to 280px width.
   */
  openUserRegistrationDialog(): void {
    this.dialog.open(UserRegistrationFormComponent, {
      width: '280px'
    });
  }

  /**
   * Opens a dialog for user login.
   * The dialog contains the UserLoginFormComponent and is set to 280px width.
   */
   openUserLoginDialog(): void {
      this.dialog.open(UserLoginFormComponent, {
        width: '280px'
      });
   }
}