import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal, AfterViewInit, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';


// Angular Material Imports
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { AddVisitRecordDTO, GetPatientDTO, GetPractitionerScheduleDTO, GetPractitionerScheduleDTOListServiceResponse, GetVisitRecordDTO, GetVisitRecordDTOListServiceResponse, GetVisitRecordDTOServiceResponse, PractitionerSchedulesService, UpdatePractitionerScheduleDTO } from '@libs/api-client';
import { VisitRecordsService } from '@libs/api-client';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MasterDataService } from 'src/app/services/master-data.service';
import { CheckInWaitingListComponent } from '../check-in-waiting-list/check-in-waiting-list.component';

@Component({
  selector: 'app-check-in',
  standalone: true,
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
    MatSortModule,
    CheckInWaitingListComponent
  ],
  templateUrl: './check-in.component.html',
  styleUrl: './check-in.component.scss'
})
export class CheckInComponent implements AfterViewInit, OnInit {
  @ViewChild(MatSort) sort!: MatSort;

  private masterService = inject(MasterDataService);
  private visitService = inject(VisitRecordsService);
  private scheduleService = inject(PractitionerSchedulesService);

  displayedColumns: string[] = ['practitionerName', 'startDateTime', 'endDateTime', 'action'];
  // business logic. Receptionist: 
  // 1, search appointments by patientid
  // 2, click check-in
  // 3, appointment turns into a new visitrecord 
  // 4, the table shows visitrecords with empty Diagnosis field

  // get all appointements by data (reduce back-and-force with backend)
  // filter data by patientId
  patientIdControl = new FormControl<number | null>(0);
  dataSource = new MatTableDataSource<GetPractitionerScheduleDTO>();

  today = new Date();
  todayAllShedules: GetPractitionerScheduleDTO[] = [];
  waitingList = signal<GetVisitRecordDTO[]>([]);
  patients = signal<GetPatientDTO[]>([]);

  ngOnInit(): void {
    this.getAppointmentByDate(this.today);
    this.getWaitingListByDate(this.today);
  }

  ngAfterViewInit() {
    this.masterService.patientsSubject.subscribe({
      next: (data) => this.patients.set(data),
    });
    this.dataSource.sort = this.sort;
  }

  getAppointmentByDate(bookedDate: Date) {
    this.scheduleService.apiPractitionerSchedulesGet(undefined, bookedDate)
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (res: GetPractitionerScheduleDTOListServiceResponse) => {
          const result = res.data ?? [];
          this.todayAllShedules = result.filter(res => res.reasonForVisit !== 'done');
        },
        error: () => { }
      }
      );
  }

  getWaitingListByDate(bookedDate: Date) {
    this.visitService.apiVisitRecordsWaitingListGet(bookedDate).subscribe({
      next: (res: GetVisitRecordDTOListServiceResponse) => {
        this.waitingList.set(res.data ?? []);
      },
      error: () => { }
    }
    );
  }

  getPatientAppointment() {
    const patientId = this.patientIdControl.getRawValue() ?? 0;
    const filteredData = this.todayAllShedules.filter(ele => ele.patientId === patientId);
    this.dataSource.data = [...filteredData];

  }

  addWaitingList(schedule: GetPractitionerScheduleDTO) {
    // 1, update schedule data
    const newSchedule = { ...schedule };
    newSchedule.reasonForVisit = 'done';
    this.scheduleService.apiPractitionerSchedulesPut(newSchedule as UpdatePractitionerScheduleDTO).subscribe(
      {
        next: (data) => { console.log('updated', data); },
        error: (err) => { console.error('error is', err); }
      }
    );


    // 2, add to waitlist data
    const newVisit: AddVisitRecordDTO = {
      patientId: schedule.patientId ?? 0,
      practitionerId: schedule.practitionerId,
      scheduleId: schedule.scheduleId,
      practitionerSignaturePath: "",
      visitDate: this.today,
      diagnosis: "",
      treatment: "",
      notes: ""
    };

    const newWaiting: GetVisitRecordDTO = {
      patientId: schedule.patientId ?? 0,
      patientName: schedule.patientName,
      practitionerId: schedule.practitionerId,
      practitionerName: schedule.practitionerName,
      scheduleId: schedule.scheduleId,
      practitionerSignaturePath: "",
      visitDate: this.today,
      diagnosis: "",
      treatment: "",
      notes: ""

    };

    this.visitService.apiVisitRecordsPost(newVisit).subscribe({
      next: (rep: GetVisitRecordDTOServiceResponse) => {
        console.log('response is', rep);
        const oldData = [...this.dataSource.data];
        const newData = oldData.filter(ele => ele.scheduleId !== schedule.scheduleId);
        this.dataSource.data = newData;

        const id = (rep.data?.visitId) ?? 0;
        newWaiting.visitId = id;
        this.waitingList.set([...this.waitingList(), { ...newWaiting }]);
      },
      error: (err) => {
        console.error(err);
      }
    })

  }


}
