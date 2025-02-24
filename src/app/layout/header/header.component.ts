import { CommonModule } from '@angular/common';
import { GetInpatientDTO, User } from '@libs/api-client';
import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, input, model, OnInit, output, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslocoService, TranslocoDirective } from '@jsverse/transloco';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { SseClientService } from 'src/app/services/sse.service';
import { MatBadgeModule } from '@angular/material/badge';
import { MasterDataService } from 'src/app/services/master-data.service';
import { Router, RouterModule } from '@angular/router';
import { NavService } from 'src/app/services/nav.service';
import { MatListModule } from '@angular/material/list';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogSimpleDialog } from 'src/app/shared/dialog-simple-dialog';

const languageMap: { [key: string]: string } = {
  fr: 'French',
  en: 'English',
  ch: 'Chinese',
  jp: 'Japanese'
};

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatListModule,TranslocoDirective, RouterModule, MatBadgeModule, MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule, MatTooltipModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  providers: [SseClientService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  isLargeScreen = input<boolean | undefined | null>(false);
  toggleDrawer = output();
  collapsed = model.required<boolean>();

  darkMode = signal(false);
  currentLanguage = signal('English');
  isNotificationVisible = signal(false);
  transloco = inject(TranslocoService);
  private masterService = inject(MasterDataService);
  private navigationService = inject(NavService);
  readonly dialog = inject(MatDialog);

  public router = inject(Router);
  sseService = inject(SseClientService);

  user = toSignal(this.masterService.userSubject);
  currentFullRoute = toSignal(this.navigationService.currentUrl);

  setDarkMode = effect(() => {
    document.body.classList.toggle('dark', this.darkMode());
    document.body.classList.toggle('light', !this.darkMode());
  });
  destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.currentLanguage.set(this.transloco.getActiveLang());
    this.transloco.langChanges$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(lang => {
        this.currentLanguage.set(languageMap[lang]);
      });
  }

  toggleLanguage(newLanguage: string) {
    this.transloco.setActiveLang(newLanguage);
  }

  showNotifications() {
    const dialogConfig = new MatDialogConfig();

    // Set dialog position
    dialogConfig.position = {
      top: '64px',
      right: '0px'
    };

    // Set dialog dimensions
    dialogConfig.width = '300px';
    dialogConfig.height = '400px';

    // Pass data to the dialog
    dialogConfig.data = {
      title: 'Patient need a bed',
      content: [...this.sseService.message()],
      isCancelButtonVisible: true,
      optionId: 'inpatientId',
      optionValue: 'patientName'
    };

    const dialogRef = this.dialog.open(DialogSimpleDialog, dialogConfig);
    dialogRef.afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(result => {
        if (typeof result === 'object' && result) {
          // navigate to assign
          this.masterService.selectedPatientSubject.next(result);
          this.router.navigate(['/inpatient']);
        }

      });
  }

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('email');
    this.masterService.userSubject.next(null);
    this.router.navigate(['/dashboard']);
  }

}
