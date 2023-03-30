import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { NumberDirective } from 'src/app/shared';

import { Customer, OrderDetails, OrderService, Product } from '../order.service';
import { OrderProduct, Products } from './order-product.model';


@Component({
  standalone: true,
  selector: 'app-detail',
  imports: [CommonModule, HttpClientModule, MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCardModule,
    MatSnackBarModule,
    MatTableModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NumberDirective
  ],

  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
  providers: [OrderService]
})

export class DetailComponent implements OnInit, OnDestroy {
  public displayedColumns: string[] = ['product', 'quantity', 'price', 'total price', 'actions'];
  private orderId!: number;
  public orderDetails!: Array<OrderDetails>;
  public dataSource!: MatTableDataSource<any>;
  public products!: Array<Product>;
  public customers!: Array<Customer>;
  public form!: FormGroup;
  private subScription!: Subscription;
  constructor(private route: ActivatedRoute, private service: OrderService, private fb: FormBuilder,
    private snackBar: MatSnackBar) {

  }

  public ngOnInit(): void {
    this.route.paramMap.subscribe((params: any) => {
      this.orderId = parseInt(params.get('id')!);
      this.getOrderDetails();
    });
  }

  private initializeForm(): void {

    this.form = this.fb.group({
      orderNumber: [this.orderDetails[0]?.order.orderNumber],
      customerId: [this.orderDetails[0]?.order.customerId],
      orderProducts: this.fb.array([]),
      price: [],
      quantity: [],
      productId: [],
      orderId: this.orderId
    });
  }

  public removeProduct(index: number): void {
    if (confirm('Are you sure want to delete ?')) {
      const array = this.form.get('orderProducts') as FormArray;
      array.removeAt(index);
      this.dataSource = new MatTableDataSource((array).controls);
      this.snackBar.open("product deleted successfully !", "", {
        duration: 2000,
      });
    }
  }
  private getOrderDetails(): void {
    this.service.getOrderDetailById(this.orderId).pipe(take(1)).subscribe(res => {
      this.orderDetails = res;
      this.getProducts();
      this.getCustomers();
      this.initializeForm();
      this.add(res);
    })
  }


  public add(details: Array<OrderDetails> | null): void {
    const products = this.form.get('orderProducts') as FormArray;
    if (details) {
      details.forEach(element => {
        products.push(this.newProduct(element));
      });
    } else {
      const existingProducts = products.value as Array<Products>;
      if (existingProducts.find(x => x.productId === this.form.get('productId')?.value)) {
        this.snackBar.open("Product already exists", "", {
          duration: 2000,
        });
      }
      else {
        products.push(this.newProduct(null));
        this.snackBar.open("product added successfully !", "", {
          duration: 2000,
        });
      }

    }
    this.dataSource = new MatTableDataSource((products).controls);
    this.clear();
  }

  private newProduct(detail: OrderDetails | null): FormGroup {
    return this.fb.group({
      quantity: [detail?.quantity || this.form.get('quantity')?.value],
      productId: [detail?.productId || this.form.get('productId')?.value],
      price: [detail?.product.price || this.form.get('price')?.value],
      productName: [detail?.product.name || this.products.find(x => x.id === parseInt(this.form.get('productId')?.value, 0))?.name]
    });

  }

  private clear(): void {
    this.form.get('quantity')?.setValue(null);
    this.form.get('productId')?.setValue(null);
    this.form.get('price')?.setValue(null);
  }


  private getProducts(): void {
    this.service.getProducts().pipe(take(1)).subscribe(res => {
      this.products = res;
    })
  }

  private getCustomers(): void {
    this.service.getCustomers().pipe(take(1)).subscribe(res => {
      this.customers = res;
    })
  }

  public onChangeQuantity(event: any) {
    const quantity = parseInt(event.target.value || 0);
    const price = this.products.find(x => x.id === parseInt(this.form.get('productId')?.value, 0))?.price;
    this.form.get('price')?.setValue(quantity * price!);
  }

  public saveOrderDetails(): void {
    if (this.form.valid) {
      const data = this.form.value as OrderProduct;
      this.subScription = this.service.saveOrderProducts(data).subscribe(res => {
        this.snackBar.open("data saved successfully !", "", {
          duration: 2000,
        });
      });
    }
  }

  public onProductSelectionChange(): void {
    this.form.get('price')?.setValue(null);
    this.form.get('quantity')?.setValue(null);
  }

  public ngOnDestroy() {
    if (this.subScription) {
      this.subScription.unsubscribe();
    }
  }

}
