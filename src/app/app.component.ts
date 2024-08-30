import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MaterialModule } from './material/material.module';
import { OrderTableComponent } from './shared/components/order-table/order-table.component';
import { MatDialog } from '@angular/material/dialog';
import { OrderModalComponent } from './shared/components/order-modal/order-modal.component';
import { OrdersService } from './shared/services/orders.service';
import { concatMap } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MaterialModule, OrderTableComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  dialog = inject(MatDialog);
  ordersService = inject(OrdersService);

  ngOnInit(): void {
    this.ordersService.clearOrdersData();
  }

  openOrderModal() {
    const dialogRef = this.dialog.open(OrderModalComponent, {
      data: { mode: 'create' },
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
}
