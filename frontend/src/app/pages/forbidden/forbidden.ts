import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forbidden',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="text-center max-w-sm">
      <h2 class="text-xl font-semibold m-0">Access denied</h2>
      <p class="text-sm text-neutral-500 m-0 mt-1 mb-4">Your role does not allow access to this page.</p>
      <a routerLink="/" class="text-sm text-neutral-700 hover:underline">Back to start</a>
    </div>
  `
})
export class ForbiddenComponent {}
