import { Component, OnInit, } from '@angular/core';
import { CommonserviceService } from '../commonservice.service';
import { NavComponent } from '../nav/nav.component';
import { TranslateModule } from '@ngx-translate/core';
import { LazyLoadingDirective } from '../product/lazy-loading.directive';
import { Subject, take, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MdbCarouselModule } from 'mdb-angular-ui-kit/carousel';
interface data {
  brand: string;
  category: string;
  description: string;
  discountPercentage: number;
  id: number;
  images: string[];
  price: number;
  rating: number;
  stock: number;
  thumbnail: string;
  title: string;
}

@Component({
  selector: 'app-infinite-scroller',
  standalone: true,
  imports: [NavComponent, TranslateModule, LazyLoadingDirective, CommonModule, FormsModule,MdbCarouselModule],
  templateUrl: './infinite-scroller.component.html',
  styleUrl: './infinite-scroller.component.scss'
})

export class InfiniteScrollerComponent implements OnInit {
  cartArrayfromUserdata!:any[]
  userData:any
  destroy$ = new Subject<void>();
  search: string = '';
  products: any[] = [];
  cart: any[] = [];
  filteredProducts: any[] = [];
  userId: string;
  initialLoadCount = 5;
  constructor(private http: CommonserviceService,) {
    this.userId = localStorage.getItem('userId') || '';
  }

  ngOnInit(): void {
    this.getuserData()
    this.getProducts(this.initialLoadCount);
  }

  getProducts(count: number): void {
    this.http.getproducts().pipe(takeUntil(this.destroy$)).pipe(take(1)).subscribe((res: any) => {
      this.products = res.products.slice(0, count);
      this.filteredProducts = this.products
    });
  }

  calculateMainPrice(price: number, discountPercentage: number) {
    const mainPrice = price + (price * discountPercentage / 100);
    return mainPrice.toFixed(2);
  }

  loadMoreProducts(): void {
    const nextCount = this.products.length + this.initialLoadCount;
    this.getProducts(nextCount);
  }

  filterProducts(): void {
    this.filteredProducts = this.products.filter(X =>
      X.brand.toLowerCase().includes(this.search.toLowerCase())
    );
  }
  getuserData(){
    this.http.getUserData(this.userId).subscribe({next:(res:any)=>{
      this.userData=res
      this.cartArrayfromUserdata=this.userData["cartArray"]
      console.log("cartArray",  this.cartArrayfromUserdata)
    }})
  }
addTocart(productId: number): void {
  // Check if the product is already in the cartArrayfromUserdata or the regular cart
  const isProductInCart = this.cartArrayfromUserdata ? 
    this.cartArrayfromUserdata.some(item => item.id === productId) : 
    this.cart.some(item => item.id === productId);

  // If the product is already in the cart, notify the user and exit the function
  if (isProductInCart) {
    console.log("Product already added to the cart");
    window.alert("Product already added to the cart");
    return; // No need to proceed if the product is already in the cart
  }

  // Find the product to add from the products list
  const productToAdd = this.products.find(product => product.id === productId);
  // If the product is not found, log an error and exit the function
  if (!productToAdd) {
    console.log("Product not found");
    return; // No need to proceed if the product is not found
  }

  // If cartArrayfromUserdata doesn't exist, create a new cartArray
  if (!this.cartArrayfromUserdata) {
    this.cartArrayfromUserdata = [];
  }

  // Add the product to the cartArrayfromUserdata or the regular cart
  this.cartArrayfromUserdata.push(productToAdd);

  // Update userData with the updated cartArray
  this.userData = { ...this.userData, cartArray: this.cartArrayfromUserdata };

  // Send the updated userData to the server to update the user's cart
  this.http.addToCart(this.userId, this.userData)
    .pipe(takeUntil(this.destroy$))
    .subscribe(() => {
      console.log("Product added to cart successfully");
      window.alert("Product added to cart successfully");
    });
    this.http.updateCartArray(this.cartArrayfromUserdata || this.cart);
}
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

