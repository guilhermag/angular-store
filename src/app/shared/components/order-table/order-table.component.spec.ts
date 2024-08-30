import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderTableComponent } from './order-table.component';
import { MaterialModule } from '../../../material/material.module';
import { orderMock } from '../../mocks/order';
import { BehaviorSubject, of } from 'rxjs';
import { deepClone } from '../../utils/utils';
import { OrdersService } from '../../services/orders.service';
import { Order } from '../../model/order';
import { OrderModalComponent } from '../order-modal/order-modal.component';

describe('OrderTableComponent', () => {
  let component: OrderTableComponent;
  let fixture: ComponentFixture<OrderTableComponent>;
  const order = deepClone(orderMock);
  let ordersServiceMock: jasmine.SpyObj<OrdersService> = jasmine.createSpyObj(
    {
      getOrders: of([]),
      deleteOrder: of(order),
    },
    { orders$: new BehaviorSubject<Order[]>([]) }
  );
  const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
  dialogRefSpy.afterClosed.and.returnValue(of(true));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderTableComponent, MaterialModule],
      providers: [{ provide: OrdersService, useValue: ordersServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should edit', () => {
    spyOn(component.dialog, 'open').and.returnValue(dialogRefSpy);
    order.id = 1;
    component.edit(order);
    expect(component.dialog.open).toHaveBeenCalledWith(OrderModalComponent, {
      data: { mode: 'edit', code: order.id },
      height: '500px',
      minWidth: '900px',
    });
    expect(ordersServiceMock.getOrders).toHaveBeenCalled();
  });

  it('should delete', () => {
    spyOn(component.dialog, 'open').and.returnValue(dialogRefSpy);
    dialogRefSpy.afterClosed.and.returnValue(of(true));
    component.delete(order);
    expect(ordersServiceMock.deleteOrder).toHaveBeenCalledWith(order);
    dialogRefSpy.afterClosed.and.returnValue(of(false));
    component.delete(order);
  });
});
