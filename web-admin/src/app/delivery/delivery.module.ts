import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeliveryComponent } from './delivery.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [DeliveryComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class DeliveryModule {}
