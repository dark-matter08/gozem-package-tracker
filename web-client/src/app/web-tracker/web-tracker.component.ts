import { Component, ViewChild } from '@angular/core';
import { WebTrackerService } from './web-tracker.service';
import { FormBuilder } from '@angular/forms';
import { Package } from '../../types/package.type';
import { Delivery } from '../../types/delivery.type';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import { WebsocketService } from '../websocket.service';
import { DeliveryStatus, ListeningEvents } from '../../types/enums';
// import { Package } from '../../types/package.type';

@Component({
  selector: 'app-package-tracker',
  templateUrl: './web-tracker.component.html',
  styleUrls: ['./web-tracker.component.scss'],
})
export class WebTrackerComponent {
  packageData: Package | undefined;
  deliveryData: Delivery | undefined;
  center: google.maps.LatLngLiteral;
  display: any;
  zoom: number;
  markerOptions: {};
  markerPositions: google.maps.LatLngLiteral[];
  @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow | undefined;
  trackerForm = this.formBuilder.group({
    packageId: '',
  });
  packageStatus: string;

  constructor(
    private webTrackerService: WebTrackerService,
    private formBuilder: FormBuilder,
    private wsService: WebsocketService
  ) {
    this.center = {
      lat: 24,
      lng: 12,
    };
    this.zoom = 4;
    this.markerOptions = {
      draggable: false,
    };
    this.markerPositions = [];
    this.packageStatus = DeliveryStatus.open;
  }

  ngOnInit(): void {
    this.wsService.listen(ListeningEvents.location_changed).subscribe((res) => {
      console.log('Receiving new location: ', res.location);
      this.center = res.location as google.maps.LatLngLiteral;
    });

    this.wsService.listen(ListeningEvents.status_changed).subscribe((res) => {
      console.log('Receiving new status: ', res.status?.toUpperCase());
      this.packageStatus = res.status as string;
    });
  }

  moveMap(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) this.center = event.latLng.toJSON();
  }
  move(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) this.display = event.latLng.toJSON();
  }
  openInfoWindow(marker: MapMarker) {
    if (this.infoWindow != undefined) this.infoWindow.open(marker);
  }

  async onSubmit(): Promise<void> {
    console.warn('Your package id has been submitted', this.trackerForm.value);
    const { packageId } = this.trackerForm.value;

    if (!packageId) {
      window.alert('Delivery id is required to track package!');
      return;
    }
    this.webTrackerService.trackDelivery(packageId).subscribe((res) => {
      console.log(res.data);
      this.packageData = res.data;

      this.deliveryData = res.data?.active_delivery_id as Delivery;
      this.markerPositions.push(
        this.packageData?.from_location as google.maps.LatLngLiteral
      );
      this.markerPositions.push(
        this.packageData?.to_location as google.maps.LatLngLiteral
      );

      if (this.deliveryData) {
        this.packageStatus = this.deliveryData.status;
        this.center = this.deliveryData.location;
        this.markerPositions.push(
          this.deliveryData.location as google.maps.LatLngLiteral
        );
        this.zoom = 15;
        if (this.packageData?._id) {
          console.log('Joining tunnel on: ', this.packageData?._id);

          this.wsService.joinTunnel(this.packageData?._id);
        }
      } else {
        this.center = this.packageData
          ?.from_location as google.maps.LatLngLiteral;
      }
    });

    this.trackerForm.reset();

    // const socket = this.wsService.getSocket();
    // socket?.on('connected', (data: { tunnelId: string }) => {
    //   console.log('User connected on tunnel: ', data.tunnelId);
    // });

    // socket?.on(
    //   'location_changed',
    //   (data: { tunnelId: string; location: google.maps.LatLngLiteral }) => {
    //     this.center = data.location;
    //     // Todo add code to recalculate poly lines of map
    //   }
    // );
  }
}
