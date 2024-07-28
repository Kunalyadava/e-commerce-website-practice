import { Component, OnInit } from '@angular/core';
import { NavComponent } from '../nav/nav.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-thankyou',
  standalone: true,
  imports: [NavComponent,RouterModule],
  templateUrl: './thankyou.component.html',
  styleUrl: './thankyou.component.scss'
})
export class ThankyouComponent implements OnInit{
  ngOnInit(): void {
  }
}
