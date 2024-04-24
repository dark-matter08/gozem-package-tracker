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

  broadCastDeliveryData(
    tunnelId: string,
    location?: google.maps.LatLngLiteral,
    status?: DeliveryStatus
  ) {
    this.socket.emit('delivery_updated', { tunnelId, location, status });
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
}
