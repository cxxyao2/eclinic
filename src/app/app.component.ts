import { Component, computed, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./layout/header/header.component";
import { CustomSidenavComponent } from "./layout/custom-sidenav/custom-sidenav.component";
import { MatSidenavModule } from '@angular/material/sidenav';
import { ResponsiveService } from './services/responsive.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslocoService } from '@jsverse/transloco';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatToolbarModule, MatSidenavModule, HeaderComponent, CustomSidenavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'eclinic';
  responseService = inject(ResponsiveService);


  collapsed = signal(false);
  sidenavOpend = true;

  sidenavMode = computed(() => {
    if (this.responseService.isLargeScreen()) {
      return 'side';
    }
    return 'over';
  });

  sidenavWidth = computed(() => this.responseService.isLargeScreen() ? ((this.collapsed() ? '65px' : '250px')) : '80%');

}
