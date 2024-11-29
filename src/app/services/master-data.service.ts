import { DestroyRef, inject, Injectable } from '@angular/core';
import { AddPractitionerAvailabilityDTO, GetMedicationDTO, GetPatientDTO, GetPractitionerAvailabilityDTO, GetPractitionerAvailabilityDTOServiceResponse, GetPractitionerDTO, StringServiceResponse } from '@libs/api-client';
import { BehaviorSubject, from } from 'rxjs';
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

  public practitionersSubject = new BehaviorSubject<GetPractitionerDTO[]>([]);
  public medicationsSubject = new BehaviorSubject<GetMedicationDTO[]>([]);
  public availabilitiesSubject = new BehaviorSubject<GetPractitionerAvailabilityDTO[]>([]);
  public patientsSubject = new BehaviorSubject<GetPatientDTO[]>([]);
  public bedRoomsSubject = new BehaviorSubject<any[]>([]);

  constructor() {
    this.fetchPatients();
    this.fetchPractitioners();
    this.fetchMedications();
    this.fetchAvailabilities();
    this.fetchBedRooms();
  }


  fetchPractitioners(): void {
    this.practitionerService.apiPractitionersGet().pipe(
      map((result) => this.practitionersSubject.next(result.data ?? [])),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }



  // Fetch and store medications
  fetchMedications(): void {
    this.medicationService.apiMedicationsGet().pipe(
      map((result) => this.medicationsSubject.next(result.data ?? [])),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }



  fetchAvailabilities(): void {
    this.availableService.apiPractitionerAvailabilitiesGet().pipe(
      map((result) => this.availabilitiesSubject.next(result.data ?? [])),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }


  addAvailabilities(newEntities: AddPractitionerAvailabilityDTO[]): void {
    const resultArray: GetPractitionerAvailabilityDTO[] = [];

    from(newEntities)
      .pipe(
        concatMap(data => this.availableService.apiPractitionerAvailabilitiesPost(data)), // Process each object sequentially
        tap({
          next: (returnedData: GetPractitionerAvailabilityDTOServiceResponse) => {
            if (returnedData?.data) {
              resultArray.push(returnedData.data);
            }
          }
        }),
        finalize(() => {
          if (resultArray) {
            this.availabilitiesSubject.next([...this.availabilitiesSubject.value, ...resultArray]);
          }
        })
      )
      .subscribe({
        next: () => console.log('Saved successfully'),
        error: err => console.error('Error saving data:', err)
      });

  }

  deleteAvailabilities(deleteEntities: GetPractitionerAvailabilityDTO[]): void {
    const deletedEntityIds: number[] = []; // Array to save successfully deleted entity IDs

    from(deleteEntities)
      .pipe(
        concatMap(entity =>
          this.availableService.apiPractitionerAvailabilitiesIdDelete(entity.availableId!).pipe(
            tap(returnedData => {
              // Check if the backend successfully deleted the entity
              if ((returnedData as StringServiceResponse)?.data) {
                deletedEntityIds.push(entity.availableId!);
              } else {
                throw new Error(`Failed to delete entity with ID: ${entity.availableId}`);
              }
            }),
          )
        ),
        finalize(() => {
          this.availabilitiesSubject.next(
            this.availabilitiesSubject.value.filter(item =>
              !deletedEntityIds.includes(item.availableId!)
            )
          );
        })
      )
      .subscribe({
        next: () => console.log('Processed deletions successfully'),
        error: err => console.error('Error during deletion process:', err)
      });
  }



  updateAvailabilities(updatedEntities: GetPractitionerAvailabilityDTO[]): void {
    const resultArray: GetPractitionerAvailabilityDTO[] = [];

    from(updatedEntities)
      .pipe(
        concatMap(data => this.availableService.apiPractitionerAvailabilitiesPut(data)), // Process each object sequentially
        tap({
          next: (returnedData: GetPractitionerAvailabilityDTOServiceResponse) => {
            if (returnedData?.data) {
              resultArray.push(returnedData.data);
            }
          }
        }),
        finalize(() => {
          const currentValue = this.availabilitiesSubject.value;

          resultArray.forEach(v => {
            const idx = currentValue.findIndex(c => c.availableId === v.availableId);
            if (idx >= 0) currentValue[idx] = v;
          });
          this.availabilitiesSubject.next([...currentValue]);
        })
      )
      .subscribe({
        next: () => console.log('Saved successfully'),
        error: err => console.error('Error saving data:', err)
      });

  }


  fetchPatients(): void {
    this.patientService.apiPatientsGet().pipe(
      map((result) => this.patientsSubject.next(result.data ?? [])),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }


  // Fetch and store bed rooms
  fetchBedRooms(): void {
    this.bedRoomsSubject.next(ROOMS_WITH_BEDS);
  }



}
