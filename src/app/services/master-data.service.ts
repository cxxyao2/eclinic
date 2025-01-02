import { DestroyRef, inject, Injectable } from '@angular/core';
import { GetBedDTO, GetImageRecordDTO, GetInpatientDTO, GetMedicationDTO, GetPatientDTO, GetPractitionerDTO, ImageRecordsService, User } from '@libs/api-client';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { PractitionersService } from '@libs/api-client';
import { PatientsService } from '@libs/api-client';
import { MedicationsService } from '@libs/api-client';


@Injectable({
  providedIn: 'root'
})
export class MasterDataService {

  private practitionerService = inject(PractitionersService);
  private patientService = inject(PatientsService);
  private medicationService = inject(MedicationsService);
  private imageService = inject(ImageRecordsService);

  public messageSubject = new BehaviorSubject<string>('');
  public practitionersSubject = new BehaviorSubject<GetPractitionerDTO[]>([]);
  public medicationsSubject = new BehaviorSubject<GetMedicationDTO[]>([]);
  public patientsSubject = new BehaviorSubject<GetPatientDTO[]>([]);
  public bedsSubject = new BehaviorSubject<GetBedDTO[]>([]);
  public userSubject = new BehaviorSubject<User | null>(null);
  public imageRecordsSubjet = new BehaviorSubject<GetImageRecordDTO[]>([]);
  public selectedPatientSubject = new BehaviorSubject<GetInpatientDTO | null>(null);
  destroyRef = inject(DestroyRef);

  constructor() {
    this.fetchPatients();
    this.fetchPractitioners();
    this.fetchMedications();
    this.fetchImageRecords();
  }



  fetchImageRecords(): void {
    this.imageService.apiImageRecordsGet()
      .pipe(
        tap((res) => this.imageRecordsSubjet.next(res.data ?? []))
      ).subscribe({
        next:()=>{
          this.messageSubject.next("");
        },
        error: (err) => {
          this.messageSubject.next(err?.message ?? JSON.stringify(err));
        }
      });
  }


  fetchPractitioners(): void {
    this.practitionerService.apiPractitionersGet().pipe(
      tap((result) => this.practitionersSubject.next(result.data ?? [])),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next:()=>{
        this.messageSubject.next("");
      },
      error: (err) => {
        this.messageSubject.next(err?.message ?? JSON.stringify(err));
      }
    });
  }



  // Fetch and store medications
  fetchMedications(): void {
    this.medicationService.apiMedicationsGet().pipe(
      tap((result) => this.medicationsSubject.next(result.data ?? [])),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next:()=>{
        this.messageSubject.next("");
      },
      error: (err) => {
        this.messageSubject.next(err?.message ?? JSON.stringify(err));
      }
    });
  }


  fetchPatients(): void {
    this.patientService.apiPatientsGet().pipe(
      tap((result) => this.patientsSubject.next(result.data ?? [])),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next:()=>{
        this.messageSubject.next("");
      },
      error: (err) => {
        this.messageSubject.next(err?.message ?? JSON.stringify(err));
      }
    });
  }

}
