import { Injectable } from '@angular/core';
import io, { Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import * as Rx from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
@Injectable()
export class WebsocketService {
  private subject: WebSocketSubject<any> | null;

  constructor() {
    this.connect();
    this.subject = null;
  }

  public connect() {
    this.subject = webSocket({
      url: 'wss://echo.websocket.org',
      openObserver: {
        next: () => {
          console.log('connexion ok');
        },
      },
      closeObserver: {
        next: () => {
          console.log('disconnect ok');
        },
      },
    });

    this.subject.subscribe({
      next: (msg) => console.log('message received: ' + msg),
      error: (err) => console.log(err),
      complete: () => console.log('complete'),
    });
  }

  public send(msg: string) {
    this.subject?.next(msg);
  }

  public disconnect() {
    this.subject?.complete();
  }
}
