import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, inject, signal, computed, effect } from '@angular/core';
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
    ButtonModule, CardModule, TagModule, SelectModule,
    InputNumberModule, InputTextModule, ChipModule, MessageModule, DividerModule, TableModule
  ],
  template: `
    <div *ngIf="dashboard() as d">
      <div class="flex items-center justify-between mb-4">
        <div>
          <a *ngIf="canSeeRoster()" routerLink="/dashboard" class="text-sm text-indigo-600 hover:underline">
            <i class="pi pi-arrow-left mr-1"></i>Roster
          </a>
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

      <div *ngIf="d.alerts.length" class="mb-4 space-y-2">
        <div *ngFor="let a of d.alerts" class="flex items-center gap-3 px-4 py-3 rounded border border-red-300 bg-red-50">
          <i class="pi pi-exclamation-triangle text-red-600 text-xl"></i>
          <div class="flex-1">
            <div class="font-semibold text-red-900">{{ a.message }}</div>
            <div class="text-sm text-red-700">Action: {{ a.actionType }} · Severity: {{ a.severity }}</div>
          </div>
        </div>
      </div>

      <div *ngIf="d.pediatricRtl?.length" class="mb-4 space-y-2">
        <div *ngFor="let p of d.pediatricRtl" class="flex items-center gap-3 px-4 py-3 rounded border border-blue-300 bg-blue-50">
          <i class="pi pi-book text-blue-600 text-xl"></i>
          <div class="text-sm text-blue-900">{{ p.message }}</div>
        </div>
      </div>

      <div *ngIf="d.individualizedAssessments?.length" class="mb-4 space-y-2">
        <div *ngFor="let i of d.individualizedAssessments" class="flex items-center gap-3 px-4 py-3 rounded border border-purple-300 bg-purple-50">
          <i class="pi pi-user-edit text-purple-600 text-xl"></i>
          <div class="text-sm text-purple-900">{{ i.reason }}</div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
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
                  Step {{ r.currentStep }} → {{ r.recommendedStep }}
                  <span *ngIf="r.retryAfterHours">· retry after {{ r.retryAfterHours }}h</span>
                </div>
              </div>
            </ng-container>
            <ng-template #noRec><p class="text-slate-500 m-0">No active recommendation.</p></ng-template>
          </p-card>

          <p-card header="Symptom timeline">
            <canvas #chart class="w-full" style="max-height: 240px;"></canvas>
            <p *ngIf="!history().length" class="text-slate-500 text-sm m-0 mt-2">No symptom reports yet.</p>
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

          <p-card *ngIf="canDoctor()" header="Step transitions and clearance">
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

          <p-card *ngIf="canDoctor()" header="Decision audit log (rule firing chain)">
            <p-table [value]="audit()" [paginator]="audit().length > 8" [rows]="8" responsiveLayout="scroll">
              <ng-template pTemplate="header">
                <tr>
                  <th>When</th>
                  <th>Trigger</th>
                  <th>By</th>
                  <th>Rules fired</th>
                  <th>Facts inserted</th>
                </tr>
              </ng-template>
              <ng-template pTemplate="body" let-e>
                <tr>
                  <td class="text-xs text-slate-500">{{ e.timestamp | date:'short' }}</td>
                  <td class="text-sm">{{ e.trigger }}</td>
                  <td class="text-sm">{{ e.actor }}</td>
                  <td>
                    <span *ngIf="!e.rulesFired?.length" class="text-slate-400">—</span>
                    <p-chip *ngFor="let r of e.rulesFired" [label]="r" styleClass="text-xs mr-1 mb-1"></p-chip>
                  </td>
                  <td>
                    <span *ngIf="!e.factsInserted?.length" class="text-slate-400">—</span>
                    <p-chip *ngFor="let f of e.factsInserted" [label]="f" styleClass="text-xs mr-1 mb-1"></p-chip>
                  </td>
                </tr>
              </ng-template>
              <ng-template pTemplate="emptymessage">
                <tr><td colspan="5" class="text-center py-4 text-slate-500">No decisions yet.</td></tr>
              </ng-template>
            </p-table>
          </p-card>
        </div>

        <div class="space-y-4">
          <p-card *ngIf="estimate() as est" header="Estimated earliest return">
            <div *ngIf="!est.error">
              <p class="text-3xl font-semibold m-0 text-indigo-700">{{ est.earliestReturn | date:'mediumDate' }}</p>
              <p class="text-xs text-slate-500 mt-1 m-0">
                {{ est.stepsRemaining }} steps remaining · {{ est.minHoursPerStep }}h minimum dwell per step
              </p>
              <p-divider></p-divider>
              <p class="text-xs text-slate-600 m-0">{{ est.note }}</p>
            </div>
            <p *ngIf="est.error" class="text-slate-500 m-0">{{ est.error }}</p>
          </p-card>

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
              <p-chip *ngIf="d.athlete.riskFactors.migraine" label="Migraine"></p-chip>
              <p-chip *ngIf="d.athlete.riskFactors.adhd" label="ADHD"></p-chip>
              <p-chip *ngIf="d.athlete.riskFactors.anxiety" label="Anxiety"></p-chip>
              <p-chip *ngIf="d.athlete.riskFactors.learningDifficulties" label="Learning difficulties"></p-chip>
              <p-chip *ngIf="d.athlete.riskFactors.mentalHealthHistory" label="Mental health history"></p-chip>
              <p-chip *ngIf="d.athlete.riskFactors.sleepDisorder" label="Sleep disorder"></p-chip>
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
    const palette = ['#6366f1', '#ef4444', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899', '#0ea5e9', '#84cc16'];
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
