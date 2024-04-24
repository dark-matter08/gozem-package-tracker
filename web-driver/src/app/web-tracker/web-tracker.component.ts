import { Component, QueryList, ViewChildren } from '@angular/core';
import { WebTrackerService } from './web-tracker.service';
import { FormBuilder } from '@angular/forms';
import { Package } from '../../types/package.type';
import { Delivery } from '../../types/delivery.type';
import {
  MapDirectionsService,
  MapInfoWindow,
  MapMarker,
} from '@angular/google-maps';
import { WebsocketService } from '../websocket.service';
import { DeliveryStatus, ListeningEvents } from '../../types/enums';

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
  map: google.maps.Map | undefined;

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
  directionOptionsOriginDestination:
    | google.maps.DirectionsRendererOptions
    | undefined;
  directionOptionsOriginCenter:
    | google.maps.DirectionsRendererOptions
    | undefined;
  directionOptionsCenterDestination:
    | google.maps.DirectionsRendererOptions
    | undefined;

  constructor(
    private webTrackerService: WebTrackerService,
    private formBuilder: FormBuilder,
    private wsService: WebsocketService,
    private mapDirectionsService: MapDirectionsService
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
    this.listenOnLocation();
    this.listenOnStatus();
  }

  async listenOnLocation(): Promise<void> {
    this.wsService.listen(ListeningEvents.location_changed).subscribe((res) => {
      console.log('Driver Receiving new location: ', res.location);
      if (this.markerPositions.length >= 3) {
        this.markerPositions.pop();
      }
      const newLocationInfo = {
        location: res.location as google.maps.LatLngLiteral,
        packageData: this.packageData as Package,
        content: 'Package current location',
      };
      this.markerPositions.push(newLocationInfo);
      this.center = res.location as google.maps.LatLngLiteral;
      this.zoom = 10;
      this.calculateRoute(
        this.packageData?.from_location as google.maps.LatLngLiteral,
        res.location as google.maps.LatLngLiteral,
        'origin-center'
      );

      this.calculateRoute(
        res.location as google.maps.LatLngLiteral,
        this.packageData?.to_location as google.maps.LatLngLiteral,
        'center-destination'
      );
    });
  }

  async listenOnStatus(): Promise<void> {
    this.wsService.listen(ListeningEvents.status_changed).subscribe((res) => {
      console.log('Driver Receiving new status: ', res.status?.toUpperCase());

      this.deliveryData = res.delivery;
    });
  }

  ngOnInit(): void {
    this.getAndBroadCastLocation();
  }

  onMapReady(map: google.maps.Map) {
    this.map = map;
  }

  async getAndBroadCastLocation(): Promise<void> {
    while (true) {
      if (this.packageData?._id && this.deliveryData?._id) {
        await this.webTrackerService.getLocationAndBroadcast(
          this.deliveryData?._id
        );
      }
      await new Promise((resolve) => setTimeout(resolve, 20000));
    }
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
        this.zoom = 10;
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
    this.webTrackerService.broadCastStatusUpdate(
      this.deliveryData._id,
      DeliveryStatus.picked_up
    );
  }

  async inTransit(): Promise<void> {
    if (!this.deliveryData) {
      window.alert('Delivery id is not defined');
      return;
    }
    this.webTrackerService.broadCastStatusUpdate(
      this.deliveryData._id,
      DeliveryStatus.in_transit
    );
  }

  async deliver(): Promise<void> {
    if (!this.deliveryData || !this.packageData) {
      window.alert('Delivery id is not defined');
      return;
    }
    this.webTrackerService.broadCastStatusUpdate(
      this.deliveryData._id,
      DeliveryStatus.delivered
    );
  }

  async fail(): Promise<void> {
    if (!this.deliveryData || !this.packageData) {
      window.alert('Delivery id is not defined');
      return;
    }
    this.webTrackerService.broadCastStatusUpdate(
      this.deliveryData._id,
      DeliveryStatus.failed
    );
  }

  calculateRoute(
    start: google.maps.LatLngLiteral,
    end: google.maps.LatLngLiteral,
    type: 'origin-destination' | 'origin-center' | 'center-destination'
  ) {
    if (!this) {
      return;
    }

    const request: google.maps.DirectionsRequest = {
      destination: end,
      origin: start,
      travelMode: 'DRIVING' as google.maps.TravelMode,
    };

    if (type === 'origin-destination') {
      this.pipeOriginToDestination(request);
    }

    if (type === 'origin-center') {
      this.pipeOriginToCenter(request);
    }

    if (type === 'center-destination') {
      this.pipeCenterDestination(request);
    }
  }

  pipeOriginToDestination(request: google.maps.DirectionsRequest) {
    this.mapDirectionsService.route(request).subscribe((response) => {
      this.directionOptionsOriginDestination = {
        directions: response.result,
        polylineOptions: {
          strokeColor: '#008000',
        },
        suppressInfoWindows: true,
        suppressMarkers: true,
      };
    });
  }

  pipeOriginToCenter(request: google.maps.DirectionsRequest) {
    this.mapDirectionsService.route(request).subscribe((response) => {
      this.directionOptionsOriginCenter = {
        directions: response.result,
        polylineOptions: {
          strokeColor: '#FFA500',
        },
        suppressInfoWindows: true,
        suppressMarkers: true,
      };
    });
  }

  pipeCenterDestination(request: google.maps.DirectionsRequest) {
    this.mapDirectionsService.route(request).subscribe((response) => {
      this.directionOptionsCenterDestination = {
        directions: response.result,
        polylineOptions: {
          strokeColor: '#0000FF',
          strokeWeight: 5,
          strokeOpacity: 0.1,
        },
        suppressInfoWindows: true,
        suppressMarkers: true,
      };
    });
  }
}
