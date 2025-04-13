// Angular Core imports
import { ChangeDetectionStrategy, Component, DestroyRef, computed, effect, inject, input, model, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { filter, tap } from 'rxjs';

// Angular Material imports
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';

// Third-party imports
import { TranslocoService, TranslocoDirective } from '@jsverse/transloco';

// Application imports
import { GetInpatientDTO, User, UserRole } from '@libs/api-client';
import { DialogSimpleDialog } from 'src/app/shared/dialog-simple-dialog';
import { MasterDataService } from 'src/app/services/master-data.service';
import { NavService } from 'src/app/services/nav.service';
import { SseClientService } from 'src/app/services/sse.service';

// Constants
const LANGUAGE_MAP: Readonly<Record<string, string>> = {
  fr: 'French',
  en: 'English',
  ch: 'Chinese',
  jp: 'Japanese'
} as const;

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    // Angular modules
    CommonModule,
    RouterModule,
    
    // Material modules
    MatBadgeModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatToolbarModule,
    MatTooltipModule,
    
    // Other modules
    TranslocoDirective,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  providers: [SseClientService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  // Input/Output properties
  isLargeScreen = input<boolean | undefined | null>(false);
  toggleDrawer = output<void>();
  collapsed = model.required<boolean>();

  // Enum exports
  protected readonly UserRole = UserRole;

  // Signals and Computed values
  protected readonly darkMode = signal(false);
  protected readonly isNotificationVisible = signal(false);
  protected readonly currentLanguage = computed(() => 
    LANGUAGE_MAP[this.transloco.getActiveLang()] || 'English'
  );

  // Injected services
  private readonly transloco = inject(TranslocoService);
  private readonly masterService = inject(MasterDataService);
  private readonly navigationService = inject(NavService);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly sseService = inject(SseClientService);
  private readonly destroyRef = inject(DestroyRef);

  // Converted observables to signals
  protected readonly user = toSignal(this.masterService.userSubject);
  protected readonly currentFullRoute = toSignal(this.navigationService.currentUrl);

  // Effects
  protected readonly setDarkMode = effect(() => {
    document.body.classList.toggle('dark', this.darkMode());
    document.body.classList.toggle('light', !this.darkMode());
  });

  // Public methods
  protected toggleLanguage(newLanguage: string): void {
    this.transloco.setActiveLang(newLanguage);
  }

  protected showNotifications(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.position = {
      top: '64px',
      right: '0px'
    };
    dialogConfig.width = '300px';
    dialogConfig.height = '400px';
    dialogConfig.data = {
      title: 'Patient need a bed',
      content: [...this.sseService.message()],
      isCancelButtonVisible: true,
      optionId: 'inpatientId',
      optionValue: 'patientName'
    };

    const dialogRef = this.dialog.open(DialogSimpleDialog, dialogConfig);
    dialogRef.afterClosed().pipe(
      takeUntilDestroyed(this.destroyRef),
      filter((result): result is object => typeof result === 'object' && !!result),
      tap(result => {
        this.masterService.selectedPatientSubject.next(result);
        this.router.navigate(['/inpatient']);
      })
    ).subscribe();
  }

  protected logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('email');
    this.masterService.userSubject.next(null);
    this.router.navigate(['/dashboard']);
  }
}
