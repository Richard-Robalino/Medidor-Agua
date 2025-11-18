import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/auth/login/login.page').then(m => m.LoginPage),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/auth/register/register.page').then(m => m.RegisterPage),
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./pages/auth/forgot-password/forgot-password.page').then(
        m => m.ForgotPasswordPage
      ),
  },
  {
    path: 'update-password',
    loadComponent: () =>
      import('./pages/auth/update-password/update-password.page').then(
        m => m.UpdatePasswordPage
      ),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/dashboard/dashboard.page').then(m => m.DashboardPage)
  },
  {
    path: 'new-reading',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/readings/new-reading.page').then(m => m.NewReadingPage)
  },
  {
    path: 'my-readings',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/readings/my-readings.page').then(m => m.MyReadingsPage)
  },
  {
    path: 'all-readings',
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('./pages/readings/all-readings.page').then(m => m.AllReadingsPage)
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
