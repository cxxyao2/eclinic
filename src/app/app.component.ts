import { Component, computed, effect, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./layout/header/header.component";
import { CustomSidenavComponent } from "./layout/custom-sidenav/custom-sidenav.component";
import { MatSidenavModule } from '@angular/material/sidenav';
import { ResponsiveService } from './services/responsive.service';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatToolbarModule, MatSidenavModule,HeaderComponent, CustomSidenavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'eclinic';

  collapsed = signal(false);
  sidenavOpend = true;
  responseService = inject(ResponsiveService);

  sidenavMode = computed(()=>{
    if(this.responseService.largeWidth()){
      return 'side';
    }

    return 'over';
  });

  sidenavWidth = computed(()=> this.collapsed()?'65px':'250px');
 
}
