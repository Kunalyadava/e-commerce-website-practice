import { Component } from '@angular/core';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router, RouterModule } from '@angular/router';
import { CommonserviceService } from '../commonservice.service';
import { Subscription } from 'rxjs';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { TranslateModule } from '@ngx-translate/core';
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, TranslateModule, ReactiveFormsModule, RouterModule, ToastrModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private loginSubscription!: Subscription;
  loginform!: FormGroup;
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);
  matcher = new MyErrorStateMatcher();
  constructor(private http: CommonserviceService, private router: Router, private toastr: ToastrService) {
    this.loginform = new FormGroup({
      email: this.email,
      password: this.password
    })
  }
  submit() {
    if (this.loginform.valid) {
      this.loginSubscription = this.http.login().subscribe({
        next: (res) => {
          const inputEmail = this.loginform.value.email ? this.loginform.value.email.toLowerCase() : '';
          const inputPassword = this.loginform.value.password ? this.loginform.value.password : '';
          const user = res.find((a: any) => {
            const storedEmail = a.email ? a.email.toLowerCase() : '';
            return storedEmail === inputEmail;
          });
          if (user) {
            if (user.password === inputPassword) {
              this.toastr.success('Login successful');
              localStorage.setItem('isloggedIn', JSON.stringify(true));
              localStorage.setItem('userId', user.id);
              this.loginform.reset();
              this.router.navigate(['/homepage']);
            } else {
              this.toastr.error('Incorrect password');
            }
          } else {
            this.toastr.error('User not found');
          }
        },
        error: (error) => {
        },
        complete: () => {
        }
      });
    }
  }
  ngOnDestroy() {
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe()
    }
  }
}
