import { Component } from '@angular/core';
import { WebTrackerService } from './web-tracker.service';
import { FormBuilder } from '@angular/forms';
// import { Package } from '../../types/package.type';

@Component({
  selector: 'app-package-tracker',
  templateUrl: './web-tracker.component.html',
  styleUrls: ['./web-tracker.component.scss'],
})
export class WebTrackerComponent {
  constructor(
    private webTrackerService: WebTrackerService,
    private formBuilder: FormBuilder
  ) {}

  trackerForm = this.formBuilder.group({
    packageId: '',
  });

  packageData: any;
  deliveryData: any;

  async onSubmit(): Promise<void> {
    // Process checkout data here

    console.warn('Your package id has been submitted', this.trackerForm.value);
    const { packageId } = this.trackerForm.value;

    if (!packageId) {
      window.alert('Delivery id is required to track package!');
      return;
    }
    this.webTrackerService.trackDelivery(packageId).subscribe((res) => {
      console.log(res.data);
      this.packageData = res.data;
      this.deliveryData = res.data?.active_delivery_id;
    });

    this.trackerForm.reset();
  }
}
