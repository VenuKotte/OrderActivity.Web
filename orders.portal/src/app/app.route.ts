import { Routes } from '@angular/router';
import { OrderComponent } from './order/order.component';
import { DetailComponent } from './order/detail/detail.component';

export const App_Route: Routes = [] = [
  { path: '', component: OrderComponent },
  { path: 'detail/:id', component: DetailComponent },
];
