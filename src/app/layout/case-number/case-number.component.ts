import { Component } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label, Color } from 'ng2-charts';


// line chart
@Component({
  selector: 'app-case-number',
  standalone: true,
  imports: [],
  templateUrl: './case-number.component.html',
  styleUrl: './case-number.component.scss'
})
export class CaseNumberComponent {

  lineChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Product A' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Product B' }
  ];
  lineChartLabels: Label[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
  lineChartOptions: ChartOptions = {
    responsive: true
  };
  lineChartColors: Color[] = [
    { borderColor: 'black', backgroundColor: 'rgba(255,0,0,0.3)' },
    { borderColor: 'blue', backgroundColor: 'rgba(0,0,255,0.3)' }
  ];
  lineChartLegend = true;
  lineChartType: ChartType = 'line';
}