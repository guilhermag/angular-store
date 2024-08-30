import { TestBed } from '@angular/core/testing';

import { OrdersService } from './orders.service';
import { forkJoin, of } from 'rxjs';
import { orderMock, productsMock } from '../mocks/order';
import { Order } from '../model/order';

describe('OrdersService', () => {
  let service: OrdersService;
  let storage = {} as any;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrdersService);

    const mockLocalStorage = {
      getItem: (key: string): string => {
        return key in storage ? storage[key] : null;
      },
      setItem: (key: string, value: string) => {
        storage[key] = `${value}`;
      },
      clear: () => {
        storage = {};
      },
    };
    storage = {};
    spyOn(localStorage, 'getItem').and.callFake(mockLocalStorage.getItem);
    spyOn(localStorage, 'setItem').and.callFake(mockLocalStorage.setItem);
    spyOn(localStorage, 'clear').and.callFake(mockLocalStorage.clear);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should all orders, empty array', (done) => {
    service.getOrders().subscribe((res) => {
      const orders = res;
      expect(orders).toEqual([]);
      done();
    });
  });

  it('should all orders', (done) => {
    localStorage.setItem('orders', JSON.stringify([orderMock]));
    service.getOrders().subscribe((res) => {
      const orders = res;
      expect(orders).toEqual([orderMock]);
      done();
    });
  });

  it('should get order, case order exists', (done) => {
    localStorage.setItem('orders', JSON.stringify([orderMock]));
    service.getOrder(1).subscribe((res) => {
      expect(res).toEqual(orderMock);
      done();
    });
  });

  it('should get order, case order does not exists', (done) => {
    service.getOrder(1).subscribe((res) => {
      expect(res).toBeUndefined();
      done();
    });
  });

  it('should create order', (done) => {
    const order: Order = {
      products: [],
      status: false,
      total: 0,
      totalProducts: 0,
    };
    service.createOrder(order).subscribe();
    service.createOrder(order).subscribe();
    service.getOrders().subscribe((orders) => {
      order.id = 1;
      expect(orders.length).toEqual(2);
      expect(orders[0]).toEqual(order);
      done();
    });
  });
  it('should update order', (done) => {
    const order: Order = {
      products: [],
      status: false,
      total: 0,
      totalProducts: 0,
    };
    service.createOrder(order).subscribe();
    order.products = productsMock;
    order.id = 1;
    service.updateOrder(order).subscribe();
    service.getOrder(1).subscribe((res) => {
      expect(res).toEqual(order);
      done();
    });
  });
  it('should delete order', (done) => {
    const order: Order = {
      products: [],
      status: false,
      total: 0,
      totalProducts: 0,
    };
    service.createOrder(order).subscribe();
    order.id = 1;
    service.deleteOrder(order).subscribe();
    service.getOrders().subscribe((res) => {
      expect(res).toEqual([]);
      done();
    });
  });

  it('should close order, orders$ is empty', (done) => {
    const order: Order = {
      products: productsMock,
      status: false,
      total: 0,
      totalProducts: 0,
    };

    service.closeOrder(order).subscribe();
    service.getOrder(1).subscribe((res) => {
      expect(res?.status).toBeTrue();
      done();
    });
  });

  it('should close order', (done) => {
    const order: Order = {
      products: productsMock,
      status: false,
      total: 0,
      totalProducts: 0,
    };
    service.createOrder(order).subscribe();
    order.id = 1;
    service.orders$.next([order]);
    service.closeOrder(order).subscribe();
    service.getOrder(1).subscribe((res) => {
      expect(res?.status).toBeTrue();
      done();
    });
  });

  it('should clear orders data', (done) => {
    const order: Order = {
      products: productsMock,
      status: false,
      total: 0,
      totalProducts: 0,
    };
    service.createOrder(order).subscribe();
    service.getOrders().subscribe((res) => {
      expect(res.length).toEqual(1);
      service.clearOrdersData();
      expect(storage).toEqual({});
      done();
    });
  });
});
