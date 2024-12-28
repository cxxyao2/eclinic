import { GetBedDTO } from '@libs/api-client/model/getBedDTO';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { BedsService } from '@libs/api-client';
import { take } from 'rxjs';
import { BEDNUMBER_PER_ROOM } from '@constants/rooms-with-beds.constants';
import { MasterDataService } from 'src/app/services/master-data.service';
import { toSignal } from '@angular/core/rxjs-interop';

export interface Room {
  roomNo: string;
  totalBeds: number;
  occupiedBeds: number;
  emptyBeds: number;
}

@Component({
  selector: 'app-inpatient-admit',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatIconModule],
  templateUrl: './inpatient-admit.component.html',
  styleUrl: './inpatient-admit.component.scss'
})
export class InpatientAdmitComponent implements OnInit {

  // todo: 1, 展示所有房间的使用情况.
  // 8 room * 8 bed. 
  // 2, 默认1个房间8张床位, 可以分配新病人到空床位
  // 3，可以在同一房间的6个床位间移动 1,2,3,4,病人ID 和床ID
  // Example data for rooms
  // Example data for rooms
  private bedService = inject(BedsService);
  private masterService = inject(MasterDataService);
  selectedPatient = toSignal(this.masterService.selectedPatientSubject);

  groupedRooms = signal<Room[]>([]);


  ngOnInit(): void {
    this.bedService.apiBedsGet().pipe(take(1)).subscribe({
      next: (res) => {
        let data = res.data ?? [];
        this.masterService.bedsSubject.next(data);
        this.getRoomAndEmptyBeds(data);

      },
      error: (err) => console.error(err)
    });

  }



  getRoomAndEmptyBeds(beds: GetBedDTO[]) {
    const currentRooms = Object.values(
      beds.reduce((acc, bed) => {
        const { roomNumber, inpatientId } = bed;
        const roomNo = roomNumber ?? "";

        if (!acc[roomNo]) {
          acc[roomNo] = { roomNo, emptyBeds: 0, occupiedBeds: BEDNUMBER_PER_ROOM, totalBeds: BEDNUMBER_PER_ROOM };
        }
        if (!inpatientId) {
          acc[roomNo].emptyBeds += 1;
          acc[roomNo].occupiedBeds -= 1;
        }
        return acc;
      }, {} as Record<string, Room>)
    );

    console.log(currentRooms);
    this.groupedRooms.set([...currentRooms]);
  }

}
