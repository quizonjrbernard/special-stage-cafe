import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { OrdersService } from '../../services/orders.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent {
  auth = inject(AuthService);
  ordersService = inject(OrdersService);
  orders = this.ordersService.getOrders();

  logout() { this.auth.logout(); }
}
