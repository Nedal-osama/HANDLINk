import { Component } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ForgetPasswordService } from '../../../service/forget-password.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forget-pass',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forget-pass.component.html',
  styleUrl: './forget-pass.component.scss'
})
export class ForgetPassComponent {
resetting: any;
verifying: any;
sending: any;
  constructor(private _ForgetpassService: ForgetPasswordService, private _Router: Router) {}

  step1: boolean = true;
  step2: boolean = false;
  step3: boolean = false;
  email: string = '';
  phoneNumber: string = '';
  userMsg: string = '';
  isEmail: boolean = true;
  isSuccess: boolean = false;
  isLoading: boolean = false;

  forgotForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    phoneNumber: new FormControl('', [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)])
  });

  resetCodeForm: FormGroup = new FormGroup({
    resetCode: new FormControl('')
  });

  resetPasswordForm: FormGroup = new FormGroup({
    newPassword: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/)])
  });

  toggleMethod(isEmail: boolean): void {
    this.isEmail = isEmail;
    this.forgotForm.reset();
    this.userMsg = '';
  }

  forgotPassword(): void {
    const userEmail = this.forgotForm.value.email;
    const phoneNumber = this.forgotForm.value.phoneNumber;
    this.isLoading = true;

    if (this.isEmail && userEmail) {
      this.email = userEmail;
      this._ForgetpassService.forgotPasswordByEmail({ email: userEmail }).subscribe({
        next: () => {
          this.userMsg = 'A verification code has been sent to your email.';
          this.isSuccess = true;
          this.step1 = false;
          this.step2 = true;
          this.isLoading = false;
        },
        error: () => {
          this.userMsg = 'Failed to send the verification code. Please try again.';
          this.isSuccess = false;
          this.isLoading = false;
        }
      });
    } else if (!this.isEmail && phoneNumber) {
      this.phoneNumber = phoneNumber;
      this._ForgetpassService.forgotPasswordByTelegram({ phoneNumber: phoneNumber }).subscribe({
        next: () => {
          this.userMsg = 'A verification code has been sent to your phone.';
          this.isSuccess = true;
          this.step1 = false;
          this.step2 = true;
          this.isLoading = false;
        },
        error: () => {
          this.userMsg = 'Failed to send the verification code. Please try again.';
          this.isSuccess = false;
          this.isLoading = false;
        }
      });
    } else {
      this.userMsg = 'Please enter your email or phone number.';
      this.isSuccess = false;
      this.isLoading = false;
    }
  }

  resetCode(): void {
    const resetCode = this.resetCodeForm.value.resetCode;
    const payload = {
      identifier: this.isEmail ? this.email : this.phoneNumber,
      resetCode: resetCode,
      isEmail: this.isEmail
    };
    this.isLoading = true;

    this._ForgetpassService.verifyResetCode(payload).subscribe({
      next: () => {
        this.userMsg = 'Code verified successfully. Please reset your password.';
        this.isSuccess = true;
        this.step2 = false;
        this.step3 = true;
        this.isLoading = false;
      },
      error: () => {
        this.userMsg = 'Invalid verification code. Please try again.';
        this.isSuccess = false;
        this.isLoading = false;
      }
    });
  }

  newPassword(): void {
    const newPassword = this.resetPasswordForm.value.newPassword;
    const payload = {
      identifier: this.isEmail ? this.email : this.phoneNumber,
      newPassword: newPassword,
      isEmail: this.isEmail
    };
    this.isLoading = true;

    this._ForgetpassService.resetPassword(payload).subscribe({
      next: () => {
        this.userMsg = 'Password reset successfully. Redirecting to login...';
        this.isSuccess = true;
        setTimeout(() => this._Router.navigate(['/login']), 2000);
        this.isLoading = false;
      },
      error: () => {
        this.userMsg = 'Failed to reset password. Please try again later.';
        this.isSuccess = false;
        this.isLoading = false;
      }
    });
  }
}
