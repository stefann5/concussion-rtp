import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../auth/auth.service';
import { Athlete, STEP_NAMES } from '../../models/domain';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, InputTextModule, InputNumberModule, SelectModule, CardModule, CheckboxModule],
  template: `
    <div class="max-w-3xl">
      <h2 class="text-2xl font-semibold mb-4">Register athlete</h2>
      <p-card>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex flex-col gap-1">
            <label class="text-sm text-slate-600">Athlete ID</label>
            <input pInputText [(ngModel)]="athlete.id" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-sm text-slate-600">Full name</label>
            <input pInputText [(ngModel)]="athlete.name" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-sm text-slate-600">Age</label>
            <p-inputNumber [(ngModel)]="athlete.age"></p-inputNumber>
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-sm text-slate-600">Sex</label>
            <p-select [(ngModel)]="athlete.sex" [options]="sexes" placeholder="Select"></p-select>
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-sm text-slate-600">Sport</label>
            <input pInputText [(ngModel)]="athlete.sport" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-sm text-slate-600">Position</label>
            <input pInputText [(ngModel)]="athlete.position" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-sm text-slate-600">Contact level</label>
            <p-select [(ngModel)]="athlete.contactLevel" [options]="contactLevels"></p-select>
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-sm text-slate-600">Age group</label>
            <p-select [(ngModel)]="athlete.ageGroup" [options]="ageGroups"></p-select>
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-sm text-slate-600">Concussion history</label>
            <p-select [(ngModel)]="athlete.historyFlag" [options]="historyFlags"></p-select>
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-sm text-slate-600">Starting protocol step</label>
            <p-select [(ngModel)]="athlete.currentStep" [options]="stepOptions" optionLabel="label" optionValue="value"></p-select>
          </div>
        </div>

        <div class="mt-6">
          <h3 class="text-base font-semibold mb-2">CISG risk factors</h3>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div class="flex items-center gap-2">
              <p-checkbox [(ngModel)]="athlete.riskFactors.migraine" [binary]="true" inputId="rf-migraine"></p-checkbox>
              <label for="rf-migraine" class="text-sm">Migraine</label>
            </div>
            <div class="flex items-center gap-2">
              <p-checkbox [(ngModel)]="athlete.riskFactors.adhd" [binary]="true" inputId="rf-adhd"></p-checkbox>
              <label for="rf-adhd" class="text-sm">ADHD</label>
            </div>
            <div class="flex items-center gap-2">
              <p-checkbox [(ngModel)]="athlete.riskFactors.anxiety" [binary]="true" inputId="rf-anx"></p-checkbox>
              <label for="rf-anx" class="text-sm">Anxiety</label>
            </div>
            <div class="flex items-center gap-2">
              <p-checkbox [(ngModel)]="athlete.riskFactors.learningDifficulties" [binary]="true" inputId="rf-ld"></p-checkbox>
              <label for="rf-ld" class="text-sm">Learning difficulties</label>
            </div>
            <div class="flex items-center gap-2">
              <p-checkbox [(ngModel)]="athlete.riskFactors.mentalHealthHistory" [binary]="true" inputId="rf-mh"></p-checkbox>
              <label for="rf-mh" class="text-sm">Mental health history</label>
            </div>
            <div class="flex items-center gap-2">
              <p-checkbox [(ngModel)]="athlete.riskFactors.sleepDisorder" [binary]="true" inputId="rf-sd"></p-checkbox>
              <label for="rf-sd" class="text-sm">Sleep disorder</label>
            </div>
          </div>
        </div>

        <div class="mt-6">
          <h3 class="text-base font-semibold mb-2">Athlete login credentials</h3>
          <p class="text-xs text-slate-500 mb-2">Optional. Provision a username/password so this athlete can log in and see their own protocol.</p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex flex-col gap-1">
              <label class="text-sm text-slate-600">Username</label>
              <input pInputText [(ngModel)]="account.username"/>
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-sm text-slate-600">Password</label>
              <input pInputText type="password" [(ngModel)]="account.password"/>
            </div>
          </div>
        </div>

        <div class="mt-6 flex gap-2">
          <p-button label="Register" icon="pi pi-check" (onClick)="submit()" [disabled]="!athlete.id || !athlete.name"></p-button>
          <p-button label="Cancel" severity="secondary" [outlined]="true" (onClick)="cancel()"></p-button>
        </div>
      </p-card>
    </div>
  `
})
export class RegisterComponent {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private router = inject(Router);

  account = { username: '', password: '' };

  athlete: Athlete = {
    id: '',
    name: '',
    age: 18,
    sport: '',
    contactLevel: 'CONTACT',
    ageGroup: 'ADULT',
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
  ageGroups = [{ label: 'Adult', value: 'ADULT' }, { label: 'Pediatric', value: 'PEDIATRIC' }];
  historyFlags = [
    { label: 'No previous concussions', value: 'NONE' },
    { label: 'One previous', value: 'SINGLE' },
    { label: 'Multiple', value: 'MULTIPLE' }
  ];
  stepOptions = Object.entries(STEP_NAMES).map(([k, v]) => ({ label: `Step ${k} — ${v}`, value: parseInt(k, 10) }));

  submit() {
    this.api.registerAthlete(this.athlete).subscribe(a => {
      if (this.account.username && this.account.password) {
        this.auth.registerAthleteAccount(a.id, this.account.username, this.account.password, a.name)
          .subscribe(() => this.router.navigate(['/athletes', a.id]));
      } else {
        this.router.navigate(['/athletes', a.id]);
      }
    });
  }

  cancel() { this.router.navigate(['/dashboard']); }
}
