import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { toSignal } from '@angular/core/rxjs-interop';

import { ChatService } from '../../../services/chat.service';
import { ChatRoomDTO } from '@libs/api-client';
import { ChatRoomCardComponent } from './chat-room-card/chat-room-card.component';

@Component({
  selector: 'app-chat-room-list',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    MatButtonModule,
    ChatRoomCardComponent
  ],
  template: `
    <div class="chat-list-container">
      <button mat-raised-button [routerLink]="['/chat/create']">
        Create New Room
      </button>

      <div class="chat-rooms-grid">
        @for (room of rooms(); track room.chatRoomId) {
          <app-chat-room-card [room]="room" />
        }
      </div>
    </div>
  `,
  styles: [`
    .chat-list-container {
      padding: 1rem;
      height: 100%;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .chat-rooms-grid {
      flex: 1;
      overflow: auto;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1rem;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatRoomListComponent {
  private chatService = inject(ChatService);
  protected readonly rooms = toSignal(this.chatService.getChatRooms(), {
    initialValue: [] as ChatRoomDTO[]
  });
}

