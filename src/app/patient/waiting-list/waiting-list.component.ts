import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { GetVisitRecordDTO, GetVisitRecordDTOListServiceResponse, VisitRecordsService } from '@libs/api-client';

@Component({
  selector: 'app-waiting-list',
  standalone: true,
  imports: [CommonModule, MatTabsModule],
  templateUrl: './waiting-list.component.html',
  styleUrl: './waiting-list.component.scss'
})
export class WaitingListComponent implements AfterViewInit, OnInit, OnDestroy {
  currentIndex = 0; // Current tab index
  patients = signal<GetVisitRecordDTO[]>([]);
  today = new Date();

  private intervalId: any;
  private visitService = inject(VisitRecordsService);

  ngAfterViewInit() {
    this.getWaitingListByDate(this.today);

  }

  ngOnInit() {
    this.intervalId = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % 3;
    }, 2000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  getWaitingListByDate(bookedDate: Date) {
    this.visitService.apiVisitRecordsWaitingListGet(bookedDate).subscribe({
      next: (res: GetVisitRecordDTOListServiceResponse) => {
        const visits = res.data ?? [];
        this.patients.set(visits);
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