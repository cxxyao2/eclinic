import { toSignal } from '@angular/core/rxjs-interop';
import { AfterViewInit, ViewChild, ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { PractitionerAvailabilitiesService } from '@libs/api-client/api/practitionerAvailabilities.service';
import { AddPractitionerAvailabilityDTO, PractitionersService } from '@libs/api-client';
import { MasterDataService } from 'src/app/services/master-data.service';
import { ProfileComponent } from "../../shared/profile/profile.component";
import { SCHEDULE_DURATION } from '@constants/system-settings.constants';




// table 4 columns
// No, day(monday,tuesday), from time, enduration, available or not
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
  imports: [FormsModule, ReactiveFormsModule, MatTableModule, MatSortModule, MatDatepickerModule, MatFormFieldModule, MatInputModule, MatSelectModule, ProfileComponent],
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

  private masterDataService = inject(MasterDataService);
  practitioners = toSignal(this.masterDataService.getPractitioners(), { initialValue: [] });

  readonly dateForm = new FormGroup({
    start: new FormControl<Date>(new Date(), Validators.required),
    end: new FormControl<Date>(new Date(), Validators.required),
    interval: new FormControl<number>(30),
    practitionerId: new FormControl<number | null>(null)

  });

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

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }



  ngOnInit() {




  }


  createSchedule() {
    const newAvail: AddPractitionerAvailabilityDTO = {
      practitionerId: 2,
      slotDateTime: new Date("2024-11-20T15:30:00.000Z"),
      isAvailable: true

    }
    this.masterDataService.addAvailabilities(newAvail);
    // let start = this.dateForm.value.start;
    // let end = this.dateForm.value.end;
    // let interval = this.dateForm.value.interval;
    // let practitionId = this.dateForm.value.practitionerId;
    // if (start && end && interval && practitionId) {
    //   this.appointmentServce.getAppointmentData(start, end, interval, practitionId).subscribe({
    //     next: (data) => { console.log(data); },
    //   });
    // }

  }
}