// Angular Core imports
import { Component, computed, AfterViewInit, ViewChild, inject, signal, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

// Angular Material imports
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';

// Application imports - Components
import { HeaderComponent } from "./layout/header/header.component";
import { CustomSidenavComponent } from "./layout/custom-sidenav/custom-sidenav.component";

// Application imports - Services
import { ResponsiveService } from '@services/responsive.service';
import { NavService } from '@services/nav.service';
import { MasterDataService } from '@services/master-data.service';

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
  // ViewChild references
  @ViewChild('drawer') private readonly appDrawer!: MatSidenav;

  // Private properties
  private readonly navService = inject(NavService);
  private readonly masterService = inject(MasterDataService);

  // Public properties
  public readonly responseService = inject(ResponsiveService);
  public readonly title = 'eclinic';
  public readonly sidenavOpened = true;

  // Signals
  public readonly collapsed = signal(false);
  public readonly errorMessage = toSignal(this.masterService.messageSubject);

  constructor() {
    if (!this.masterService.userSubject.value) {
      this.masterService.fetchUserFromLocalStorage();
    }
  }

  // Computed values
  public readonly sidenavMode = computed(() =>
    this.responseService.isLargeScreen() ? 'side' : 'over'
  );

  public readonly sidenavWidth = computed(() =>
    this.responseService.isLargeScreen() && this.collapsed() ? '65px' : '250px'
  );

  // Lifecycle hooks
  public ngAfterViewInit(): void {
    this.navService.appDrawer = this.appDrawer;
  }

  // Public methods
  public closeErrorMessage(): void {
    this.masterService.messageSubject.next('');
  }
}
