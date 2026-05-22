import { Routes } from '@angular/router';

import { HomeComponent } from './features/home/home';
import { MenuComponent } from './features/menu/menu';
import { LoginComponent } from './features/auth/login/login';
import { RegisterComponent } from './features/auth/register/register';
import { AuthGuard } from './services/auth.guard';
import { ProfileComponent } from './features/profile/profile';
import { CartComponent } from './features/cart/cart';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'menu', component: MenuComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'cart', component: CartComponent, canActivate: [AuthGuard] },
  { path: 'checkout', loadComponent: () => import('./features/checkout/checkout').then(m => m.CheckoutComponent), canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }
];
