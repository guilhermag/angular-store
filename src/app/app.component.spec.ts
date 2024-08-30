import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { BehaviorSubject, of } from 'rxjs';
import { OrderModalComponent } from './shared/components/order-modal/order-modal.component';
import { OrdersService } from './shared/services/orders.service';
import { Order } from './shared/model/order';
import { deepClone } from './shared/utils/utils';
import { orderMock } from './shared/mocks/order';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let ordersServiceMock: jasmine.SpyObj<OrdersService> = jasmine.createSpyObj(
    {
      getOrders: of([]),
      clearOrdersData: of(null),
    },
    { orders$: new BehaviorSubject<Order[]>([]) }
  );
  const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
  dialogRefSpy.afterClosed.and.returnValue(of(true));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [{ provide: OrdersService, useValue: ordersServiceMock }],
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app and clear orders data', () => {
    expect(component).toBeTruthy();
    expect(ordersServiceMock.clearOrdersData).toHaveBeenCalled();
  });

  it('should open order modal', () => {
    spyOn(component.dialog, 'open').and.returnValue(dialogRefSpy);
    component.openOrderModal();
    expect(component.dialog.open).toHaveBeenCalledWith(OrderModalComponent, {
      data: { mode: 'create' },
      height: '500px',
      minWidth: '900px',
    });
  });

  it('should update the array of orders after closing the modal', () => {
    spyOn(component.dialog, 'open').and.returnValue(dialogRefSpy);
    const ordersMock = [deepClone(orderMock)];
    ordersServiceMock.getOrders.and.returnValue(of(ordersMock));
    component.openOrderModal();
    expect(ordersServiceMock.orders$.value).toEqual(ordersMock);
  });
});
