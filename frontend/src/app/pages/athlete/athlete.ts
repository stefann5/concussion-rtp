import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import Chart from 'chart.js/auto';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../auth/auth.service';
import {
  Dashboard, ReadinessResult, EstimateReturn, AuditEntry, SymptomReportedEvent,
  SCAT6_SYMPTOMS, RED_FLAG_TYPES, STEP_NAMES
} from '../../models/domain';

@Component({
  selector: 'app-athlete',
  standalone: true,
  imports: [
    CommonModule, RouterLink, FormsModule,
    ButtonModule, TagModule, SelectModule,
    InputNumberModule, InputTextModule, MessageModule, TableModule
  ],
  template: `
    <div *ngIf="dashboard() as d">
      <div class="flex items-start justify-between mb-6">
        <div>
          <a *ngIf="canSeeRoster()" routerLink="/dashboard" class="text-sm text-neutral-500 hover:text-neutral-900">← Roster</a>
          <h2 class="text-xl font-semibold m-0 mt-1">{{ d.athlete.name }}</h2>
          <p class="text-sm text-neutral-500 m-0">
            {{ d.athlete.age }} · {{ d.athlete.sport }} · {{ d.athlete.contactLevel }} · history: {{ d.athlete.historyFlag }}
          </p>
        </div>
        <div class="text-right">
          <div class="text-2xl font-semibold">Step {{ d.athlete.currentStep }}</div>
          <p class="text-xs text-neutral-500 m-0 mt-0.5">{{ stepName(d.athlete.currentStep) }}</p>
        </div>
      </div>

      <div *ngFor="let a of d.alerts" class="mb-3 px-4 py-3 rounded-lg border border-red-200 bg-red-50">
        <div class="text-sm font-medium text-red-900">{{ a.message }}</div>
        <div class="text-xs text-red-700 mt-0.5">{{ a.actionType }} · {{ a.severity }}</div>
      </div>

      <div *ngFor="let p of d.pediatricRtl" class="mb-3 px-4 py-3 rounded-lg border border-blue-200 bg-blue-50 text-sm text-blue-900">{{ p.message }}</div>
      <div *ngFor="let i of d.individualizedAssessments" class="mb-3 px-4 py-3 rounded-lg border border-purple-200 bg-purple-50 text-sm text-purple-900">{{ i.reason }}</div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div class="lg:col-span-2 space-y-4">
          <section class="bg-white border border-neutral-200 rounded-lg p-4">
            <h3 class="text-xs uppercase tracking-wide text-neutral-500 m-0 mb-3">Recommendation</h3>
            <ng-container *ngIf="d.recommendations.length; else noRec">
              <div *ngFor="let r of d.recommendations" class="border-l-2 pl-3 py-1"
                   [ngClass]="{
                     'border-red-500': r.action === 'STOP_AND_RETRY' || r.action === 'REGRESS' || r.action === 'FREEZE',
                     'border-amber-500': r.action === 'HOLD',
                     'border-emerald-500': r.action === 'ADVANCE'
                   }">
                <div class="font-medium text-sm">{{ r.action }}</div>
                <div class="text-sm text-neutral-700">{{ r.explanation }}</div>
                <div class="text-xs text-neutral-500 mt-1">
                  Step {{ r.currentStep }} → {{ r.recommendedStep }}<span *ngIf="r.retryAfterHours"> · retry after {{ r.retryAfterHours }}h</span>
                </div>
              </div>
            </ng-container>
            <ng-template #noRec><p class="text-sm text-neutral-500 m-0">No active recommendation.</p></ng-template>
          </section>

          <section class="bg-white border border-neutral-200 rounded-lg p-4">
            <h3 class="text-xs uppercase tracking-wide text-neutral-500 m-0 mb-3">Symptom timeline</h3>
            <canvas #chart class="w-full" style="max-height: 220px;"></canvas>
            <p *ngIf="!history().length" class="text-sm text-neutral-500 m-0 mt-2">No symptom reports yet.</p>
          </section>

          <section class="bg-white border border-neutral-200 rounded-lg p-4">
            <h3 class="text-xs uppercase tracking-wide text-neutral-500 m-0 mb-3">Allowed activities</h3>
            <div class="flex flex-wrap gap-1.5">
              <span *ngFor="let act of allowed()" class="text-xs px-2 py-1 rounded border border-neutral-200 bg-neutral-50 text-neutral-700">{{ act }}</span>
              <span *ngIf="!allowed().length" class="text-sm text-neutral-500">None permitted.</span>
            </div>
          </section>

          <section class="bg-white border border-neutral-200 rounded-lg p-4">
            <h3 class="text-xs uppercase tracking-wide text-neutral-500 m-0 mb-4">Daily input</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 class="text-sm font-medium m-0 mb-2">Symptom (SCAT6)</h4>
                <div class="space-y-2">
                  <p-select [(ngModel)]="symInput.symptom" [options]="symptomOptions" placeholder="Symptom" styleClass="w-full"></p-select>
                  <p-inputNumber [(ngModel)]="symInput.level" [min]="0" [max]="6" placeholder="Level 0–6" styleClass="w-full"></p-inputNumber>
                  <p-button label="Submit" size="small" (onClick)="reportSymptom()" [disabled]="!symInput.symptom"></p-button>
                </div>
              </div>
              <div>
                <h4 class="text-sm font-medium m-0 mb-2">Exertion attempt</h4>
                <div class="space-y-2">
                  <input pInputText [(ngModel)]="exInput.activity" placeholder="Activity (e.g. JOGGING)" class="w-full"/>
                  <input pInputText [(ngModel)]="exInput.intensity" placeholder="Intensity" class="w-full"/>
                  <p-button label="Log attempt" size="small" (onClick)="reportExertion()"></p-button>
                </div>
              </div>
              <div>
                <h4 class="text-sm font-medium m-0 mb-2">Symptom during exertion</h4>
                <div class="space-y-2">
                  <p-select [(ngModel)]="duringInput.symptom" [options]="symptomOptions" placeholder="Symptom" styleClass="w-full"></p-select>
                  <p-inputNumber [(ngModel)]="duringInput.delta" [min]="0" [max]="10" placeholder="Δ severity" styleClass="w-full"></p-inputNumber>
                  <p-inputNumber [(ngModel)]="duringInput.durationMinutes" [min]="0" placeholder="Duration min" styleClass="w-full"></p-inputNumber>
                  <p-button label="Log exacerbation" size="small" severity="warn" (onClick)="reportDuringExertion()"></p-button>
                </div>
              </div>
              <div>
                <h4 class="text-sm font-medium m-0 mb-2">Red flag</h4>
                <div class="space-y-2">
                  <p-select [(ngModel)]="redFlagInput.symptom" [options]="redFlagOptions" placeholder="Red flag" styleClass="w-full"></p-select>
                  <p-button label="Trigger red flag" size="small" severity="danger" (onClick)="reportRedFlag()" [disabled]="!redFlagInput.symptom"></p-button>
                </div>
              </div>
            </div>
          </section>

          <section *ngIf="canDoctor()" class="bg-white border border-neutral-200 rounded-lg p-4">
            <h3 class="text-xs uppercase tracking-wide text-neutral-500 m-0 mb-4">Step transitions and clearance</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 class="text-sm font-medium m-0 mb-2">Advance / regress</h4>
                <div class="space-y-2">
                  <p-select [(ngModel)]="advanceInput.toStep" [options]="stepOptions" placeholder="Target step" styleClass="w-full"></p-select>
                  <div class="flex gap-2">
                    <p-button label="Move step" size="small" severity="success" (onClick)="advance()"></p-button>
                    <p-button label="Check readiness" size="small" severity="secondary" [outlined]="true" (onClick)="checkReadiness()"></p-button>
                  </div>
                </div>
                <p-message *ngIf="readiness() as r" [severity]="r.ready ? 'success' : 'warn'" styleClass="mt-3 w-full">
                  <div class="text-xs">
                    <strong>{{ r.ready ? 'Ready' : 'Not ready' }}</strong>
                    <ul *ngIf="!r.ready" class="m-0 pl-4 mt-1">
                      <li *ngFor="let c of r.unmetConditions">{{ c }}</li>
                    </ul>
                  </div>
                </p-message>
              </div>
              <div>
                <h4 class="text-sm font-medium m-0 mb-2">Medical clearance</h4>
                <div class="space-y-2">
                  <p-select [(ngModel)]="clearanceInput.clearanceForStep" [options]="stepOptions" placeholder="For step" styleClass="w-full"></p-select>
                  <input pInputText [(ngModel)]="clearanceInput.physicianId" placeholder="Physician ID" class="w-full"/>
                  <input pInputText [(ngModel)]="clearanceInput.note" placeholder="Note" class="w-full"/>
                  <p-button label="Record clearance" size="small" (onClick)="recordClearance()"></p-button>
                </div>
              </div>
            </div>
          </section>

          <section *ngIf="canDoctor()" class="bg-white border border-neutral-200 rounded-lg overflow-hidden">
            <div class="px-4 py-3 border-b border-neutral-200">
              <h3 class="text-xs uppercase tracking-wide text-neutral-500 m-0">Decision audit</h3>
            </div>
            <p-table [value]="audit()" [paginator]="audit().length > 8" [rows]="8">
              <ng-template pTemplate="header">
                <tr class="text-xs uppercase tracking-wide text-neutral-500">
                  <th>When</th>
                  <th>Trigger</th>
                  <th>By</th>
                  <th>Rules fired</th>
                </tr>
              </ng-template>
              <ng-template pTemplate="body" let-e>
                <tr>
                  <td class="text-xs text-neutral-500">{{ e.timestamp | date:'short' }}</td>
                  <td class="text-sm">{{ e.trigger }}</td>
                  <td class="text-sm text-neutral-600">{{ e.actor }}</td>
                  <td>
                    <span *ngIf="!e.rulesFired?.length" class="text-neutral-400 text-sm">—</span>
                    <span *ngFor="let r of e.rulesFired" class="text-xs px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-700 mr-1 mb-1 inline-block">{{ r }}</span>
                  </td>
                </tr>
              </ng-template>
              <ng-template pTemplate="emptymessage">
                <tr><td colspan="4" class="text-center py-6 text-sm text-neutral-500">No decisions yet.</td></tr>
              </ng-template>
            </p-table>
          </section>
        </div>

        <div class="space-y-4">
          <section *ngIf="estimate() as est" class="bg-white border border-neutral-200 rounded-lg p-4">
            <h3 class="text-xs uppercase tracking-wide text-neutral-500 m-0 mb-2">Estimated earliest return</h3>
            <div *ngIf="!est.error">
              <p class="text-2xl font-semibold tabular-nums m-0">{{ est.earliestReturn | date:'mediumDate' }}</p>
              <p class="text-xs text-neutral-500 m-0 mt-1">
                {{ est.stepsRemaining }} steps remaining · {{ est.minHoursPerStep }}h per step
              </p>
              <p class="text-xs text-neutral-500 m-0 mt-2 leading-relaxed">{{ est.note }}</p>
            </div>
            <p *ngIf="est.error" class="text-sm text-neutral-500 m-0">{{ est.error }}</p>
          </section>

          <section class="bg-white border border-neutral-200 rounded-lg p-4">
            <h3 class="text-xs uppercase tracking-wide text-neutral-500 m-0 mb-3">Derived facts</h3>
            <div class="space-y-2 text-sm">
              <div *ngIf="d.intoleranceFlags.length" class="text-red-700">
                <div class="font-medium">Exertion intolerance</div>
                <div *ngFor="let f of d.intoleranceFlags" class="text-neutral-700 text-xs">{{ f.reason }}</div>
              </div>
              <div *ngIf="d.regressTriggers.length" class="text-amber-700">
                <div class="font-medium">Regress trigger</div>
                <div *ngFor="let f of d.regressTriggers" class="text-neutral-700 text-xs">{{ f.reason }}</div>
              </div>
              <div *ngIf="d.exacerbations.length" class="text-amber-700">
                <div class="font-medium">Exacerbations</div>
                <div *ngFor="let e of d.exacerbations" class="text-neutral-700 text-xs">
                  {{ e.symptom }} +{{ e.delta }} for {{ e.durationMinutes }} min
                </div>
              </div>
              <div *ngIf="d.persisting.length" class="text-purple-700">
                <div class="font-medium">Persisting symptoms</div>
                <div *ngFor="let f of d.persisting" class="text-neutral-700 text-xs">{{ f.reason }}</div>
              </div>
              <div *ngIf="d.rehabIndications.length" class="text-blue-700">
                <div class="font-medium">Rehab indication</div>
                <div *ngFor="let f of d.rehabIndications" class="text-neutral-700 text-xs">{{ f.reason }}</div>
              </div>
              <div *ngIf="d.locks.length" class="text-neutral-800">
                <div class="font-medium">Protocol lock</div>
                <div *ngFor="let l of d.locks" class="text-neutral-700 text-xs">{{ l.reason }} ({{ l.lockUntilHours }}h)</div>
              </div>
              <div *ngIf="d.blocks.length" class="text-red-700">
                <div class="font-medium">Blocked activities</div>
                <div *ngFor="let b of d.blocks" class="text-neutral-700 text-xs">{{ b.message }}</div>
              </div>
              <div *ngIf="!hasAnyDerived(d)" class="text-neutral-500">All clear.</div>
            </div>
          </section>

          <section class="bg-white border border-neutral-200 rounded-lg p-4">
            <h3 class="text-xs uppercase tracking-wide text-neutral-500 m-0 mb-3">CISG risk profile</h3>
            <div class="flex flex-wrap gap-1.5">
              <span *ngIf="d.athlete.riskFactors.migraine" class="text-xs px-2 py-1 rounded border border-neutral-200 text-neutral-700">Migraine</span>
              <span *ngIf="d.athlete.riskFactors.adhd" class="text-xs px-2 py-1 rounded border border-neutral-200 text-neutral-700">ADHD</span>
              <span *ngIf="d.athlete.riskFactors.anxiety" class="text-xs px-2 py-1 rounded border border-neutral-200 text-neutral-700">Anxiety</span>
              <span *ngIf="d.athlete.riskFactors.learningDifficulties" class="text-xs px-2 py-1 rounded border border-neutral-200 text-neutral-700">Learning difficulties</span>
              <span *ngIf="d.athlete.riskFactors.mentalHealthHistory" class="text-xs px-2 py-1 rounded border border-neutral-200 text-neutral-700">Mental health history</span>
              <span *ngIf="d.athlete.riskFactors.sleepDisorder" class="text-xs px-2 py-1 rounded border border-neutral-200 text-neutral-700">Sleep disorder</span>
              <span *ngIf="!hasRiskFactor(d)" class="text-sm text-neutral-500">None reported.</span>
            </div>
            <hr class="my-3 border-neutral-200"/>
            <p class="text-sm text-neutral-600 m-0">Previous concussions: {{ d.athlete.previousConcussions.length || 0 }}</p>
          </section>
        </div>
      </div>
    </div>
  `
})
export class AthleteComponent implements OnInit, AfterViewInit, OnDestroy {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  private auth = inject(AuthService);

