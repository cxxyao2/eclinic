import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { AuthService, UserCreateDTO } from '@libs/api-client';

private interface RegisterForm {
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent {
  // Private properties
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  // Public properties
  public readonly registerForm: FormGroup<RegisterForm> = this.fb.group<RegisterForm>({
    firstName: this.fb.control('', [Validators.required, Validators.minLength(2)]),
    lastName: this.fb.control('', [Validators.required, Validators.minLength(2)]),
    email: this.fb.control('', [Validators.required, Validators.email]),
    password: this.fb.control('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: this.fb.control('', [Validators.required])
  }, { validators: (g: AbstractControl) => this.passwordMatchValidator(g as FormGroup) });

  public errorMessage: string | null = null;
  public hidePassword = true;

  // Public methods
  public onSubmit(): void {
    if (this.registerForm.valid) {
      const registerData: UserCreateDTO = {
        name: `${this.registerForm.value.firstName!} ${this.registerForm.value.lastName!}`,
        email: this.registerForm.value.email!,
        password: this.registerForm.value.password!
      };

      this.authService.apiAuthRegisterPost(registerData).subscribe({
        next: () => {
          this.router.navigate(['/login'], {
            queryParams: { registered: 'true' }
          });
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
        }
      });
    }
  }

  // Private methods
  private passwordMatchValidator(g: FormGroup): { [key: string]: boolean } | null {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null
      : { 'mismatch': true };
  }
}


