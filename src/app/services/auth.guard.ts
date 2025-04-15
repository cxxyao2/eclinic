import { SnackbarService } from './snackbar-service.service';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { MasterDataService } from './master-data.service';
import { inject } from '@angular/core';
import { UserRole } from '@libs/api-client';

export const authGuard: CanActivateFn = (next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot) => {
  const masterService = inject(MasterDataService);
  const router = inject(Router);
  const snackbar = inject(SnackbarService);
  const user = masterService.userSubject.value;
  if (!user) {
    snackbar.show('You need to login first', 'error-snackbar');
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
  if (user.role === UserRole.Admin) {
    return true;
  }
  return false;
};
