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
    MatIconModule
  ],
  template: `
    <mat-card class="chat-container">
      <mat-card-header>
        <mat-card-title>Chat Room</mat-card-title>
      </mat-card-header>
      
      <mat-card-content class="messages-container">
        @for (message of messages; track message.messageId) {
          <div class="message" [class.own-message]="message.senderId === currentUserId">
            <span class="message-content">{{ message.content }}</span>
            <span class="message-time">{{ message.createdAt | date:'short' }}</span>
          </div>
        }
      </mat-card-content>
      
      <mat-card-actions>
        <form (ngSubmit)="sendMessage()" class="message-form">
          <mat-form-field appearance="outline" class="message-input">
            <input matInput [formControl]="messageControl" placeholder="Type a message...">
          </mat-form-field>
          <button mat-icon-button type="submit" [disabled]="!messageControl.value">
            <mat-icon>send</mat-icon>
          </button>
        </form>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    .chat-container {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    
    .messages-container {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
    }
    
    .message {
      margin: 8px 0;
      padding: 8px;
      border-radius: 8px;
      background: #f5f5f5;
      max-width: 70%;
    }
    
    .own-message {
      margin-left: auto;
      background: #e3f2fd;
    }
    
    .message-content {
      display: block;
    }
    
    .message-time {
      font-size: 0.8em;
      color: #666;
    }
    
    .message-form {
      display: flex;
      align-items: center;
      padding: 8px;
    }
    
    .message-input {
      flex: 1;
      margin-right: 8px;
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
  
  protected async sendMessage(): Promise<void> {
    const message = this.messageControl.value.trim();
    if (message) {
      await this.chatService.sendMessage(this.roomId(), message);
      this.messageControl.reset();
    }
  }
  
  ngOnDestroy() {
    this.chatService.leaveRoom(this.roomId());
    this.chatService.disconnect();
  }
}