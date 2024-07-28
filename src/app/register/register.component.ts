import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  ValidationErrors,
  FormBuilder,
  AbstractControl,
} from '@angular/forms';
import { ErrorStateMatcher, MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router, RouterModule } from '@angular/router';
import { Subscription, map } from 'rxjs';
import { CommonserviceService } from '../commonservice.service';
import { ToastrService } from 'ngx-toastr';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatListModule } from '@angular/material/list';
import { TranslateModule } from '@ngx-translate/core';
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, TranslateModule, MatInputModule, ReactiveFormsModule, RouterModule, MatNativeDateModule, MatSelectModule, CommonModule, MatDatepickerModule, MatNativeDateModule, MatListModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  registerform: FormGroup;
  private loginSubscription!: Subscription;
  private SignupSubscription!: Subscription;
  filterDates = (d: Date | null) => {
    const today = new Date()
    if (d == null) return false
    return d <= today;
  };
  submitted:boolean=false
  checkboxState: boolean = false
  favoriteFoods: string[] = ['Crab Curry', 'Eathworm-noodles', 'Snake soup', 'Pasta', 'frog Biryani', 'Cockroach Fry'];
  email: FormControl;
  password: FormControl;
  firstName: FormControl;
  lastName: FormControl;
  favoriteFood: FormControl
  confirmPassword: FormControl;
  gender: FormControl;
  dob: FormControl
  maxDate: string = ''
  matcher: ErrorStateMatcher
  constructor(private router: Router, private http: CommonserviceService, private toastr: ToastrService, private fb: FormBuilder) {
    this.registerform = new FormGroup({
      email: this.email = new FormControl('', [Validators.required, Validators.email]),
      password: this.password = new FormControl('', [Validators.required, Validators.minLength(5)]),
      firstName: this.firstName = new FormControl('', [Validators.required]),
      lastName: this.lastName = new FormControl('', [Validators.required]),
      gender: this.gender = new FormControl('', [Validators.required]),
      hobbies: this.fb.group({
        reading: false,
        cooking: false,
        gardening: false
      }, { validators: this.atLeastOneChecked }),
      favoriteFood: this.favoriteFood = new FormControl('', [Validators.required]),
      dob: this.dob = new FormControl('', [Validators.required]),
      confirmPassword: this.confirmPassword = new FormControl('', [Validators.required, confirmPasswordValidator]),

    });
    this.matcher = new MyErrorStateMatcher();
  }
  ngOnInit(): void {
  }
  atLeastOneChecked(group: FormGroup) {
    const reading = group.controls["reading"].value;
    const cooking = group.controls["cooking"].value;
    const gardening = group.controls["gardening"].value;

    if (!(reading || cooking || gardening)) {
      return { atLeastOneChecked: true };
    }

    return null;
  }
  submit() {
    if (this.registerform.invalid) {
      this.submitted = true;
      return;
    }
    const userToRegister = {
      ...this.registerform.value,
      userCreatedDate: this.getFormattedDate(new Date())
    };
    this.loginSubscription = this.http.login().pipe(
      map((res) => {
        return res.find((a: any) => {
          return a.email == this.registerform.value.email
        });
      })
    ).subscribe((user) => {
      if (user) {
        this.toastr.error("An user with this email already exists. Please use another email to register.");
      } else {
        this.SignupSubscription = this.http.signup(userToRegister).subscribe((res: any) => {
          this.registerform.reset();
          this.toastr.success("User created succesfully");
          this.router.navigate(['']);
        });
      }
    });
  }  

  getFormattedDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
  
  ngOnDestroy() {
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }
    if (this.SignupSubscription) {
      this.SignupSubscription.unsubscribe();
    }
  }

}
function confirmPasswordValidator(control: FormControl): ValidationErrors | null {
  const password = control.root.get('password');
  const confirmPassword = control.root.get('confirmPassword');
  if (password && confirmPassword && password.value !== confirmPassword.value) {
    return { confirmPassword: true };
  }
  return null;
}