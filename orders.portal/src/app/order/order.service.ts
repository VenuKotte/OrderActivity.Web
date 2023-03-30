import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { OrderProduct } from './detail/order-product.model';
import { Order } from './order.component';

export interface OrderDetails {
  id: number;
  product: Product;
  order: Order;
  orderId: number;
  productId: number,
  quantity: number;
  totalPrice: number;

}

export interface Product {
  id: number;
  name: string;
  price: number

}
export interface Customer {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})


export class OrderService {

  baseUrl: string = 'http://localhost:5268/api/order/';
  constructor(private http: HttpClient) { }

  public getOrders(): Observable<Array<Order>> {
    return this.http.get<Array<Order>>(this.baseUrl + 'orders').pipe();
  }

  public getOrderDetailById(orderId: number): Observable<Array<OrderDetails>> {
    return this.http.get<Array<OrderDetails>>(this.baseUrl + 'details?id=' + orderId).pipe();
  }
  public updateOrder(data: any): Observable<Order> {
    return this.http.post<any>("", data).pipe();
  }

  public getProducts(): Observable<Array<Product>> {
    return this.http.get<Array<Product>>(this.baseUrl + 'products').pipe();
  }

  public getCustomers(): Observable<Array<Customer>> {
    return this.http.get<Array<Customer>>(this.baseUrl + 'customers').pipe();
  }

  public saveOrderProducts(data: OrderProduct): Observable<boolean> {
    return this.http.post<boolean>(this.baseUrl + 'save/order/products', data).pipe();
  }
}
