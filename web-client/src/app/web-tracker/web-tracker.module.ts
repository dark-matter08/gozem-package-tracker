import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebTrackerComponent } from './web-tracker.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GoogleMapsModule, MapDirectionsRenderer } from '@angular/google-maps';

@NgModule({
  declarations: [WebTrackerComponent],
  imports: [
    CommonModule,
    FormsModule, //added here too
    ReactiveFormsModule, //added here too
    GoogleMapsModule,
    MapDirectionsRenderer,
  ],
})
export class WebTrackerModule {}
