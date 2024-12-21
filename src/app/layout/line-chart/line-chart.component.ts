import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  standalone: true,
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
  imports: [
    BrowserAnimationsModule,
    NgxChartsModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineChartComponent {
  mockData = [
    { month: 'January', flu: 120, diarrhea: 80, respiratoryInfections: 95 },
    { month: 'February', flu: 100, diarrhea: 75, respiratoryInfections: 90 },
    { month: 'March', flu: 110, diarrhea: 85, respiratoryInfections: 100 },
    { month: 'April', flu: 90, diarrhea: 70, respiratoryInfections: 85 },
    { month: 'May', flu: 80, diarrhea: 65, respiratoryInfections: 80 },
    { month: 'June', flu: 70, diarrhea: 60, respiratoryInfections: 75 },
  ];

  title = 'numbercardApp';
  view: [number, number] = [1000, 300];
  dataset = [
    { "name": "a", "value": 1 },
    { "name": "b", "value": 2 },]
}



