import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, OnInit, signal } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { GetVisitRecordDTOListServiceResponse, VisitRecordsService } from '@libs/api-client';

@Component({
  selector: 'app-waiting-list',
  standalone: true,
  imports: [CommonModule, MatTabsModule],
  templateUrl: './waiting-list.component.html',
  styleUrl: './waiting-list.component.scss'
})
export class WaitingListComponent implements AfterViewInit, OnInit {
  currentIndex = 0; // Current tab index
  patients = signal<string[]>([]);
  today = new Date();

  private visitService = inject(VisitRecordsService);

  ngAfterViewInit() {
    this.getWaitingListByDate(this.today);

  }

  ngOnInit() {
    setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % 3; // Cycle through tabs
    }, 2000); // Switch every 2 seconds
  }

  getWaitingListByDate(bookedDate: Date) {
    this.visitService.apiVisitRecordsWaitingListGet(bookedDate).subscribe({
      next: (res: GetVisitRecordDTOListServiceResponse) => {
        const visits = res.data ?? [];
        this.patients.set(visits.map(v => v.patientName ?? ""));
      },
      error: () => { }
    }
    );
  }


  onTabChange(index: number) {
    this.currentIndex = index;
    console.log(`Switched to screen: ${index + 1}`);
  }

}