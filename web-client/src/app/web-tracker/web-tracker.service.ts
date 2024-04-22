import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Package } from '../../types/package.type';
import Response from '../../types/response.type';

@Injectable({
  providedIn: 'root',
})
export class WebTrackerService {
  constructor(private http: HttpClient) {}

  trackDelivery(packageId: string) {
    return this.http.get<Response<Package>>(
      `http://localhost:8004/api/v1/package/${packageId}`
    );
  }

  getLocationAndBroadcast(): void {
    if (navigator.geolocation) {
      let latitude;
      let longitude;
      navigator.geolocation.getCurrentPosition((position) => {
        longitude = position.coords.longitude;
        latitude = position.coords.latitude;

        console.log(latitude, longitude);
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
