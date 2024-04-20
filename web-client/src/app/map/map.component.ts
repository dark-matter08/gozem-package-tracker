import { Component } from '@angular/core';
// import { Package } from '../../types/package.type';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent {
  // google maps zoom level
  zoom: number = 8;

  lat: number = 51.673858;
  lng: number = 7.815982;
}
