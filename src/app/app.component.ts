import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MaterialModule } from './material/material.module';
import { OrderTableComponent } from './shared/components/order-table/order-table.component';
import { MatDialog } from '@angular/material/dialog';
import { OrderModalComponent } from './shared/components/order-modal/order-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MaterialModule, OrderTableComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  dialog = inject(MatDialog);

  ngOnInit(): void {
    this.openOrderModal();
  }

  openOrderModal() {
    this.dialog.open(OrderModalComponent, {
      height: '400px',
      minWidth: '900px',
    });
  }
}
