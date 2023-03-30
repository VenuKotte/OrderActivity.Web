import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

import { Customer, OrderService } from './order.service';

export interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  totalAmount: number;
  customerId: number;
  customer: Customer;
}

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCardModule,
    MatSnackBarModule,
    MatTableModule,
    HttpClientModule
  ],
  providers: [OrderService],
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit, OnDestroy {
  public orders: Order[] = [];
  public displayedColumns: string[] = ['orderNumber', 'customer', 'orderTotal', 'actions'];
  private subScription!: Subscription;
  constructor(private orderService: OrderService) { }

  public ngOnInit(): void {
    this.getOrders();
  }

  private getOrders(): void {
    this.subScription = this.orderService.getOrders().subscribe(res => {
      this.orders = res;
    })
  }
  public ngOnDestroy(): void {
    if (this.subScription) {
      this.subScription.unsubscribe();
    }
  }
}
