import { authGuard } from './auth.guard';
import { MasterDataService } from '../services/master-data.service';
import { Router } from '@angular/router';
import { SnackbarService } from '../services/snackbar-service.service';
import { UserRole } from '@libs/api-client';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { of, Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

export class MockMatSnackBar {
    open = jest.fn();
}

export class MockSnackbarService {
    public snackbarSubject = new Subject<{ message: string; panelClass: string }>();

    constructor(private snackBar: MatSnackBar) { }

    show(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 2000,
        });
    }
}

jest.mock('../services/master-data.service');
jest.mock('@angular/router');


describe('authGuard', () => {
    let masterService: jest.Mocked<MasterDataService>;
    let router: jest.Mocked<Router>;
    let snackbarService: SnackbarService;
    let snackBar: jest.Mocked<MatSnackBar>;

    beforeEach(() => {
        masterService = new MasterDataService() as jest.Mocked<MasterDataService>;
        router = new Router() as jest.Mocked<Router>;
        snackBar = new MockMatSnackBar() as unknown as jest.Mocked<MatSnackBar>;
        snackbarService = new MockSnackbarService(snackBar as unknown as MatSnackBar) as unknown as SnackbarService;

        (masterService.userSubject as any) = { value: null }; // Mock userSubject
        router.navigate = jest.fn();
        snackBar.open = jest.fn();
    });

    it('should navigate to login if user is not logged in', () => {
        const next: ActivatedRouteSnapshot = {} as ActivatedRouteSnapshot;
        const state: RouterStateSnapshot = { url: '/protected' } as RouterStateSnapshot;

        const result = authGuard(next, state);

        expect(result).toBe(false);
        expect(router.navigate).toHaveBeenCalledWith(['/login'], { queryParams: { returnUrl: state.url } });
    });

    it('should show error snackbar if user is not authorized', () => {
        (masterService.userSubject as any).value = { role: UserRole.NUMBER_1 }; // Mock user with unauthorized role
        const next: ActivatedRouteSnapshot = {} as ActivatedRouteSnapshot;
        const state: RouterStateSnapshot = { url: '/protected' } as RouterStateSnapshot;

        const result = authGuard(next, state);

        expect(result).toBe(false);
        expect(snackBar.open).toHaveBeenCalledWith('You are not authorized to access this page', 'error-snackbar', { duration: 2000 });
    });

    it('should allow access if user is authorized', () => {
        (masterService.userSubject as any).value = { role: UserRole.NUMBER_3 }; // Mock user with authorized role
        const next: ActivatedRouteSnapshot = {} as ActivatedRouteSnapshot;
        const state: RouterStateSnapshot = { url: '/protected' } as RouterStateSnapshot;

        const result = authGuard(next, state);

        expect(result).toBe(true);
    });
});