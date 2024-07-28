import { Routes } from '@angular/router';
import { DetailspageComponent } from './detailspage/detailspage.component';
import { ScrolldirectiveComponent } from './scrolldirective/scrolldirective.component';
import { ImagedirectiveComponent } from './imagedirective/imagedirective.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { authGuard } from './auth.guard';
import { HomepageComponent } from './homepage/homepage.component';
import { CropimageComponent } from './cropimage/cropimage.component';
import { InfiniteScrollerComponent } from './infinite-scroller/infinite-scroller.component';
import { MovieTicketsComponent } from './movie/movie-tickets/movie-tickets.component';
import { TicketBookingComponent } from './movie/ticket-booking/ticket-booking.component';
import { CartPageComponent } from './cart-page/cart-page.component';
import { TermsandconditionsComponent } from './cart-page/termsandconditions/termsandconditions.component';
import { ThankyouComponent } from './thankyou/thankyou.component';
import { OrderedListComponent } from './ordered-list/ordered-list.component';
import { ProductListComponent } from './product/product/product-list-pagination/product-list.component';
import { ProductListComponentscoller } from './product/product/product-list-scroller/product-list.component';

export const routes: Routes = [
    {path:"", component:LoginComponent},
    {path:"detailspage",component:DetailspageComponent,canActivate:[authGuard]},
    {path:"productlistpage",component:ProductListComponent,canActivate:[authGuard]},
    {path:"scrolldirective",component:ScrolldirectiveComponent,canActivate:[authGuard]},
    {path:"scrolldirective/:id",component:ScrolldirectiveComponent,canActivate:[authGuard]},
    {path:"imagedirective",component:ImagedirectiveComponent,canActivate:[authGuard]},
    {path:"register",component:RegisterComponent},
    {path:"homepage",component:HomepageComponent,canActivate:[authGuard]},
    {path:"cropandset",component:CropimageComponent,canActivate:[authGuard]},
    {path:"infiniteScroller",component:InfiniteScrollerComponent,canActivate:[authGuard]},
    {path:"bookmyshow",component:MovieTicketsComponent,canActivate:[authGuard]},
    {path:"moviebooking",component:TicketBookingComponent,canActivate:[authGuard]},
    {path:"cartpage",component:CartPageComponent,canActivate:[authGuard]},
    {path:"terms",component:TermsandconditionsComponent,canActivate:[authGuard]},
    {path:"thankyou",component:ThankyouComponent,canActivate:[authGuard]},
    {path:"orderedList",component:OrderedListComponent,canActivate:[authGuard]},
    {path:"infinitescroll",component:OrderedListComponent,canActivate:[authGuard]},
    {path:"productlistscroller",component:ProductListComponentscoller,canActivate:[authGuard]},

];

