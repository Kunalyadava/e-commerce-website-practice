import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrolldirectiveComponent } from './scrolldirective.component';

describe('ScrolldirectiveComponent', () => {
  let component: ScrolldirectiveComponent;
  let fixture: ComponentFixture<ScrolldirectiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScrolldirectiveComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ScrolldirectiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
