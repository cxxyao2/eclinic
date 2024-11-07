// practitioner.service.ts
import { Injectable } from '@angular/core';
import { Practitioner } from '../models/practitioner.model';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PractitionerService {
  private mockPractitioners: Practitioner[] = [
    {
      practitionerId: 1,
      firstName: 'John',
      lastName: 'Doe',
      specialty: 'Cardiology',
      phoneNumber: '123-456-7890',
      email: 'johndoe@example.com',
      createdDate: new Date('2023-01-15T10:00:00'),
    },
    {
      practitionerId: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      specialty: 'Pediatrics',
      phoneNumber: '098-765-4321',
      email: 'janesmith@example.com',
      createdDate: new Date('2023-02-20T12:30:00'),
    },
    {
      practitionerId: 3,
      firstName: 'Alice',
      lastName: 'Johnson',
      specialty: 'Dermatology',
      phoneNumber: '555-123-4567',
      email: 'alicejohnson@example.com',
      createdDate: new Date('2023-03-10T09:15:00'),
    },
    // Add more practitioners as needed
  ];

  constructor() {}

  getMockPractitioners(): Observable<Practitioner[]> {
    return of(this.mockPractitioners);
  }
}
