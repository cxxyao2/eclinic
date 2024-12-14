import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { MatTabsModule } from '@angular/material/tabs';
import { LabResultsComponent } from "../lab-results/lab-results.component";
import { MriImagesComponent } from "../mri-images/mri-images.component";

@Component({
  selector: 'app-consultation-form',
  standalone: true,
  imports: [CommonModule,MatTabsModule, TranslocoDirective, ConsultationFormComponent, LabResultsComponent, MriImagesComponent],
  templateUrl: './consultation-form.component.html',
  styleUrl: './consultation-form.component.scss'
})
export class ConsultationFormComponent {

}
