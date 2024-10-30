import { Component, effect, input, model, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  collapsed = model.required<boolean>();

  darkMode = signal(false);


  setDarkMode = effect(() => {
    document.body.classList.toggle('dark', this.darkMode());
  });

}
