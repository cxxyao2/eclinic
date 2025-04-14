import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { toSignal } from '@angular/core/rxjs-interop';

import { ChatService } from '../../../services/chat.service';
import { ChatRoomDTO } from '@libs/api-client';

@Component({
  selector: 'app-chat-room-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatListModule, MatIconModule],
  template: `
    <mat-nav-list>
      @for (room of rooms(); track room.chatRoomId) {
        <a mat-list-item [routerLink]="['/chat', room.chatRoomId]">
          <mat-icon matListItemIcon>chat</mat-icon>
          <span matListItemTitle>{{ room.topic }}</span>
          <span matListItemLine>Patient ID: {{ room.patientId }}</span>
        </a>
      }
    </mat-nav-list>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
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