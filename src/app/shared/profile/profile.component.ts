import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { UserProfile } from '@models/userProfile.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  imagePath = 'assets/images/sarah.jpg';
  profileInfo = input.required<UserProfile>();

}
