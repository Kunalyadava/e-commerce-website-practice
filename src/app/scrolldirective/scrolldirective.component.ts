import { Component } from '@angular/core';
import { ScrollToElementDirective } from './scroll-to-element.directive';
import { NavComponent } from '../nav/nav.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-scrolldirective',
  standalone: true,
  imports: [ScrollToElementDirective, NavComponent, RouterModule, TranslateModule],
  templateUrl: './scrolldirective.component.html',
  styleUrl: './scrolldirective.component.scss'
})

export class ScrolldirectiveComponent {
}



