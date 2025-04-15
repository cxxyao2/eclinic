import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ChatRoomDTO } from '@libs/api-client';
import { TimeAgoPipe } from '@shared/pipes/time-ago.pipe';

@Component({
  selector: 'app-chat-room-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, RouterModule, TimeAgoPipe],
  templateUrl: './chat-room-card.component.html',
  styleUrls: ['./chat-room-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatRoomCardComponent {
  @Input({ required: true }) room!: ChatRoomDTO;

  protected readonly placeholderImage = 'https://placehold.co/600x400/e9ecef/495057?text=Chat+Room';
  
  protected participantsCount = 2;
  protected messagesCount = 15;
}

