import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { GetVisitRecordDTO } from '@libs/api-client';

@Component({
  selector: 'app-check-in-waiting-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule],
  templateUrl: './check-in-waiting-list.component.html',
  styleUrl: './check-in-waiting-list.component.scss'
})
export class CheckInWaitingListComponent implements AfterViewInit {
  displayedColumns: string[] = ['visitId', 'patientName', 'practitionerName', 'visitDate'];
  dataSource = new MatTableDataSource<GetVisitRecordDTO>([]);

  @Input({ required: true }) set waitingList(newList: GetVisitRecordDTO[]) {
    this.dataSource.data = newList;
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

}