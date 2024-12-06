// Angular Core Imports
import { ChangeDetectionStrategy, Component, OnInit, Signal, ViewChild, computed, effect, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

// Angular Material Imports
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

// Third-Party Libraries
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Application-Specific Imports
import { SCHEDULE_DURATION } from '@constants/system-settings.constants';
import { addMinutesToDate, compareDates, formatDateToHHmm, formatDateToYMDPlus, getDayOfWeek } from 'src/app/helpers/date-helpers';
import { AddPractitionerAvailabilityDTO, GetPractitionerDTO, GetPractitionerAvailabilityDTO } from '@libs/api-client';
import { MasterDataService } from 'src/app/services/master-data.service';
import { ProfileComponent } from 'src/app/shared/profile/profile.component';
import { AddMinutesPipe } from 'src/app/helpers/add-minutes.pipe';
import { UserProfile } from '@models/userProfile.model';
import { toSignal } from '@angular/core/rxjs-interop';

export interface DialogData {
  title: string;
  content: string;
  isCancelButtonVisible: boolean;
}

@Component({
  selector: 'app-practitioner-schedule',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    AddMinutesPipe,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatSelectModule,
    MatSortModule,
    MatTableModule,
    ProfileComponent,
  ],
  templateUrl: './practitioner-schedule.component.html',
  styleUrls: ['./practitioner-schedule.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PractitionerScheduleComponent implements OnInit {
  // Constants
  SCHEDULE_DURATION = SCHEDULE_DURATION;

  // Data & Forms
  columnHeaders: { [key: string]: string } = {
    day: 'Day',
    fromTime: 'From Time',
    endTime: 'End Time',
    isAvailable: 'Available',
  };
  changedData: GetPractitionerAvailabilityDTO[] = []; // added, updated
  deletedData: GetPractitionerAvailabilityDTO[] = []; // deleted


  dataSource = new MatTableDataSource<GetPractitionerAvailabilityDTO>([]);
  displayedColumns: string[] = ['day', 'fromTime', 'endTime', 'isAvailable'];
  initialData: GetPractitionerAvailabilityDTO[] = [];
  practitioners = signal<GetPractitionerDTO[]>([]);
  // Form controls
  workDayControl = new FormControl<Date | null>(new Date());
  practitionerIdControl = new FormControl<number | null>(0);
  selectedPractitioner = signal<UserProfile>({ id: 0 });
  // Convert form control values to signals
  workDay$ = toSignal(this.workDayControl.valueChanges, { initialValue: new Date() });
  practitionerId$ = toSignal(this.practitionerIdControl.valueChanges, { initialValue: 0 });

  // ViewChild References
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Services
  masterDataService = inject(MasterDataService);
  readonly dialog = inject(MatDialog);
  // Filtered data using compute
  filteredData: Signal<any[]> = computed(() => {
    const workDay = this.workDay$();
    const practitionerId = this.practitionerId$();
    const data = this.masterDataService.availabilitiesSubject.value;

    return data.filter(item => {
      const matchesWorkday = item.slotDateTime && workDay && compareDates(item.slotDateTime, workDay);
      const matchesPractitionerId = item.practitionerId && practitionerId && item.practitionerId === practitionerId;
      return matchesWorkday && matchesPractitionerId;
    });
  });

  constructor() {
    effect(() => {
      this.dataSource.data = this.filteredData();
      this.changedData = [];
      this.deletedData = [];
    });
  }

  // Lifecycle Hooks
  ngOnInit(): void {
    this.masterDataService.practitionersSubject.subscribe({
      next: (data) => this.practitioners.set(data),
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  // Event Handlers
  onPractitionerChange(event: MatSelectChange): void {
    const id = event.value;
    const practitioner = this.practitioners().find((p) => p.practitionerId === id);
    if (practitioner) {
      this.selectedPractitioner.set({
        id,
        firstName: practitioner.firstName ?? '',
        lastName: practitioner.lastName ?? '',
      });
    }
  }

  onAvailableChange(event: MatCheckboxChange, element: any, column: string): void {
    const newValue = event.checked;
    element[column] = newValue;
    const index = this.changedData.findIndex((item) => item.availableId === element.availableId);
    if (index === -1) {
      this.changedData.push(element);
    } else {
      this.changedData[index] = element;
    }
  }

  deleteSchedule(): void {
    const dialogRef = this.dialog.open(DialogPractitionerScheduleDialog, {
      data: { title: 'Confirm Action', content: 'Are you sure you want to delete? All unsaved changes will be lost.', isCancelButtonVisible: true },
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result !== undefined) {
        this.deletedData = this.dataSource.data.filter((entity) => (entity.availableId ?? 0) > 0);
        this.changedData = [];
        this.dataSource.data = [];
      }
    });

  }


  saveSchedule(): void {
    const updatedEntities = this.changedData.filter((c) => (c.availableId ?? 0) > 0);
    const newEntities = this.changedData.filter((c) => (c.availableId ?? 0) === 0);
    this.masterDataService.errorMessage.next(null);
    this.masterDataService.crudResultMessage.next(null);
    if (updatedEntities.length > 0) this.masterDataService.updateAvailabilities(updatedEntities);
    if (newEntities.length > 0) {
      this.masterDataService.addAvailabilities(
        newEntities.map((ele) => ({
          practitionerId: ele.practitionerId,
          slotDateTime: ele.slotDateTime,
          isAvailable: ele.isAvailable,
        }))
      )
    }

    if (this.deletedData.length > 0) {
      this.masterDataService.deleteAvailabilities(this.deletedData);
    }
  }



  createSchedule(): void {
    const workDate = this.workDay$();
    const practitionerId = this.practitionerId$();
    if (!workDate || !practitionerId) {
      this.openDataInvalidDialog();
      return;
    }

    if (this.dataSource.data.length > 0) {
      this.dialog.open(DialogPractitionerScheduleDialog, {
        data: { title: 'Notification', content: 'The schedule for the staff has already been created.If you want to update it, please proceed to click "Delete" button first', isCancelButtonVisible: false },
      });
      return;
    }

    const startDate = formatDateToYMDPlus(workDate, '00:00:00');
    const endDate = formatDateToYMDPlus(workDate, '23:30:00');
    const availabilitySlots = this.generatePractitionerAvailabilitySlots(startDate, endDate, this.SCHEDULE_DURATION, practitionerId);

    this.changedData = [...availabilitySlots];
    this.dataSource.data = availabilitySlots.map((avail) => ({
      slotDateTime: avail.slotDateTime,
      isAvailable: avail.isAvailable,
    }));
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
        practitionerId,
        slotDateTime: new Date(currentDate),
        isAvailable: true,
      });
      currentDate = new Date(currentDate.getTime() + duration * 60 * 1000);
    }

    return slots;
  }

  // Dialogs


  openDataInvalidDialog(): void {
    this.dialog.open(DialogPractitionerScheduleDialog, {
      data: { title: 'Notification', content: 'Please select practitioner and date first.', isCancelButtonVisible: false },
    });
  }

  openNoPrintDataDialog(): void {
    this.dialog.open(DialogPractitionerScheduleDialog, {
      data: { title: 'Notification', content: 'No data to print.', isCancelButtonVisible: false },
    });
  }

  printSchedule(): void {
    if (this.dataSource.data.length <= 0) {
      this.openNoPrintDataDialog();
      return;
    }

    const doc = new jsPDF('p', 'mm', 'a4');
    doc.setFontSize(16);
    doc.text('Practitioner Schedule', 105, 20, { align: 'center' });

    doc.setFontSize(14);
    doc.text(
      formatDateToYMDPlus(this.workDay$()!)
      + ' '
      + this.selectedPractitioner().firstName!
      + ' '
      + this.selectedPractitioner().lastName!,
      105,
      30,
      { align: 'center' });

    const columns = ['Day', 'From Time', 'End Time', 'Available'];
    const rows = this.dataSource.data.map((slot) => [
      getDayOfWeek(new Date(slot.slotDateTime!)),
      formatDateToHHmm(slot.slotDateTime!),
      formatDateToHHmm(addMinutesToDate(slot.slotDateTime!, SCHEDULE_DURATION)),
      slot.isAvailable]);

    (doc as any).autoTable({ head: [columns], body: rows, startY: 40, theme: 'grid' });
    const pdfUrl = doc.output('bloburl');
    window.open(pdfUrl, '_blank')?.print();
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

