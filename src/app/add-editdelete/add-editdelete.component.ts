import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonserviceService } from '../commonservice.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { ReactiveFormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-add-editdelete',
  standalone: true,
  imports: [ReactiveFormsModule, MatPaginatorModule, MatTableModule,
    MatToolbarModule, MatIconModule, MatButtonModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatNativeDateModule, MatDatepickerModule,
    MatRadioModule, MatDialogModule, CommonModule, TranslateModule],
  templateUrl: './add-editdelete.component.html',
  styleUrl: './add-editdelete.component.scss'
})
export class AddEditdeleteComponent implements OnInit {
  Form!: FormGroup;
  files: any = []
  constructor(
    private addeitService: CommonserviceService, private toster: ToastrService,
    private dialogRef: MatDialogRef<AddEditdeleteComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
  }

  ngOnInit() {
    this.Form = this.formBuilder.group({
      id: [null],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      avatar: ['']
    });

    if (this.data) {
      this.Form.patchValue(this.data);
    }
  }

  onChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const files = inputElement.files;
    if (!files || files.length === 0) {
      return;
    }
    const file = files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.Form.controls['avatar'].setValue(file.name);
    };
    reader.readAsDataURL(file);
  } 
  onSubmit() {
    if (this.Form.valid) {
      if (this.data) {
        this.addeitService
          .updateUser(this.data.id, this.Form.value)
          .subscribe({
            next: (val: any) => {
              this.toster.success('User details updated!');
              this.dialogRef.close(true);
            },
            error: (err: any) => {
              console.error(err);
              this.toster.error("Error while updating the employee!");
            },
          });
      } else {
        this.addeitService.addUser(this.Form.value).subscribe({
          next: (val: any) => {
            this.toster.success('user added successfully!');
            this.Form.reset();
            this.dialogRef.close(true);
          },
          error: (err: any) => {
            console.error(err);
            this.toster.error("Error while adding te user!");
          },
        });
      }
    }

  }
}