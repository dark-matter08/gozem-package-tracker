import { Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';
import { Observable, Subject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class MapService {
  // messages: any;

  constructor(private wsService: WebsocketService) {
    const data = this.wsService.connect();
  }

  sendMessage(msg: any) {
    // this.messages.next(msg);
  }
}
