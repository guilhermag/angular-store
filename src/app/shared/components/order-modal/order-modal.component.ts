import {
  Component,
  computed,
  Inject,
  inject,
  OnDestroy,
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
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OrdersService } from '../../services/orders.service';
import { Subscription } from 'rxjs';

interface DialogData {
  mode: string;
  code: number;
}
@Component({
  selector: 'app-order-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './order-modal.component.html',
  styleUrl: './order-modal.component.scss',
})
export class OrderModalComponent implements OnInit, OnDestroy {
  title = '';
  content = 'Adicione produtos ao pedido:';
  ordersService = inject(OrdersService);
  private subscription: Subscription = new Subscription();
  readonly dialogRef = inject(MatDialogRef<OrderModalComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  order: Order = {
    products: [],
    status: false,
    totalProducts: 0,
    total: 0,
  };
  products: WritableSignal<Product[]> = signal([]);
  total: Signal<number> = signal(0);
  showTable = false;

  productForm = new FormGroup({
    description: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(50),
    ]),
    price: new FormControl(null, [
      Validators.required,
      Validators.min(0.01),
      Validators.pattern('^[0-9]*$'),
    ]),
  });

  private populateOrder() {
    this.order.products = this.products();
    this.order.status = false;
    this.order.totalProducts = this.products().length;
    this.order.total = this.total();
  }

  private resetForm() {
    this.productForm.reset();
    this.productForm.controls.description.setErrors(null);
    this.productForm.controls.price.setErrors(null);
  }

  ngOnInit(): void {
    this.title = `${this.data.mode == 'create' ? 'Criar' : 'Editar'} Pedido`;
    this.total = computed(() =>
      this.products().reduce((acc, product) => acc + Number(product.price), 0)
    );
    const orderSub = this.ordersService
      .getOrder(this.data.code)
      .subscribe((order) => {
        if (order) {
          this.order = order;
          this.products.set(order.products);
          if (order.status) {
            this.content = 'Listagem de produtos do pedido finalizado:';
            this.title = 'Consulta pedido finalizado';
          }
        }
      });
    this.subscription.add(orderSub);
  }

  addProduct() {
    const description = this.productForm.get('description')?.value || '';
    const price = this.productForm.get('price')?.value || 0;
    this.products.update((products) => [...products, { description, price }]);
    this.resetForm();
  }

  deleteProduct(idx: number) {
    this.products.update((products) => products.filter((_, i) => i !== idx));
  }

  handleOrder() {
    this.populateOrder();
    if (this.data.mode === 'create') {
      this.subscription.add(
        this.ordersService.createOrder(this.order).subscribe()
      );
    } else {
      this.subscription.add(
        this.ordersService.updateOrder(this.order).subscribe()
      );
    }
    this.dialogRef.close();
  }

  closeOrder() {
    this.populateOrder();
    this.subscription.add(
      this.ordersService.closeOrder(this.order).subscribe()
    );
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
