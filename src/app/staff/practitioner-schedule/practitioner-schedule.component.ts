// Angular Core Imports
import { AfterViewInit, ChangeDetectionStrategy, Component, Signal, ViewChild, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

// Angular Material Imports
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';


// Third-Party Libraries
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Application-Specific Imports
import { SCHEDULE_DURATION } from '@constants/system-settings.constants';
import { addMinutesToDate, formatDateToHHmm, formatDateToYMDPlus, getDayOfWeek } from 'src/app/helpers/date-helpers';
import { AddPractitionerScheduleDTO, GetMedicationDTO, GetPractitionerDTO, GetPractitionerScheduleDTO, PractitionerSchedulesService } from '@libs/api-client';
import { MasterDataService } from 'src/app/services/master-data.service';
import { ProfileComponent } from 'src/app/shared/profile/profile.component';
import { UserProfile } from '@models/userProfile.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, concatMap, finalize, from, map, merge, of as observableOf, startWith, switchMap, tap } from 'rxjs';
import { SnackbarService } from 'src/app/services/snackbar-service.service';
import { DialogSimpleDialog } from 'src/app/shared/dialog-simple-dialog';


@Component({
  selector: 'app-practitioner-schedule',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
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
    MatProgressSpinnerModule,
    MatSortModule,
    MatTableModule,
    ProfileComponent
  ],
  templateUrl: './practitioner-schedule.component.html',
  styleUrls: ['./practitioner-schedule.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PractitionerScheduleComponent implements AfterViewInit {
  // Constants
  SCHEDULE_DURATION = SCHEDULE_DURATION;

  // Data & Forms
  columnHeaders: { [key: string]: string } = {
    day: 'Day',
    fromTime: 'From Time',
    endTime: 'End Time'
  };
  changedData: GetPractitionerScheduleDTO[] = []; // added, updated
  deletedData: GetPractitionerScheduleDTO[] = []; // deleted
  imagePath = signal('assets/images/smiling-doctor.jpg');
  savedFlag = signal(false);

  dataSource = new MatTableDataSource<GetPractitionerScheduleDTO>([]);
  displayedColumns: string[] = ['day', 'fromTime', 'endTime'];
  initialData: GetPractitionerScheduleDTO[] = [];
  practitioners = signal<GetPractitionerDTO[]>([]);
  // Form controls
  workDayControl = new FormControl<Date | null>(new Date());
  practitionerIdControl = new FormControl<number | null>(0);
  selectedPractitioner = signal<UserProfile>({ id: 0, firstName: "", lastName: "", age: 30 });
  isLoadingResults = false;
  // Convert form control values to signals
  workDay$ = toSignal(this.workDayControl.valueChanges, { initialValue: new Date() });
  practitionerId$ = toSignal(this.practitionerIdControl.valueChanges, { initialValue: 0 });

  // ViewChild References
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Services
  masterDataService = inject(MasterDataService);
  readonly dialog = inject(MatDialog);
  private snackbarService = inject(SnackbarService);
  private scheduleService = inject(PractitionerSchedulesService)



  // Lifecycle Hooks
  ngAfterViewInit(): void {
    this.masterDataService.practitionersSubject.subscribe({
      next: (data) => this.practitioners.set(data),
    });
    merge(this.workDayControl.valueChanges, this.practitionerIdControl.valueChanges)
      .pipe(
        startWith({}),
        switchMap(() => {
          // Get the values from the form controls
          const practitionerId = this.practitionerIdControl.value;
          const workDate = this.workDayControl.value;
          if (!practitionerId || !workDate) {
            this.isLoadingResults = false;
            return observableOf(null);
          }
          // https://localhost:7120/api/PractitionerSchedules?patitionerId=1&workdate=2024-12-09
          this.isLoadingResults = true;

          return this.scheduleService.apiPractitionerSchedulesGet(
            practitionerId,
            new Date(workDate!)
          ).pipe(catchError(() => observableOf(null)));
        }),
        map(response => {
          this.isLoadingResults = false;

          if (response?.data === null) {
            return [];
          }

          return response?.data;
        }),
      )
      .subscribe(data => (this.dataSource.data = data ?? []));
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

  saveSchedule(): void {
    this.savedFlag.set(false);
    // add
    const newData = this.dataSource.data.filter((entity) => (entity.scheduleId ?? 0) === 0);
    if (newData.length > 0) {
      this.addNewSchedules(newData);
    }

    // delete
    if (this.deletedData.length > 0) {
      this.deleteScheduleArray(this.deletedData);
    }
  }


  onDeleteSchedule(): void {
    const dialogRef = this.dialog.open(DialogSimpleDialog, {
      data: { title: 'Confirm Action', content: 'Are you sure you want to delete? All unsaved changes will be lost.', isCancelButtonVisible: true },
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result !== undefined) {
        this.deletedData = this.dataSource.data.filter((entity) => (entity.scheduleId ?? 0) > 0);

        this.changedData = [];
        this.dataSource.data = [];
      }
    });

  }



  addOneSchedule(data: GetPractitionerScheduleDTO) {
    const newEntity: AddPractitionerScheduleDTO = Object.assign({}, data);
    return this.scheduleService.apiPractitionerSchedulesPost(newEntity).pipe(
      tap(() => console.log(`Posted: ${data.patientId}`)),
      catchError((error) => {
        console.error(`Error posting: ${data}`, error);
        return observableOf(null); // Return a fallback value to continue the stream
      })
    );
  }

  deleteScheduleArray(dataArray: GetPractitionerScheduleDTO[]) {
    this.savedFlag.set(true);
    from(dataArray)
      .pipe(
        concatMap((item) => this.scheduleService.apiPractitionerSchedulesIdDelete(item.scheduleId!)), // Process each item sequentially
        finalize(() => {
          // Perform a final action after all processing
          console.log('All items have been processed.');
        })
      )
      .subscribe({
        next: (response) => {
          if (response) {
            console.log('Response:', response);
          }
        },
        error: (err) => console.error('Stream error:', err),
      });
  }

  addNewSchedules(dataArray: GetPractitionerScheduleDTO[]) {
    let recordCount = 0;
    this.savedFlag.set(true);
    from(dataArray)
    .pipe(
      concatMap((item) => this.addOneSchedule(item)), // Process each item sequentially
      finalize(() => {
          if (recordCount === dataArray.length) {
            this.snackbarService.show('All items processed successfully!', 'success-snackbar');
            this.dataSource.data = [];
            this.changedData = [];
            this.deletedData = [];
            this.practitionerIdControl.setValue(0, { onlySelf: true });
          } else {
            this.snackbarService.show('Some items failed to process.', 'error-snackbar');
          }
        })
      )
      .subscribe({
        next: () => {
          recordCount += 1;
        },
        error: (err) => console.error('Stream error:', err),
      });
  }



  createSchedule(): void {
    const workDate = this.workDay$();
    const practitionerId = this.practitionerId$();
    if (!workDate || ((practitionerId ?? 0) === 0)) {
      this.openDataInvalidDialog();
      return;
    }

    // TODO
    // if (this.dataSource.data.length > 0) {
    //   this.dialog.open(DialogSimpleDialog, {
    //     data: { title: 'Notification', content: 'The schedule for the staff has already been created.If you want to update it, please proceed to click "Delete" button first', isCancelButtonVisible: false },
    //   });
    //   return;
    // }

    const startDate = formatDateToYMDPlus(workDate, '00:00:00');
    const endDate = formatDateToYMDPlus(workDate, '23:30:00');
    const availabilitySlots = this.generatePractitionerScheduleSlots(startDate, endDate, this.SCHEDULE_DURATION, practitionerId || 0);

    this.changedData = [...availabilitySlots];
    this.dataSource.data = [...availabilitySlots];
  }

  generatePractitionerScheduleSlots(
    startDate: string,
    endDate: string,
    duration: number,
    practitionerId: number
  ): AddPractitionerScheduleDTO[] {
    const slots: AddPractitionerScheduleDTO[] = [];
    let currentDate = new Date(startDate);
    const endDateTime = new Date(endDate);

    while (currentDate < endDateTime) {
      slots.push({
        practitionerId,
        startDateTime: new Date(currentDate),
        endDateTime: addMinutesToDate(currentDate, SCHEDULE_DURATION),
        reasonForVisit: 'Urgenet'
      });
      currentDate = new Date(currentDate.getTime() + duration * 60 * 1000);
    }

    return slots;
  }

  // Dialogs
  openDataInvalidDialog(): void {
    this.dialog.open(DialogSimpleDialog, {
      data: { title: 'Notification', content: 'Please select practitioner and date first.', isCancelButtonVisible: false },
    });
  }

  openNoPrintDataDialog(): void {
    this.dialog.open(DialogSimpleDialog, {
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

    const columns = ['Day', 'From Time', 'End Time'];
    const rows = this.dataSource.data.map((slot) => [
      getDayOfWeek(new Date(slot.startDateTime!)),
      formatDateToHHmm(slot.startDateTime!),
      formatDateToHHmm(slot.endDateTime!)]);

    (doc as any).autoTable({ head: [columns], body: rows, startY: 40, theme: 'grid' });
    const pdfUrl = doc.output('bloburl');
    window.open(pdfUrl, '_blank')?.print();
  }
}



