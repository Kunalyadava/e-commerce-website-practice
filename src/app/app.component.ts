import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from "./nav/nav.component";
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [RouterOutlet, NavComponent, TranslateModule,]
})
export class AppComponent {
  title = 'Learning Classes......';
  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang('en');
  }
  selectLanguage(event: Event) {
    this.translate.use((event.target as HTMLInputElement)?.value);
  }
  
}
