import {
  Component,
  computed,
  inject,
  Input,
  OnInit,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Order, Product } from '../../model/order';
import { MaterialModule } from '../../../material/material.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './order-modal.component.html',
  styleUrl: './order-modal.component.scss',
})
export class OrderModalComponent implements OnInit {
  @Input() mode = 'creation';
  @Input() order: Order = {
    id: -1,
    products: [],
    status: false,
    totalProducts: 0,
    total: 0,
  };
  products: WritableSignal<Product[]> = signal([]);
  total: Signal<number> = signal(0);

  productForm = new FormGroup({
    description: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(50),
    ]),
    price: new FormControl(0, [Validators.required, Validators.min(0.01)]),
  });

  ngOnInit(): void {
    this.total = computed(() =>
      this.products().reduce((acc, product) => acc + product.price, 0)
    );
  }

  addProduct() {
    const description = this.productForm.get('description')?.value || '';
    const price = this.productForm.get('price')?.value || 0;
    this.products.update((products) => [...products, { description, price }]);

    // Reseta o formulário
    this.productForm.reset({ description: '', price: 0 });
  }
}
