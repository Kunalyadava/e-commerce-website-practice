import { Component } from '@angular/core';
import { NavComponent } from '../../nav/nav.component';
import { ActivatedRoute } from '@angular/router';
import { CommonserviceService } from '../../commonservice.service';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { FormsModule } from '@angular/forms';
import jsPDF from 'jspdf';
import { TranslateModule } from '@ngx-translate/core';
interface movieDetail {
  id: string;
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  Response: string;
  Images: string[];
  seats: Seat[] | undefined,
  ticketPrice: string
  bookedSeats: string[];

}
interface Seat {
  seatNumber: string;
  available: boolean;
  bookedBy?: string | null;
}

interface userData {
  firstName: string;
  lastName: string;
}
@Component({
  selector: 'app-ticket-booking',
  standalone: true,
  imports: [NavComponent, CommonModule, FormsModule, TranslateModule],
  templateUrl: './ticket-booking.component.html',
  styleUrl: './ticket-booking.component.scss'
})
export class TicketBookingComponent {
  seatsSavedSuccessfully: boolean = false;
  destroy$ = new Subject<void>();
  userId: string = '';
  userData: userData | null = null
  movieDetails: movieDetail | null = null
  id: string = ""
  selectedSeats: Seat[] = [];
  totalPrice: number = 0;
  seatsSaved: boolean = false;
  constructor(private route: ActivatedRoute, private http: CommonserviceService) { }
  ngOnInit() {
    this.userId = localStorage.getItem('userId') || '';
    this.route.queryParams.subscribe(res => {
      this.id = res['id'];
      this.getMovieDetails()
      this.getprofiledata()
    });
    this.calculateTotalPrice();
  }

  getprofiledata() {
    this.http.getUserData(this.userId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.userData = res;
      },
    });
  }
  getMovieDetails(): void {
    this.http.getMovies().pipe(takeUntil(this.destroy$)).subscribe(
      (data: any) => {
        this.movieDetails = data.find((movie: movieDetail) => movie.id == this.id);
        this.calculateTotalPrice();
        if (!this.movieDetails) {
          console.error('Movie with  ID ' + this.id + ' not found.');
        }
      },
      (error) => {
        console.error('Error fetching movies:', error);
      }
    );
  }
  getImageUrl(images: string[]): string {
    if (images.length > 2) {
      return images[1];
    }
    else if (images.length > 4) {
      return images[2];
    } else {
      return 'assets\error.png';
    }
  }
  getSeatRows(seats: Seat[]): Seat[][] {
    const rows: Seat[][] = [];
    const seatsPerRow = 4;
    let currentRow: Seat[] = [];
    for (let i = 0; i < seats.length; i++) {
      currentRow.push(seats[i]);
      if (currentRow.length === seatsPerRow || i === seats.length - 1) {
        rows.push(currentRow);
        currentRow = [];
      }
    }
    return rows;
  }

  // selectSeat(seat: Seat) {
  //   if (!this.movieDetails) {
  //     console.log('Movie details not available');
  //     return;
  //   }

  //   if (!seat.available && seat.bookedBy === this.userId) {
  //     seat.available = true;
  //     seat.bookedBy = null;
  //   } else if (seat.available) {
  //     seat.available = false;
  //     seat.bookedBy = this.userId;
  //   }
  //   const index = this.selectedSeats.findIndex(s => s.seatNumber === seat.seatNumber);
  //   if (index !== -1 && seat.available) {
  //     this.selectedSeats.splice(index, 1);
  //   } else if (index === -1 && !seat.available) {
  //     this.selectedSeats.push(seat);
  //   }
  //   this.calculateTotalPrice();
  // }
  selectSeat(seat: Seat) {
    if (!this.movieDetails) {
      console.log('Movie details not available');
      return;
    }
    if (!seat.available) {
      return;
    }
    if (seat.bookedBy === this.userId) {
      seat.available = true;
      seat.bookedBy = null;
    } else {
      seat.available = false;
      seat.bookedBy = this.userId;
    }
    const index = this.selectedSeats.findIndex(s => s.seatNumber === seat.seatNumber);
    if (index !== -1 && seat.available) {
      this.selectedSeats.splice(index, 1);
    } else if (index === -1 && !seat.available) {
      this.selectedSeats.push(seat);
    }
    this.calculateTotalPrice();
  }

  calculateTotalPrice() {
    this.totalPrice = 0;
    if (this.movieDetails && this.movieDetails.seats) {
      for (let seat of this.movieDetails.seats) {
        if (!seat.available && this.selectedSeats.some(selectedSeat => selectedSeat.seatNumber === seat.seatNumber)) {
          this.totalPrice += parseInt(this.movieDetails.ticketPrice);
        }
      }
    }
  }
  bookSeats() {
    if (!this.userId || !this.movieDetails || !this.selectedSeats || this.selectedSeats.length === 0) {
      console.error('User ID, movie details, or selected seats not available.');
      return;
    }
    const updatedSeats = this.selectedSeats.map(seat => ({
      ...seat,
      available: false,
      bookedBy: this.userId
    }));

    this.http.updateSeatAvailability(this.movieDetails.id, updatedSeats).pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => {
        console.log('Seats booked successfully:', response);
        this.selectedSeats = [];
        this.calculateTotalPrice();
      },
      error: (error) => {
        console.error('Error booking seats:', error);
      }
    });

    this.generatePDF();
  }

  generatePDF() {
    if (this.movieDetails && this.userData) {
      const doc = new jsPDF();
      const title = this.movieDetails.Title;
      const totalPrice = this.totalPrice;
      const bookedby = this.userData.firstName;
      const user_id = this.userId;
      const selectedBookedSeats = this.selectedSeats.filter(seat => !seat.available);
      const bookedSeats = selectedBookedSeats.map(seat => seat.seatNumber).join(', ');
      const backgroundImage = new Image();
      backgroundImage.src = '/assets/booked.jpg';

      backgroundImage.onload = function () {

        doc.setFillColor(255, 255, 255);
        doc.rect(10, 10, 180, 60, 'F');

        doc.setDrawColor(0);
        doc.setLineWidth(0.5);
        doc.rect(10, 10, 180, 60);

        doc.addImage(backgroundImage, 'JPEG', 12, 12, 176, 56);


        doc.text(`Movie Name: ${title}`, 20, 20);

        doc.setTextColor(0, 0, 255);
        doc.setFont('Arial');
        doc.text(`Booked By: ${bookedby}`, 20, 30);

        doc.setTextColor(0, 0, 255);
        doc.setFont('Arial');
        doc.text(`User ID: ${user_id}`, 20, 40);

        doc.setTextColor(0, 0, 255);
        doc.setFont('Arial');
        doc.text(`Booked Seats: ${bookedSeats}`, 20, 50);

        doc.setTextColor(0);
        doc.setFont('Arial');
        doc.text(`Total Price: $${totalPrice}`, 20, 60);

        doc.save('movie_ticket.pdf');
      };
    } else {
      console.error('Movie details or user data not available');
    }
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
