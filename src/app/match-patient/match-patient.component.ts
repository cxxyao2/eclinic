import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-match-patient',
  standalone: true,
  imports: [FormsModule,MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './match-patient.component.html',
  styleUrl: './match-patient.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatchPatientComponent {

  @Input() patients: any[] = [];
  @Input() practitioners: any[] = [];

  patientId: string | null = null;
  selectedPractitionerId: string | null = null;
  availablePractitioners: any[] = [];

  loadMatchingPractitioners() {
    // Filter practitioners based on the selected patient's specialty
    const selectedPatient = this.patients.find(patient => patient.id === this.patientId);
    if (selectedPatient) {
      this.availablePractitioners = this.practitioners.filter(prac => prac.specialty === selectedPatient.specialty && prac.isAvailable);
    }
  }

  assignPractitioner() {
    if (this.patientId && this.selectedPractitionerId) {
      // Call the backend API to assign the patient to the selected practitioner
      console.log('Assigning practitioner:', {
        patientId: this.patientId,
        practitionerId: this.selectedPractitionerId
      });
      // Implement your backend call here
    }
  }
}