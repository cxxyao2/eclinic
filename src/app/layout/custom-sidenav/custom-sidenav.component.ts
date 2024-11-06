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
      icon: 'dashboard',
      label: 'Dashboard',
      route: 'dashboard',
    },
    {
      icon: "calendar_month",
      label: 'Check in',
      route: 'checkin'
    },
    {
      icon: 'video_library',
      label: 'Content',
      route: 'content',
      subItems: [
        {

          icon: 'play_circle',
          label: 'Videos',
          route: 'content/videos'
        },
        {
          icon: 'playlist_play',
          label: 'Playlists',
          route: 'content/playlists'
        },
        {
          icon: 'post_add',
          label: 'Posts',
          route: 'content/posts'
        }
      ]
    },
    {
      icon: 'analytics',
      label: 'Analytics',
      route: 'analytics',
    },
    {
      icon: 'comments',
      label: 'Comments',
      route: 'comments',
    }
  ]);

  toggleSidenav() {
    this.toggleDrawer.emit();
  }

}
