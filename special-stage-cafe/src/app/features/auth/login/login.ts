import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent {
  email = signal('');
  password = signal('');
  error = signal('');

  constructor(private auth: AuthService, private router: Router) {}

  submit(): void {
    this.error.set('');
    const success = this.auth.login(this.email(), this.password());

    if (!success) {
      this.error.set('Invalid email or password.');
      return;
    }

    // Redirect based on role: admins -> landing (home), users -> menu
    if (this.auth.isAdmin()) {
      this.router.navigate(['/']);
    } else {
      this.router.navigate(['/menu']);
    }
  }
}
