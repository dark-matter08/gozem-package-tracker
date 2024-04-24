import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import Response from '../types/response.type';
import { Delivery } from '../types/delivery.type';
import { Package } from '../types/package.type';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
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
    }
    // Return an observable with a user-facing error message.
    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }

  getDeliveries() {
    return this.http
      .get<Response<Delivery[]>>(`http://localhost:8004/api/v1/delivery/`)
      .pipe(catchError(this.handleError));
  }

  getPackages() {
    return this.http
      .get<Response<Package[]>>(`http://localhost:8004/api/v1/package/`)
      .pipe(catchError(this.handleError));
  }

  getOpenPackages() {
    return this.http
      .get<Response<Package[]>>(
        `http://localhost:8004/api/v1/package/open/packages`
      )
      .pipe(catchError(this.handleError));
  }

  createPackage(packageData: Partial<Package>): Observable<Response<Package>> {
    return this.http
      .post<Response<Package>>(
        `http://localhost:8004/api/v1/package/create`,
        packageData
      )
      .pipe(catchError(this.handleError));
  }

  createDelivery(deliveryData: {
    package_id: string;
  }): Observable<Response<Delivery>> {
    return this.http
      .post<Response<Delivery>>(
        `http://localhost:8004/api/v1/delivery/create`,
        deliveryData
      )
      .pipe(catchError(this.handleError));
  }
}
