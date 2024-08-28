import { Component, inject, Input } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { Product } from '../../model/order';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MaterialModule } from '../../../material/material.module';

@Component({
  selector: 'app-order-modal',
  standalone: true,
  imports: [ReactiveFormsModule, MaterialModule],
  templateUrl: './order-modal.component.html',
  styleUrl: './order-modal.component.scss',
})
export class OrderModalComponent {
  @Input() mode = 'creation';
  private formBuilder = inject(FormBuilder);

  // id?: number;
  // totalProducts?: number;
  // products: Product[];
  // total: number;
  // status: boolean;
  totalProducts: Product[] = [];

  orderForm = new FormGroup({
    description: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(50),
    ]),
    value: new FormControl(0, [Validators.required, Validators.min(0.01)]),
  });
}
