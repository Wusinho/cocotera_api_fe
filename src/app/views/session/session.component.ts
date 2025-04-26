import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-session',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './session.component.html',
  styleUrl: './session.component.css'
})
export class SessionComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

onSubmit(): void {
  if (this.loginForm.valid) {
    const { username, password } = this.loginForm.value;

    this.authService.saveAuth(username, password);

    this.http.post('http://localhost:8080/api/session/login', { username, password })
      .subscribe({
        next: (response) => {
          console.log('Login success!', response);
            this.router.navigate(["/clients"])
        },
        error: (error) => {
          console.error('Login failed', error);
        }
      });
    }
  }
}
