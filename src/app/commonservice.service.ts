import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, mergeMap } from 'rxjs';
import { environment } from './environment';
export interface UserData {
  firstName: string;
  lastName: string;
  avatar: string
}
interface Movie {
  id: string;
  seats: Seat[];
}

interface Seat {
  seatNumber: string;
  available: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CommonserviceService {
  userId: string = ''

  baseUrl: string = environment.baseUrl;
  baseusers: string = environment.baseusers;
  products: string = environment.products
  moviesUrl: string = environment.moviesUrl
  private cartArraySubject = new BehaviorSubject<any[]>([]);
  cartArray$ = this.cartArraySubject.asObservable();
  constructor(private http: HttpClient) {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}') as UserData;
    this.userId = localStorage.getItem('userId') || '';
    this.setUserData(userData);
    const cartData = localStorage.getItem('cartArray');
    if (cartData) {
      this.cartArraySubject.next(JSON.parse(cartData));
    }
  }

  addUser(data: any): Observable<any> {
    return this.http.post(this.baseUrl, data);
  }

  updateUser(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/2/${id}`, data);
  }


  getUserList(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/2/${id}`);
  }

  postUser(data: any) {
    return this.http.post<any>(`${this.baseusers}/users`, data)
      .pipe(map((res: any) => {
        return res
      }))
  }
  getuser() {
    return this.http.get<any[]>(`${this.baseusers}/users`).pipe(map((res: any) => {
      return res
    }))
  }
  deleteuser(id: number) {
    return this.http.delete<any>(`${this.baseusers}/users/${id}`)
  }
  updateuser(id: number, data: any) {
    return this.http.put<any>(`${this.baseusers}/users/${id}`, data)
  }
  login() {
    return this.http.get<any>(`${this.baseusers}/signup`).pipe(map((res: any) => {
      return res
    }))
  }
  signup(data: any) {
    return this.http.post<any>(`${this.baseusers}/signup`, data).pipe(map((res: any) => {
      return res
    }))
  }
  getUserData(userId: string): Observable<any> {
    return this.http.get<any>(`${this.baseusers}/signup/${userId}`,);
  }
  updateUserData(id: number, data: {}) {
    return this.http.put<any>(`${this.baseusers}/signup/${id}`, data).pipe(map((res) => { return res }))
  }

  private userDataSubject = new BehaviorSubject<UserData | null>(null);
  userData$ = this.userDataSubject.asObservable();

  setUserData(userData: UserData | null) {
    this.userDataSubject.next(userData);
    localStorage.setItem('userData', JSON.stringify(userData));
  }

  updateCartArray(cartArray: any[]): void {
    this.cartArraySubject.next(cartArray);
    localStorage.setItem('cartArray', JSON.stringify(cartArray));
  }
  getproducts() {
    return this.http.get(`${this.products}`)
  }
  getProducts(pageIndex: number, pageSize: number) {
    return this.http.get(`${this.baseusers}/users/${pageIndex}/${pageSize}`).pipe(map((res: any) => {
      return res
    }))
  }
  getMovies() {
    return this.http.get(`${this.moviesUrl}`)
  }
  updateSeatAvailability(id: string, updatedSeats: Seat[]): Observable<Movie> {
    return this.http.get<Movie>(`${this.moviesUrl}/${id}`).pipe(
      mergeMap((movie: Movie) => {
        const updatedMovie = {
          ...movie,
          seats: movie.seats.map((seat: Seat) => {
            const updatedSeat = updatedSeats.find((s: Seat) => s.seatNumber === seat.seatNumber);
            return updatedSeat ? updatedSeat : seat;
          })
        };
        return this.http.put<Movie>(`${this.moviesUrl}/${id}`, updatedMovie);
      }),
    );
  }
 addToCart(id: string, data:{cartArray:any[] }): Observable<any> {
  return this.http.put<any>(`${this.baseusers}/signup/${id}`, data).pipe(map((res) => { return res }))
  }

}
