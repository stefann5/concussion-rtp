import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageModule } from 'primeng/message';
import { ApiService } from '../../services/api.service';
import { Athlete, STEP_NAMES } from '../../models/domain';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, InputTextModule, InputNumberModule, SelectModule, CheckboxModule, MessageModule],
  template: `
    <div class="max-w-3xl">
      <h2 class="text-xl font-semibold m-0 mb-6">Register athlete</h2>

      <div class="bg-white border border-neutral-200 rounded-lg p-6 mb-4">
        <h3 class="text-xs uppercase tracking-wide text-neutral-500 m-0 mb-4">Profile</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label class="flex flex-col gap-1.5">
            <span class="text-xs font-medium text-neutral-600">Full name</span>
            <input pInputText [(ngModel)]="athlete.name"/>
          </label>
          <label class="flex flex-col gap-1.5">
            <span class="text-xs font-medium text-neutral-600">Age</span>
            <p-inputNumber [(ngModel)]="athlete.age"></p-inputNumber>
          </label>
          <label class="flex flex-col gap-1.5">
            <span class="text-xs font-medium text-neutral-600">Sex</span>
            <p-select [(ngModel)]="athlete.sex" [options]="sexes" placeholder="—"></p-select>
          </label>
          <label class="flex flex-col gap-1.5">
            <span class="text-xs font-medium text-neutral-600">Sport</span>
            <input pInputText [(ngModel)]="athlete.sport"/>
          </label>
          <label class="flex flex-col gap-1.5">
            <span class="text-xs font-medium text-neutral-600">Position</span>
            <input pInputText [(ngModel)]="athlete.position"/>
          </label>
          <label class="flex flex-col gap-1.5">
            <span class="text-xs font-medium text-neutral-600">Contact level</span>
            <p-select [(ngModel)]="athlete.contactLevel" [options]="contactLevels"></p-select>
          </label>
          <label class="flex flex-col gap-1.5">
            <span class="text-xs font-medium text-neutral-600">Concussion history</span>
            <p-select [(ngModel)]="athlete.historyFlag" [options]="historyFlags"></p-select>
          </label>
          <label class="flex flex-col gap-1.5">
            <span class="text-xs font-medium text-neutral-600">Starting step</span>
            <p-select [(ngModel)]="athlete.currentStep" [options]="stepOptions" optionLabel="label" optionValue="value"></p-select>
          </label>
        </div>
      </div>

      <div class="bg-white border border-neutral-200 rounded-lg p-6 mb-4">
        <h3 class="text-xs uppercase tracking-wide text-neutral-500 m-0 mb-4">CISG risk factors</h3>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
          <label class="flex items-center gap-2 text-sm">
            <p-checkbox [(ngModel)]="athlete.riskFactors.migraine" [binary]="true"></p-checkbox>
            Migraine
          </label>
          <label class="flex items-center gap-2 text-sm">
            <p-checkbox [(ngModel)]="athlete.riskFactors.adhd" [binary]="true"></p-checkbox>
            ADHD
          </label>
          <label class="flex items-center gap-2 text-sm">
            <p-checkbox [(ngModel)]="athlete.riskFactors.anxiety" [binary]="true"></p-checkbox>
            Anxiety
          </label>
          <label class="flex items-center gap-2 text-sm">
            <p-checkbox [(ngModel)]="athlete.riskFactors.learningDifficulties" [binary]="true"></p-checkbox>
            Learning difficulties
          </label>
          <label class="flex items-center gap-2 text-sm">
            <p-checkbox [(ngModel)]="athlete.riskFactors.mentalHealthHistory" [binary]="true"></p-checkbox>
            Mental health history
          </label>
          <label class="flex items-center gap-2 text-sm">
            <p-checkbox [(ngModel)]="athlete.riskFactors.sleepDisorder" [binary]="true"></p-checkbox>
            Sleep disorder
          </label>
        </div>
      </div>

      <div class="bg-white border border-neutral-200 rounded-lg p-6 mb-4">
        <h3 class="text-xs uppercase tracking-wide text-neutral-500 m-0 mb-1">Athlete login</h3>
        <p class="text-xs text-neutral-500 m-0 mb-4">Required. The athlete will use these credentials to sign in and view their own protocol.</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label class="flex flex-col gap-1.5">
            <span class="text-xs font-medium text-neutral-600">Username</span>
            <input pInputText [(ngModel)]="account.username"/>
          </label>
          <label class="flex flex-col gap-1.5">
            <span class="text-xs font-medium text-neutral-600">Password</span>
            <input pInputText type="password" [(ngModel)]="account.password"/>
          </label>
        </div>
      </div>

      <p-message *ngIf="error()" severity="error" styleClass="w-full mb-4">{{ error() }}</p-message>

      <div class="flex gap-2">
        <p-button label="Register" (onClick)="submit()" [disabled]="!isValid()"></p-button>
        <p-button label="Cancel" severity="secondary" [text]="true" (onClick)="cancel()"></p-button>
      </div>
    </div>
  `
})
export class RegisterComponent {
  private api = inject(ApiService);
  private router = inject(Router);

  account = { username: '', password: '' };
  error = signal<string | null>(null);

  athlete: Athlete = {
    id: '',
    name: '',
    age: 18,
    sport: '',
    contactLevel: 'CONTACT',
    historyFlag: 'NONE',
    riskFactors: {
      migraine: false, adhd: false, anxiety: false,
      learningDifficulties: false, mentalHealthHistory: false, sleepDisorder: false
    },
    previousConcussions: [],
    baselineSymptoms: {},
    currentStep: 1
  };

  sexes = [{ label: 'Male', value: 'MALE' }, { label: 'Female', value: 'FEMALE' }, { label: 'Other', value: 'OTHER' }];
  contactLevels = [{ label: 'Contact', value: 'CONTACT' }, { label: 'Non-contact', value: 'NONCONTACT' }];
  historyFlags = [
    { label: 'No previous concussions', value: 'NONE' },
    { label: 'One previous', value: 'SINGLE' },
    { label: 'Multiple', value: 'MULTIPLE' }
  ];
  stepOptions = Object.entries(STEP_NAMES).map(([k, v]) => ({ label: `Step ${k} — ${v}`, value: parseInt(k, 10) }));

  isValid(): boolean {
    return !!this.athlete.name && !!this.athlete.sport
        && !!this.account.username && !!this.account.password;
  }

  submit() {
    this.error.set(null);
    this.api.registerAthlete({
      athlete: this.athlete,
      username: this.account.username,
      password: this.account.password
    }).subscribe({
      next: a => this.router.navigate(['/athletes', a.id]),
      error: e => this.error.set(e.error?.error ?? 'Registration failed')
    });
  }

  cancel() { this.router.navigate(['/dashboard']); }
}
