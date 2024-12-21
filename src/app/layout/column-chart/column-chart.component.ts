import { ChangeDetectionStrategy, Component } from '@angular/core';


@Component({
  standalone: true,
  selector: 'app-column-chart',
  templateUrl: './column-chart.component.html',
  styleUrls: ['./column-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColumnChartComponent {
  // columnChartData: ChartDataset[] = [
  //   { data: [85, 78, 90, 95, 88], label: 'Dr. Smith' },
  //   { data: [80, 82, 88, 92, 85], label: 'Dr. Lee' },
  //   { data: [78, 75, 82, 87, 80], label: 'Dr. Carter' }
  // ];

  // columnChartLabels: string[] = ['January', 'February', 'March', 'April', 'May'];

  // // columnChartOptions: ChartOptions = {
  // //   responsive: true,
  // //   scales: {
  // //     xAxes: [
  // //       {
  // //         gridLines: { display: false },
  // //         scaleLabel: { display: true, labelString: 'Month' }
  // //       }
  // //     ],
  // //     yAxes: [
  // //       {
  // //         ticks: { beginAtZero: true },
  // //         scaleLabel: { display: true, labelString: 'Performance Score' }
  // //       }
  // //     ]
  // //   },
  // //   plugins: {
  // //     legend: {
  // //       display: true,
  // //       position: 'top'
  // //     }
  // //   }
  // // };

  // columnChartLegend = true;
  // columnChartType: ChartType = 'bar'; // For column charts, use 'bar'
}
