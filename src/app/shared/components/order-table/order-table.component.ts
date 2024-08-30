import { Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OrdersService } from '../../services/orders.service';
import { concatMap, of } from 'rxjs';
import { Order } from '../../model/order';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material/material.module';
import { SuffixPipe } from '../../pipes/suffix.pipe';
import { OrderModalComponent } from '../order-modal/order-modal.component';
import { ConfirmationModal } from '../confirmation-modal/confirmation-modal.component';

interface TableData {
  title: string;
  id: string;
}

@Component({
  selector: 'order-table',
  standalone: true,
  imports: [CommonModule, MaterialModule, SuffixPipe],
  templateUrl: './order-table.component.html',
  styleUrl: './order-table.component.scss',
})
export class OrderTableComponent implements OnInit {
  dialog = inject(MatDialog);
  ordersService = inject(OrdersService);
  orders$ = this.ordersService.orders$;
  ordersData: Order[] = [];

  columns: TableData[] = [
    { title: '#', id: 'id' },
    { title: 'Num. Produtos', id: 'totalProducts' },
    { title: 'Total', id: 'total' },
    { title: 'Status', id: 'status' },
    { title: 'Ação', id: 'action' },
  ];

  tableHeaders = this.columns.map((column) => column.id);

  ngOnInit(): void {
    this.orders$.subscribe((res) => {
      this.ordersData = res;
    });
  }

  edit(order: Order) {
    const dialogRef = this.dialog.open(OrderModalComponent, {
      data: { mode: 'edit', code: order.id },
      height: '500px',
      minWidth: '900px',
    });
    dialogRef
      .afterClosed()
      .pipe(concatMap(() => this.ordersService.getOrders()))
      .subscribe((orders) => {
        this.ordersService.orders$.next(orders);
      });
  }

  delete(order: Order) {
    const dialogRef = this.dialog.open(ConfirmationModal);

    dialogRef
      .afterClosed()
      .pipe(
        concatMap((result) => {
          if (result) {
            return this.ordersService.deleteOrder(order);
          } else {
            return of(null);
          }
        })
      )
      .subscribe((orders) => {
        if (orders) this.ordersService.orders$.next(orders);
      });
  }
}
