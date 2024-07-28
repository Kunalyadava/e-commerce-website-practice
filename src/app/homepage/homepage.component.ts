import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonserviceService } from '../commonservice.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { NavComponent } from '../nav/nav.component';
import { TranslateModule } from '@ngx-translate/core';
import { ImageToDirectiveDirective } from '../imagedirective/image-to-directive.directive';
import { MatRadioModule } from '@angular/material/radio';

interface userData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  gender: string;
  avatar: string;
  address: string;
  dob: string;
  favoriteFood: string;
  fb: string;
  github: string;
  hobbies: {
    reading: boolean;
    cooking: boolean;
    gardening: boolean;
  };
  id: number;
  instagram: string;
  mobile: number;
  portfolio: string;
  position: string;
  twitter: string;
  bio: string
}

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe, NavComponent, TranslateModule, ImageToDirectiveDirective, MatRadioModule, CommonModule],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }
  formValue!: FormGroup;
  allowEditEmail: boolean = false
  allowEditdob: boolean = false
  userId: string = '';
  showUpdate: Boolean = false;
  userData: userData | null = null
  avatarUrl: string = ''
  destroy$ = new Subject<void>();
  constructor(private http: CommonserviceService, private toastr: ToastrService, private formbuilder: FormBuilder) {
    this.formValue = this.formbuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(12), Validators.pattern('[0-9]*')]],
      email: [{ value: '', disabled: !this.allowEditEmail }],
      gender: ['', Validators.required],
      dob: [{ value: '', disabled: !this.allowEditdob }],
      address: ['', Validators.required],
      position: ['', Validators.required],
      bio: ['', Validators.required],
      fb: ['', [Validators.pattern('https?://.+')]],
      twitter: ['', [Validators.pattern('https?://.+')]],
      instagram: ['', [Validators.pattern('https?://.+')]],
      github: ['', [Validators.pattern('https?://.+')]],
      portfolio: ['', [Validators.pattern('https?://.+')]],
      avatar: ['']

    })
  }
  ngOnInit(): void {
    this.userId = localStorage.getItem('userId') || '';
    if (!this.userId) {
      this.toastr.error('User ID not found');
      return;
    }
    this.getprofiledata()
  }
  getprofiledata() {
    this.http.getUserData(this.userId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.userData = res;
        this.avatarUrl = res.avatar;
        this.formValue.patchValue({ ...res });
        this.http.setUserData(this.userData);
      },
      error: (error) => {
        this.toastr.error('Error fetching user data');
      }
    });
  }
  removeImage() {
    this.avatarUrl = '';
    this.formValue.controls['avatar'].setValue('');
  }
  onChange(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];
    if (file) {
      if (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg') {
        // If the file type is valid
        if (file.size <= 200 * 1024) {
          // If the size of the image is within the limit (200KB)
          const reader = new FileReader();
          reader.onload = () => {
            this.avatarUrl = reader.result as string;
            this.formValue.controls['avatar'].setValue(reader.result);
            // Clear the errors if they were previously set
            this.formValue.controls['avatar'].setErrors(null);
            this.updateProfile();
          };
          reader.readAsDataURL(file);
        } else {
          // If the size of the image exceeds the limit, set the size error on the form control
          this.formValue.controls['avatar'].setErrors({ maxSize: true });
          this.toastr.error("Image size exceeds the limit of 200KB. Please select a smaller image.");
        }
      } else {
        // If the file type is invalid, set the format error on the form control
        this.formValue.controls['avatar'].setErrors({ invalidFormat: true });
        this.toastr.error("Invalid file type. Please select an image of type JPEG, PNG, or JPG.");
      }
    } else {
      // If no file is selected, clear the avatar URL and form control value
      this.removeImage();
    }
  }


  updateProfile() {
    if (this.formValue.invalid) {
      this.formValue.markAllAsTouched();
      return;
    }
    const updatedUserData = { ...this.userData, ...this.formValue.value, avatar: this.avatarUrl };
    this.http.updateUserData(Number(this.userId), updatedUserData).pipe(takeUntil(this.destroy$)).subscribe(
      (res) => {
        this.toastr.success('Profile updated successfully');
        let ref = document.getElementById('cancel')
        ref?.click();
        this.formValue.reset()
        this.getprofiledata()
      },
      (error) => {
        this.toastr.error('Error updating profile');
      }
    );
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}

