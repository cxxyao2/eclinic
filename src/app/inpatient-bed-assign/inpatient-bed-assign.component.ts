import { MatButtonModule } from '@angular/material/button';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BedsService, GetBedDTO, GetInpatientDTO, InpatientsService, UpdateBedDTO } from '@libs/api-client';
import { MasterDataService } from '../services/master-data.service';
import { combineLatest, concatMap, finalize, from, map } from 'rxjs';
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-inpatient-bed-assign',
    imports: [CdkDropList, CdkDrag, CommonModule, MatIconModule, MatButtonModule, MatCardModule, RouterModule],
    templateUrl: './inpatient-bed-assign.component.html',
    styleUrl: './inpatient-bed-assign.component.scss'
})
export class InpatientBedAssignComponent implements OnInit {
  roomNumber: string | null = null;
  // bedsOfRoom = signal<GetBedDTO[]>([]);
  bedsOfRoom: GetBedDTO[] = [];
  existingInpatients: GetInpatientDTO[] = [];


  private route = inject(ActivatedRoute);
  public router = inject(Router);
  private bedService = inject(BedsService);
  private masterService = inject(MasterDataService);
  private inpatientService = inject(InpatientsService);
  patientInWaiting = toSignal(this.masterService.selectedPatientSubject);

  ngOnInit(): void {

    combineLatest([
      this.route.paramMap,
      this.masterService.bedsSubject
    ]).pipe(
      map(([params, beds]) => {
        const roomNumber = params.get('roomNumber');
        const filteredBeds = beds.filter(b => b.roomNumber === roomNumber);
        return { roomNumber, filteredBeds };
      })
    ).subscribe(({ roomNumber, filteredBeds }) => {
      this.roomNumber = roomNumber;
      this.bedsOfRoom = filteredBeds.slice();
      // this.bedsOfRoom.set(filteredBeds.slice());
    });


    // get the inpatients in this room filtered by roomNuber
    this.inpatientService.apiInpatientsGet(this.roomNumber!).subscribe({
      next: (res) => {
        this.existingInpatients = res.data ?? [];
      },
      error: (err) => console.error(err)
    });


  }

  addToRoom(): void {
    const currentBeds = this.bedsOfRoom.slice();
    const emptyBed = currentBeds.find(bed => ((bed.inpatientId ?? 0) === 0));
    if (!emptyBed) return;
    emptyBed.inpatientId = this.patientInWaiting()?.inpatientId;
    emptyBed.patientName = this.patientInWaiting()?.patientName;
    emptyBed.practitionerName = this.patientInWaiting()?.practitionerName;
    this.bedsOfRoom = [...currentBeds];
    // this.bedsOfRoom.set([...currentBeds]);
  }

  removeFromRoom(): void {
    const currentBeds = this.bedsOfRoom.slice();
    const occupiedBed = currentBeds.find(bed => ((bed.inpatientId ?? 0) === this.patientInWaiting()?.inpatientId));
    if (!occupiedBed) return;
    occupiedBed.inpatientId = null;
    occupiedBed.patientName = null;
    occupiedBed.practitionerName = null;
    this.bedsOfRoom = [...currentBeds];
    // this.bedsOfRoom.set([...currentBeds]);
  }

  // drop(event: CdkDragDrop<GetBedDTO[]>) {
  //   moveItemInArray(this.bedsOfRoom, event.previousIndex, event.currentIndex);
  // }

  drop(event: CdkDragDrop<GetBedDTO[]>): void {
    const draggedIndex = event.previousIndex;
    const droppedIndex = event.currentIndex;

    // Swap patient names and inpatientId
    const beds = [...this.bedsOfRoom];

    const temp = { ...beds[draggedIndex] };
    beds[draggedIndex].patientName = beds[droppedIndex].patientName;
    beds[draggedIndex].inpatientId = beds[droppedIndex].inpatientId;
    beds[draggedIndex].practitionerName = beds[droppedIndex].practitionerName;


    beds[droppedIndex].patientName = temp.patientName;
    beds[droppedIndex].patientId = temp.patientId;
    beds[droppedIndex].practitionerName = temp.practitionerName;
    this.bedsOfRoom = [...beds];
  }


  onSave(): void {
    // 1. Save beds
    const changedBeds: GetBedDTO[] = this.bedsOfRoom;
    const saveBeds$ = from(changedBeds).pipe(
      concatMap((bed: GetBedDTO) => this.bedService.apiBedsPut(bed as UpdateBedDTO))
    );

    // 2. Save inpatients
    const changedInPatients: GetInpatientDTO[] = [];
    const nurseId = this.masterService.userSubject.value?.practitionerId;
    changedBeds.filter(c => !!c.inpatientId).forEach(o => {
      const updateEntity: GetInpatientDTO = {
        inpatientId: o.inpatientId!,
        nurseId,
        roomNumber: o.roomNumber,
        bedNumber: o.bedNumber
      };
      changedInPatients.push(updateEntity);

    });

    const saveInpatients$ = from(changedInPatients).pipe(
      concatMap((inp: GetInpatientDTO) => this.inpatientService.apiInpatientsPut(inp))
    );

    // 3. Chain both observables and navigate after completion
    saveBeds$
      .pipe(
        concatMap(() => saveInpatients$), 
        finalize(() => {
          this.router.navigate(['/dashboard']); 
        })
      )
      .subscribe({
        next: (res) => {
          console.log('Operation success:', res);
        },
        error: (err) => {
          console.error('Operation failed:', err);
        }
      });
  }

}
