import { Component, OnInit } from '@angular/core';
import { NavComponent } from '../../nav/nav.component';
import { CommonserviceService } from '../../commonservice.service';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
interface Movie {
  id:string
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
}

@Component({
  selector: 'app-movie-tickets',
  standalone: true,
  imports: [NavComponent,DatePipe,FormsModule,RouterModule,TranslateModule],
  templateUrl: './movie-tickets.component.html',
  styleUrl: './movie-tickets.component.scss'
})
export class MovieTicketsComponent implements OnInit{
  destroy$ = new Subject<void>();
  search:string=''
  list:Movie[]=[]
  filteredMovies: Movie[] = [];
constructor(private http:CommonserviceService){

}
  ngOnInit(): void {
   this.getMovies()
  }
  getMovies(){
    this.http.getMovies().pipe(takeUntil(this.destroy$)).subscribe((res:any)=>{
      this.list=res
      this.filteredMovies = this.list;
    })
  }
  getImageUrl(images: string[]): string {
    if (images.length > 2) {
      return images[1];
    }
    else if (images.length > 4) {
      return images[2];
    } else {
      return 'C:\Users\Samcom\Desktop\kunal_kumar_angular\src\assets\error.png'; 
    }
  }

  filterMovies() {
    this.filteredMovies = this.list.filter(movie =>
      movie.Title.toLowerCase().includes(this.search.toLowerCase())
    );
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
