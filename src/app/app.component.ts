// Angular Core imports
import { Component, computed, AfterViewInit, ViewChild, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

// Angular Material imports
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';

// Component imports
import { HeaderComponent } from "./layout/header/header.component";
import { CustomSidenavComponent } from "./layout/custom-sidenav/custom-sidenav.component";

// Service imports
import { ResponsiveService } from './services/responsive.service';
import { NavService } from './services/nav.service';
import { MasterDataService } from './services/master-data.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    MatSidenavModule,
    HeaderComponent,
    CustomSidenavComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit {
  @ViewChild('drawer') appDrawer!: MatSidenav;

  // Service injections
  public readonly responseService = inject(ResponsiveService);
  private readonly navService = inject(NavService);
  private readonly masterService = inject(MasterDataService);

  // Public properties
  title = 'eclinic';
  sidenavOpend = true;

  // Signals
  collapsed = signal(false);
  errorMessage = toSignal(this.masterService.messageSubject);

  constructor() {
    if (!this.masterService.userSubject.value) {
      this.masterService.fetchUserFromLocalStorage();
    }
  }

  // Computed values
  sidenavMode = computed(() =>
    this.responseService.isLargeScreen() ? 'side' : 'over'
  );

  sidenavWidth = computed(() =>
    this.responseService.isLargeScreen() && this.collapsed() ? '65px' : '250px'
  );

  ngAfterViewInit(): void {
    this.navService.appDrawer = this.appDrawer;
  }

  // Public methods
  closeErrorMessage(): void {
    this.masterService.messageSubject.next('');
  }
}
