import { CommonModule } from '@angular/common';
import { User } from '@libs/api-client';
import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, input, model, OnInit, output, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslocoService } from '@jsverse/transloco';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { SseClientService } from 'src/app/services/sse.service';
import { MatBadgeModule } from '@angular/material/badge';
import { MasterDataService } from 'src/app/services/master-data.service';
import { Router, RouterModule } from '@angular/router';
import { NavService } from 'src/app/services/nav.service';
import { MatListModule } from '@angular/material/list';

const languageMap: { [key: string]: string } = {
  fr: 'French',
  en: 'English',
  ch: 'Chinese',
  jp: 'Japanese'
};

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatListModule, RouterModule, MatBadgeModule, MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule, MatTooltipModule],
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
  private destroyRef = inject(DestroyRef);
  private translocoService = inject(TranslocoService);
  private masterService = inject(MasterDataService);
  private navigationService = inject(NavService);

  public router = inject(Router);
  sseService = inject(SseClientService);

  user = toSignal(this.masterService.userSubject);
  currentFullRoute = toSignal(this.navigationService.currentUrl);

  setDarkMode = effect(() => {
    document.body.classList.toggle('dark', this.darkMode());
    document.body.classList.toggle('light', !this.darkMode());
  });

  ngOnInit() {
    this.currentLanguage.set(this.translocoService.getActiveLang());
    this.translocoService.langChanges$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(lang => {
        this.currentLanguage.set(languageMap[lang]);
      });
  }

  toggleLanguage(newLanguage: string) {
    this.translocoService.setActiveLang(newLanguage);
  }


  toggleNotifications() {
    this.isNotificationVisible.set(!this.isNotificationVisible());
    console.log('hi', this.sseService.message());
    // 1, show a list of inpatients
    // 2, click a specific inpatient, then REDIRECT TO inpatient arrangement
  }

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('email');
    this.masterService.userSubject.next(null);
    this.router.navigate(['/dashboard']);
  }

}
