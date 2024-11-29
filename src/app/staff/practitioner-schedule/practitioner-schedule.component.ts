import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ViewChild, ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

import { AddPractitionerAvailabilityDTO, GetPractitionerDTO, GetPractitionerAvailabilityDTO } from '@libs/api-client';
import { MasterDataService } from 'src/app/services/master-data.service';
import { ProfileComponent } from "../../shared/profile/profile.component";
import { SCHEDULE_DURATION } from '@constants/system-settings.constants';
import { MatIconModule } from '@angular/material/icon';
import { addMinutesToDate, compareDates, formatDateToCustomString, getDayOfWeek } from 'src/app/helpers/date-helpers';

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { UserProfile } from '@models/userProfile.model';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { AddMinutesPipe } from 'src/app/helpers/add-minutes.pipe';


export interface DialogData {
  title: string;
  content: string;
  isCancelButtonVisible: boolean
}

@Component({
  selector: 'app-practitioner-schedule',
  standalone: true,
  providers: [provideNativeDateAdapter(),

  ],
  imports: [AddMinutesPipe, MatCheckboxModule, MatPaginatorModule, CommonModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatIconModule, MatTableModule, MatSortModule, MatDatepickerModule, MatFormFieldModule, MatInputModule, MatSelectModule, ProfileComponent],
  templateUrl: './practitioner-schedule.component.html',
  styleUrl: './practitioner-schedule.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PractitionerScheduleComponent implements OnInit {
  columnHeaders: { [key: string]: string } = {
    day: 'Day',
    fromTime: 'From Time',
    endTime: 'End Time',
    isAvailable: 'Availabe'
  };

  displayedColumns: string[] = ['day', 'fromTime', 'endTime', 'isAvailable'];
  SCHEDULE_DURATION = SCHEDULE_DURATION;

  initialData: GetPractitionerAvailabilityDTO[] = [];
  dataSource = new MatTableDataSource<GetPractitionerAvailabilityDTO>([]);

  @ViewChild(MatSort) sort!: MatSort;

  private masterDataService = inject(MasterDataService);
  practitioners = signal<GetPractitionerDTO[]>([]);
  changedData: GetPractitionerAvailabilityDTO[] = [];

  readonly scheduleForm = new FormGroup({
    workDate: new FormControl<Date>(new Date(), Validators.required),
    practitionerId: new FormControl<number | null>(null)
  });

  isCreate = signal(true);

  selectedPractitoner = signal<UserProfile>({ id: 0 });

  readonly dialog = inject(MatDialog);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogPractitionerScheduleDialog, {
      data: {
        title: 'Confirm action',
        content: 'Are you sure you want to reset? All unsaved changes will be lost.',
        isCancelButtonVisible: true
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.resetSchedule();
      }
    });
  }


  openDataInvalidDialog(): void {
    const dialogRef = this.dialog.open(DialogPractitionerScheduleDialog, {
      data: {
        title: 'Notification',
        content: 'Please select practitioner and date firstly.',
        isCancelButtonVisible: false
      },
    });
  }

  openNoPrintDataDialog(): void {
    const dialogRef = this.dialog.open(DialogPractitionerScheduleDialog, {
      data: {
        title: 'Notification',
        content: 'No data to print.',
        isCancelButtonVisible: false
      },
    });
  }



  ngOnInit() {
    this.masterDataService.practitionersSubject.subscribe({
      next: data => this.practitioners.set(data)
    })
  }

  onPractitionerChange(event: MatSelectChange): void {
    const id = event.value;
    const pra = this.practitioners().find(pra => pra.practitionerId === id);
    if (pra) {
      this.selectedPractitoner.set({
        id,
        firstName: pra.firstName ?? '',
        lastName: pra.lastName ?? ''
      });
      this.scheduleForm.patchValue({
        practitionerId: id
      });
    }
    this.searchExistingSchedule();
  }

  onWorkDateChange(event: MatDatepickerInputEvent<Date>): void {
    this.scheduleForm.patchValue({ workDate: event.value });
    console.log(`selected date is ${event.value}`);

    this.searchExistingSchedule();

  }

  searchExistingSchedule(): void {
    const workDate = this.scheduleForm.value.workDate;
    const practitionerId = this.scheduleForm.value.practitionerId;
    if ((!workDate) || practitionerId === 0) return;
    const existingData = this.masterDataService.availabilitiesSubject.value
      .filter(rec => rec.slotDateTime && compareDates(rec.slotDateTime, workDate)
        && rec.practitionerId === practitionerId
      );

    this.dataSource.data = existingData;
    this.initialData = existingData;

  }

  saveSchedule(): void {
    const updatedEntities = this.changedData.filter(c => (c.availableId ?? 0) > 0)
    const newEntities = this.changedData.filter(c => c.availableId === 0);
    if (updatedEntities.length > 0) this.masterDataService.updateAvailabilities(updatedEntities);
    if (newEntities.length > 0) this.masterDataService.addAvailabilities(newEntities.map(ele => ({
      practitionerId: ele.practitionerId,
      slotDateTime: ele.slotDateTime,
      isAvailable: ele.isAvailable,
    })));

    // TODO: save success message. + checkbox disabled + buttons changes: edit, reset, save,
    this.isCreate.set(true);

  }

  resetSchedule(): void {
    this.dataSource.data = [];
    this.changedData = [];
    this.isCreate.set(!this.isCreate());

    const validEntities = this.dataSource.data.filter(
      entity => (entity.availableId ?? 0 > 0)
    );

    this.masterDataService.deleteAvailabilities(validEntities);

  }


  createSchedule(): void {

    let start = this.scheduleForm.value.workDate || new Date();
    let practitionerId = this.scheduleForm.value.practitionerId ?? 0;
    if (!(start && practitionerId)) {
      this.openDataInvalidDialog();
      return;
    }

    const startDate = formatDateToCustomString(start, '00:00:00');
    const endDate = formatDateToCustomString(start, '23:30:00');
    const availabilitySlots = this.generatePractitionerAvailabilitySlots(
      startDate,
      endDate,
      this.SCHEDULE_DURATION,
      practitionerId
    );

    this.changedData = [...availabilitySlots];
    this.dataSource.data = availabilitySlots.map((avail) => ({
      slotDateTime: avail.slotDateTime,
      isAvailable: avail.isAvailable
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

  onAvaialableChange(event: MatCheckboxChange, element: any, column: string): void {
    const newValue = event.checked;
    console.log(`Checkbox in column "${column}" changed to`, newValue);
    element[column] = newValue;
    const index = this.changedData.findIndex((item) => item.availableId === element.availableId);
    if (index === -1) {
      this.changedData.push(element);
    } else {
      this.changedData[index] = element;
    }
  }

  printSchedule(): void {
    if (this.dataSource.data.length <= 0) {
      this.openNoPrintDataDialog();
      return;
    }

    const users = [
      { name: 'Alice', age: 25 },
      { name: 'Bob', age: 30 },
      { name: 'Charlie', age: 35 },
    ];
    const doc = new jsPDF('p', 'mm', 'a4'); // Portrait, millimeters, A4 size


    doc.setFontSize(16);
    doc.text('User List', 105, 20, { align: 'center' }); // Title centered at the top of the page

    const columns = ['Name', 'Age']; // Table headers
    const rows = users.map((user) => [user.name, user.age]); // Convert users to table rows

    (doc as any).autoTable({
      head: [columns],
      body: rows,
      startY: 30,
      theme: 'grid',
    });

    const pdfUrl = doc.output('bloburl');
    const printWindow = window.open(pdfUrl, '_blank');
    if (printWindow) {
      printWindow.onload = () => printWindow.print();
    }
  }

}


@Component({
  selector: 'practitioner-schedule-dialog',
  templateUrl: 'practitioner-schedule-dialog.html',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
})
export class DialogPractitionerScheduleDialog {
  readonly dialogRef = inject(MatDialogRef<DialogPractitionerScheduleDialog>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  onNoClick(): void {
    this.dialogRef.close();
  }
}

