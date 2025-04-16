import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
// Angular Core imports
import { ChangeDetectionStrategy, Component, computed, DestroyRef, effect, inject, input, model, output, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { filter, tap } from 'rxjs';

// Angular Material imports
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

// Third-party imports
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';


// Application imports - Services
import { MasterDataService } from '@services/master-data.service';
import { NavService } from '@services/nav.service';
import { UserRole } from '@libs/api-client';
import { SseClientService } from '@services/sse.service';
import { DialogSimpleDialog } from '@shared/dialog-simple-dialog';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';

// Application imports - Models
const LANGUAGE_MAP: Record<string, string> = {
  en: 'English',
  fr: 'French',
  ch: 'Chinese',
  jp: 'Japanese'
} as const;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  standalone: true,
  providers: [
    SseClientService
  ],
  imports: [CommonModule, MatBadgeModule, MatButtonModule,MatMenuModule, MatToolbarModule, MatIcon, MatTooltipModule, RouterLink,TranslocoModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  // Input/Output properties
  public readonly isLargeScreen = input<boolean | undefined | null>(false);
  public readonly toggleDrawer = output<void>();
  public readonly collapsed = model.required<boolean>();

  // Protected constants
  protected readonly UserRole = UserRole;

  // Protected signals
  protected readonly darkMode = signal(false);
  protected readonly isNotificationVisible = signal(false);
  protected readonly currentLanguage = computed(() =>
    LANGUAGE_MAP[this.transloco.getActiveLang()] || 'English'
  );

  // Protected services (used in template)
  public readonly sseService = inject(SseClientService);

  // Private services
  private readonly transloco = inject(TranslocoService);
  private readonly masterService = inject(MasterDataService);
  private readonly navigationService = inject(NavService);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  // Protected signals (from observables)
  protected readonly user = toSignal(this.masterService.userSubject);
  protected readonly currentFullRoute = toSignal(this.navigationService.currentUrl);

  // Effects
  protected readonly setDarkMode = effect(() => {
    document.body.classList.toggle('dark', this.darkMode());
    document.body.classList.toggle('light', !this.darkMode());
  });

  // Protected methods (used in template)
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

  protected toggleLanguage(lang: string): void {
    this.transloco.setActiveLang(lang);
  }

  protected logout(): void {
    localStorage.removeItem('accessToken');
    this.masterService.userSubject.next(null);
    this.router.navigate(['/dashboard']);
  }
}
