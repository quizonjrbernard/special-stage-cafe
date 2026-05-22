import { Routes } from '@angular/router';

import { HomeComponent } from './features/home/home';
import { MenuComponent } from './features/menu/menu';
import { LoginComponent } from './features/auth/login/login';
import { RegisterComponent } from './features/auth/register/register';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent }
];
