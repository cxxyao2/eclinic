import { CommonModule } from '@angular/common';
import { CardsComponent } from '../cards/cards.component';
import { ColumnChartComponent } from '../column-chart/column-chart.component';
import { LineChartComponent } from '../line-chart/line-chart.component';
import { PatientTableComponent } from '../patient-table/patient-table.component';

import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    CardsComponent,
    LineChartComponent,
    PatientTableComponent,
    ColumnChartComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}



// <!-- 
// <div style="margin: 16px;">
//     <!-- Child component for cards -->
//     <app-cards></app-cards>
  
//     <!-- Child components for charts -->
//     <div style="display: flex; gap: 16px; margin-top: 16px;">
//       <app-line-chart></app-line-chart>
//       <app-column-chart></app-column-chart>
//     </div>
  
//     <!-- Child component for the table -->
//     <div style="margin-top: 16px;">
//       <app-patient-table></app-patient-table>
//     </div>
//   </div> 
// -->
  