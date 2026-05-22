import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [AuthService] });
    service = TestBed.inject(AuthService);
  });

  it('should initialize without an authenticated user', () => {
    expect(service.user()).toBeNull();
    expect(service.isAuthenticated()).toBeFalsy();
  });

  it('should reject invalid login credentials', () => {
    expect(service.login('bad@example.com', 'wrong')).toBeFalsy();
    expect(service.user()).toBeNull();
  });

  it('should register and authenticate a new user', () => {
    const result = service.register('Test User', 'test@example.com', 'password');

    expect(result.success).toBeTruthy();
    expect(service.isAuthenticated()).toBeTruthy();
    expect(service.user()?.email).toBe('test@example.com');
    expect(localStorage.getItem('ssc_user')).toContain('test@example.com');
  });

  it('should prevent duplicate registration for the same email', () => {
    service.register('Test User', 'test@example.com', 'password');
    const result = service.register('Duplicate', 'test@example.com', 'password2');

    expect(result.success).toBeFalsy();
    expect(result.message).toContain('already registered');
  });

  it('should log out an authenticated user', () => {
    service.register('Test User', 'test@example.com', 'password');
    service.logout();
    expect(service.user()).toBeNull();
    expect(service.isAuthenticated()).toBeFalsy();
    expect(localStorage.getItem('ssc_user')).toBeNull();
  });
});