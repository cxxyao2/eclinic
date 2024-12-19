import { Component, inject } from '@angular/core';
import { UserRole, UsersService, UserUpdateDto } from '@libs/api-client';

@Component({
  selector: 'app-update-user',
  standalone: true,
  imports: [],
  templateUrl: './update-user.component.html',
  styleUrl: './update-user.component.scss'
})
export class UpdateUserComponent {

  private userService = inject(UsersService);

  updateUser() {
    let userUpdateDto: UserUpdateDto = {
      userId: 1,
      role: UserRole.NUMBER_3,
      practitionerId: 2

    }
    this.userService.apiUsersPut(userUpdateDto).subscribe(
      {
        next: (res) => { console.log('res', res) },
        error: (err) => console.error(err)
      }
    );
  }

}
