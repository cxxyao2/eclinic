import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { AddPractitionerScheduleDTO } from '@libs/api-client';

@Component({
  selector: 'app-book-appointment',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule],

  templateUrl: './book-appointment.component.html',
  styleUrl: './book-appointment.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookAppointmentComponent {

  // patientId: string | null = null;
  // availablePractitionerSlots: AddPractitionerScheduleDTO[] = [];

  // loadMatchingPractitioners() {
  //   // Filter practitioners based on the selected patient's specialty
  //   const selectedPatient = this.patients.find(patient => patient.id === this.patientId);
  //   if (selectedPatient) {
  //     this.availablePractitioners = this.practitioners.filter(prac => prac.specialty === selectedPatient.specialty && prac.isAvailable);
  //   }
  // }

  // assignPractitionerSlot() {
  //   if (this.patientId && this.selectedPractitionerId) {
  //     // Call the backend API to assign the patient to the selected practitioner
  //     console.log('Assigning practitioner:', {
  //       patientId: this.patientId,
  //       practitionerId: this.selectedPractitionerId
  //     });
  //     // Implement your backend call here
  //   }
  // }
}