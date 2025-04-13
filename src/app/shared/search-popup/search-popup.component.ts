import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output, SimpleChanges } from '@angular/core';

import { SearchPopupItemComponent } from "../search-popup-item/search-popup-item.component";
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';


@Component({
  selector: 'app-search-popup',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatDividerModule, MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule, SearchPopupItemComponent],
  templateUrl: './search-popup.component.html',
  styleUrl: './search-popup.component.scss'
})
export class SearchPopupComponent implements OnInit {
  searchControl = new FormControl('');
  searchResults: any[] = [];
  private router = inject(Router);
  placeholderText: string = 'Search symptoms, treatments, or cases for reference';

  // todo: replace with actual data from medical database service
  articleTitles = [
    "Innovations in Cardiovascular Surgery by Dr. Jane Smith, on June 4, 2024, The New England Journal of Medicine",
    "Breakthroughs in Oncology Treatments by Dr. John Doe, on June 4, 2024, The Lancet",
    "Advancements in Genetic Editing by Dr. Emily Davis, on June 4, 2024, JAMA",
    "The Role of AI in Personalized Medicine by Dr. Michael Lee, on June 4, 2024, The New England Journal of Medicine",
    "Combating Antimicrobial Resistance by Dr. Sarah Brown, on June 4, 2024, The Lancet",
    "Exploring New Horizons in Neuroscience by Dr. Olivia Garcia, on June 4, 2024, JAMA",
    "Pioneering Vaccine Development for Emerging Diseases by Dr. Liam Martinez, on June 4, 2024, The New England Journal of Medicine",
    "Revolutionizing Diabetes Management by Dr. Sophia Taylor, on June 4, 2024, The Lancet",
    "Breakthrough Studies in Infectious Diseases by Dr. Ethan Wilson, on June 4, 2024, JAMA",
    "Telemedicine and Its Future Impact on Healthcare by Dr. Mia Anderson, on June 4, 2024, The New England Journal of Medicine"
  ];


  @Input() fileName!: string;
  @Output() close = new EventEmitter<void>();

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((searchTerm) => this.mockSearchRequest(searchTerm ?? ""))
      )
      .subscribe((results) => {
        this.searchResults = results; // Update the results
        console.log('Search results:', results);
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['fileName']) {
      console.log('fileName changed', changes['fileName'].currentValue);
    }

  }


  closePopup(): void {
    this.router.navigate(['/dashboard']);
  }


  // Mock search HTTP request (replace with your actual service)
  mockSearchRequest(query: string) {
    if (!query.trim()) {
      // Return empty results for empty query
      return of([]);
    }
    console.log('Performing search for:', query);
    // Simulate an API response
    const filteredArray = this.articleTitles.filter(item =>
      item.toLowerCase().includes(query.trim().toLowerCase())
    );
    return of([...filteredArray]).pipe(debounceTime(500)); // Simulate network delay
  }

  // For explicit search button clicks (optional)
  onSearch() {
    alert('You are visiting knowledge base.');
    const currentValue = this.searchControl.value;
    if (currentValue) {
      this.mockSearchRequest(currentValue).subscribe((results) => {
        this.searchResults = results;
      });
    }
  }



}
