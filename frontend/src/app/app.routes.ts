import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./pages/login/login').then(m => m.LoginComponent) },
  { path: 'forbidden', loadComponent: () => import('./pages/forbidden/forbidden').then(m => m.ForbiddenComponent) },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    data: { roles: ['DOCTOR', 'ADMIN'] },
    loadComponent: () => import('./pages/roster/roster').then(m => m.RosterComponent)
  },
  {
    path: 'athletes/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/athlete/athlete').then(m => m.AthleteComponent)
  },
  {
    path: 'register',
    canActivate: [authGuard],
    data: { roles: ['DOCTOR', 'ADMIN'] },
    loadComponent: () => import('./pages/register/register').then(m => m.RegisterComponent)
  },
  {
    path: 'reports',
    canActivate: [authGuard],
    data: { roles: ['DOCTOR', 'ADMIN'] },
    loadComponent: () => import('./pages/reports/reports').then(m => m.ReportsComponent)
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] },
    loadComponent: () => import('./pages/admin/admin').then(m => m.AdminComponent)
  },
  {
    path: 'audit',
    canActivate: [authGuard],
    data: { roles: ['DOCTOR', 'ADMIN'] },
    loadComponent: () => import('./pages/audit/audit').then(m => m.AuditComponent)
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard' }
];
