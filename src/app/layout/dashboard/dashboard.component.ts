import { CardsComponent } from '../cards/cards.component';
import { ColumnChartComponent } from '../column-chart/column-chart.component';
import { LineChartComponent } from '../line-chart/line-chart.component';
import { PatientTableComponent } from '../patient-table/patient-table.component';

import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CardsComponent, LineChartComponent, PatientTableComponent, ColumnChartComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
