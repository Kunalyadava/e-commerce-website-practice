import { Component } from '@angular/core';
import { NavComponent } from '../nav/nav.component';
import { CommonModule } from '@angular/common';
import { CommonserviceService } from '../commonservice.service';
import jsPDF from 'jspdf';
interface OrderHistoryItem {
  orderId: string;
  date: string;
  products: any[]; // Update this type to match the type of your product objects
}
@Component({
  selector: 'app-ordered-list',
  standalone: true,
  imports: [NavComponent,CommonModule],
  templateUrl: './ordered-list.component.html',
  styleUrl: './ordered-list.component.scss'
})
export class OrderedListComponent {
  userId: string;
  orderHistory: OrderHistoryItem[] = [];

  constructor(private http: CommonserviceService) {
    this.userId = localStorage.getItem('userId') || '';
  }

  ngOnInit(): void {
    this.getUserOrderHistory();
  }

  getUserOrderHistory(): void {
    this.http.getUserData(this.userId).subscribe({
      next: (userData: any) => {
        const purchasedArray = userData.purchasedArray || {};
        this.orderHistory = this.organizeOrderHistory(purchasedArray);
      },
      error: (err:any) => {
        console.error("Error while fetching user order history:", err);
      }
    });
  }

  organizeOrderHistory(purchasedArray: any): OrderHistoryItem[] {
    const orderHistory: OrderHistoryItem[] = [];
    for (const date in purchasedArray) {
      if (purchasedArray.hasOwnProperty(date)) {
        purchasedArray[date].forEach((order: any) => {
          orderHistory.push({
            orderId: order.orderId,
            date: date,
            products: order.products
          });
        });
      }
    }
    return orderHistory;
  }

  
  calculateTotalOrderPrice(products: any[]): number {
    return products.reduce((total, product) => total + (product.price * product.quantity), 0);
  }


  downloadInvoice(order: OrderHistoryItem): void {
    const doc = new jsPDF();
    let y = 10;

    doc.text(`User: ${this.userId}`, 10, y);
    y += 10;
    doc.text(`Order ID: ${order.orderId}`, 10, y);
    y += 10;
    doc.text(`Date: ${order.date}`, 10, y);
    y += 10;

    order.products.forEach(product => {
      doc.text(`Product: ${product.title}`, 10, y);
      y += 5;
      doc.text(`Price: ${product.price}, Quantity: ${product.quantity}`, 15, y);
      y += 10;
    });

    y += 10;
    doc.text(`Total Price: ${this.calculateTotalOrderPrice(order.products)}`, 10, y);

    doc.save(`invoice_${order.orderId}.pdf`);
  }
}
