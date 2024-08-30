import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderModalComponent } from './order-modal.component';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { MaterialModule } from '../../../material/material.module';
import { BehaviorSubject, of } from 'rxjs';
import { Dialog } from '@angular/cdk/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { deepClone } from '../../utils/utils';
import { orderMock, productsMock } from '../../mocks/order';
import { OrdersService } from '../../services/orders.service';
import { Order } from '../../model/order';

describe('OrderModalComponent', () => {
  let component: OrderModalComponent;
  let fixture: ComponentFixture<OrderModalComponent>;
  let dialogMock: jasmine.SpyObj<MatDialog> = jasmine.createSpyObj({
    open: { afterClosed: () => of(true) },
  });
  let dialogRefMock: jasmine.SpyObj<MatDialogRef<Dialog>> =
    jasmine.createSpyObj({
      afterClosed: of(null),
      close: of(null),
    });
  const order = deepClone(orderMock);
  let ordersServiceMock: jasmine.SpyObj<OrdersService> = jasmine.createSpyObj(
    {
      getOrders: of([]),
      getOrder: of(order),
      clearOrdersData: of(null),
      createOrder: of(null),
      updateOrder: of(null),
      closeOrder: of(null),
    },
    { orders$: new BehaviorSubject<Order[]>([]) }
  );

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderModalComponent, MaterialModule, BrowserAnimationsModule],
      providers: [
        { provide: MatDialog, useValue: dialogMock },
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: { mode: 'create', code: 1 } },
        { provide: OrdersService, useValue: ordersServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle an open order', () => {
    order.status = false;
    ordersServiceMock.getOrder.and.returnValue(of(order));
    component.data.mode = 'edit';
    component.ngOnInit();
    expect(component.order).toEqual(order);
    expect(component.title).toEqual('Editar Pedido');
    expect(component.content).toEqual('Adicione produtos ao pedido:');
  });

  it('should handle a finished order', () => {
    order.status = true;
    ordersServiceMock.getOrder.and.returnValue(of(order));
    component.ngOnInit();
    expect(component.order).toEqual(order);
    expect(component.title).toEqual('Consulta pedido finalizado');
    expect(component.content).toEqual(
      'Listagem de produtos do pedido finalizado:'
    );
  });

  it('should add product', () => {
    component.products.set([]);
    component.productForm.controls.description.setValue('description');
    component.productForm.controls.price.setValue(55);
    component.addProduct();
    expect(component.products().length).toEqual(1);
    expect(component.products()).toEqual([
      { description: 'description', price: 55 },
    ]);
    component.products.set([]);
    component.productForm.controls.description.setValue(null);
    component.productForm.controls.price.setValue(null);
    component.addProduct();
    expect(component.products()).toEqual([{ description: '', price: 0 }]);
  });

  it('should delete product', () => {
    component.products.set([{ description: 'description', price: 55 }]);
    expect(component.products().length).toEqual(1);
    component.deleteProduct(0);
    expect(component.products().length).toEqual(0);
  });

  it('should handle order, case mode create', () => {
    component.handleOrder();
    expect(ordersServiceMock.createOrder).toHaveBeenCalledWith(component.order);
  });
  it('should handle order, case mode edit', () => {
    component.data.mode = 'edit';
    component.handleOrder();
    expect(ordersServiceMock.updateOrder).toHaveBeenCalledWith(component.order);
  });

  it('should close order', () => {
    component.closeOrder();
    expect(ordersServiceMock.closeOrder).toHaveBeenCalledWith(component.order);
  });

  it('should populate order', () => {
    const order: Order = {
      id: 1,
      products: productsMock,
      status: false,
      totalProducts: 1,
      total: 10,
    };
    component.products.set(productsMock);
    component['populateOrder']();
    expect(component.order).toEqual(order);
  });
  it('should reset form', () => {
    component.productForm.controls.description.setValue('description');
    component.productForm.controls.price.setValue(55);
    component['resetForm']();
    expect(component.productForm.controls.price.value).toBeNull();
    expect(component.productForm.controls.description.value).toBeNull();
  });
});
