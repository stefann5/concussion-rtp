import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forbidden',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="text-center max-w-md">
      <i class="pi pi-lock text-5xl text-red-600"></i>
      <h2 class="text-2xl font-semibold mt-2">Access denied</h2>
      <p class="text-slate-500">Your role does not allow access to this page.</p>
      <a routerLink="/" class="text-indigo-600 hover:underline">Back to start</a>
    </div>
  `
})
export class ForbiddenComponent {}
