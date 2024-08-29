import { Injectable } from '@angular/core';
import { BehaviorSubject, concatMap, map, Observable, of, tap } from 'rxjs';
import { Order } from '../model/order';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  orders$ = new BehaviorSubject<Order[]>([]);

  getOrders(): Observable<Order[]> {
    return of(JSON.parse(localStorage.getItem('orders') || '[]'));
  }

  getOrder(code: number): Observable<Order | undefined> {
    return this.getOrders().pipe(
      map((orders) => orders.find((order) => order.id === code))
    );
  }

  createOrder(order: Order) {
    return this.getOrders().pipe(
      tap((orders) => {
        const maxId =
          orders.length > 0
            ? Math.max(...orders.map((order) => order.id || 0))
            : 0;
        order.id = maxId + 1;
        localStorage.setItem('orders', JSON.stringify([...orders, order]));
      })
    );
  }

  updateOrder(updatedOrder: Order) {
    return this.getOrders().pipe(
      tap((orders) => {
        orders.forEach((order, idx) => {
          if (order.id === updatedOrder.id) {
            orders[idx] = updatedOrder;
          }
        });
        localStorage.setItem('orders', JSON.stringify([...orders]));
      })
    );
  }

  deleteOrder(deletedOrder: Order) {
    return this.getOrders().pipe(
      map((orders) => {
        const id = orders.findIndex((order) => order.id !== deletedOrder.id);
        orders.splice(id, 1);
        localStorage.setItem('orders', JSON.stringify([...orders]));
        return orders;
      })
    );
  }

  closeOrder(order: Order) {
    order.status = true;
    if (this.orders$.value.length === 0) {
      return this.createOrder(order).pipe(
        concatMap(() => this.updateOrder(order))
      );
    }
    return this.updateOrder(order);
  }

  clearOrdersData() {
    localStorage.clear();
  }
}
