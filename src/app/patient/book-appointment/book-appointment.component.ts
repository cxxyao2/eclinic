// Angular Core Imports
import { AfterViewInit, ChangeDetectionStrategy, Component, ViewChild, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, concatMap, finalize, from, map, merge, of as observableOf, startWith, switchMap, tap } from 'rxjs';


// Angular Material Imports
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';


// Application-Specific Imports
import { AddPractitionerScheduleDTO, GetPatientDTO, GetPractitionerScheduleDTO, PractitionerSchedulesService } from '@libs/api-client';
import { MasterDataService } from 'src/app/services/master-data.service';
import { ProfileComponent } from 'src/app/shared/profile/profile.component';
import { UserProfile } from '@models/userProfile.model';
import { provideNativeDateAdapter } from '@angular/material/core';
import { SnackbarService } from 'src/app/services/snackbar-service.service';


@Component({
  selector: 'app-book-appointment',
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
  templateUrl: './book-appointment.component.html',
  styleUrl: './book-appointment.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookAppointmentComponent implements AfterViewInit {

  // Data & Forms
  columnHeaders: { [key: string]: string } = {
    index: '#',
    practitionerName: 'Practitioner',
    startDateTime: 'From Time',
    endDateTime: 'End Time',
    patientName: 'Patient',
    actions: 'Actions'
  };
  changedData: GetPractitionerScheduleDTO[] = []; // added, updated


  dataSource = new MatTableDataSource<GetPractitionerScheduleDTO>([]);
  displayedColumns: string[] = ['index', 'practitionerName', 'startDateTime', 'endDateTime', 'patientName', 'actions'];
  initialData: GetPractitionerScheduleDTO[] = [];
  updateData: GetPractitionerScheduleDTO[] = [];
  patients = signal<GetPatientDTO[]>([]);
  // Form controls
  workDayControl = new FormControl<Date | null>(new Date());
  patientIdControl = new FormControl<number | null>(0);
  selectedPatient = signal<UserProfile>({ id: 0, firstName: "", lastName: "", age: 30 });
  isLoadingResults = false;
  // Convert form control values to signals
  workDay$ = toSignal(this.workDayControl.valueChanges, { initialValue: new Date() });
  patientId$ = toSignal(this.patientIdControl.valueChanges, { initialValue: 0 });

  // ViewChild References
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Services
  private masterDataService = inject(MasterDataService);
  private scheduleService = inject(PractitionerSchedulesService);
  private snackbarService = inject(SnackbarService);



  ngAfterViewInit(): void {
    this.masterDataService.patientsSubject.subscribe({
      next: (data) => this.patients.set(data),
    });
    merge(this.patientIdControl.valueChanges, this.workDayControl.valueChanges)
      .pipe(
        startWith({}),
        switchMap(() => {
          const workDate = this.workDayControl.value;
          const patientId = this.patientIdControl.value;
          if (!workDate || ((patientId ?? 0) === 0)) {
            this.isLoadingResults = false;
            return observableOf(null);
          }
          // https://localhost:7120/api/PractitionerSchedules?workdate=2024-12-09
          this.isLoadingResults = true;

          return this.scheduleService.apiPractitionerSchedulesGet(
            undefined,
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
  onPatientChange(event: MatSelectChange): void {
    const id = event.value;
    const patient = this.patients().find((p) => p.patientId === id);
    if (patient) {
      this.selectedPatient.set({
        id,
        firstName: patient.firstName ?? '',
        lastName: patient.lastName ?? '',
      });
    }
  }

  onCancel(element: GetPractitionerScheduleDTO) {
    element.patientId = 0;
    element.patientName = "";
    const idx = this.updateData.findIndex(e => e.scheduleId === element.scheduleId);
    if (idx >= 0)
      this.updateData[idx].patientId = 0;
    else
      this.updateData.push(element);
  }

  onAssign(element: GetPractitionerScheduleDTO) {
    element.patientId = this.patientId$();
    element.patientName = this.selectedPatient().firstName + " " + this.selectedPatient().lastName;
    const idx = this.updateData.findIndex(e => e.scheduleId === element.scheduleId);
    if (idx >= 0) {
      this.updateData[idx].patientId = element.patientId;
    }
    else
      this.updateData.push(element);
  }

  saveSchedule(): void {
    if (this.updateData.length > 0) {
      this.updateScheduleArray(this.updateData);
    } else {
      this.snackbarService.show('No data to save.');
    }
  }



  updateSchedule(data: GetPractitionerScheduleDTO) {
    const newEntity: AddPractitionerScheduleDTO = Object.assign({}, data);
    return this.scheduleService.apiPractitionerSchedulesPut(newEntity).pipe(
      tap(() => console.log(`Posted: ${data.patientId}`)),
      catchError((error) => {
        console.error(`Error posting: ${data}`, error);
        return observableOf(null); // Return a fallback value to continue the stream
      })
    );
  }


  updateScheduleArray(dataArray: GetPractitionerScheduleDTO[]) {
    let successCount = 0;
    let errorCount = 0;

    from(dataArray)
      .pipe(
        concatMap((item) =>
          this.updateSchedule(item).pipe(
            tap((response) => {
              if (response) {
                successCount++;
              } else {
                errorCount++;
              }
            })
          )
        ),
        finalize(() => {
          if (errorCount === 0) {
            this.snackbarService.show('All items processed successfully!', 'success-snackbar');
            this.updateData = [];
          } else {
            this.snackbarService.show('Some items failed to process.', 'error-snackbar');

          }
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

}