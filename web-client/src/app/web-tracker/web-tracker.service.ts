import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Package } from '../../types/package.type';
import Response from '../../types/response.type';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebTrackerService {
  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `,
        error.error
      );

      window.alert(error.error.message);
    }
    // Return an observable with a user-facing error message.
    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }

  trackDelivery(packageId: string) {
    return this.http
      .get<Response<Package>>(
        `http://localhost:8004/api/v1/package/track/${packageId}`
      )
      .pipe(catchError(this.handleError));
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
