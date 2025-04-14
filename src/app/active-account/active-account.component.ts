import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@libs/api-client';

import { CodeInputModule } from 'angular-code-input';

@Component({
  selector: 'app-active-account',
  imports: [CodeInputModule],
  templateUrl: './active-account.component.html',
  styleUrl: './active-account.component.scss'
})
export class ActiveAccountComponent {

  message = signal('');
  isOkay = signal(true);
  submitted = signal(false);

  private router = inject(Router);
  private authService = inject(AuthService);

  onCodeCompleted(token: string) {
    this.confirmAccount(token);
  }

  redirectToLogin() {
    this.router.navigate(['login']);
  }

  private confirmAccount(token: string) {
    this.authService.apiAuthActivatePost({
      code: token
    }).subscribe({
      next: () => {
        this.message.set("Your account has been successfully activated. \nNow you can proceed to login");
        this.submitted.set(true);
        this.isOkay.set(true);
      },
      error: () => {
        console.log('eror is www');
        this.message.set("Token has been expired or invalid");
        this.submitted.set(true);
        this.isOkay.set(false);
      }
    });
  }
}
