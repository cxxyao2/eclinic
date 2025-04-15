import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-participant',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <div class="participant d-flex align-items-center p-2 border-bottom">
      <div class="avatar me-3">
        <img [src]="avatarUrl" [alt]="name" class="rounded-circle" width="40" height="40">
      </div>
      <div class="flex-grow-1">
        <div class="fw-bold">{{name}}</div>
      </div>
      <div class="status-indicator" [class.bg-success]="!isLatestMessageOwner" [class.bg-danger]="isLatestMessageOwner"></div>
    </div>
  `,
  styles: [`
    .status-indicator {
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }
    .avatar img {
      object-fit: cover;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ParticipantComponent {
  @Input() name!: string;
  @Input() avatarUrl!: string;
  @Input() isLatestMessageOwner = false;
}