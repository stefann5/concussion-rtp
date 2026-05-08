import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ChipModule } from 'primeng/chip';
import { MessageModule } from 'primeng/message';
import { DividerModule } from 'primeng/divider';
import { ApiService } from '../../services/api.service';
import { Dashboard, ReadinessResult, SCAT6_SYMPTOMS, RED_FLAG_TYPES, STEP_NAMES } from '../../models/domain';

@Component({
  selector: 'app-athlete',
  standalone: true,
  imports: [
    CommonModule, RouterLink, FormsModule,
    ButtonModule, CardModule, TagModule, SelectModule,
    InputNumberModule, InputTextModule, ChipModule, MessageModule, DividerModule
  ],
  template: `
    <div *ngIf="dashboard() as d">
      <div class="flex items-center justify-between mb-4">
        <div>
          <a routerLink="/dashboard" class="text-sm text-indigo-600 hover:underline"><i class="pi pi-arrow-left mr-1"></i>Roster</a>
          <h2 class="text-2xl font-semibold m-0 mt-1">{{ d.athlete.name }}</h2>
          <p class="text-sm text-slate-500 m-0">
            {{ d.athlete.age }} y/o {{ d.athlete.sport }} · {{ d.athlete.contactLevel }} · history: {{ d.athlete.historyFlag }}
          </p>
        </div>
        <div class="text-right">
          <p-tag [value]="'Step ' + d.athlete.currentStep" severity="info" styleClass="text-base"></p-tag>
          <p class="text-xs text-slate-500 mt-1 m-0">{{ stepName(d.athlete.currentStep) }}</p>
        </div>
      </div>

      <!-- Critical alerts -->
      <div *ngIf="d.alerts.length" class="mb-4 space-y-2">
        <div *ngFor="let a of d.alerts" class="flex items-center gap-3 px-4 py-3 rounded border border-red-300 bg-red-50">
          <i class="pi pi-exclamation-triangle text-red-600 text-xl"></i>
          <div class="flex-1">
            <div class="font-semibold text-red-900">{{ a.message }}</div>
            <div class="text-sm text-red-700">Action: {{ a.actionType }} · Severity: {{ a.severity }}</div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <!-- Left column: recommendation, allowed activities, readiness -->
        <div class="lg:col-span-2 space-y-4">
          <p-card header="Current recommendation">
            <ng-container *ngIf="d.recommendations.length; else noRec">
              <div *ngFor="let r of d.recommendations" class="border-l-4 pl-4 py-2"
                   [ngClass]="{
                     'border-red-500 bg-red-50': r.action === 'STOP_AND_RETRY' || r.action === 'REGRESS' || r.action === 'FREEZE',
                     'border-amber-500 bg-amber-50': r.action === 'HOLD',
                     'border-emerald-500 bg-emerald-50': r.action === 'ADVANCE'
                   }">
                <div class="font-semibold">{{ r.action }}</div>
                <div class="text-sm text-slate-700">{{ r.explanation }}</div>
                <div class="text-xs text-slate-500 mt-1">
                  Current step {{ r.currentStep }} → recommended {{ r.recommendedStep }}
                  <span *ngIf="r.retryAfterHours">· retry after {{ r.retryAfterHours }}h</span>
                </div>
              </div>
            </ng-container>
            <ng-template #noRec><p class="text-slate-500 m-0">No active recommendation.</p></ng-template>
          </p-card>

          <p-card header="Allowed activities for current step">
            <div class="flex flex-wrap gap-2">
              <p-chip *ngFor="let act of allowed()" [label]="act" icon="pi pi-check"></p-chip>
              <span *ngIf="!allowed().length" class="text-slate-500">No activities permitted.</span>
            </div>
          </p-card>

          <p-card header="Daily inputs">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 class="text-sm font-semibold m-0 mb-2">Report symptom (SCAT6)</h4>
                <div class="space-y-2">
                  <p-select [(ngModel)]="symInput.symptom" [options]="symptomOptions" placeholder="Symptom" styleClass="w-full"></p-select>
                  <p-inputNumber [(ngModel)]="symInput.level" [min]="0" [max]="6" placeholder="Level 0-6" styleClass="w-full"></p-inputNumber>
                  <p-button label="Submit symptom" icon="pi pi-send" (onClick)="reportSymptom()" [disabled]="!symInput.symptom"></p-button>
                </div>
              </div>
              <div>
                <h4 class="text-sm font-semibold m-0 mb-2">Exertion attempt</h4>
                <div class="space-y-2">
                  <input pInputText [(ngModel)]="exInput.activity" placeholder="Activity (e.g. JOGGING)" class="w-full"/>
                  <input pInputText [(ngModel)]="exInput.intensity" placeholder="Intensity" class="w-full"/>
                  <p-button label="Log attempt" icon="pi pi-play" (onClick)="reportExertion()"></p-button>
                </div>
              </div>
              <div>
                <h4 class="text-sm font-semibold m-0 mb-2">Symptom during exertion</h4>
                <div class="space-y-2">
                  <p-select [(ngModel)]="duringInput.symptom" [options]="symptomOptions" placeholder="Symptom" styleClass="w-full"></p-select>
                  <p-inputNumber [(ngModel)]="duringInput.delta" [min]="0" [max]="10" placeholder="Delta 0-10" styleClass="w-full"></p-inputNumber>
                  <p-inputNumber [(ngModel)]="duringInput.durationMinutes" [min]="0" placeholder="Duration min" styleClass="w-full"></p-inputNumber>
                  <p-button label="Log exacerbation" icon="pi pi-bolt" severity="warn" (onClick)="reportDuringExertion()"></p-button>
                </div>
              </div>
              <div>
                <h4 class="text-sm font-semibold m-0 mb-2">Red flag</h4>
                <div class="space-y-2">
                  <p-select [(ngModel)]="redFlagInput.symptom" [options]="redFlagOptions" placeholder="Red flag" styleClass="w-full"></p-select>
                  <p-button label="Trigger red flag" icon="pi pi-exclamation-triangle" severity="danger" (onClick)="reportRedFlag()" [disabled]="!redFlagInput.symptom"></p-button>
                </div>
              </div>
            </div>
          </p-card>

          <p-card header="Step transitions">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 class="text-sm font-semibold m-0 mb-2">Advance / regress</h4>
                <div class="space-y-2">
                  <p-select [(ngModel)]="advanceInput.toStep" [options]="stepOptions" placeholder="Target step" styleClass="w-full"></p-select>
                  <p-button label="Advance / move step" icon="pi pi-forward" severity="success" (onClick)="advance()"></p-button>
                  <p-button label="Check readiness" icon="pi pi-question-circle" severity="secondary" [outlined]="true" (onClick)="checkReadiness()"></p-button>
                </div>
                <p-message *ngIf="readiness() as r" [severity]="r.ready ? 'success' : 'warn'" styleClass="mt-3 w-full">
                  <div class="text-sm">
                    <strong>{{ r.ready ? 'Ready to advance' : 'Not ready' }}</strong>
                    <ul *ngIf="!r.ready" class="m-0 pl-4 mt-1">
                      <li *ngFor="let c of r.unmetConditions">{{ c }}</li>
                    </ul>
                  </div>
                </p-message>
              </div>
              <div>
                <h4 class="text-sm font-semibold m-0 mb-2">Medical clearance</h4>
                <div class="space-y-2">
                  <p-select [(ngModel)]="clearanceInput.clearanceForStep" [options]="stepOptions" placeholder="For step" styleClass="w-full"></p-select>
                  <input pInputText [(ngModel)]="clearanceInput.physicianId" placeholder="Physician ID" class="w-full"/>
                  <input pInputText [(ngModel)]="clearanceInput.note" placeholder="Note" class="w-full"/>
                  <p-button label="Record clearance" icon="pi pi-verified" (onClick)="recordClearance()"></p-button>
                </div>
              </div>
            </div>
          </p-card>
        </div>

        <!-- Right column: derived facts -->
        <div class="space-y-4">
          <p-card header="Derived facts">
            <div class="space-y-3 text-sm">
              <div *ngIf="d.intoleranceFlags.length">
                <div class="font-semibold text-red-700 mb-1"><i class="pi pi-flag mr-1"></i>Exertion intolerance</div>
                <div *ngFor="let f of d.intoleranceFlags" class="text-slate-700">{{ f.reason }}</div>
              </div>
              <div *ngIf="d.regressTriggers.length">
                <div class="font-semibold text-amber-700 mb-1"><i class="pi pi-undo mr-1"></i>Regress trigger</div>
                <div *ngFor="let f of d.regressTriggers" class="text-slate-700">{{ f.reason }}</div>
              </div>
              <div *ngIf="d.exacerbations.length">
                <div class="font-semibold text-amber-700 mb-1"><i class="pi pi-chart-line mr-1"></i>Exacerbations</div>
                <div *ngFor="let e of d.exacerbations" class="text-slate-700">
                  {{ e.symptom }} +{{ e.delta }} for {{ e.durationMinutes }} min
                </div>
              </div>
              <div *ngIf="d.persisting.length">
                <div class="font-semibold text-purple-700 mb-1"><i class="pi pi-clock mr-1"></i>Persisting symptoms</div>
                <div *ngFor="let f of d.persisting" class="text-slate-700">{{ f.reason }}</div>
              </div>
              <div *ngIf="d.rehabIndications.length">
                <div class="font-semibold text-blue-700 mb-1"><i class="pi pi-heart mr-1"></i>Rehab indication</div>
                <div *ngFor="let f of d.rehabIndications" class="text-slate-700">{{ f.reason }}</div>
              </div>
              <div *ngIf="d.locks.length">
                <div class="font-semibold text-slate-700 mb-1"><i class="pi pi-lock mr-1"></i>Protocol locks</div>
                <div *ngFor="let l of d.locks" class="text-slate-700">{{ l.reason }} ({{ l.lockUntilHours }}h)</div>
              </div>
              <div *ngIf="d.blocks.length">
                <div class="font-semibold text-red-700 mb-1"><i class="pi pi-ban mr-1"></i>Blocked activities</div>
                <div *ngFor="let b of d.blocks" class="text-slate-700">{{ b.message }}</div>
              </div>
              <div *ngIf="!hasAnyDerived(d)" class="text-slate-500">All clear — clean slate.</div>
            </div>
          </p-card>

          <p-card header="CISG risk profile">
            <div class="flex flex-wrap gap-2">
              <p-chip *ngIf="d.athlete.riskFactors.migraine" label="Migraine" icon="pi pi-bolt"></p-chip>
              <p-chip *ngIf="d.athlete.riskFactors.adhd" label="ADHD" icon="pi pi-bolt"></p-chip>
              <p-chip *ngIf="d.athlete.riskFactors.anxiety" label="Anxiety" icon="pi pi-bolt"></p-chip>
              <p-chip *ngIf="d.athlete.riskFactors.learningDifficulties" label="Learning difficulties" icon="pi pi-bolt"></p-chip>
              <p-chip *ngIf="d.athlete.riskFactors.mentalHealthHistory" label="Mental health history" icon="pi pi-bolt"></p-chip>
              <p-chip *ngIf="d.athlete.riskFactors.sleepDisorder" label="Sleep disorder" icon="pi pi-bolt"></p-chip>
              <span *ngIf="!hasRiskFactor(d)" class="text-slate-500">None reported.</span>
            </div>
            <p-divider></p-divider>
            <div class="text-sm text-slate-600">
              Previous concussions: {{ d.athlete.previousConcussions.length || 0 }}
            </div>
          </p-card>
        </div>
      </div>
    </div>
  `
})
export class AthleteComponent implements OnInit {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);

  dashboard = signal<Dashboard | null>(null);
  allowed = signal<string[]>([]);
  readiness = signal<ReadinessResult | null>(null);

  athleteId = computed(() => this.dashboard()?.athlete?.id ?? '');

  symInput = { symptom: '', level: 0 };
  exInput = { activity: '', intensity: '' };
  duringInput = { symptom: '', delta: 0, durationMinutes: 0 };
  redFlagInput = { symptom: '' };
  advanceInput = { toStep: 2 };
  clearanceInput = { clearanceForStep: 4, physicianId: '', note: '' };

  symptomOptions = SCAT6_SYMPTOMS.map(s => ({ label: s, value: s }));
  redFlagOptions = RED_FLAG_TYPES.map(s => ({ label: s, value: s }));
  stepOptions = Object.entries(STEP_NAMES).map(([k, v]) => ({ label: `Step ${k} — ${v}`, value: parseInt(k, 10) }));

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.refresh(id);
  }

  refresh(id?: string) {
    const aid = id ?? this.athleteId();
    if (!aid) return;
    this.api.dashboard(aid).subscribe(d => this.dashboard.set(d));
    this.api.allowedActivities(aid).subscribe(r => this.allowed.set(r.activities));
  }

  reportSymptom() {
    this.api.reportSymptom({ athleteId: this.athleteId(), symptom: this.symInput.symptom, level: this.symInput.level })
      .subscribe(() => this.refresh());
  }

  reportRedFlag() {
    this.api.reportSymptom({ athleteId: this.athleteId(), symptom: this.redFlagInput.symptom, level: 6 })
      .subscribe(() => this.refresh());
  }

  reportExertion() {
    this.api.reportExertion({ athleteId: this.athleteId(), activity: this.exInput.activity, intensity: this.exInput.intensity })
      .subscribe(() => this.refresh());
  }

  reportDuringExertion() {
    this.api.reportSymptomDuringExertion({
      athleteId: this.athleteId(), symptom: this.duringInput.symptom,
      delta: this.duringInput.delta, durationMinutes: this.duringInput.durationMinutes
    }).subscribe(() => this.refresh());
  }

  advance() {
    const cur = this.dashboard()?.athlete.currentStep ?? 1;
    this.api.recordAdvancement({ athleteId: this.athleteId(), fromStep: cur, toStep: this.advanceInput.toStep })
      .subscribe(() => this.refresh());
  }

  recordClearance() {
    this.api.recordClearance({
      athleteId: this.athleteId(),
      clearanceForStep: this.clearanceInput.clearanceForStep,
      physicianId: this.clearanceInput.physicianId,
      note: this.clearanceInput.note
    }).subscribe(() => this.refresh());
  }

  checkReadiness() {
    this.api.readyToAdvance(this.athleteId(), this.advanceInput.toStep).subscribe(r => this.readiness.set(r));
  }

  stepName(s: number) { return STEP_NAMES[s] ?? '—'; }

  hasAnyDerived(d: Dashboard) {
    return d.intoleranceFlags.length || d.regressTriggers.length || d.exacerbations.length
        || d.persisting.length || d.rehabIndications.length || d.locks.length || d.blocks.length;
  }

  hasRiskFactor(d: Dashboard) {
    const r = d.athlete.riskFactors;
    return r.migraine || r.adhd || r.anxiety || r.learningDifficulties || r.mentalHealthHistory || r.sleepDisorder;
  }
}
