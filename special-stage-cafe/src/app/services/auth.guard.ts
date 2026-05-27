import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route?: ActivatedRouteSnapshot, state?: RouterStateSnapshot): boolean {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }

    // Prevent admins from accessing cart route
    const url = state?.url || route?.url?.join('/') || '';
    if (url.includes('/cart') && this.auth.isAdmin()) {
      this.router.navigate(['/']);
      return false;
    }

    return true;
  }
}
