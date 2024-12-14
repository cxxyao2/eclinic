import { Component } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { MatTabsModule } from '@angular/material/tabs';
import { ConsultationFormComponent } from "../consultation-form/consultation-form.component";
import { LabResultsComponent } from "../lab-results/lab-results.component";
import { MriImagesComponent } from "../mri-images/mri-images.component";

@Component({
  selector: 'app-check-in',
  standalone: true,
  imports: [MatTabsModule, TranslocoDirective, ConsultationFormComponent, LabResultsComponent, MriImagesComponent],
  templateUrl: './check-in.component.html',
  styleUrl: './check-in.component.scss'
})
export class CheckInComponent {
  // create visit record. 
  // field: PractitionerSignaturePath = ""
  

}
