import { Component, ViewChild } from '@angular/core';
import { WebTrackerService } from './web-tracker.service';
import { FormBuilder } from '@angular/forms';
import { Package } from '../../types/package.type';
import { Delivery } from '../../types/delivery.type';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import { WebsocketService } from '../websocket.service';
import { DeliveryStatus } from '../../types/enums';
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
    deliveryId: '',
  });

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
    this.wsService.listen('location_changed').subscribe((res) => {
      console.log(res);
    });
  }

  ngOnInit(): void {
    this.getAndBroadCastLocation();
  }

  async getAndBroadCastLocation(): Promise<void> {
    while (true) {
      if (this.packageData?._id) {
        await this.webTrackerService.getLocationAndBroadcast(
          this.packageData._id
        );
      }
      await new Promise((resolve) => setTimeout(resolve, 20000));
    }
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
    const { deliveryId } = this.trackerForm.value;

    if (!deliveryId) {
      window.alert('Delivery id is required to track package!');
      return;
    }
    this.webTrackerService.trackDelivery(deliveryId).subscribe((res) => {
      console.log(res.data);
      this.deliveryData = res.data;

      this.packageData = res.data?.package_id as Package;

      if (this.packageData && this.deliveryData) {
        this.markerPositions.push(
          this.packageData?.from_location as google.maps.LatLngLiteral
        );
        this.markerPositions.push(
          this.packageData?.to_location as google.maps.LatLngLiteral
        );
        this.center = this.deliveryData?.location;
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

  async pickUp(): Promise<void> {
    if (!this.deliveryData || !this.packageData) {
      window.alert('Delivery or package id is not defined');
      return;
    }
    this.webTrackerService
      .updateStatus(
        this.packageData?._id,
        this.deliveryData._id,
        DeliveryStatus.picked_up
      )
      .subscribe((res) => {
        this.deliveryData = res.data;
      });
  }

  async inTransit(): Promise<void> {
    if (!this.deliveryData || !this.packageData) {
      window.alert('Delivery or package id is not defined');
      return;
    }
    this.webTrackerService
      .updateStatus(
        this.packageData?._id,
        this.deliveryData._id,
        DeliveryStatus.in_transit
      )
      .subscribe((res) => {
        this.deliveryData = res.data;
      });
  }

  async deliver(): Promise<void> {
    if (!this.deliveryData || !this.packageData) {
      window.alert('Delivery or package id is not defined');
      return;
    }
    this.webTrackerService
      .updateStatus(
        this.packageData._id,
        this.deliveryData._id,
        DeliveryStatus.delivered
      )
      .subscribe((res) => {
        this.deliveryData = res.data;
      });
  }

  async fail(): Promise<void> {
    if (!this.deliveryData || !this.packageData) {
      window.alert('Delivery or package id is not defined');
      return;
    }
    this.webTrackerService
      .updateStatus(
        this.packageData._id,
        this.deliveryData._id,
        DeliveryStatus.failed
      )
      .subscribe((res) => {
        this.deliveryData = res.data;
      });
  }
}
