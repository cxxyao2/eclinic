import { ChangeDetectionStrategy, Component, DestroyRef, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ChatService } from '../../../services/chat.service';
import { ChatMessageDTO } from '@libs/api-client';
import { MessageComposerComponent } from './message-composer.component';
import { ParticipantComponent } from './participant/participant.component';

@Component({
  selector: 'app-chat-room',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MessageComposerComponent,
    ParticipantComponent
  ],
  template: `
    <div class="container-fluid h-100 py-2">
      <div class="row h-100">
        <!-- Main Chat Area -->
        <div class="col-12 col-lg-9 h-100">
          <mat-card class="chat-card">
            <mat-card-header class="border-bottom">
              <mat-card-title class="mb-0 p-2">Chat Room</mat-card-title>
            </mat-card-header>
            
            <mat-card-content class="messages-container px-3">
              @for (message of messages; track message.messageId) {
                <div class="d-flex mb-3 {{ message.senderId === currentUserId ? 'justify-content-end' : 'justify-content-start' }}">
                  <div class="message rounded p-2 {{ message.senderId === currentUserId ? 'bg-primary text-white' : 'bg-light' }}"
                       style="max-width: 70%;">
                    <div class="message-content">{{ message.content }}</div>
                    <small class="d-block {{ message.senderId === currentUserId ? 'text-white-50' : 'text-muted' }}">
                      {{ message.createdAt | date:'short' }}
                    </small>
                  </div>
                </div>
              }
            </mat-card-content>
            
            <mat-card-actions class="border-top p-3 m-0">
              <app-message-composer 
                [roomId]="roomId()" 
                (messageSent)="onMessageSent($event)">
              </app-message-composer>
            </mat-card-actions>
          </mat-card>
        </div>

        <!-- Participants Sidebar -->
        <div class="col-12 col-lg-3 h-100">
          <mat-card class="participants-card">
            <mat-card-header class="border-bottom">
              <mat-card-title class="mb-0 p-2">Participants</mat-card-title>
            </mat-card-header>
            
            <mat-card-content class="participants-container p-0">
              @for (participant of participants; track participant.userId) {
                <app-participant
                  [name]="participant.name"
                  [avatarUrl]="participant.avatarUrl"
                  [isLatestMessageOwner]="participant.userId === getLatestMessageSenderId()"
                />
              }
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }

    .chat-card, .participants-card {
      height: calc(100vh - 80px); /* 64px header + 16px padding */
      display: flex;
      flex-direction: column;
    }

    .messages-container {
      flex: 1;
      overflow-y: auto;
      min-height: 0;
      padding-top: 1rem;
      padding-bottom: 1rem;
    }

    .participants-container {
      flex: 1;
      overflow-y: auto;
      min-height: 0;
    }

    .message {
      word-break: break-word;
    }

    mat-card {
      background-color: var(--mat-app-surface-container);
      color: var(--mat-app-on-surface);
    }

    mat-card-header {
      background-color: var(--mat-app-surface-container-high);
    }

    /* Custom scrollbar */
    .messages-container::-webkit-scrollbar,
    .participants-container::-webkit-scrollbar {
      width: 6px;
    }

    .messages-container::-webkit-scrollbar-track,
    .participants-container::-webkit-scrollbar-track {
      background: transparent;
    }

    .messages-container::-webkit-scrollbar-thumb,
    .participants-container::-webkit-scrollbar-thumb {
      background-color: rgba(0, 0, 0, 0.2);
      border-radius: 3px;
    }

    @media (max-width: 991.98px) {
      .participants-card {
        height: auto;
        margin-top: 1rem;
        max-height: 300px;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatRoomComponent {
  roomId = input.required<number>();

  private chatService = inject(ChatService);
  private destroyRef = inject(DestroyRef);

  protected messages: ChatMessageDTO[] = [];
  protected messageControl = new FormControl('', { nonNullable: true });
  protected currentUserId = 1; // TODO: Get from auth service

  // TODO: Replace with actual participants data from service
  protected participants = [
    {
      userId: 1,
      name: 'Dr. Smith',
      avatarUrl: 'assets/avatars/doctor.png'
    },
    {
      userId: 2,
      name: 'John Doe',
      avatarUrl: 'assets/avatars/patient.png'
    }
  ];

  constructor() {
    this.chatService.messages$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(messages => this.messages = messages);

    this.initializeRoom();
  }

  private async initializeRoom(): Promise<void> {
    await this.chatService.startConnection();
    await this.chatService.joinRoom(this.roomId());

    // Load existing messages
    this.chatService.getRoomMessages(this.roomId())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(messages => this.messages = messages);
  }

  protected onMessageSent(message: string): void {
    this.chatService.sendMessage(this.roomId(), message);
  }

  protected getLatestMessageSenderId(): number {
    return this.messages[this.messages.length - 1]?.senderId ?? 0;
  }

  ngOnDestroy() {
    this.chatService.leaveRoom(this.roomId());
    this.chatService.disconnect();
  }
}

