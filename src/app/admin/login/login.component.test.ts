import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { LoginComponent } from './login.component';
import { User } from '@libs/api-client';
import { AuthService } from '@libs/api-client';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { MasterDataService } from 'src/app/services/master-data.service';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';


class MockAuthService {
  apiAuthLoginPost = jest.fn().mockReturnValue({
    accessToken: 'accessToken',
    user: { userID: 1, email: '' } as User,
  });
  login: any;
}

class MockMasterService {
  userSubject = new BehaviorSubject<User | null>(null);
};


describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: MockAuthService;
  let masterService: MockMasterService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        CommonModule,
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatButtonModule,
        MatCardModule,
        LoginComponent
      ],
      providers: [
        FormBuilder,
        { provide: AuthService, useClass: MockAuthService },
        { provide: MasterDataService, useClass: MockMasterService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParams: {
                returnUrl: '/dashboard'
              }
            },
            queryParams: of({ returnUrl: '/dashboard' })
          }
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as unknown as MockAuthService;
    masterService = TestBed.inject(MasterDataService) as unknown as MockMasterService;
    fixture.detectChanges(); // Trigger initial change detection
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should update userSubject on successful login', () => {
    const user = { id: 1, name: 'Test User' }; // Mock user data
    authService.apiAuthLoginPost.mockReturnValue(of({ user })); // Mock login response

    component.loginForm.setValue({ email: 'test@example.com', password: 'password' });
    component.onSubmit();
    fixture.detectChanges(); // Trigger change detection to update the DOM

    expect(masterService.userSubject.value).toEqual(user);
  });

  it('should display error message when email is empty', () => {
    const emailInput = fixture.nativeElement.querySelector('input[formControlName="email"]');
    emailInput.value = '';
    emailInput.dispatchEvent(new Event('input'));
    fixture.detectChanges(); // Trigger change detection to update the DOM

    const errorMessage = fixture.nativeElement.querySelector('.error-message');
    expect(errorMessage.textContent).toContain('Email is required.');
  });

  it('should display error message when email is invalid', () => {
    const emailInput = fixture.nativeElement.querySelector('input[formControlName="email"]');
    emailInput.value = 'invalid-email';
    emailInput.dispatchEvent(new Event('input'));
    fixture.detectChanges(); // Trigger change detection to update the DOM

    const errorMessage = fixture.nativeElement.querySelector('.error-message');
    expect(errorMessage.textContent).toContain('Please enter a valid email address.');
  });

  it('should display error message when password is empty', () => {
    const passwordInput = fixture.nativeElement.querySelector('input[formControlName="password"]');
    passwordInput.value = '';
    passwordInput.dispatchEvent(new Event('input'));
    fixture.detectChanges(); // Trigger change detection to update the DOM

    const errorMessage = fixture.nativeElement.querySelector('.error-message');
    expect(errorMessage.textContent).toContain('Password is required.');
  });

  it('should enable login button when form is valid', () => {
    component.loginForm.setValue({ email: 'test@example.com', password: 'password' });
    fixture.detectChanges(); // Trigger change detection to update the DOM

    const loginButton = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(loginButton.disabled).toBeFalsy();
  });

  // Edge Case: Empty form submission
  it('should not submit the form when it is invalid', () => {
    const loginButton = fixture.nativeElement.querySelector('button[type="submit"]');
    loginButton.click();
    fixture.detectChanges(); // Trigger change detection to update the DOM

    expect(component.loginForm.valid).toBeFalsy();
  });

  // Test login method
  it('should call AuthService login method on form submit', async () => {
    component.loginForm.setValue({ email: 'test@example.com', password: 'password' });
    fixture.detectChanges(); // Trigger change detection to update the DOM

    const loginButton = fixture.nativeElement.querySelector('button[type="submit"]');
    loginButton.click();
    fixture.detectChanges(); // Trigger change detection to update the DOM

    expect(authService.apiAuthLoginPost).toHaveBeenCalled();
  });
});