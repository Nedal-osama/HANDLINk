import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  errMsg: string = '';
  isLoading: boolean = false;

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[a-zA-Z0-9_@]{6,}$/)
    ]),
  });

  constructor(
    private _AuthService: AuthService,
    private _Router: Router
  ) {}

  handelForm(): void {
    if (this.loginForm.invalid) return;

    const userData = this.loginForm.value;
    this.isLoading = true;
    this.errMsg = '';

    this._AuthService.login(userData).subscribe({
      next: (response: { token: string; message: string }) => {
        if (response.message === 'Success') {
          localStorage.setItem('token', response.token);
          this._AuthService.decodeUser();
          this._Router.navigate(['/home']);
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.errMsg = "Invalid login credentials, please try again.";
        this.isLoading = false;
      },
    });
  }
}
