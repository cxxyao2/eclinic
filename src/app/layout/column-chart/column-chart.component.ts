import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EChartsOption } from 'echarts';
import { NgxEchartsDirective } from 'ngx-echarts';

@Component({
  standalone: true,
  selector: 'app-column-chart',
  templateUrl: './column-chart.component.html',
  styleUrls: ['./column-chart.component.scss'],
  imports:[NgxEchartsDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColumnChartComponent {

  options: EChartsOption = {
    title: {
      text: 'Illness'
    },
    tooltip: {},
    legend: {
      data: ['cases']
    },
    xAxis: {
      data: ['Jan', 'Feb', 'Mar', 'April', 'May', 'June']
    },
    yAxis: {},
    series: [
      {
        name: 'cases',
        type: 'bar',
        data: [120, 90, 100, 110, 120, 50]
      }
    ]
  };


  }
