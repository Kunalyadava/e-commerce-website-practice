import { Component, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { CommonserviceService } from '../commonservice.service';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { ImageToDirectiveDirective } from '../imagedirective/image-to-directive.directive';
import { TranslateModule } from '@ngx-translate/core';
export interface UserData {
  firstName: string;
  lastName: string;
  avatar: string
}

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, RouterModule, ImageToDirectiveDirective, TranslateModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss'
})
export class NavComponent implements OnInit {
  cartLength:number=0;
  cartSubscription!: Subscription;
  userId: string = ""
  destroy$ = new Subject<void>();
  userData: UserData | null = null;
  constructor(
    private router: Router, private http: CommonserviceService,
  ) {
    this.userId = localStorage.getItem('userId') || '';

  }
  ngOnInit(): void {
    this.http.userData$.subscribe(userData => {
      this.userData = userData;
    });
    this.cartSubscription = this.http.cartArray$.subscribe(cartArray => {
      this.cartLength = cartArray.length;
    });
  }
  redirectTo() {
    this.router.navigate(['productlistpage']);
  }
  logout() {
    this.http.setUserData(null);
    localStorage.removeItem('isloggedIn');
    localStorage.removeItem("userId",)
    this.router.navigate([''])
  }
  ngOnDestroy(): void {
    this.cartSubscription.unsubscribe();
  }
}
