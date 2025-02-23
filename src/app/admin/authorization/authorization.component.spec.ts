import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthorizationComponent } from './authorization.component';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { UserRole, UsersService } from '@libs/api-client';
import { of } from 'rxjs';
import { Router } from '@angular/router';

class MockUsersService {
  apiUsersGet = jest.fn().mockReturnValue(of([
    { userID: 1, userName: 'John Doe', role: UserRole.NUMBER_1 },
    { userID: 2, userName: 'Jane Smith', role: UserRole.NUMBER_2 }
  ]));
}

describe('AuthorizationComponent', () => {
  let component: AuthorizationComponent;
  let fixture: ComponentFixture<AuthorizationComponent>;
  let usersService: MockUsersService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatSelectModule,
        MatTableModule
      ],
      declarations: [AuthorizationComponent],
      providers: [
        { provide: UsersService, useClass: MockUsersService },
        { provide: Router, useValue: { navigate: jest.fn() } }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorizationComponent);
    component = fixture.componentInstance;
    usersService = TestBed.inject(UsersService) as unknown as MockUsersService;
    router = TestBed.inject(Router);
    fixture.detectChanges(); // Trigger initial change detection
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load users on init', () => {
    expect(usersService.apiUsersGet).toHaveBeenCalled();
    expect(component.dataSource.data.length).toBe(2);
    expect(component.dataSource.data[0].userName).toBe('John Doe');
  });

  it('should update user role', () => {
    const user = component.dataSource.data[0];
    user.role = UserRole.NUMBER_3;
    component.save();
    fixture.detectChanges();

    expect(component.originalData[0].role).toBe(UserRole.NUMBER_3);
  });

  it('should navigate to login on unauthorized access', () => {
    router.navigate = jest.fn();
    component.ngOnInit();
    fixture.detectChanges();

    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});