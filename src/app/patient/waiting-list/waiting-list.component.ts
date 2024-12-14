import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-waiting-list',
  standalone: true,
  imports: [CommonModule, MatTabsModule],
  templateUrl: './waiting-list.component.html',
  styleUrl: './waiting-list.component.scss'
})
export class WaitingListComponent implements OnInit {
  currentIndex = 0; // Current tab index
  patients = Array.from({ length: 9 }, (_, i) => `Patient ${i + 1}`); // 9 patients


  ngOnInit() {
    setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % 3; // Cycle through tabs
    }, 2000); // Switch every 2 seconds
  }


  onTabChange(index: number) {
    this.currentIndex = index;
    console.log(`Switched to screen: ${index + 1}`);
  }

}