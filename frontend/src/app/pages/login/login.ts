import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, InputTextModule, MessageModule],
  template: `
    <div class="w-full max-w-sm p-8">
      <div class="mb-8">
        <h1 class="text-xl font-semibold m-0">SBNZ Concussion</h1>
        <p class="text-sm text-neutral-500 m-0 mt-1">Amsterdam 2022 graduated return-to-play protocol</p>
      </div>
      <div class="space-y-4">
        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-medium text-neutral-600">Username</label>
          <input pInputText [(ngModel)]="username" (keyup.enter)="submit()" autofocus class="w-full"/>
        </div>
        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-medium text-neutral-600">Password</label>
          <input pInputText type="password" [(ngModel)]="password" (keyup.enter)="submit()" class="w-full"/>
        </div>
        <p-message *ngIf="error()" severity="error" styleClass="w-full text-xs">{{ error() }}</p-message>
        <p-button label="Sign in" (onClick)="submit()" [disabled]="!username || !password" styleClass="w-full"></p-button>
      </div>
      <div class="mt-8 pt-6 border-t border-neutral-200 text-xs text-neutral-500 space-y-1">
        <p class="m-0 font-medium text-neutral-600">Demo accounts</p>
        <p class="m-0">doctor / doctor — clinician</p>
        <p class="m-0">trainer / trainer — clinician</p>
        <p class="m-0">admin / admin — template editor</p>
        <p class="m-0 mt-2 font-medium text-neutral-600">Demo athletes</p>
        <p class="m-0">marko / marko — adult, rugby, step 3</p>
        <p class="m-0">sara / sara — pediatric, soccer, step 2</p>
        <p class="m-0">luka / luka — adult, basketball, step 5</p>
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
