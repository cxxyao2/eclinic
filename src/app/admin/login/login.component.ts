import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';


import { AuthService } from '@libs/api-client';
import { ActivatedRoute, Router } from '@angular/router';
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
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage = signal<string | null>(null);
  returnUrl: string = '';

  constructor(private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private masterService: MasterDataService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
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
          this.router.navigateByUrl(this.returnUrl);
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