import { Component, inject, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BedsService, GetBedDTO, GetInpatientDTO, InpatientsService, UpdateBedDTO } from '@libs/api-client';
import { MasterDataService } from '../services/master-data.service';
import { concatMap, from } from 'rxjs';
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inpatient-bed-assign',
  standalone: true,
  imports: [CdkDropListGroup, CdkDropList, CdkDrag, CommonModule, MatIconModule, MatCardModule, RouterModule],
  templateUrl: './inpatient-bed-assign.component.html',
  styleUrl: './inpatient-bed-assign.component.scss'
})
export class InpatientBedAssignComponent implements OnInit {
  roomNumber: string | null = null;
  selectedBedId: number = 0;
  initBeds: GetBedDTO[] = [];
  bedsOfRoom = signal<GetBedDTO[]>([]);
  inPatientRecord: GetInpatientDTO = {};
  existingInpatients: GetInpatientDTO[] = [];


  private route = inject(ActivatedRoute);
  private bedService = inject(BedsService);
  private masterService = inject(MasterDataService);
  private inpatientService = inject(InpatientsService);

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.roomNumber = params.get('roomNumber');
      let oldBeds = this.masterService.bedsSubject.value;
      this.initBeds = oldBeds.filter(b => b.roomNumber === this.roomNumber);
      this.bedsOfRoom.set([...this.initBeds]);
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
    const beds = this.bedsOfRoom().filter(bed => !bed.inpatientId);
    if (beds.length <= 0) return;
    this.selectedBedId = beds[0].bedId ?? 0;
    beds[0].inpatientId = this.inPatientRecord.inpatientId;
    this.bedsOfRoom.set([...beds]);
  }

  removeFromRoom(): void {
    this.bedsOfRoom.set([...this.initBeds]);
  }

  // todo, drag, 
  onDrop(event: CdkDragDrop<GetBedDTO[]>): void {
    const draggedIndex = event.previousIndex;
    const droppedIndex = event.currentIndex;

    // Swap patient names and inpatientId
    const beds = this.bedsOfRoom();


    const temp = beds[draggedIndex];
    beds[draggedIndex].patientName = beds[droppedIndex].patientName;
    beds[draggedIndex].inpatientId = beds[droppedIndex].inpatientId;

    beds[droppedIndex].patientName = temp.patientName;
    beds[droppedIndex].patientId = temp.patientId;
    this.bedsOfRoom.set([...beds]);
  }


  onSave(): void {
    // 1, save beds
    const changedBeds: GetBedDTO[] = this.bedsOfRoom();
    from(changedBeds)
      .pipe(
        concatMap((bed: GetBedDTO) => {
          return this.bedService.apiBedsPut(bed as UpdateBedDTO);
        }))
      .subscribe();


    // 2, save inpaitents
    const changedInPatients: GetInpatientDTO[] = [];
    const occupiedBeds = changedBeds.filter(c => !!c.inpatientId)
    occupiedBeds.forEach(o => {
      let idx = this.existingInpatients.findIndex(ex => ex.inpatientId === o.inpatientId);
      if (idx >= 0) {
        const updateEntity: GetInpatientDTO = {
          inpatientId: o.inpatientId!,
          nurseId: this.masterService.userSubject.value.practitionerId,
          roomNumber: o.roomNumber,
          bedNumber: o.bedNumber
        };
        changedInPatients.push(updateEntity);
      }
    });

    from(changedInPatients).pipe(
      concatMap((inp: GetInpatientDTO) => {
        return this.inpatientService.apiInpatientsPut(inp)
      })
    ).subscribe();


  }

}
