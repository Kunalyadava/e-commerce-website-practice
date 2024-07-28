import { Component, OnInit } from '@angular/core';
import { NavComponent } from '../nav/nav.component';
import { CommonserviceService } from '../commonservice.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [NavComponent, CommonModule, FormsModule, RouterModule, MatNativeDateModule, MatInputModule, MatSelectModule, MatDatepickerModule],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.scss'
})
export class CartPageComponent implements OnInit {
  quantity: number = 1;
  userId: string = ""
  userData: any
  cartData: any[] = []
  totalPrice: number = 0;
  constructor(private http: CommonserviceService, private router: Router) {
    this.userId = localStorage.getItem('userId') || '';
  }
  ngOnInit(): void {
    this.getdata()
  }

  getdata() {
    this.http.getUserData(this.userId).subscribe({
      next: (res: any) => {
        this.userData = res
        this.cartData = this.userData["cartArray"]
        console.log("cartData", this.cartData)
        this.cartData.forEach(product => {
          product.quantity = 1;
        });
        this.calculateTotalPrice();
      }
    })
  }
  calculateMainPrice(price: number, discountPercentage: number) {
    const mainPrice = price + (price * discountPercentage / 100);
    return mainPrice.toFixed(2);
  }
  incrementQuantity(product: any) {
    product.quantity++;
    this.calculateTotalPrice();
  }

  decrementQuantity(product: any) {
    if (product.quantity > 1) {
      product.quantity--;
      this.calculateTotalPrice();
    }
  }

  calculateTotalPrice(): void {
    this.totalPrice = 0;
    this.cartData.forEach(product => {
      this.totalPrice += product.price * product.quantity;
    });
    this.totalPrice = parseFloat(this.totalPrice.toFixed(2));
  }
  calculateTotalDiscount(): number {
    let totalDiscount = 0;
    this.cartData.forEach(product => {
      totalDiscount += (product.price * product.discountPercentage / 100) * product.quantity;
    });
    return parseFloat(totalDiscount.toFixed(2));
  }
  formData = {
    cardNumber: '',
    cardName: '',
    expiration: '',
    cvv: ''
  };
  validateExpiration() {
  }


  buy(): void {
    const currentDate = new Date().toISOString().split('T')[0];
    const orderId = this.generateOrderId();
    // Retrieve purchasedArray from userData or initialize an empty object
    const purchasedData = this.userData.purchasedArray || {};

    // Add purchased products to the array for the current date
    purchasedData[currentDate] = purchasedData[currentDate] || [];
    purchasedData[currentDate].push({ orderId: orderId, products: this.cartData });

    // Clear cartData
    this.cartData = [];

    // Update user data with updated cartArray and purchasedArray
    const updatedUserData = { ...this.userData, cartArray: [], purchasedArray: purchasedData };
    this.http.addToCart(this.userId, updatedUserData).subscribe({
      next: () => {
        console.log("Products purchased successfully!");
        localStorage.removeItem("cartArray")
        this.router.navigateByUrl('/thankyou');
      },
      error: (err) => {
        console.error("Error while purchasing:", err);
      }
    });
  }

  generateOrderId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}


