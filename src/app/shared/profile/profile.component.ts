import { Component, Input, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { UserProfile } from '@models/userProfile.model';

@Component({
    selector: 'app-profile',
    imports: [MatIconModule],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  @Input() imagePath: string = 'assets/images/sarah.jpg';
  profileInfo = input.required<UserProfile>();

}
