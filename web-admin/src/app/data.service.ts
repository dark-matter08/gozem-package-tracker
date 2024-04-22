import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Response from '../types/response.type';
import { Delivery } from '../types/delivery.type';
import { Package } from '../types/package.type';

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
}
