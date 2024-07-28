import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieTicketsComponent } from './movie-tickets.component';

describe('MovieTicketsComponent', () => {
  let component: MovieTicketsComponent;
  let fixture: ComponentFixture<MovieTicketsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieTicketsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MovieTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
