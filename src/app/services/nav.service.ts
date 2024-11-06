import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSidenav } from '@angular/material/sidenav';
import { Event, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class NavService {
  public appDrawer!: MatSidenav;
  public currentUrl = new BehaviorSubject<string | null>(null);
  private destroyRef = inject(DestroyRef);

  constructor(private router: Router) {
    this.router.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl.next(event.urlAfterRedirects);
      }
    });
  }

  public closeNav(): void {
    this.appDrawer.close();
  }

  public openNav(): void {
    this.appDrawer.open();
  }
}
