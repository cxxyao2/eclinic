import { DestroyRef, PLATFORM_ID, inject, Injectable } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { GetBedDTO, GetImageRecordDTO, GetInpatientDTO, GetMedicationDTO, GetPatientDTO, GetPractitionerDTO, ImageRecordsService, User, UsersService } from '@libs/api-client';
import { BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PractitionersService, PatientsService, MedicationsService } from '@libs/api-client';
import { jwtDecode } from 'jwt-decode';

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
  private readonly platformId = inject(PLATFORM_ID);
  private readonly usersService = inject(UsersService);

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    this.fetchPatients();
    this.fetchPractitioners();
    this.fetchMedications();
    this.fetchImageRecords();
  }


  fetchUserFromLocalStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      const accessToken = localStorage.getItem('accessToken');

      if (accessToken) {
        try {
          const decodedToken: any = jwtDecode(accessToken);
          // Get userId from the nameidentifier claim
          const userId = decodedToken['nameidentifier'] || 
                         decodedToken['nameid'] || 
                         decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ||
                         Object.entries(decodedToken).find(([key]) => key.toLowerCase().endsWith('nameidentifier'))?.[1]; // [key,value], value index is 1
          
          if (!userId) {
            throw new Error('User ID not found in token');
          }

          this.usersService.apiUsersIdGet(Number(userId))
            .pipe(
              map((response:any) => response.data ?? null),
              takeUntilDestroyed(this.destroyRef),
              catchError(error => {
                console.error('Error fetching user:', error);
                localStorage.removeItem('accessToken');
                return [];
              })
            )
            .subscribe({
              next: (user) => {
                if (user) {
                  this.userSubject.next(user);
                } else {
                  localStorage.removeItem('accessToken');
                  this.userSubject.next(null);
                }
              },
              error: () => {
                localStorage.removeItem('accessToken');
                this.userSubject.next(null);
              }
            });
        } catch (error) {
          console.error('Error decoding token:', error);
          localStorage.removeItem('accessToken');
          this.userSubject.next(null);
        }
      } else {
        this.userSubject.next(null);
      }
    }
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