  @ViewChild('chart') chartRef?: ElementRef<HTMLCanvasElement>;
  private chart?: Chart;

  dashboard = signal<Dashboard | null>(null);
  allowed = signal<string[]>([]);
  history = signal<SymptomReportedEvent[]>([]);
  estimate = signal<EstimateReturn | null>(null);
  audit = signal<AuditEntry[]>([]);
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

  canDoctor = computed(() => this.auth.role() === 'DOCTOR' || this.auth.role() === 'ADMIN');
  canSeeRoster = computed(() => this.canDoctor());

  constructor() {
    effect(() => {
      const h = this.history();
      if (this.chart) this.updateChart(h);
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.refresh(id);
  }

  ngAfterViewInit() {
    if (this.chartRef) {
      this.chart = new Chart(this.chartRef.nativeElement, {
        type: 'line',
        data: { labels: [], datasets: [] },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 10 } } } },
          scales: { y: { min: 0, max: 6, title: { display: true, text: 'Severity 0-6' } } }
        }
      });
      this.updateChart(this.history());
    }
  }

  ngOnDestroy() { this.chart?.destroy(); }

  private updateChart(history: SymptomReportedEvent[]) {
    if (!this.chart) return;
    const bySymptom = new Map<string, { x: string; y: number }[]>();
    history.forEach(ev => {
      const arr = bySymptom.get(ev.symptom) ?? [];
      arr.push({ x: ev.timestamp ?? new Date().toISOString(), y: ev.level });
      bySymptom.set(ev.symptom, arr);
    });
    const palette = ['#1f2937', '#ef4444', '#f59e0b', '#10b981', '#6366f1', '#ec4899', '#0ea5e9', '#84cc16'];
    const labels = Array.from(new Set(history.map(h => new Date(h.timestamp ?? '').toLocaleString())));
    this.chart.data.labels = labels;
    this.chart.data.datasets = Array.from(bySymptom.entries()).map(([sym, points], i) => ({
      label: sym,
      data: points.map(p => p.y),
      borderColor: palette[i % palette.length],
      backgroundColor: palette[i % palette.length],
      tension: 0.2
    }));
    this.chart.update();
  }

  refresh(id?: string) {
    const aid = id ?? this.athleteId();
    if (!aid) return;
    this.api.dashboard(aid).subscribe(d => this.dashboard.set(d));
    this.api.allowedActivities(aid).subscribe(r => this.allowed.set(r.activities));
    this.api.symptomHistory(aid).subscribe(h => this.history.set(h));
    this.api.estimatedReturn(aid).subscribe(e => this.estimate.set(e));
    if (this.canDoctor()) {
      this.api.auditFor(aid).subscribe(a => this.audit.set(a));
    }
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
