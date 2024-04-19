import { Component } from '@angular/core';
import { WebTrackerService } from './web-tracker.service';
import { FormBuilder } from '@angular/forms';

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

  onSubmit(): void {
    // Process checkout data here

    console.warn('Your package id has been submitted', this.trackerForm.value);
    this.trackerForm.reset();
  }
}
