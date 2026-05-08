import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', loadComponent: () => import('./pages/roster/roster').then(m => m.RosterComponent) },
  { path: 'athletes/:id', loadComponent: () => import('./pages/athlete/athlete').then(m => m.AthleteComponent) },
  { path: 'register', loadComponent: () => import('./pages/register/register').then(m => m.RegisterComponent) },
  { path: 'reports', loadComponent: () => import('./pages/reports/reports').then(m => m.ReportsComponent) },
  { path: '**', redirectTo: 'dashboard' }
];
