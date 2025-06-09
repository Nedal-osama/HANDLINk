import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  constructor(private _AuthService: AuthService, private _Router: Router) { }
  errMsg: string = '';
  isLoading: boolean = false;
  registerForm: FormGroup = new FormGroup(
    {
      displayName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
      phoneNumber: new FormControl('', [Validators.required, Validators.pattern(/^\+20[0-9]{10}$/)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8),
         Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/)]),
      rePassword: new FormControl('', Validators.required),
    },

  );

  confirmPassword(group: FormGroup): void {
    const password = group.get('password');
    const rePassword = group.get('rePassword');
    if (rePassword?.value !== password?.value) {
      rePassword?.setErrors({ mismatch: true });
    } else {
      rePassword?.setErrors(null);
    }
  }

  handelForm(): void {
    const userData = this.registerForm.value;

    this.isLoading = true;
    if (this.registerForm.valid) {
      this._AuthService.register(userData).subscribe({
        next: (response: { message: string }) => {
          console.log('Response:', response);
          if (response.message === 'Success') {
            this.isLoading = false;
            this.registerForm.reset();
            this._Router.navigate(['/login']);
          }
        },
        error: (err: any) => {
          this.errMsg = err.error.detail || 'An error occurred';
          this.isLoading = false;
        }
      });
    }
  }

}
