import { animate, state, style, transition, trigger } from '@angular/animations';
import { MenuItem } from './../custom-sidenav/custom-sidenav.component';
import { Component, DestroyRef, HostBinding, inject, Input, input, OnInit, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterModule } from '@angular/router';
import { NavService } from '../../services/nav.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgClass, NgStyle } from '@angular/common';

@Component({
  selector: 'app-menu-item',
  standalone: true,
  imports: [MatListModule, RouterModule, MatIconModule, MatTooltipModule, NgStyle, NgClass],
  templateUrl: './menu-item.component.html',
  styleUrl: './menu-item.component.scss',
  animations: [
    trigger('expandCollapseMenu', [
      state('collapsed', style({ transform: 'rotate(0deg)' })),
      state('expanded', style({ transform: 'rotate(180deg' })),
      transition('expanded <=> collapsed', animate('225ms')),
    ]),
  ]
})
export class MenuItemComponent implements OnInit {
  expanded = signal(false);
  @HostBinding('attr.aria-expanded') ariaExpanded = this.expanded();
  item = input.required<MenuItem>();
  @Input() depth?: number;
  collapsed = input<boolean>(true);
  private destroyRef = inject(DestroyRef);

  constructor(public navService: NavService, public router: Router) {
    if (this.depth === undefined) {
      this.depth = 0;
    }
  }

  ngOnInit(): void {
    this.navService.currentUrl
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((url) => {
        if (this.item().route && url) {
          this.expanded.set(url.indexOf(`/${this.item().route}`) === 0);
          this.ariaExpanded = this.expanded();
        }
      });
  }

  onItemSelected(item: MenuItem): void {

    if (item.subItems?.length ?? 0 > 0) {
      this.expanded.set(!this.expanded());
      return;
    }

    if (this.navService.appDrawer.mode === 'over') {
      this.router.navigate([item.route]);
      this.navService.closeNav();
    } else {
      this.router.navigate([item.route]);
    }
  }

}

