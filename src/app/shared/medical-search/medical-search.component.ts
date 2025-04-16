import { Component, inject, signal, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { VisitRecordsService, GetMedicalHistoryDTO } from '@libs/api-client';
import { debounceTime, distinctUntilChanged, Observable, switchMap, catchError, of, BehaviorSubject, startWith } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-medical-search',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatPaginatorModule
  ],
  templateUrl: './medical-search.component.html',
  styleUrls: ['./medical-search.component.scss']
})
export class MedicalSearchComponent {
  searchControl = new FormControl('');
  isLoading = signal(false);
  private visitRecordsService = inject(VisitRecordsService);
  private searchResultsSubject = new BehaviorSubject<GetMedicalHistoryDTO[]>([]);
  searchResults$ = this.searchResultsSubject.asObservable();

  // Pagination
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  totalItems = signal(0);
  currentPage = signal(1);
  pageSize = signal(10);

  ngOnInit() {
    this.setupSearch();
  }

  private setupSearch() {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => {
        if (!term || term.length < 2) {
          this.totalItems.set(0);
          return of({ data: { items: [], totalItems: 0 } });
        }
        this.isLoading.set(true);
        // Reset to first page when search term changes
        this.currentPage.set(1);
        if (this.paginator) {
          this.paginator.pageIndex = 0;
        }

        return this.visitRecordsService.apiVisitRecordsSearchGet(
          term,
          undefined, // startDate
          this.currentPage(),
          this.pageSize()
        ).pipe(
          catchError(() => of({ data: { items: [], totalItems: 0 } }))
        );
      })
    ).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        if (response.data) {
          this.searchResultsSubject.next(response.data.items || []);
          this.totalItems.set(response.data.totalItems);
        }
      },
      error: () => {
        this.isLoading.set(false);
        this.searchResultsSubject.next([]);
        this.totalItems.set(0);
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.currentPage.set(event.pageIndex + 1);
    this.pageSize.set(event.pageSize);

    const searchTerm = this.searchControl.value;
    if (searchTerm && searchTerm.length >= 2) {
      this.isLoading.set(true);
      this.visitRecordsService.apiVisitRecordsSearchGet(
        searchTerm,
        undefined, // startDate
        this.currentPage(),
        this.pageSize()
      ).subscribe({
        next: (response) => {
          this.isLoading.set(false);
          if (response.data) {
            this.searchResultsSubject.next(response.data.items || []);
            this.totalItems.set(response.data.totalItems);
          }
        },
        error: () => {
          this.isLoading.set(false);
          this.searchResultsSubject.next([]);
          this.totalItems.set(0);
        }
      });
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }
}

