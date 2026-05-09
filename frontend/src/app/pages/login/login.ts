import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, InputTextModule, CardModule, MessageModule],
  template: `
    <div class="w-full max-w-md p-6">
      <div class="text-center mb-6">
        <i class="pi pi-shield text-5xl text-indigo-600"></i>
        <h1 class="text-2xl font-semibold mt-2">SBNZ Concussion Protocol</h1>
        <p class="text-sm text-slate-500">Sign in to continue</p>
      </div>
      <p-card>
        <div class="space-y-3">
          <div class="flex flex-col gap-1">
            <label class="text-sm text-slate-600">Username</label>
            <input pInputText [(ngModel)]="username" (keyup.enter)="submit()" autofocus/>
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-sm text-slate-600">Password</label>
            <input pInputText type="password" [(ngModel)]="password" (keyup.enter)="submit()"/>
          </div>
          <p-message *ngIf="error()" severity="error" styleClass="w-full">{{ error() }}</p-message>
          <p-button label="Sign in" icon="pi pi-sign-in" (onClick)="submit()" [disabled]="!username || !password" styleClass="w-full"></p-button>
        </div>
      </p-card>
      <div class="mt-4 text-xs text-slate-500">
        <strong>Demo accounts:</strong>
        <ul class="m-0 pl-5 mt-1">
          <li>doctor / doctor — clinician view (full access)</li>
          <li>trainer / trainer — athletic trainer (clinician role)</li>
          <li>admin / admin — admin (template editor)</li>
          <li>Athletes log in with credentials provisioned at registration time</li>
        </ul>
      </div>
    </div>
  `
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  username = '';
  password = '';
  error = signal<string | null>(null);

  submit() {
    this.error.set(null);
    this.auth.login(this.username, this.password).subscribe({
      next: s => {
        if (s.role === 'ATHLETE' && s.athleteId) {
          this.router.navigate(['/athletes', s.athleteId]);
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      error: () => this.error.set('Invalid username or password')
    });
  }
}
