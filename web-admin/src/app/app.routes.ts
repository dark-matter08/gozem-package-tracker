import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PackageComponent } from './package/package.component';
import { DeliveryComponent } from './delivery/delivery.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'package', component: PackageComponent },
  { path: 'delivery', component: DeliveryComponent },
];
