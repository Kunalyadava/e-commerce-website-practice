import { Component } from '@angular/core';
import { ImageToDirectiveDirective } from './image-to-directive.directive';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavComponent } from '../nav/nav.component';

@Component({
  selector: 'app-imagedirective',
  standalone: true,
  imports: [ImageToDirectiveDirective,RouterModule,CommonModule,NavComponent],
  templateUrl: './imagedirective.component.html',
  styleUrl: './imagedirective.component.scss'
})

export class ImagedirectiveComponent {
  images = [
    'assets/photo-1.jpg',
    'assets/photo-2.jpg',
    'assets/photo-3.jpg',
    'assets/photo-4.jpg',
    'assets/photo-5.jpg',
    'assets/photo-6.jpg',
    'A4Angular',"k4kunal","k4umar",
  ];
}
