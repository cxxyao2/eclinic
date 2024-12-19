import { DestroyRef, inject, Injectable } from '@angular/core';
import { AddPractitionerAvailabilityDTO, GetMedicationDTO, GetPatientDTO, GetPractitionerAvailabilityDTO, GetPractitionerAvailabilityDTOServiceResponse, GetPractitionerDTO, StringServiceResponse } from '@libs/api-client';
import { BehaviorSubject, from } from 'rxjs';
import { concatMap, finalize, map, tap } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ROOMS_WITH_BEDS } from '@constants/rooms-with-beds.constants';
import { PractitionersService } from '@libs/api-client';
import { PatientsService } from '@libs/api-client';
import { MedicationsService } from '@libs/api-client';


@Injectable({
  providedIn: 'root'
})
export class MasterDataService {
  private destroyRef = inject(DestroyRef);

  private practitionerService = inject(PractitionersService);
  private patientService = inject(PatientsService);
  private medicationService = inject(MedicationsService);


  public practitionersSubject = new BehaviorSubject<GetPractitionerDTO[]>([]);
  public medicationsSubject = new BehaviorSubject<GetMedicationDTO[]>([]);
  public patientsSubject = new BehaviorSubject<GetPatientDTO[]>([]);
  public bedRoomsSubject = new BehaviorSubject<any[]>([]);

  public crudResultMessage = new BehaviorSubject<string | null>(null);
  public errorMessage = new BehaviorSubject<string | null>(null);



  constructor() {
    this.fetchPatients();
    this.fetchPractitioners();
    this.fetchMedications();
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
