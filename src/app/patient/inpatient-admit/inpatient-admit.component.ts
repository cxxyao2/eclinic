import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';


interface Room {
  roomNumber: number;
  totalBeds: number;
  occupiedBeds: number;
  beds: Bed[]; // Array to hold bed details
}

interface Bed {
  bedNumber: number;
  occupied: boolean;
  patientName?: string;
  illnessName?: string;
}


@Component({
  selector: 'app-inpatient-admit',
  standalone: true,
  imports: [CommonModule,MatCardModule, MatIconModule],
  templateUrl: './inpatient-admit.component.html',
  styleUrl: './inpatient-admit.component.scss'
})
export class InpatientAdmitComponent {

  // todo: 1, 展示所有房间的使用情况. 一个护士管理4个房间, 16个床位
  // 2, 默认1个房间4张床位, 可以分配新病人到空床位
  // 3，可以在同一房间的4个床位间移动 1,2,3,4,病人ID 和床ID
  // Example data for rooms
 // Example data for rooms
 rooms: Room[] = [
  {
    roomNumber: 101,
    totalBeds: 4,
    occupiedBeds: 2,
    beds: [
      { bedNumber: 1, occupied: true, patientName: 'John Doe', illnessName: 'Fever' },
      { bedNumber: 2, occupied: true, patientName: 'Jane Smith', illnessName: 'Flu' },
      { bedNumber: 3, occupied: false },
      { bedNumber: 4, occupied: false }
    ]
  },
  {
    roomNumber: 102,
    totalBeds: 4,
    occupiedBeds: 4,
    beds: [
      { bedNumber: 1, occupied: true, patientName: 'Alice Brown', illnessName: 'Cold' },
      { bedNumber: 2, occupied: true, patientName: 'Tom Lee', illnessName: 'Headache' },
      { bedNumber: 3, occupied: true, patientName: 'Sara White', illnessName: 'Cough' },
      { bedNumber: 4, occupied: true, patientName: 'Mark Green', illnessName: 'Asthma' }
    ]
  },
  {
    roomNumber: 103,
    totalBeds: 4,
    occupiedBeds: 1,
    beds: [
      { bedNumber: 1, occupied: true, patientName: 'Charlie Black', illnessName: 'Allergy' },
      { bedNumber: 2, occupied: false },
      { bedNumber: 3, occupied: false },
      { bedNumber: 4, occupied: false }
    ]
  }
];

selectedRoom: Room | null = null;

getAvailableBeds(occupiedBeds: number, totalBeds: number): number {
  return totalBeds - occupiedBeds;
}

selectRoom(room: Room): void {
  if (this.getAvailableBeds(room.occupiedBeds, room.totalBeds) > 0) {
    this.selectedRoom = room;
  }
}

closeRoomDetails(): void {
  this.selectedRoom = null;
}
}
