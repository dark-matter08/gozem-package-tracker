import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DataService } from '../data.service';
import { Router } from '@angular/router';
import { Package } from '../../types/package.type';

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrl: './delivery.component.scss',
})
export class DeliveryComponent {
  createDeliveryForm = this.formBuilder.group({
    packageId: '',
  });
  openPackages: Package[];
  constructor(
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private router: Router
  ) {
    this.openPackages = [];
  }

  ngOnInit(): void {
    this.loadOpenPackages();
  }

  async loadOpenPackages() {
    this.dataService.getOpenPackages().subscribe((res) => {
      this.openPackages = res.data as Package[];

      console.log('Open Packages: ', res.data);
    });
  }

  async onSubmit(): Promise<void> {
    console.info('submitting form data as: ', this.createDeliveryForm.value);
    const { packageId } = this.createDeliveryForm.value;

    if (!packageId) {
      window.alert('Select a valid package to create a delivery');
      return;
    }

    this.dataService
      .createDelivery({ package_id: packageId })
      .subscribe((res) => {
        if (!res.status?.toString().startsWith('2')) {
          window.alert(
            'An error occurred trying to create delivery: ' + res.message
          );
        }

        this.router.navigateByUrl('/');
      });
  }
}
