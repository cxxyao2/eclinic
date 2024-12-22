import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';


import { AuthService } from '@libs/api-client';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MasterDataService } from 'src/app/services/master-data.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatInputModule, MatFormFieldModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage = signal<string | null>(null);

  constructor(private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private masterService: MasterDataService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const loginData = this.loginForm.value;

      this.authService.apiAuthLoginPost(loginData).subscribe({
        next: (response) => {
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('email', loginData['email']);
          this.masterService.userSubject.next(response.user);
          this.errorMessage.set(null);
          this.router.navigate(['/dashboard']);
          console.log('Login successful:', response);
        },
        error: (errResponse: HttpErrorResponse) => {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('email');
          const message = errResponse.error?.message || errResponse.message || "Something went wrong."
          this.errorMessage.set(message);
          console.error('Login failed:', errResponse);
        }
      }

      );
    }
  }
}