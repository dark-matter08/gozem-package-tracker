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
import { Observable, of } from 'rxjs';

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
  directionLineOptions: google.maps.DirectionsRendererOptions;

  markerPositions: {
    location: google.maps.LatLngLiteral;
    packageData: Package;
    content: string;
  }[];
  @ViewChildren(MapInfoWindow) infoWindowsView:
    | QueryList<MapInfoWindow>
    | undefined;
  trackerForm = this.formBuilder.group({
    packageId: '',
  });
  packageStatus: string;
  directionsResults$:
    | Observable<google.maps.DirectionsResult | undefined>
    | undefined;

  directionsResultsOriginCenter$:
    | Observable<google.maps.DirectionsResult | undefined>
    | undefined;

  directionsResultsCenterDestination$:
    | Observable<google.maps.DirectionsResult | undefined>
    | undefined;

  constructor(
    private webTrackerService: WebTrackerService,
    private formBuilder: FormBuilder,
    private wsService: WebsocketService,
    private mapDirectionsService: MapDirectionsService
  ) {
    this.directionLineOptions = {
      polylineOptions: {
        strokeColor: '#008000',
      },
    };
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
    this.listenOnLocation();
    this.listenOnStatus();
  }

  ngOnInit(): void {}

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

  calculateRoute(
    start: google.maps.LatLngLiteral,
    end: google.maps.LatLngLiteral,
    type: 'origin-destination' | 'origin-center' | 'center-destination'
  ) {
    console.log(google.maps?.TravelMode);

    if (!this) {
      return;
    }

    const request: google.maps.DirectionsRequest = {
      destination: end,
      origin: start,
      travelMode: 'DRIVING' as google.maps.TravelMode,
    };
    console.log(request);

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
      console.log(response);
      this.directionsResults$ = of(response.result);
    });
  }

  pipeOriginToCenter(request: google.maps.DirectionsRequest) {
    this.mapDirectionsService.route(request).subscribe((response) => {
      console.log(response);
      this.directionsResultsOriginCenter$ = of(response.result);
    });
  }
  pipeCenterDestination(request: google.maps.DirectionsRequest) {
    this.mapDirectionsService.route(request).subscribe((response) => {
      console.log(response);
      this.directionsResultsCenterDestination$ = of(response.result);
    });
  }

  onMapReady(map: google.maps.Map) {
    this.map = map;
  }

  async listenOnLocation(): Promise<void> {
    this.wsService.listen(ListeningEvents.location_changed).subscribe((res) => {
      console.log('Receiving new location: ', res.location);
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
    });
  }

  async listenOnStatus(): Promise<void> {
    this.wsService.listen(ListeningEvents.status_changed).subscribe((res) => {
      console.log('Receiving new status: ', res.status?.toUpperCase());
      this.packageStatus = res.status as string;
    });
  }

  async onSubmit(): Promise<void> {
    console.info('Your package id has been submitted', this.trackerForm.value);
    const { packageId } = this.trackerForm.value;

    if (!packageId) {
      window.alert('Delivery id is required to track package!');
      return;
    }
    this.webTrackerService.trackDelivery(packageId).subscribe((res) => {
      console.log(res.data);
      this.packageData = res.data;

      this.deliveryData = res.data?.active_delivery_id as Delivery;
      const fromLocationInfo = {
        location: this.packageData?.from_location as google.maps.LatLngLiteral,
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

      if (this.deliveryData) {
        this.packageStatus = this.deliveryData.status;
        this.center = this.deliveryData.location;
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
        this.calculateRoute(
          this.packageData?.from_location as google.maps.LatLngLiteral,
          this.deliveryData.location as google.maps.LatLngLiteral,
          'origin-center'
        );

        this.calculateRoute(
          this.deliveryData.location as google.maps.LatLngLiteral,
          this.packageData?.to_location as google.maps.LatLngLiteral,
          'center-destination'
        );
      } else {
        this.center = this.packageData
          ?.from_location as google.maps.LatLngLiteral;
        this.calculateRoute(
          this.packageData?.from_location as google.maps.LatLngLiteral,
          this.packageData?.to_location as google.maps.LatLngLiteral,
          'origin-destination'
        );
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
