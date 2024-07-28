import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditdeleteComponent } from './add-editdelete.component';

describe('AddEditdeleteComponent', () => {
  let component: AddEditdeleteComponent;
  let fixture: ComponentFixture<AddEditdeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditdeleteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddEditdeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
