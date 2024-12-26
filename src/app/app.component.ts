import { CommonModule } from '@angular/common';
import { Component, computed, AfterViewInit, effect, inject, OnInit, signal, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./layout/header/header.component";
import { CustomSidenavComponent } from "./layout/custom-sidenav/custom-sidenav.component";
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { ResponsiveService } from './services/responsive.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavService } from './services/nav.service';
import { PractitionerScheduleComponent } from "./staff/practitioner-schedule/practitioner-schedule.component";

import { provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import { BarChart } from 'echarts/charts';
import { GridComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

import {LineChart} from 'echarts/charts';
import { TitleComponent, TooltipComponent, LegendComponent} from 'echarts/components';

echarts.use([BarChart, GridComponent,LineChart, TitleComponent, TooltipComponent, LegendComponent, CanvasRenderer]);


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatToolbarModule, MatSidenavModule, HeaderComponent, CustomSidenavComponent, PractitionerScheduleComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [
    provideEchartsCore({ echarts }),
  ]
})
export class AppComponent implements AfterViewInit {
  @ViewChild('drawer') appDrawer!: MatSidenav;

  title = 'eclinic';
  responseService = inject(ResponsiveService);
  private navService = inject(NavService)

  collapsed = signal(false);
  sidenavOpend = true;
  sidenavMode = computed(() => {
    if (this.responseService.isLargeScreen()) {
      return 'side';
    }
    return 'over';
  });

  sidenavWidth = computed(() => this.responseService.isLargeScreen() && this.collapsed() ? '65px' : '250px');

  ngAfterViewInit(): void {
    this.navService.appDrawer = this.appDrawer;
  }

}
