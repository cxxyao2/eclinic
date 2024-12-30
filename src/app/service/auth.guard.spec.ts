import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { authGuard } from './auth.guard';
import { MasterDataService } from '../services/master-data.service';
import { UserRole, User } from '@libs/api-client';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

interface UserSubject {
    value: User | null
}
class MockMasterDataService {
    userSubject: UserSubject = { value: null };
}

class MockMatSnackBar {
    show = jest.fn();
}

describe('authGuard', () => {
    let masterService: MockMasterDataService;
    let router: Router;
    let snackBar: MockMatSnackBar;

    beforeEach(() => {
        masterService = new MockMasterDataService();
        router = { navigate: jest.fn() } as any;
        snackBar = new MockMatSnackBar();

        TestBed.configureTestingModule({
            providers: [
                { provide: MasterDataService, useValue: masterService },
                { provide: Router, useValue: router },
                { provide: MatSnackBar, useValue: snackBar }
            ]
        });
    });

    it('should navigate to login if user is not logged in', () => {
        const next: ActivatedRouteSnapshot = {} as ActivatedRouteSnapshot;
        const state: RouterStateSnapshot = { url: '/protected' } as RouterStateSnapshot;

        TestBed.runInInjectionContext(() => {
            const result = authGuard(next, state);
            expect(result).toBe(false);
            expect(router.navigate).toHaveBeenCalledWith(['/login'], { queryParams: { returnUrl: state.url } });
        });
    });

    it('should show error snackbar if user is not authorized', () => {
        masterService.userSubject.value = { userID: 0, email: "0@gmail.com", role: UserRole.NUMBER_1 }; // Mock user with unauthorized role
        const next: ActivatedRouteSnapshot = {} as ActivatedRouteSnapshot;
        const state: RouterStateSnapshot = { url: '/protected' } as RouterStateSnapshot;

        TestBed.runInInjectionContext(() => {
            const result = authGuard(next, state);
            expect(result).toBe(false);
        });
    });

    it('should allow access if user is authorized', () => {
        masterService.userSubject.value = { userID: 0, email: "0@gmail.com", role: UserRole.NUMBER_3 }; // Mock user with authorized role
        const next: ActivatedRouteSnapshot = {} as ActivatedRouteSnapshot;
        const state: RouterStateSnapshot = { url: '/protected' } as RouterStateSnapshot;

        TestBed.runInInjectionContext(() => {
            const result = authGuard(next, state);
            expect(result).toBe(true);
        });
    });
});