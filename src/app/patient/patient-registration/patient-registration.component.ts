import { Component, inject } from '@angular/core';
import { Patient } from '../../models/patien.model';
import { PatientService } from '../../services/patient.service';

@Component({
  selector: 'app-patient-registration',
  standalone: true,
  imports: [],
  templateUrl: './patient-registration.component.html',
  styleUrl: './patient-registration.component.scss'
})
export class PatientRegistrationComponent {
  patientService = inject(PatientService);


  addUser(): void {
    // Example: Adding a new patient
    const newPatient: Patient = {
      patientID: 1,
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: new Date(1990, 1, 1),
      gender: 'Male',
      address: '123 Main St',
      phoneNumber: '123-456-7890',
      email: 'johndoe@example.com',
      emergencyContact: 'Jane Doe',
      emergencyPhoneNumber: '098-765-4321',
      createdDate: new Date()
    };
    this.patientService.addPatient(newPatient);
  }
}

