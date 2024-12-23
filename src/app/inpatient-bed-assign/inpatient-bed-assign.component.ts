import { Component, inject, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BedsService, GetBedDTO, GetInpatientDTO, InpatientsService, UpdateBedDTO } from '@libs/api-client';
import { MasterDataService } from '../services/master-data.service';
import { concatMap, , from, , Subject } from 'rxjs';

@Component({
  selector: 'app-inpatient-bed-assign',
  standalone: true,
  imports: [MatIconModule, MatCardModule, RouterModule],
  templateUrl: './inpatient-bed-assign.component.html',
  styleUrl: './inpatient-bed-assign.component.scss'
})
export class InpatientBedAssignComponent implements OnInit {
  roomId: string | null = null;
  selectedBedId: number = 0;
  initBeds: GetBedDTO[] = [];
  bedsOfRoom = signal<GetBedDTO[]>([]);
  inPatientRecord: GetInpatientDTO = {};


  private route = inject(ActivatedRoute);
  private bedService = inject(BedsService);
  private masterService = inject(MasterDataService);
  private inpatientService = inject(InpatientsService);

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.roomId = params.get('roomId');
      let oldBeds = this.masterService.bedsSubject.value;
      this.initBeds = oldBeds.filter(b => b.roomNumber === this.roomId);
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
  // 
  // this.inPatientRecord.roomNumber = beds[0].roomNumber;
  // this.inPatientRecord.bedNumber = beds[0].bedNumber;

  onSave(): void {
    // 1, save beds
    const changedBeds: GetBedDTO[] = [];
    from(changedBeds)
      .pipe(
        concatMap((bed: GetBedDTO) => {
          return this.bedService.apiBedsPut(bed as UpdateBedDTO);
        }))
      .subscribe();


    // 2, save inpaitents
    const changedInPatients: GetInpatientDTO[] = [];
    changedInPatients.forEach(pa => {
      pa.nurseId = this.masterService.userSubject.value.practitionerId;
    });

    from(changedInPatients).pipe(
      concatMap((inp: GetInpatientDTO) => {
        return this.inpatientService.apiInpatientsPut(inp)
      })
    ).subscribe();


  }

}
