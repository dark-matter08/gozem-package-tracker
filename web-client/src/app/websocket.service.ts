import { Injectable } from '@angular/core';
import io from 'socket.io-client';
import { Observable } from 'rxjs';
import { DeliveryStatus } from '../types/enums';
import { Delivery } from '../types/delivery.type';
@Injectable()
export class WebsocketService {
  private socket = io('http://localhost:8004');

  joinTunnel(tunnelId: string) {
    if (this.socket) {
      this.socket.emit('joinTunnel', {
        tunnelId: tunnelId,
      });
    }
  }

  listen(event: string) {
    let observable = new Observable<{
      tunnelId: String;
      location?: google.maps.LatLngLiteral;
      status?: DeliveryStatus;
      delivery?: Delivery;
    }>((observer) => {
      this.socket.on(event, (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }
  // private subject: WebSocketSubject<any> | null;

  // constructor() {
  //   this.connect();
  //   this.subject = null;
  // }

  // public connect() {
  //   this.subject = webSocket({
  //     url: 'ws://localhost:8005',
  //     openObserver: {
  //       next: () => {
  //         console.log('connected to socket');
  //       },
  //     },
  //     closeObserver: {
  //       next: () => {
  //         console.log('disconnect ok');
  //       },
  //     },
  //   });

  //   this.subject.subscribe({
  //     next: (msg) => console.log('message received: ' + msg),
  //     error: (err) => console.log(err),
  //     complete: () => console.log('complete'),
  //   });
  // }

  // public send(msg: string) {
  //   this.subject?.next(msg);
  // }

  // public disconnect() {
  //   this.subject?.complete();
  // }

  // private socket: Socket | null;

  // constructor() {
  //   this.socket = null;
  //   this.connect();
  // }

  // connect() {
  //   this.socket = io('http://localhost:8004');
  //   console.log('===== Socket Connected =====');
  // }

  // disconnect() {
  //   if (this.socket) {
  //     this.socket.disconnect();
  //   }
  // }

  // joinTunnel(tunnelId: string) {
  //   if (this.socket) {
  //     this.socket.emit('joinTunnel', {
  //       tunnelId: tunnelId,
  //     });
  //   }
  // }

  // getSocket() {
  //   return this.socket;
  // }
}
