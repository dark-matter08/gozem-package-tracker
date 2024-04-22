import { Component } from '@angular/core';
import { DataService } from '../data.service';
import { Package } from '../../types/package.type';
import { Delivery } from '../../types/delivery.type';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  packages: Package[];
  deliveries: Delivery[];
  constructor(private dataService: DataService) {
    this.packages = [];
    this.deliveries = [];
  }

  ngOnInit(): void {
    this.loadPackages();
    this.loadDeliveries();
  }

  async loadPackages() {
    this.dataService.getPackages().subscribe((res) => {
      this.packages = res.data as Package[];

      console.log(res);
    });
  }

  async loadDeliveries() {
    this.dataService.getDeliveries().subscribe((res) => {
      this.deliveries = res.data as Delivery[];

      console.log(res);
    });
  }
}
