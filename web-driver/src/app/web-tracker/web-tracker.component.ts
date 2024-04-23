import { Component, QueryList, ViewChildren } from '@angular/core';
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
  markerPositions: {
    location: google.maps.LatLngLiteral;
    packageData: Package;
    content: string;
  }[];
  @ViewChildren(MapInfoWindow) infoWindowsView:
    | QueryList<MapInfoWindow>
    | undefined;
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
    // this.wsService.listen('location_changed').subscribe((res) => {
    //   console.log(res);
    // });
  }

  ngOnInit(): void {
    this.getAndBroadCastLocation();
  }

  async getAndBroadCastLocation(): Promise<void> {
    while (true) {
      if (this.packageData?._id && this.deliveryData?._id) {
        await this.webTrackerService.getLocationAndBroadcast(
          this.deliveryData?._id
        );
      }
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }

  moveMap(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) this.center = event.latLng.toJSON();
  }
  move(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) this.display = event.latLng.toJSON();
  }
  openInfoWindow(marker: MapMarker, windowIndex: number) {
    /// stores the current index in forEach
    let curIdx = 0;
    this.infoWindowsView?.forEach((window: MapInfoWindow) => {
      if (windowIndex === curIdx) {
        window.open(marker);
        curIdx++;
      } else {
        curIdx++;
      }
    });
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
        const fromLocationInfo = {
          location: this.packageData
            ?.from_location as google.maps.LatLngLiteral,
          packageData: this.packageData as Package,
          content: 'Package Origin',
        };
        this.markerPositions.push(fromLocationInfo);
        const toLocationInfo = {
          location: this.packageData?.to_location as google.maps.LatLngLiteral,
          packageData: this.packageData as Package,
          content: 'Package Destination',
        };
        this.markerPositions.push(toLocationInfo);
        this.center = this.deliveryData?.location;
        const currentLocation = {
          location: this.deliveryData.location as google.maps.LatLngLiteral,
          packageData: this.packageData as Package,
          content: 'Package current location',
        };
        this.markerPositions.push(currentLocation);
        this.zoom = 15;
        if (this.packageData?._id) {
          console.log('Joining tunnel on: ', this.deliveryData?._id);

          this.wsService.joinTunnel(this.deliveryData?._id);
        }
      } else {
        this.center = this.packageData
          ?.from_location as google.maps.LatLngLiteral;
      }
    });

    this.trackerForm.reset();
  }

  async pickUp(): Promise<void> {
    if (!this.deliveryData) {
      window.alert('Delivery id is not defined');
      return;
    }
    this.webTrackerService
      .updateStatus(this.deliveryData._id, DeliveryStatus.picked_up)
      .subscribe((res) => {
        this.deliveryData = res.data;
      });
  }

  async inTransit(): Promise<void> {
    if (!this.deliveryData) {
      window.alert('Delivery id is not defined');
      return;
    }
    this.webTrackerService
      .updateStatus(this.deliveryData._id, DeliveryStatus.in_transit)
      .subscribe((res) => {
        this.deliveryData = res.data;
      });
  }

  async deliver(): Promise<void> {
    if (!this.deliveryData || !this.packageData) {
      window.alert('Delivery id is not defined');
      return;
    }
    this.webTrackerService
      .updateStatus(this.deliveryData._id, DeliveryStatus.delivered)
      .subscribe((res) => {
        this.deliveryData = res.data;
      });
  }

  async fail(): Promise<void> {
    if (!this.deliveryData || !this.packageData) {
      window.alert('Delivery id is not defined');
      return;
    }
    this.webTrackerService
      .updateStatus(this.deliveryData._id, DeliveryStatus.failed)
      .subscribe((res) => {
        this.deliveryData = res.data;
      });
  }
}
