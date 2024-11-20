import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  registerForm: FormGroup;
  authMode: string = 'login';
  email: string = '';
  password: string = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private alertController: AlertController,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordConfirmation: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  login() {

    const { email, password } = this.loginForm.value;
    if (this.loginForm.invalid) {
      console.log('Submitting login form with error', { email, password });
      this.showAlert('Error', 'Please enter valid email and password');
      return;
    }
    console.log('Submitting login form', { email, password });

    this.http.post('http://localhost:3000/api/auth/login', { email, password })
      .subscribe({
        next: (response: any) => {
          console.log('Login response', response);
          this.authService.setToken(response.token);
          this.showAlert('Success', 'Login successful');
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Login error', error);
          this.showAlert('Error', error.error.error || 'Login failed');
        }
      });
  }

  register() {
    if (this.registerForm.invalid) {
      const errors = [];
      const controls = this.registerForm.controls;

      if (controls['email'].errors) {
        if (controls['email'].errors['required']) {
          errors.push('Email is required.');
        }
        if (controls['email'].errors['email']) {
          errors.push('Email is invalid.');
        }
      }

      if (controls['password'].errors) {
        if (controls['password'].errors['required']) {
          errors.push('Password is required.');
        }
        if (controls['password'].errors['minlength']) {
          errors.push('Password must be at least 6 characters long.');
        }
      }

      if (controls['passwordConfirmation'].errors) {
        if (controls['passwordConfirmation'].errors['required']) {
          errors.push('Password confirmation is required.');
        }
        if (controls['passwordConfirmation'].errors['minlength']) {
          errors.push('Password confirmation must be at least 6 characters long.');
        }
      }

      this.showAlert('Error', errors.join(' '));
      return;
    }

    const { email, password, passwordConfirmation } = this.registerForm.value;

    if (password !== passwordConfirmation) {
      this.showAlert('Error', 'Passwords do not match');
      return;
    }

    console.log('Submitting registration form', { email, password, passwordConfirmation });

    this.http.post('http://localhost:3000/api/auth/register', { email, password, passwordConfirmation })
      .subscribe({
        next: (response) => {
          console.log('Registration response', response);
          this.showAlert('Success', 'Registration successful');
        },
        error: (error) => {
          console.error('Registration error', error);
          this.showAlert('Error', error.error.error || 'Registration failed');
        }
      });
  }

  onLogin() {
    this.login();
  }

  onRegister() {
    this.register();
  }
}
