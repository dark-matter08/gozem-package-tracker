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
}

/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/