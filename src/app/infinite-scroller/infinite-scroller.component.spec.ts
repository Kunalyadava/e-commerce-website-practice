import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfiniteScrollerComponent } from './infinite-scroller.component';

describe('InfiniteScrollerComponent', () => {
  let component: InfiniteScrollerComponent;
  let fixture: ComponentFixture<InfiniteScrollerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfiniteScrollerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InfiniteScrollerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
