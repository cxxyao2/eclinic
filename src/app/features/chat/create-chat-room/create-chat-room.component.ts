
import { Component, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Router } from '@angular/router';
import { map, Observable, startWith, switchMap } from 'rxjs';

import { ChatService } from '@libs/api-client/api/chat.service';
import { MasterDataService } from '@services/master-data.service';
import { GetPatientDTO, GetPatientDTO as Patient } from '@libs/api-client';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface ChatRoomForm {
  patientId: number;
  patientName: string;
  topic: string;
}

@Component({
  selector: 'app-create-chat-room',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatAutocompleteModule
  ],
  template: `
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-md-6 col-lg-4">
          <form [formGroup]="roomForm" (ngSubmit)="onSubmit()" class="mt-4">
            <mat-form-field appearance="outline" class="w-100 mb-3">
              <mat-label>Patient Name</mat-label>
              <input type="text" matInput formControlName="patientName" 
                     [matAutocomplete]="auto">
              <mat-autocomplete #auto="matAutocomplete" 
                              [displayWith]="displayFn"
                              (optionSelected)="onPatientSelected($event)">
                @for (patient of filteredPatients$ | async; track patient.patientId) {
                  <mat-option [value]="patient">
                    {{ patient.firstName }} {{ patient.lastName }} (ID: {{ patient.patientId }})
                  </mat-option>
                }
              </mat-autocomplete>
            </mat-form-field>

            <mat-form-field appearance="outline" class="w-100 mb-3">
              <mat-label>Topic</mat-label>
              <input matInput formControlName="topic">
            </mat-form-field>

            <div class="d-grid">
              <button mat-raised-button  type="submit" 
                      [disabled]="!roomForm.valid" 
                      class="w-100">
                Create Room
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class CreateChatRoomComponent {
  private fb = inject(FormBuilder);
  private chatService = inject(ChatService);
  private router = inject(Router);
  private masterDataService = inject(MasterDataService);
  private destroyRef = inject(DestroyRef);

  protected roomForm = this.fb.nonNullable.group({
    patientId: [0, Validators.required],
    patientName: ['', Validators.required],
    topic: ['', Validators.required]
  });

  protected patients: GetPatientDTO[] = [];
  protected filteredPatients$: Observable<Patient[]>;

  constructor() {
    this.masterDataService.patientsSubject.subscribe(
      patients => this.patients = patients || []
    );

    this.filteredPatients$ = this.roomForm.controls.patientName.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : null;
        return name ? this._filter(name) : this.patients.slice();
      })
    );
  }

  private _filter(name: string): Patient[] {
    const filterValue = name.toLowerCase();
    return this.patients.filter(patient =>
      (patient.firstName + ' ' + patient.lastName)
        .toLowerCase()
        .includes(filterValue)
    );
  }

  // todo: selected patient is not correctly displayed
  protected displayFn(patient: Patient): string {
    return patient ? `${patient.firstName} ${patient.lastName} (ID: ${patient.patientId})` : '';
  }

  protected onPatientSelected(event: any): void {
    const patient = event.option.value as Patient;
    this.roomForm.patchValue({
      patientId: patient.patientId,
      patientName: `${patient.firstName} ${patient.lastName}`
    });
  }

  protected onSubmit(): void {
    if (!this.roomForm.valid) return;

    const formValue = this.roomForm.getRawValue();
    const request = {
      patientId: formValue.patientId,
      topic: formValue.topic
    };

    this.chatService.apiChatRoomsPost(request).pipe(
      switchMap(response => {
        if (!response?.data?.chatRoomId) {
          throw new Error('Failed to create chat room');
        }

        return this.chatService.apiChatRoomsRoomIdParticipantsPost(
          response.data.chatRoomId,
          { userId: request.patientId }
        ).pipe(
          map(() => response?.data?.chatRoomId)
        );
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (chatRoomId) => {
        this.router.navigate(['/chat', chatRoomId]);
      },
      error: (error) => {
        console.error('Error creating chat room:', error);
      }
    });
  }
}




