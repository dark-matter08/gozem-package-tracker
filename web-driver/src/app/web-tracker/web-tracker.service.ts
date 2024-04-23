import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Package } from '../../types/package.type';
import Response from '../../types/response.type';
import { WebsocketService } from '../websocket.service';
import { Delivery } from '../../types/delivery.type';
import { DeliveryStatus } from '../../types/enums';
import { Observable, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebTrackerService {
  runLoop: any;
  constructor(private http: HttpClient, private wsService: WebsocketService) {}

  trackDelivery(deliveryId: string) {
    return this.http.get<Response<Delivery>>(
      `http://localhost:8004/api/v1/delivery/track/${deliveryId}`
    );
  }

  updateStatus(
    tunnelId: string,
    newStatus: DeliveryStatus
  ): Observable<Response<Delivery>> {
    this.wsService.broadCastDeliveryData(tunnelId, undefined, newStatus);
    return this.http.put<Response<Delivery>>(
      `http://localhost:8004/api/v1/delivery/${tunnelId}`,
      {
        status: newStatus,
      }
    );
  }

  updateLocation(
    deliveryId: string,
    location: google.maps.LatLngLiteral
  ): Observable<Response<Delivery>> {
    return this.http.put<Response<Delivery>>(
      `http://localhost:8004/api/v1/delivery/${deliveryId}`,
      {
        location: location,
      }
    );
  }

  async getLocationAndBroadcast(tunnelId: string): Promise<void> {
    if (navigator.geolocation) {
      let latitude;
      let longitude;
      navigator.geolocation.getCurrentPosition((position) => {
        longitude = position.coords.longitude;
        latitude = position.coords.latitude;

        console.log(
          '===== Broadcasting Location on tunnel: ',
          tunnelId,
          '===> Location: ',
          { latitude, longitude },
          '<< ========='
        );

        this.updateLocation(tunnelId, {
          lat: latitude,
          lng: longitude,
        }).subscribe((res) => {
          console.log(res);
        });
        this.wsService.broadCastDeliveryData(tunnelId, {
          lat: latitude,
          lng: longitude,
        });
      });
    } else {
      console.log('No support for geolocation');
    }
  }
}

/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/
