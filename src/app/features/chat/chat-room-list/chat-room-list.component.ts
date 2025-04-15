import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { toSignal } from '@angular/core/rxjs-interop';

import { ChatService } from '../../../services/chat.service';
import { ChatRoomDTO } from '@libs/api-client';

@Component({
  selector: 'app-chat-room-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatListModule, MatIconModule, MatButtonModule],
  template: `
    <div class="chat-list-container">
      <button mat-raised-button  [routerLink]="['/chat/create']">
        Create New Room
      </button>

      <mat-nav-list>
        @for (room of rooms(); track room.chatRoomId) {
          <a mat-list-item [routerLink]="['/chat', room.chatRoomId]">
            <mat-icon matListItemIcon>chat</mat-icon>
            <span matListItemTitle>{{ room.topic }}</span>
            <span matListItemLine>Patient ID: {{ room.patientId }}</span>
          </a>
        }
      </mat-nav-list>
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

    mat-nav-list {
      flex: 1;
      overflow: auto;
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
