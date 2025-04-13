import { CommonModule } from '@angular/common';
import { CardsComponent } from '../cards/cards.component';
import { ColumnChartComponent } from '../column-chart/column-chart.component';
import { LineChartComponent } from '../line-chart/line-chart.component';
import { PatientTableComponent } from '../patient-table/patient-table.component';

import { Component } from '@angular/core';

@Component({
    selector: 'app-dashboard',
    imports: [
        CommonModule,
        CardsComponent,
        LineChartComponent,
        PatientTableComponent,
        ColumnChartComponent
    ],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}


// <div style="display: flex; gap: 16px; margin-top: 16px;">
// <app-line-chart></app-line-chart>
// // <app-column-chart></app-column-chart>
// </div>