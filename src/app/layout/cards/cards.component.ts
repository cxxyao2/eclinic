import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-cards',
  standalone: true,
  imports: [CommonModule, MatGridListModule, MatCardModule],
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.scss'
})
export class CardsComponent {
  cards = [
    { title: 'Total Patients Today', value: 42 },
    { title: 'Available Beds', value: 12 },
    { title: 'Critical Cases', value: 5 },
    { title: 'Staff on Duty', value: 28 },
  ];
}
