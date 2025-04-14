import { Routes } from '@angular/router';
import { ChatRoomListComponent } from './chat-room-list/chat-room-list.component';
import { ChatRoomComponent } from './chat-room/chat-room.component';

export const chatRoutes: Routes = [
  {
    path: '',
    component: ChatRoomListComponent
  },
  {
    path: ':id',
    component: ChatRoomComponent
  }
];