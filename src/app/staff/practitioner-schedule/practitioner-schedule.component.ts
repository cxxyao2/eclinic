import { MatButtonModule } from '@angular/material/button';
import { ViewChild, ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { AddPractitionerAvailabilityDTO, GetPractitionerDTO } from '@libs/api-client';
import { MasterDataService } from 'src/app/services/master-data.service';
import { ProfileComponent } from "../../shared/profile/profile.component";
import { SCHEDULE_DURATION } from '@constants/system-settings.constants';
import { MatIconModule } from '@angular/material/icon';
import { addMinutesToDate, formatDateToCustomString, getDayOfWeek } from 'src/app/helpers/date-helpers';

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { UserProfile } from '@models/userProfile.model';

export interface ScheduleElement {
  position: number;
  day: string;
  fromTime: Date;
  endTime: Date;
  available: boolean;
}

@Component({
  selector: 'app-practitioner-schedule',
  standalone: true,
  providers: [provideNativeDateAdapter(),

  ],
  imports: [FormsModule, ReactiveFormsModule, MatButtonModule, MatIconModule, MatTableModule, MatSortModule, MatDatepickerModule, MatFormFieldModule, MatInputModule, MatSelectModule, ProfileComponent],
  templateUrl: './practitioner-schedule.component.html',
  styleUrl: './practitioner-schedule.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PractitionerScheduleComponent implements OnInit {
  columnHeaders: { [key: string]: string } = {
    position: 'No.',
    day: 'Day',
    fromTime: 'From Time',
    endTime: 'End Time',
    availabe: 'Available'
  };

  displayedColumns: string[] = ['position', 'day', 'fromTime', 'endTime', 'available'];

  data: ScheduleElement[] = [{
    position: 1,
    day: 'Monday',
    fromTime: new Date(),
    endTime: new Date(),
    available: true
  }];
  dataSource = new MatTableDataSource(this.data);

  @ViewChild(MatSort) sort!: MatSort;

  private masterDataService = inject(MasterDataService);
  practitioners = signal<GetPractitionerDTO[]>([]);

  readonly dateForm = new FormGroup({
    workDate: new FormControl<Date>(new Date(), Validators.required),
    duration: new FormControl<number>(30),
    practitionerId: new FormControl<number | null>(null)

  });

  isCreate = signal(true);

  selectedPractitoner: UserProfile = {
    id: 1,
    firstName: 'aa',
    lastName: 'bb',
    gender: 'female',
    age: 33
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }



  ngOnInit() {

    this.masterDataService.practitionersSubject.subscribe({
      next: data => this.practitioners.set(data)
    })


  }



  setDate(event: MatDatepickerInputEvent<Date>): void {
    console.log(`selected date is ${event.value}`);

  }

  saveSchedule(): void {
    // todo , create an array based on date and duration

  }

  resetSchedule(): void {

    this.data = [];
    this.isCreate.set(!this.isCreate());
  }


  createSchedule(): void {

    let start = this.dateForm.value.workDate || new Date();
    let end = this.dateForm.value.workDate || new Date();
    let duration = this.dateForm.value.duration || SCHEDULE_DURATION;
    let practitionerId = this.dateForm.value.practitionerId ?? 0;
    if (!(start && end && duration && practitionerId)) {
      alert('Please input data.')
    }


    const startDate = formatDateToCustomString(start, '00:00:00');
    const endDate = formatDateToCustomString(end, '23:30:00');

    const availabilitySlots = this.generatePractitionerAvailabilitySlots(
      startDate,
      endDate,
      duration,
      practitionerId
    );

    this.dataSource.data = availabilitySlots.map((avail, index) => ({
      position: index,
      day: getDayOfWeek(avail.slotDateTime!, true),
      fromTime: avail.slotDateTime!,
      endTime: addMinutesToDate(avail.slotDateTime!, duration),
      available: avail.isAvailable!
    }));

    this.isCreate.set(!this.isCreate());
  }


  generatePractitionerAvailabilitySlots(
    startDate: string,
    endDate: string,
    duration: number,
    practitionerId: number
  ): AddPractitionerAvailabilityDTO[] {
    const slots: AddPractitionerAvailabilityDTO[] = [];

    let currentDate = new Date(startDate);
    const endDateTime = new Date(endDate);

    while (currentDate < endDateTime) {
      slots.push({
        practitionerId: practitionerId,
        slotDateTime: new Date(currentDate),
        isAvailable: true
      });

      // Increment the time by the specified duration in minutes
      currentDate = new Date(currentDate.getTime() + duration * 60 * 1000);
    }

    return slots;
  }

  printSchedule(): void {
    const users = [
      { name: 'Alice', age: 25 },
      { name: 'Bob', age: 30 },
      { name: 'Charlie', age: 35 },
    ];
    const doc = new jsPDF('p', 'mm', 'a4'); // Portrait, millimeters, A4 size

    // Title
    doc.setFontSize(16);
    doc.text('User List', 105, 20, { align: 'center' }); // Title centered at the top of the page

    // Table
    const columns = ['Name', 'Age']; // Table headers
    const rows = users.map((user) => [user.name, user.age]); // Convert users to table rows

    (doc as any).autoTable({
      head: [columns],
      body: rows,
      startY: 30, // Start below the title
      theme: 'grid', // Add grid lines
    });

    // Open the print dialog
    const pdfUrl = doc.output('bloburl'); // Create a Blob URL for the PDF
    const printWindow = window.open(pdfUrl, '_blank'); // Open it in a new tab/window
    if (printWindow) {
      printWindow.onload = () => printWindow.print(); // Trigger print once loaded
    }
  }

}


