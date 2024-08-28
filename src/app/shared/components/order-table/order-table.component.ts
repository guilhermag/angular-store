import { Component, inject, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OrdersService } from '../../services/orders.service';
import { Observable, of } from 'rxjs';
import { Order } from '../../model/order';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MaterialModule } from '../../../material/material.module';

interface TableData {
  title: string;
  id: string;
}

@Component({
  selector: 'order-table',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './order-table.component.html',
  styleUrl: './order-table.component.scss',
})
export class OrderTableComponent implements OnInit {
  dialog = inject(MatDialog);
  ordersService = inject(OrdersService);
  @Input() orders$: Observable<Order[]> = of([
    { id: 1, totalProducts: 0, products: [], total: 0, status: false },
  ]);
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
    //TODO
  }

  delete(order: Order) {
    //TODO
  }
}
