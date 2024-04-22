import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DataService } from '../data.service';
import { Package } from '../../types/package.type';
import { Router } from '@angular/router';

@Component({
  selector: 'app-package',
  templateUrl: './package.component.html',
  styleUrl: './package.component.scss',
})
export class PackageComponent {
  createPackageForm = this.formBuilder.group({
    description: '',
    weight: 0,
    width: 0,
    height: 0,
    depth: 0,
    from: '',
    from_location: '',
    from_lat: 0,
    from_lng: 0,
    to: '',
    to_location: '',
    to_lat: 0,
    to_lng: 0,
  });

  constructor(
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private router: Router
  ) {}

  async onSubmit(): Promise<void> {
    console.info('submitting form data as: ', this.createPackageForm.value);
    const {
      description,
      weight,
      width,
      height,
      depth,
      from,
      from_location,
      from_lat,
      from_lng,
      to,
      to_location,
      to_lat,
      to_lng,
    } = this.createPackageForm.value;

    if (
      !description ||
      !weight ||
      !width ||
      !height ||
      !depth ||
      !from ||
      !to ||
      !from_location ||
      !to_location ||
      !from_lat ||
      !to_lat ||
      !from_lng ||
      !to_lng
    ) {
      window.alert('Please ensure to fill in all fields before proceeding');
      return;
    }

    const packageData: Partial<Package> = {
      description,
      weight,
      width,
      height,
      depth,
      from_name: from,
      to_name: to,
      from_address: from_location,
      to_address: to_location,
      from_location: {
        lat: from_lat,
        lng: from_lng,
      },
      to_location: {
        lat: to_lat,
        lng: to_lng,
      },
    };

    this.dataService.createPackage(packageData).subscribe((res) => {
      if (!res?.status?.toString().startsWith('2')) {
        window.alert(
          'An error occurred trying to create package: ' + res?.message
        );
      }

      this.router.navigateByUrl('/');
    });
  }
}
