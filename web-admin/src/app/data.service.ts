import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Response from '../types/response.type';
import { Delivery } from '../types/delivery.type';
import { Package } from '../types/package.type';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient) {}

  getDeliveries() {
    return this.http.get<Response<Delivery[]>>(
      `http://localhost:8004/api/v1/delivery/`
    );
  }

  getPackages() {
    return this.http.get<Response<Package[]>>(
      `http://localhost:8004/api/v1/package/`
    );
  }

  getOpenPackages() {
    return this.http.get<Response<Package[]>>(
      `http://localhost:8004/api/v1/package/open/packages`
    );
  }

  createPackage(packageData: Partial<Package>): Observable<Response<Package>> {
    return this.http.post<Response<Package>>(
      `http://localhost:8004/api/v1/package/create`,
      packageData
    );
  }

  createDelivery(deliveryData: {
    package_id: string;
  }): Observable<Response<Delivery>> {
    return this.http.post<Response<Delivery>>(
      `http://localhost:8004/api/v1/delivery/create`,
      deliveryData
    );
  }
}
