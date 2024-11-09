import { Injectable, signal, WritableSignal } from '@angular/core';
import { of } from 'rxjs';
import { Patient } from '../models/patien.model';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  patients: Patient[] = [
    {
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
    },
    {
      patientID: 2,
      firstName: 'Mary',
      lastName: 'Smith',
      dateOfBirth: new Date(1985, 5, 10),
      gender: 'Female',
      address: '456 Elm St',
      phoneNumber: '321-654-0987',
      email: 'marysmith@example.com',
      emergencyContact: 'John Smith',
      emergencyPhoneNumber: '567-890-1234',
      createdDate: new Date()
    }
    // Add more patients as needed
  ];

  private patientsSignal: WritableSignal<Patient[]>;

  constructor() {
    // Initializing the signal with an empty array
    this.patientsSignal = signal<Patient[]>([]);
  }

  // Method to get the signal-wrapped patients array
  getPatientsSignal(): WritableSignal<Patient[]> {
    return this.patientsSignal;
  }

  // Method to add a new patient to the signal array
  addPatient(newPatient: Patient): void {
    this.patientsSignal.update(patients => [...patients, newPatient]);
  }

  // Method to set the entire patient list
  setPatients(patients: Patient[]): void {
    this.patientsSignal.set(patients);
  }
}