import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { SliderModule } from 'primeng/slider';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import Chart from 'chart.js/auto';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../auth/auth.service';
import {
  Dashboard, ReadinessResult, EstimateReturn, AuditEntry, SymptomReportedEvent,
  SCAT6_SYMPTOMS, RED_FLAG_TYPES, STEP_NAMES
} from '../../models/domain';

interface DuringSymptom {
  symptom: string;
  delta: number;
  durationMinutes: number;
}

@Component({
  selector: 'app-athlete',
  standalone: true,
  imports: [
    CommonModule, RouterLink, FormsModule,
    ButtonModule, TagModule, SelectModule, InputTextModule, MessageModule, TableModule,
    SliderModule, ToggleSwitchModule, ToastModule
  ],
  providers: [MessageService],
  template: `
    <p-toast position="bottom-right"></p-toast>
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

      <!-- Emergency signs panel: prominent, compact, distinct -->
      <section class="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
        <div class="flex items-center justify-between mb-3">
          <div>
            <h3 class="text-xs uppercase tracking-wide text-red-700 m-0 font-semibold">Emergency signs</h3>
            <p class="text-xs text-red-600 m-0 mt-0.5">Tap to immediately flag and trigger emergency protocol.</p>
          </div>
        </div>
        <div class="flex flex-wrap gap-1.5">
          <button *ngFor="let f of redFlagOptions"
                  type="button"
                  (click)="triggerRedFlag(f)"
                  class="text-xs px-2 py-1.5 rounded border border-red-300 bg-white hover:bg-red-100 text-red-800 transition-colors">
            {{ f.replaceAll('_', ' ') | titlecase }}
          </button>
        </div>
      </section>

      <div *ngFor="let a of d.alerts" class="mb-3 px-4 py-3 rounded-lg border border-red-300 bg-red-50">
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
            <div style="position: relative; height: 260px;">
              <canvas #chart></canvas>
            </div>
            <p *ngIf="!history().length" class="text-sm text-neutral-500 m-0 mt-2">No symptom reports yet.</p>
          </section>

          <section class="bg-white border border-neutral-200 rounded-lg p-4">
            <h3 class="text-xs uppercase tracking-wide text-neutral-500 m-0 mb-3">Allowed activities</h3>
            <div class="flex flex-wrap gap-1.5">
              <span *ngFor="let act of allowed()" class="text-xs px-2 py-1 rounded border border-neutral-200 bg-neutral-50 text-neutral-700">{{ act }}</span>
              <span *ngIf="!allowed().length" class="text-sm text-neutral-500">None permitted.</span>
            </div>
          </section>

          <!-- Daily SCAT6 check: 22 sliders, locked once submitted today -->
          <section class="bg-white border border-neutral-200 rounded-lg p-4">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-xs uppercase tracking-wide text-neutral-500 m-0">Daily symptom check (at rest)</h3>
              <button *ngIf="!dailyLocked()" class="text-xs text-neutral-500 hover:text-neutral-900" (click)="resetDaily()">Reset</button>
              <span *ngIf="dailyLocked()" class="text-xs text-emerald-700">Submitted {{ dailySubmittedAt() | date:'shortTime' }}</span>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3" [class.opacity-70]="dailyLocked()">
              <div *ngFor="let s of symptomList" class="flex items-center gap-3">
                <span class="text-xs text-neutral-700 w-44 shrink-0">{{ formatSymptom(s) }}</span>
                <p-slider [(ngModel)]="dailyLevels[s]" [min]="0" [max]="6" [step]="1" [disabled]="dailyLocked()" class="flex-1"></p-slider>
                <span class="text-xs tabular-nums w-4 text-right" [class.text-neutral-400]="dailyLevels[s] === 0">{{ dailyLevels[s] || 0 }}</span>
              </div>
            </div>
            <div class="mt-4 flex items-center justify-between">
              <p class="text-xs text-neutral-500 m-0">
                <ng-container *ngIf="!dailyLocked()">{{ dailyNonZeroCount() }} symptom(s) selected</ng-container>
                <ng-container *ngIf="dailyLocked()">Today's check is locked. Next submission allowed tomorrow.</ng-container>
              </p>
              <p-button *ngIf="!dailyLocked()" label="Submit daily check" size="small" (onClick)="submitDailyCheck()"></p-button>
            </div>
          </section>

          <!-- Exertion form: attempt + optional symptoms -->
          <section class="bg-white border border-neutral-200 rounded-lg p-4">
            <h3 class="text-xs uppercase tracking-wide text-neutral-500 m-0 mb-3">Exertion log</h3>
            <div class="space-y-3">
              <label class="flex flex-col gap-1.5">
                <span class="text-xs font-medium text-neutral-600">Activity (allowed for current step)</span>
                <p-select [(ngModel)]="exertion.activity" [options]="activityOptions()" placeholder="Pick an activity" styleClass="w-full"
                          [filter]="true" filterBy="label" [showClear]="true"></p-select>
                <span *ngIf="!allowed().length" class="text-xs text-amber-600">No allowed activities for the current step.</span>
              </label>

              <div class="flex items-center justify-between p-3 rounded border border-neutral-200 bg-neutral-50">
                <div>
                  <p class="text-sm font-medium m-0">Did symptoms occur during this exertion?</p>
                  <p class="text-xs text-neutral-500 m-0 mt-0.5">Toggle on to record provoked symptoms.</p>
                </div>
                <p-toggleswitch [(ngModel)]="hadSymptomsDuring"></p-toggleswitch>
              </div>

              <div *ngIf="hadSymptomsDuring" class="space-y-3 pl-3 border-l-2 border-neutral-200">
                <div class="flex items-center gap-2">
                  <p-select [(ngModel)]="newDuringSymptom" [options]="symptomSelectOptions" placeholder="Add symptom" styleClass="flex-1"></p-select>
                  <p-button label="Add" size="small" severity="secondary" [outlined]="true" (onClick)="addDuringSymptom()" [disabled]="!newDuringSymptom"></p-button>
                </div>
                <p *ngIf="!duringSymptoms.length" class="text-xs text-neutral-500 m-0">Add at least one symptom that occurred during exertion.</p>
                <div *ngFor="let ds of duringSymptoms; let i = index" class="border border-neutral-200 rounded p-3 space-y-3">
                  <div class="flex items-center justify-between">
                    <span class="text-sm font-medium">{{ formatSymptom(ds.symptom) }}</span>
                    <button class="text-xs text-neutral-500 hover:text-red-600" (click)="removeDuringSymptom(i)">Remove</button>
                  </div>
                  <div class="flex items-center gap-3">
                    <span class="text-xs text-neutral-600 w-20 shrink-0">Δ severity</span>
                    <p-slider [(ngModel)]="ds.delta" [min]="0" [max]="6" [step]="1" class="flex-1"></p-slider>
                    <span class="text-xs tabular-nums w-4 text-right">{{ ds.delta }}</span>
                  </div>
                  <div class="flex items-center gap-3">
                    <span class="text-xs text-neutral-600 w-20 shrink-0">Duration</span>
                    <p-slider [(ngModel)]="ds.durationMinutes" [min]="0" [max]="120" [step]="15" class="flex-1"></p-slider>
                    <span class="text-xs tabular-nums w-12 text-right">{{ ds.durationMinutes }} min</span>
                  </div>
                </div>
              </div>

              <div class="flex justify-end">
                <p-button label="Submit exertion" size="small" (onClick)="submitExertion()"
                          [disabled]="!exertion.activity || (hadSymptomsDuring && !duringSymptoms.length)"></p-button>
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
  private toast = inject(MessageService);

  @ViewChild('chart') chartRef?: ElementRef<HTMLCanvasElement>;
  private chart?: Chart;

  dashboard = signal<Dashboard | null>(null);
  allowed = signal<string[]>([]);
  history = signal<SymptomReportedEvent[]>([]);
  estimate = signal<EstimateReturn | null>(null);
  audit = signal<AuditEntry[]>([]);
  readiness = signal<ReadinessResult | null>(null);

  athleteId = computed(() => this.dashboard()?.athlete?.id ?? '');

  symptomList = SCAT6_SYMPTOMS;
  dailyLevels: { [key: string]: number } = {};
  dailyLocked = signal<boolean>(false);
  dailySubmittedAt = signal<string | null>(null);

  exertion: { activity: string } = { activity: '' };
  hadSymptomsDuring = false;
  newDuringSymptom = '';
  duringSymptoms: DuringSymptom[] = [];

  activityOptions = computed(() =>
    this.allowed().map(a => ({ label: this.formatSymptom(a), value: a }))
  );

  advanceInput = { toStep: 2 };
  clearanceInput = { clearanceForStep: 4, physicianId: '', note: '' };

  symptomSelectOptions = SCAT6_SYMPTOMS.map(s => ({ label: this.formatSymptom(s), value: s }));
  redFlagOptions = RED_FLAG_TYPES;
  stepOptions = Object.entries(STEP_NAMES).map(([k, v]) => ({ label: `Step ${k} — ${v}`, value: parseInt(k, 10) }));

  canDoctor = computed(() => this.auth.role() === 'DOCTOR' || this.auth.role() === 'ADMIN');
  canSeeRoster = computed(() => this.canDoctor());

  constructor() {
    SCAT6_SYMPTOMS.forEach(s => this.dailyLevels[s] = 0);
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.refresh(id);
  }

  ngAfterViewInit() {
    this.renderChart();
  }

  ngOnDestroy() { this.chart?.destroy(); }

  private renderChart() {
    if (!this.chartRef) return;
    const history = this.history();

    const sorted = [...history]
      .filter(h => h.timestamp)
      .sort((a, b) => new Date(a.timestamp!).getTime() - new Date(b.timestamp!).getTime());
    const labels = Array.from(new Set(sorted.map(h => this.formatTs(h.timestamp!))));

    const bySymptom = new Map<string, Map<string, number>>();
    sorted.forEach(ev => {
      const key = this.formatTs(ev.timestamp!);
      const m = bySymptom.get(ev.symptom) ?? new Map<string, number>();
      m.set(key, ev.level);
      bySymptom.set(ev.symptom, m);
    });

    const palette = ['#1f2937', '#ef4444', '#f59e0b', '#10b981', '#6366f1', '#ec4899', '#0ea5e9', '#84cc16'];
    const datasets = Array.from(bySymptom.entries()).map(([sym, m], i) => ({
      label: this.formatSymptom(sym),
      data: labels.map(l => m.has(l) ? m.get(l)! : null),
      borderColor: palette[i % palette.length],
      backgroundColor: palette[i % palette.length],
      pointRadius: 4,
      pointHoverRadius: 6,
      tension: 0.2,
      spanGaps: true
    } as any));

    if (this.chart) this.chart.destroy();
    this.chart = new Chart(this.chartRef.nativeElement, {
      type: 'line',
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 10 } } } },
        scales: { y: { min: 0, max: 6, title: { display: true, text: 'Severity 0-6' } } }
      }
    });
  }

  private formatTs(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  refresh(id?: string) {
    const aid = id ?? this.athleteId();
    if (!aid) return;
    this.api.dashboard(aid).subscribe(d => this.dashboard.set(d));
    this.api.allowedActivities(aid).subscribe(r => this.allowed.set(r.activities));
    this.api.symptomHistory(aid).subscribe(h => {
      this.history.set(h);
      queueMicrotask(() => this.renderChart());
    });
    this.api.estimatedReturn(aid).subscribe(e => this.estimate.set(e));
    this.api.dailyCheckToday(aid).subscribe(r => {
      if (r.submitted) {
        this.dailyLocked.set(true);
        this.dailySubmittedAt.set(r.submittedAt ?? null);
        SCAT6_SYMPTOMS.forEach(s => this.dailyLevels[s] = r.levels?.[s] ?? 0);
      } else {
        this.dailyLocked.set(false);
        this.dailySubmittedAt.set(null);
      }
    });
    if (this.canDoctor()) {
      this.api.auditFor(aid).subscribe(a => this.audit.set(a));
    }
  }

  dailyNonZeroCount(): number {
    return SCAT6_SYMPTOMS.filter(s => (this.dailyLevels[s] ?? 0) > 0).length;
  }

  resetDaily() {
    SCAT6_SYMPTOMS.forEach(s => this.dailyLevels[s] = 0);
  }

  submitDailyCheck() {
    if (this.dailyLocked()) return;
    this.api.dailyCheck(this.athleteId(), this.dailyLevels).subscribe({
      next: r => {
        this.toast.add({ severity: 'success', summary: 'Daily check submitted',
          detail: `${r.submitted} symptom(s) recorded`, life: 4000 });
        this.refresh();
      },
      error: e => {
        const detail = e.status === 409
          ? 'Already submitted today — only one check per day is allowed'
          : (e.error?.error ?? 'Unknown error');
        this.toast.add({ severity: 'error', summary: 'Submission failed', detail, life: 4000 });
        if (e.status === 409) this.refresh();
      }
    });
  }

  addDuringSymptom() {
    if (!this.newDuringSymptom) return;
    if (this.duringSymptoms.some(s => s.symptom === this.newDuringSymptom)) {
      this.toast.add({ severity: 'info', summary: 'Already added', life: 2000 });
      return;
    }
    this.duringSymptoms.push({ symptom: this.newDuringSymptom, delta: 1, durationMinutes: 15 });
    this.newDuringSymptom = '';
  }

  removeDuringSymptom(i: number) {
    this.duringSymptoms.splice(i, 1);
  }

  submitExertion() {
    if (!this.exertion.activity) return;
    if (this.hadSymptomsDuring && !this.duringSymptoms.length) return;
    const aid = this.athleteId();
    const payload = {
      exertion: { athleteId: aid, activity: this.exertion.activity },
      symptoms: this.hadSymptomsDuring
        ? this.duringSymptoms.map(s => ({ athleteId: aid, ...s }))
        : []
    };
    this.api.exertionWithSymptoms(payload).subscribe({
      next: r => {
        const sym = r.symptomCount > 0 ? `, ${r.symptomCount} provoked symptom(s)` : '';
        this.toast.add({ severity: 'success', summary: 'Exertion logged',
          detail: `${this.exertion.activity}${sym} · ${r.rulesFired} rule(s) fired`, life: 4000 });
        this.exertion = { activity: '' };
        this.hadSymptomsDuring = false;
        this.duringSymptoms = [];
        this.refresh();
      },
      error: e => this.toast.add({ severity: 'error', summary: 'Submission failed', detail: e.error?.error ?? 'Unknown error', life: 4000 })
    });
  }

  triggerRedFlag(flagType: string) {
    this.api.reportSymptom({ athleteId: this.athleteId(), symptom: flagType, level: 6 }).subscribe({
      next: () => {
        this.toast.add({ severity: 'error', summary: 'Red flag triggered',
          detail: `${this.formatSymptom(flagType)} — emergency protocol engaged`, life: 5000 });
        this.refresh();
      },
      error: e => this.toast.add({ severity: 'error', summary: 'Failed', detail: e.error?.error ?? 'Unknown error', life: 4000 })
    });
  }

  advance() {
    const cur = this.dashboard()?.athlete.currentStep ?? 1;
    this.api.recordAdvancement({ athleteId: this.athleteId(), fromStep: cur, toStep: this.advanceInput.toStep })
      .subscribe({
        next: () => { this.toast.add({ severity: 'success', summary: 'Step updated', life: 3000 }); this.refresh(); },
        error: e => this.toast.add({ severity: 'error', summary: 'Failed', detail: e.error?.error ?? 'Unknown error' })
      });
  }

  recordClearance() {
    this.api.recordClearance({
      athleteId: this.athleteId(),
      clearanceForStep: this.clearanceInput.clearanceForStep,
      physicianId: this.clearanceInput.physicianId,
      note: this.clearanceInput.note
    }).subscribe({
      next: () => { this.toast.add({ severity: 'success', summary: 'Clearance recorded', life: 3000 }); this.refresh(); },
      error: e => this.toast.add({ severity: 'error', summary: 'Failed', detail: e.error?.error ?? 'Unknown error' })
    });
  }

  checkReadiness() {
    this.api.readyToAdvance(this.athleteId(), this.advanceInput.toStep).subscribe(r => this.readiness.set(r));
  }

  stepName(s: number) { return STEP_NAMES[s] ?? '—'; }
  formatSymptom(s: string) { return s.replaceAll('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()); }

  hasAnyDerived(d: Dashboard) {
    return d.intoleranceFlags.length || d.regressTriggers.length || d.exacerbations.length
        || d.persisting.length || d.rehabIndications.length || d.locks.length || d.blocks.length;
  }
  hasRiskFactor(d: Dashboard) {
    const r = d.athlete.riskFactors;
    return r.migraine || r.adhd || r.anxiety || r.learningDifficulties || r.mentalHealthHistory || r.sleepDisorder;
  }
}
