import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductListComponentscoller } from './product-list.component';

describe('ProductListComponent', () => {
  let component: ProductListComponentscoller;
  let fixture: ComponentFixture<ProductListComponentscoller>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductListComponentscoller]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductListComponentscoller);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
