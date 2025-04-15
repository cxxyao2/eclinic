import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '@libs/api-client';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  forgotPasswordForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  message = '';
  isError = false;

  onSubmit() {
    if (this.forgotPasswordForm.valid) {
      this.authService.apiAuthRequestPasswordResetPost({
        email: this.forgotPasswordForm.get('email')?.value
      }).subscribe({
        next: () => {
          this.message = 'If the email exists, a reset link has been sent';
          this.isError = false;
        },
        error: (error:HttpErrorResponse) => {
          this.message = error.error?.message || 'An error occurred';
          this.isError = true;
        }
      });
    }
  }
}
