import { toSignal } from '@angular/core/rxjs-interop';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { AppointmentService } from '../../services/appointment.service';
import { Practitioner } from '../../models/practitioner.model';
import { PractitionerService } from '../../services/practitioner.service';

@Component({
  selector: 'app-practitioner-schedule',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [FormsModule, ReactiveFormsModule, MatDatepickerModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './practitioner-schedule.component.html',
  styleUrl: './practitioner-schedule.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PractitionerScheduleComponent {
  private practitionerService = inject(PractitionerService);
  practitioners = toSignal(this.practitionerService.getMockPractitioners(), { initialValue: [] });

  // @Input() practitioners: any[] = []; todo: route, resolve,
  private appointmentServce = inject(AppointmentService);
  readonly dateForm = new FormGroup({
    start: new FormControl<Date>(new Date(), Validators.required),
    end: new FormControl<Date>(new Date(), Validators.required),
    interval: new FormControl<number>(30),
    practitionerId: new FormControl<number | null>(null)

  });

  intervals: number[] = [10, 20, 30];



  createSchedule() {
    let start = this.dateForm.value.start;
    let end = this.dateForm.value.end;
    let interval = this.dateForm.value.interval;
    let practitionId = this.dateForm.value.practitionerId;
    if (start && end && interval && practitionId) {
      this.appointmentServce.getAppointmentData(start, end, interval, practitionId).subscribe({
        next: (data) => { console.log(data); },
      });
    }

  }
}