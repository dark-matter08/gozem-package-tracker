import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PackageComponent } from './package.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [PackageComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class PackageModule {}
