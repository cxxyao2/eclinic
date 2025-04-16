
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Router } from '@angular/router';
import { map, Observable, startWith, switchMap } from 'rxjs';
import { GetPatientDTO as Patient } from '@libs/api-client';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ChatService } from '@libs/api-client/api/chat.service';
import { MasterDataService } from '@services/master-data.service';

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
  templateUrl: './create-chat-room.component.html',
  styleUrls: ['./create-chat-room.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateChatRoomComponent {
  private fb = inject(FormBuilder);
  private chatService = inject(ChatService);
  private router = inject(Router);
  private masterDataService = inject(MasterDataService);
  private destroyRef = inject(DestroyRef);

  protected roomForm = this.fb.group({
    patient: new FormControl<string | Patient>('', { nonNullable: true }),
    topic: new FormControl('', { nonNullable: true, validators: [Validators.required] })
  });

  protected patients: Patient[] = [];
  protected filteredPatients$: Observable<Patient[]>;
  protected errorMessage = signal<string>('');


  constructor() {
    this.masterDataService.patientsSubject
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(patients => this.patients = patients || []);

    this.filteredPatients$ = this.roomForm.controls.patient.valueChanges.pipe(
      startWith(''),
      map(value => {
        const searchTerm = this.extractSearchTerm(value);
        return searchTerm ? this._filter(searchTerm) : this.patients.slice();
      })
    );
  }

  private extractSearchTerm(value: string | Patient): string {
    return typeof value === 'string' ? value : value.firstName + ' ' + value.lastName;
  }

  private _filter(searchTerm: string): Patient[] {
    const filterValue = searchTerm.toLowerCase();
    return this.patients.filter(patient =>
      `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(filterValue)
    );
  }

  protected displayFn(patient: Patient | string): string {
    if (!patient) return '';
    if (typeof patient === 'string') return patient;
    return `${patient.firstName} ${patient.lastName} (ID: ${patient.patientId})`;
  }

  protected onPatientSelected(event: { option: { value: Patient } }): void {
    const patient = event.option.value;
    this.roomForm.patchValue({
      patient: patient
    });
  }

  protected onSubmit(): void {
    if (!this.roomForm.valid) return;

    this.errorMessage.set('');

    const formValue = this.roomForm.getRawValue();
    const patient = formValue.patient;
    
    if (typeof patient === 'string' || !patient.patientId) {
      console.error('Invalid patient selection');
      return;
    }

    const request = {
      patientId: patient.patientId,
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
          map(() => response.data?.chatRoomId)
        );
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (chatRoomId) => {
        this.router.navigate(['/chat', chatRoomId]);
      },
      error: (error) => {
        console.error('Error creating chat room:', error);
        this.errorMessage.set('Failed to create chat room. Please try again.' + error.message);
      }
    });
  }
}

