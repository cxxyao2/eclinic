import { DestroyRef, inject, Injectable } from '@angular/core';
import { GetBedDTO, GetImageRecordDTO, GetInpatientDTO, GetMedicationDTO, GetPatientDTO, GetPractitionerDTO, ImageRecordsService, User } from '@libs/api-client';
import { BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PractitionersService, PatientsService, MedicationsService } from '@libs/api-client';

@Injectable({
  providedIn: 'root'
})
export class MasterDataService {
  // Public properties
  public readonly messageSubject = new BehaviorSubject<string>('');
  public readonly practitionersSubject = new BehaviorSubject<GetPractitionerDTO[]>([]);
  public readonly medicationsSubject = new BehaviorSubject<GetMedicationDTO[]>([]);
  public readonly patientsSubject = new BehaviorSubject<GetPatientDTO[]>([]);
  public readonly bedsSubject = new BehaviorSubject<GetBedDTO[]>([]);
  public readonly userSubject = new BehaviorSubject<User | null>(null);
  public readonly imageRecordsSubjet = new BehaviorSubject<GetImageRecordDTO[]>([]);
  public readonly selectedPatientSubject = new BehaviorSubject<GetInpatientDTO | null>(null);

  // Private properties
  private readonly practitionerService = inject(PractitionersService);
  private readonly patientService = inject(PatientsService);
  private readonly medicationService = inject(MedicationsService);
  private readonly imageService = inject(ImageRecordsService);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    this.fetchPatients();
    this.fetchPractitioners();
    this.fetchMedications();
    this.fetchImageRecords();
  }



  fetchImageRecords(): void {
    this.imageService.apiImageRecordsGet()
      .pipe(
        map(response => response.data ?? []),
        catchError(error => {
          this.messageSubject.next(error?.message ?? JSON.stringify(error));
          return [];
        }),
        takeUntilDestroyed(this.destroyRef)
      ).subscribe({
        next: (data) => {
          this.imageRecordsSubjet.next(data);
          this.messageSubject.next('');
        }
      });
  }


  fetchPractitioners(): void {
    this.practitionerService.apiPractitionersGet()
      .pipe(
        map(response => response.data ?? []),
        catchError(error => {
          this.messageSubject.next(error?.message ?? JSON.stringify(error));
          return [];
        }),
        takeUntilDestroyed(this.destroyRef)
      ).subscribe({
        next: (data) => {
          this.practitionersSubject.next(data);
          this.messageSubject.next('');
        }
      });
  }



  // Fetch and store medications
  fetchMedications(): void {
    this.medicationService.apiMedicationsGet()
      .pipe(
        map(response => response.data ?? []),
        catchError(error => {
          this.messageSubject.next(error?.message ?? JSON.stringify(error));
          return [];
        }),
        takeUntilDestroyed(this.destroyRef)
      ).subscribe({
        next: (data) => {
          this.medicationsSubject.next(data);
          this.messageSubject.next('');
        }
      });
  }


  fetchPatients(): void {
    this.patientService.apiPatientsGet()
      .pipe(
        map(response => response.data ?? []),
        catchError(error => {
          this.messageSubject.next(error?.message ?? JSON.stringify(error));
          return [];
        }),
        takeUntilDestroyed(this.destroyRef)
      ).subscribe({
        next: (data) => {
          this.patientsSubject.next(data);
          this.messageSubject.next('');
        }
      });
  }

}
