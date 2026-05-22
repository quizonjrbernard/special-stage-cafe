import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class RegisterComponent {
  name = signal('');
  email = signal('');
  password = signal('');
  error = signal('');
  success = signal('');

  constructor(private auth: AuthService, private router: Router) {}

  submit(): void {
    this.error.set('');
    this.success.set('');
    const result = this.auth.register(this.name(), this.email(), this.password());

    if (!result.success) {
      this.error.set(result.message);
      return;
    }

    this.success.set(result.message);
    setTimeout(() => this.router.navigate(['/menu']), 800);
  }
}
