import {
  Component,
  DestroyRef,
  inject,
  OnInit
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  debounceTime,
  distinctUntilChanged,
  Observable,
  of,
  switchMap
} from 'rxjs';

import { SearchPopupItemComponent } from "../search-popup-item/search-popup-item.component";
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

interface SearchResult {
  id: string;
  title: string;
  description?: string;
  category?: string;
}

@Component({
  selector: 'app-search',  // renamed from app-search-popup
  templateUrl: './search-popup.component.html',
  styleUrls: ['./search-popup.component.scss'],
  standalone: true,
  imports: [
    MatCardModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    SearchPopupItemComponent
  ]
})
export class SearchComponent implements OnInit {  // renamed from SearchPopupComponent
  // Form Controls
  protected readonly searchControl = new FormControl('');

  // Protected properties
  protected searchResults: SearchResult[] = [];
  protected readonly placeholderText = 'Search symptoms, treatments, or cases for reference';

  // Private properties
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    // this.setupSearchSubscription();  // 
  }

  // Protected methods
  protected onSearch(): void {
    const searchTerm = this.searchControl.value;
    if (!searchTerm) return;

    // this.performSearch(searchTerm).subscribe(results => {
    //   this.searchResults = results;
    //   this.notifySearchPerformed();
    // });
  }

  protected onResultSelected(result: SearchResult): void {
    // Handle result selection - navigate or perform action
    console.log('Selected result:', result);
  }

  // Private methods remain the same...
}
