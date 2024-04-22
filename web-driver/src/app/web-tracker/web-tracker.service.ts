import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Package } from '../../types/package.type';
import Response from '../../types/response.type';
import { WebsocketService } from '../websocket.service';

@Injectable({
  providedIn: 'root',
})
export class WebTrackerService {
  runLoop: any;
  constructor(private http: HttpClient, private wsService: WebsocketService) {}

  trackDelivery(packageId: string) {
    return this.http.get<Response<Package>>(
      `http://localhost:8004/api/v1/package/${packageId}`
    );
  }

  async getLocationAndBroadcast(tunnelId: string): Promise<void> {
    while (this.runLoop) {
      if (navigator.geolocation) {
        let latitude;
        let longitude;
        navigator.geolocation.getCurrentPosition((position) => {
          longitude = position.coords.longitude;
          latitude = position.coords.latitude;

          this.wsService.broadcastLocation(tunnelId, {
            lat: latitude,
            lng: longitude,
          });
        });
      } else {
        console.log('No support for geolocation');
        break;
      }

      await new Promise((resolve) => setTimeout(resolve, 20000));
    }
  }
}

/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/
