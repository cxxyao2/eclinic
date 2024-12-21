import { Component, inject, Input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, UrlTree } from '@angular/router';
import { MenuItemComponent } from "../menu-item/menu-item.component";
import { ResponsiveService } from '../../services/responsive.service';

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
  imports: [CommonModule, MatListModule, MatIconModule, RouterModule, MenuItemComponent],
  templateUrl: './custom-sidenav.component.html',
  styleUrl: './custom-sidenav.component.scss'
})
export class CustomSidenavComponent {

  toggleDrawer = output();

  sideNavCollapsed = signal(false);
  responseService = inject(ResponsiveService);
  isBigScreen = this.responseService.isLargeScreen;
  // TODO
  username = "Magical Manager";

  @Input() set collapsed(val: boolean) {
    this.sideNavCollapsed.set(val);
  }

  menuItems = signal<MenuItem[]>([
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
    },
    {
      icon: 'login',
      label: 'Login',
      route: 'login'
    },
    {
      icon: 'account_box',
      label: 'update',
      route: 'update-user'
    }
  ]);

  toggleSidenav() {
    this.toggleDrawer.emit();
  }

}
