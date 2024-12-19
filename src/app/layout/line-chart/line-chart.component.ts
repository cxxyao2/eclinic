import { Component } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent {
  lineChartData: ChartDataSets[] = [
    { data: [120, 150, 170, 200, 250, 300, 400], label: 'Emergency Department' },
    { data: [90, 110, 150, 130, 180, 240, 300], label: 'Outpatient Visits' }
  ];
  lineChartLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  lineChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      xAxes: [{ gridLines: { display: false } }],
      yAxes: [{ ticks: { beginAtZero: true }, scaleLabel: { display: true, labelString: 'Number of Patients' } }]
    }
  };
  lineChartLegend = true;
  lineChartType: ChartType = 'line';
}
