import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
})
export class NavbarComponent {
  auth = inject(AuthService);
  cart = inject(CartService);
  router = inject(Router);
  notificationService = inject(NotificationService);

  notificationsOpen = signal(false);
  unreadCount = computed(() => this.notificationService.notifications().filter(n => !n.read && n.email === this.auth.user()?.email).length);
  notificationsList = computed(() => this.notificationService.getForUser(this.auth.user()?.email));

  logout(): void {
    this.auth.logout();
    this.cart.clear();
    this.router.navigate(['/login']);
  }

  toggleNotifications() {
    this.notificationsOpen.set(!this.notificationsOpen());
  }

  markRead(id: string) {
    this.notificationService.markRead(id);
  }
}
