import { DestroyRef, inject, Injectable } from '@angular/core';
import { AddPractitionerAvailabilityDTO, GetMedicationDTO, GetPatientDTO, GetPractitionerAvailabilityDTO, GetPractitionerAvailabilityDTOServiceResponse, GetPractitionerDTO } from '@libs/api-client';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { concatMap, finalize, map, tap } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ROOMS_WITH_BEDS } from '@constants/rooms-with-beds.constants';
import { PractitionersService } from '@libs/api-client';
import { PatientsService } from '@libs/api-client';
import { MedicationsService } from '@libs/api-client';
import { PractitionerAvailabilitiesService } from '@libs/api-client';





@Injectable({
  providedIn: 'root'
})
export class MasterDataService {
  private destroyRef = inject(DestroyRef);

  private practitionerService = inject(PractitionersService);
  private patientService = inject(PatientsService);
  private medicationService = inject(MedicationsService);
  private availableService = inject(PractitionerAvailabilitiesService);

  private practitionersSubject = new BehaviorSubject<GetPractitionerDTO[]>([]);
  private medicationsSubject = new BehaviorSubject<GetMedicationDTO[]>([]);
  private availabilitiesSubject = new BehaviorSubject<GetPractitionerAvailabilityDTO[]>([]);
  private patientsSubject = new BehaviorSubject<GetPatientDTO[]>([]);
  private bedRoomsSubject = new BehaviorSubject<any[]>([]);

  constructor() {
    this.getPatients();
    this.getPractitioners();
    this.getMedications();
    this.getAvailabilities();
    this.getBedRooms();
  }


  fetchPractitioners(): void {
    this.practitionerService.apiPractitionersGet().pipe(
      map((result) => this.practitionersSubject.next(result.data ?? [])),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  getPractitioners(): Observable<GetPractitionerDTO[]> {
    return this.practitionersSubject.asObservable(); // Return as observable for components to subscribe
  }

  // Fetch and store medications
  fetchMedications(): void {
    this.medicationService.apiMedicationsGet().pipe(
      map((result) => this.medicationsSubject.next(result.data ?? [])),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  getMedications(): Observable<GetMedicationDTO[]> {
    return this.medicationsSubject.asObservable();
  }

  fetchAvailabilities(): void {
    this.availableService.apiPractitionerAvailabilitiesGet().pipe(
      map((result) => this.availabilitiesSubject.next(result.data ?? [])),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }


  addAvailabilities(newEntities: AddPractitionerAvailabilityDTO[]): void {
    const resultArray: GetPractitionerAvailabilityDTO[] = [];

    from(newEntities) // Convert array into an Observable stream
      .pipe(
        concatMap(data => this.availableService.apiPractitionerAvailabilitiesPost(data)), // Process each object sequentially
        tap((returnedData: GetPractitionerAvailabilityDTOServiceResponse) => {
          if (returnedData?.data) {
            resultArray.push(returnedData.data);
          }
        }, // Add the returned object to resultArray
          finalize(() => {
            if (resultArray) {
              this.availabilitiesSubject.next([...this.availabilitiesSubject.value, ...resultArray]);
            }
          })
        ))
      .subscribe({
        next: () => console.log('Saved successfully'),
        error: err => console.error('Error saving data:', err)
      });


  }

  getAvailabilities(): Observable<GetPractitionerAvailabilityDTO[]> {
    return this.availabilitiesSubject.asObservable();
  }


  fetchPatients(): void {
    this.patientService.apiPatientsGet().pipe(
      map((result) => this.patientsSubject.next(result.data ?? [])),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  getPatients(): Observable<GetPatientDTO[]> {
    return this.patientsSubject.asObservable();
  }

  // Fetch and store bed rooms
  fetchBedRooms(): void {
    this.bedRoomsSubject.next(ROOMS_WITH_BEDS);
  }

  getBedRooms(): Observable<any[]> {
    return this.bedRoomsSubject.asObservable();
  }

}
