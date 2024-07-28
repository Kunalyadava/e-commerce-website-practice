import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CropimageComponent } from './cropimage.component';

describe('CropimageComponent', () => {
  let component: CropimageComponent;
  let fixture: ComponentFixture<CropimageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CropimageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CropimageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
