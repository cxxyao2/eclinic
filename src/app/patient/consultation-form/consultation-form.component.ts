import { InpatientsService } from './../../../../libs/api-client/api/inpatients.service';
import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AddInpatientDTO, AddPrescriptionDTO, GetMedicationDTO, GetPractitionerDTO, GetVisitRecordDTO, MedicationsService, PractitionersService, PrescriptionsService, UsersService, VisitRecordsService } from '@libs/api-client';
import { concatMap, finalize, switchMap } from 'rxjs/operators';
import { SnackbarService } from 'src/app/services/snackbar-service.service';
import { CanvasComponent } from 'src/app/shared/canvas/canvas.component';
import { DialogSimpleDialog } from 'src/app/shared/dialog-simple-dialog';

import { AsyncPipe } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ConsulationFormMedicComponent } from "../../consulation-form-medic/consulation-form-medic.component";
import { from } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';


@Component({
  selector: 'app-consultation-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatRadioModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTabsModule,
    MatIconModule,
    CanvasComponent,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    ConsulationFormMedicComponent
  ],
  templateUrl: './consultation-form.component.html',
  styleUrl: './consultation-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConsultationFormComponent implements OnInit {

  readonly visitControl = new FormControl<GetVisitRecordDTO>({});
  readonly needsAdmissionControl = new FormControl(false);
  readonly diagnosisControl = new FormControl('');
  readonly treatmentControl = new FormControl('');
  readonly diagnosisForm = inject(FormBuilder).group({
    visitRecord: this.visitControl,
    admission: this.needsAdmissionControl,
    diagnosis: this.diagnosisControl,
    treatment: this.treatmentControl
  });
  // protected readonly hideRequired = toSignal(this.needsAdmissionControl.valueChanges);
  protected readonly visitRecord = toSignal(this.visitControl.valueChanges);
  protected readonly needAdmission = toSignal(this.needsAdmissionControl.valueChanges);
  dataSource = new MatTableDataSource<GetMedicationDTO>([]);
  displayedColumns: string[] = ['no', 'medicationId', 'medicationName', 'dosage', 'action'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('prescriptionTable') prescriptionTable!: ConsulationFormMedicComponent;



  scheduledVisits = signal<GetVisitRecordDTO[]>([]);
  visitDate = new Date();
  practitioner = signal<GetPractitionerDTO>({});
  isProcessing = signal<boolean>(false);


  private visitService = inject(VisitRecordsService);
  private userService = inject(UsersService);
  private practitionerService = inject(PractitionersService);
  private inpatientService = inject(InpatientsService);
  private prescriptionService = inject(PrescriptionsService);
  private snackbarService = inject(SnackbarService);
  private destroyRef = inject(DestroyRef);
  private signatureFilePath = signal<string>("");
  readonly dialog = inject(MatDialog);


  // 1, show practitioner Name with reference to user's practitionerId
  // 2, visitRecord table based date + practitionerId
  // 3, choose patientId, begin writing diagnose
  // 4, save signature field to backend subfolder + update related field in visitRecord 
  // 4.1, must sign first and get the returned file path, and then save other fields.
  // 5, fill in  others fields  
  // 5.1 enter medications
  // save test
  // create inpatient record if ??? checked 





  ngOnInit(): void {
    // get the practitioner info
    const userEmail = localStorage.getItem('email');
    if (userEmail) {
      this.userService.apiUsersGet(userEmail)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .pipe(
          switchMap((res) => {
            if (res && res.length > 0) {
              const praId = res[0].practitionerId ?? 0;
              return this.practitionerService.apiPractitionersIdGet(praId);
            }
            throw new Error('No user found');
          })
        ).subscribe({
          next: (res) => {
            if (res && res.data) {
              this.practitioner.set(res.data);
              console.log('Practitioner data:', res.data); // Use the result
            }
          },
          error: (error) => {
            console.error('An error occurred:', error.message);
          }
        });

    }

    this.fetchVistRecord();
  }


  removeMedication(rowNo: number) {
    const data = [...this.dataSource.data];
    data.splice(rowNo, 1);
    this.dataSource.data = [...data];
  }

  fetchVistRecord() {
    this.visitService.apiVisitRecordsGet(this.practitioner().practitionerId, this.visitDate)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          const data = (res.data ?? []).filter(ele => ele.diagnosis === "");
          this.scheduledVisits.set(data);
        },
        error: (err) => console.log('Error is ', err)
      });
  }

  onStart() {
    if (((this.visitRecord()?.visitId) ?? 0) === 0) return;

    const newVisit: GetVisitRecordDTO = {
      visitId: this.visitRecord()?.visitId,
      diagnosis: "",
      treatment: "",
      notes: "Processing"
    }
    this.visitService.apiVisitRecordsPut(newVisit)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(
        {
          next: (res) => console.log('res.data', res.data),
          error: (err) => console.error('error', err)
        }
      );

    this.isProcessing.set(true);

  }

  onEnd() {
    const diagnosis = this.diagnosisForm.value.diagnosis ?? "";
    const treatment = this.diagnosisForm.value.treatment ?? "";
    let reason = "Patient does not show up";
    if (!(diagnosis || treatment)) {
      const dialogRef = this.dialog.open(DialogSimpleDialog, {
        data: { title: 'Confirm Action', content: `Do you end calling because ${reason}?`, isCancelButtonVisible: true }
      });

      dialogRef.afterClosed()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(result => {
          if (!result) return;
        });
    }

    if ((diagnosis || treatment) && this.signatureFilePath() === "") {
      this.dialog.open(DialogSimpleDialog, {
        data: { title: 'Notification', content: 'Please sign your name on the touchpad before saving the prescription.', isCancelButtonVisible: false },
      });
      return;
    }

    const newVisit: GetVisitRecordDTO = {
      visitId: this.visitRecord()?.visitId ?? 0,
      diagnosis,
      treatment,
      practitionerSignaturePath: this.signatureFilePath(),
      notes: `Process ended. ${reason}`
    }
    this.visitService.apiVisitRecordsPut(newVisit)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(
        {
          next: (res) => {
            console.log('res.data', res.data);
            this.snackbarService.show("Diagnosis saved successfully.");
          },
          error: (err) => console.error('error', err),
          complete: () => this.isProcessing.set(false)
        }
      );
    
    const needAdmission = this.diagnosisForm.value.admission;
    if (needAdmission) {
      const addInpatient: AddInpatientDTO = {
        patientId: this.visitRecord()?.patientId,
        practitionerId: this.visitRecord()?.practitionerId,
        nurseId: 0,
        admissionDate: new Date(),
        reasonForAdmission: diagnosis
      };
      this.inpatientService.apiInpatientsPost(addInpatient)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe();
    }

    const medications = this.prescriptionTable.getMedications();
    if (medications.length <= 0) return;
    const presArray: AddPrescriptionDTO[] = medications.map(med => ({
      visitId: this.visitRecord()?.visitId,
      patientId: this.visitRecord()?.patientId,
      practitionerId: this.visitRecord()?.practitionerId,
      medicationId: med.medicationId,
      dosage: med.dosage,
      startDate: new Date()

    }));
    from(presArray).pipe(
      concatMap((item) => this.prescriptionService.apiPrescriptionsPost(item)),
      finalize(() => {
        console.log('All items have been processed');
      })
    ).subscribe({
      next: () => { },
      error: (err) => { }
    });
  }

  onSignSaved(filePath: string) {
    this.signatureFilePath.set(filePath);
  }

}
