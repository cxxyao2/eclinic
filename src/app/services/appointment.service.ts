// appointment.service.ts
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Appointment, AppointmentStatusEnum } from '../models/appointement.model'

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private mockAppointments: Appointment[] = [
    {
      AppointmentID: 1,
      PatientID: 101,
      PractitionerID: 201,
      AppointmentDate: new Date('2024-11-10T09:00:00'),
      ReasonForVisit: 'General Checkup',
      Status: AppointmentStatusEnum.Available,
    },
    {
      AppointmentID: 2,
      PatientID: 101,
      PractitionerID: 201,
      AppointmentDate: new Date('2024-11-10T09:30:00'),
      ReasonForVisit: 'General Checkup',
      Status: AppointmentStatusEnum.Available,
    },
    {
      AppointmentID: 3,
      PatientID: 102,
      PractitionerID: 201,
      AppointmentDate: new Date('2024-11-11T10:30:00'),
      ReasonForVisit: 'Dental Consultation',
      Status: AppointmentStatusEnum.Scheduled,
    },
    {
      AppointmentID: 4,
      PatientID: 103,
      PractitionerID: 202,
      AppointmentDate: new Date('2024-11-12T14:00:00'),
      ReasonForVisit: 'Eye Examination',
      Status: AppointmentStatusEnum.Completed,
    },
    // Add more mock data as needed
  ];

  constructor() { }

  getAppointmentData(
    startDate: Date,
    endDate: Date,
    interval: number,
    practitionerId: number
  ): Observable<Appointment[]> {
    if (!this.mockAppointments) {

      this.generateSchedule(startDate, endDate, interval, practitionerId);
    }
    return of(this.mockAppointments);
  }

  getMockAppointments(): Observable<Appointment[]> {
    // HTTP, get data from backend
    return of(this.mockAppointments).pipe(delay(1000)); // Simulate 1-second delay
  }


  // schedule-generator.ts
  generateSchedule(
    startDate: Date,
    endDate: Date,
    interval: number,
    practitionerId: number
  ): void {
    const schedule: Appointment[] = [];
    const workDayStartHour = 8; // Practitioner starts at 8:00 AM
    const workDayEndHour = 16; // Practitioner ends at 4:00 PM (8 hours after start)

    // Clone the startDate to avoid mutating the original date
    let current = new Date(startDate);

    while (current <= endDate) {
      // Check if the current date is within working hours
      if (
        current.getHours() >= workDayStartHour &&
        current.getHours() < workDayEndHour
      ) {
        // Add the current time slot to the schedule
        schedule.push({
          AppointmentDate: new Date(current),
          PractitionerID: practitionerId,
          Status: AppointmentStatusEnum.Available
        });
      }

      current.setMinutes(current.getMinutes() + interval);

      // If the time exceeds the work day, move to the next day
      if (current.getHours() >= workDayEndHour) {
        // Set the time to the beginning of the next workday
        current.setDate(current.getDate() + 1);
        current.setHours(workDayStartHour);
        current.setMinutes(0);
        current.setSeconds(0);
        current.setMilliseconds(0);
      }
    }

    this.mockAppointments = [...schedule];
  }

  // Example usage
  // const startDate = new Date('2025-02-21T08:00:00');
  // const endDate = new Date('2025-02-22T16:00:00');
  // const interval = 30; // 30 minutes
  // const practitionerId = 1;

  // const schedule = generateSchedule(startDate, endDate, interval, practitionerId);
  // console.log(schedule);

}
