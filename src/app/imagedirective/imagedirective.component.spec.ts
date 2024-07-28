import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagedirectiveComponent } from './imagedirective.component';

describe('ImagedirectiveComponent', () => {
  let component: ImagedirectiveComponent;
  let fixture: ComponentFixture<ImagedirectiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImagedirectiveComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImagedirectiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
