import { toSignal } from '@angular/core/rxjs-interop';
import { Component, inject, Input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule, UrlTree } from '@angular/router';
import { MenuItemComponent } from "../menu-item/menu-item.component";
import { ResponsiveService } from '../../services/responsive.service';
import { MasterDataService } from 'src/app/services/master-data.service';
import { TranslocoDirective } from '@jsverse/transloco';

export type MenuItem = {
  icon: string;
  label: string;
  route?: string | UrlTree;
  subItems?: MenuItem[
  ]
}


@Component({
  selector: 'app-custom-sidenav',
  standalone: true,
  imports: [CommonModule, TranslocoDirective, MatListModule, MatIconModule, RouterModule, MenuItemComponent],
  templateUrl: './custom-sidenav.component.html',
  styleUrl: './custom-sidenav.component.scss'
})
export class CustomSidenavComponent {

  toggleDrawer = output();

  sideNavCollapsed = signal(false);
  responseService = inject(ResponsiveService);
  masterService = inject(MasterDataService);
  isBigScreen = this.responseService.isLargeScreen;
  user = toSignal(this.masterService.userSubject);
  private router = inject(Router);

  @Input() set collapsed(val: boolean) {
    this.sideNavCollapsed.set(val);
  }

  menuItems = signal<MenuItem[]>([
    {
      icon: 'dashboard',
      label: 'Dashboard',
      route: 'dashboard'
    },
    {
      icon: 'event_available',
      label: 'Available',
      route: 'available',
    },
    {
      icon: "book_online",
      label: 'Booking',
      route: 'booking'
    },
    {
      icon: 'person_check',
      label: 'Check In',
      route: 'checkin'
    },
    {
      icon: 'medication',
      label: 'Consultation',
      route: 'consultation'
    },
    {
      icon: "hub",
      label: "Admin",
      route: "admin",
      subItems: [
        {

          icon: 'list',
          label: 'Waitlist',
          route: 'admin/waitlist'
        },
        {
          icon: 'group',
          label: 'Authorize',
          route: 'admin/authorize'
        },
      ]
    },
    {
      icon: 'vaccines',
      label: 'Inpatient',
      route: 'inpatient'
    }

  ]);

  loginItemForSmallScreen = signal<MenuItem>(
    {
      icon: 'login',
      label: 'Login',
      route: 'login'
    });

  toggleSidenav() {
    this.toggleDrawer.emit();
  }

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('email');
    this.masterService.userSubject.next(null);
    this.router.navigate(['/dashboard']);
    this.toggleDrawer.emit();
  }

}
