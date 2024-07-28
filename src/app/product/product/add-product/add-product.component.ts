import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CommonserviceService } from '../../../commonservice.service';
import { Userdata } from './userdata.model';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule, CommonModule, MatIconModule, TranslateModule, ReactiveFormsModule],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss'
})
export class AddProductComponent {
  userform!: FormGroup
  userModelObj: Userdata = new Userdata()
  constructor(private fb: FormBuilder, private http: CommonserviceService,
    private dialogRef: MatDialogRef<AddProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,) {

    this.userform = this.fb.group({
      id: [null],
      name: ['', [Validators.required,Validators.pattern('^[a-zA-Z ]+$')]],
      description: ['', [Validators.required,Validators.pattern('^[a-zA-Z]+$')]],
      quantity: ['', [Validators.required,Validators.min(0)]],
      price: ['', [Validators.required,Validators.min(0)]]
    })
    if (this.data) {
      this.userform.patchValue(this.data)
    }
  }

  submit() {
    this.userModelObj.name = this.userform.value.name;
    this.userModelObj.description = this.userform.value.description;
    this.userModelObj.quantity = this.userform.value.quantity;
    this.userModelObj.price = this.userform.value.price;
    this.userModelObj.id = this.userform.value.id;
    if (this.data && this.userform.valid) {
      this.http.updateuser(this.userModelObj.id, this.userModelObj).subscribe({
        next: (val: any) => {
          alert('user updated successfully!');
          this.userform.reset();
          this.dialogRef.close(true);
        },
        error: (err: any) => {
          console.error(err);
          alert("Error while adding the user!");
        },
      });
    } else {
      this.http.postUser(this.userModelObj).subscribe({
        next: (val: any) => {
          alert('user added successfully!');
          this.userform.reset();
          this.dialogRef.close(true);
        },
        error: (err: any) => {
          console.error(err);
          alert("Error while adding the user!");
        },
      })
    }
  }

}


