import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { ApiService } from '../../services/api.service';
import { Athlete, STEP_NAMES } from '../../models/domain';

interface RosterRow {
  athlete: Athlete;
  alerts: number;
  riskScore: number;
  intolerance: number;
  persisting: number;
  rehab: number;
}

@Component({
  selector: 'app-roster',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ButtonModule, TableModule, TagModule, SelectModule, InputTextModule],
  template: `
    <div class="flex justify-between items-end mb-6">
      <div>
        <h2 class="text-xl font-semibold m-0">Roster</h2>
        <p class="text-sm text-neutral-500 m-0 mt-1">{{ rows().length }} athletes under monitoring</p>
      </div>
      <a routerLink="/register">
        <p-button label="Register athlete" size="small"></p-button>
      </a>
    </div>

    <div class="bg-white border border-neutral-200 rounded-lg p-4 mb-4 flex items-center gap-2">
      <input pInputText [(ngModel)]="searchVal" (ngModelChange)="search.set($event)" placeholder="Search by name or sport" class="text-sm flex-1"/>
      <p-select [(ngModel)]="riskVal" (onChange)="riskFilter.set(riskVal)" [options]="riskFilters" placeholder="Any risk" [showClear]="true"></p-select>
      <p-select [(ngModel)]="stepVal" (onChange)="stepFilter.set(stepVal)" [options]="stepFilters" placeholder="Any step" [showClear]="true"></p-select>
    </div>

    <div class="bg-white border border-neutral-200 rounded-lg overflow-hidden">
      <p-table [value]="filtered()" [paginator]="filtered().length > 10" [rows]="10">
        <ng-template pTemplate="header">
          <tr class="text-xs uppercase tracking-wide text-neutral-500">
            <th>Risk</th>
            <th>Name</th>
            <th>Sport</th>
            <th>Step</th>
            <th>Alerts</th>
            <th>Intolerance</th>
            <th>Persisting</th>
            <th></th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-r>
          <tr>
            <td><p-tag [value]="riskBucket(r.riskScore)" [severity]="riskSeverity(r.riskScore)"></p-tag></td>
            <td class="font-medium">{{ r.athlete.name }}</td>
            <td class="text-neutral-600">{{ r.athlete.sport }}</td>
            <td class="text-neutral-600">{{ r.athlete.currentStep }} <span class="text-xs text-neutral-400">{{ stepName(r.athlete.currentStep) }}</span></td>
            <td><span [class.text-red-600]="r.alerts > 0" [class.font-semibold]="r.alerts > 0">{{ r.alerts }}</span></td>
            <td class="text-neutral-600">{{ r.intolerance }}</td>
            <td class="text-neutral-600">{{ r.persisting }}</td>
            <td class="text-right">
              <a [routerLink]="['/athletes', r.athlete.id]" class="text-sm text-neutral-600 hover:text-neutral-900">Open →</a>
            </td>
          </tr>
        </ng-template>
        <ng-template pTemplate="emptymessage">
          <tr><td colspan="8" class="text-center py-12 text-sm text-neutral-500">
            No athletes match. <a routerLink="/register" class="underline">Register one</a>.
          </td></tr>
        </ng-template>
      </p-table>
    </div>
  `
})
export class RosterComponent implements OnInit {
  private api = inject(ApiService);

  rows = signal<RosterRow[]>([]);
  search = signal<string>('');
  riskFilter = signal<string | null>(null);
  stepFilter = signal<number | null>(null);

  searchVal = '';
  riskVal: string | null = null;
  stepVal: number | null = null;

  riskFilters = [
    { label: 'High', value: 'high' },
    { label: 'Medium', value: 'medium' },
    { label: 'Low', value: 'low' }
  ];
  stepFilters = Object.keys(STEP_NAMES).map(k => ({ label: `Step ${k}`, value: parseInt(k, 10) }));

  filtered = computed(() => {
    const s = (this.search() ?? '').toLowerCase();
    const risk = this.riskFilter();
    const step = this.stepFilter();
    return this.rows().filter(r => {
      if (s && !(r.athlete.name?.toLowerCase().includes(s) || r.athlete.sport?.toLowerCase().includes(s))) return false;
      if (step != null && r.athlete.currentStep !== step) return false;
      if (risk === 'high' && r.riskScore < 100) return false;
      if (risk === 'medium' && (r.riskScore < 30 || r.riskScore >= 100)) return false;
      if (risk === 'low' && r.riskScore >= 30) return false;
      return true;
    });
  });

  ngOnInit() {
    this.api.listAthletes().subscribe(athletes => {
      this.api.riskSummary().subscribe(summary => {
        const byId = new Map<string, any>(summary.map(s => [s.id, s]));
        this.rows.set(athletes.map(a => {
          const s = byId.get(a.id) ?? {};
          return {
            athlete: a,
            alerts: s.alerts ?? 0,
            riskScore: s.riskScore ?? 0,
            intolerance: s.intolerance ?? 0,
            persisting: s.persisting ?? 0,
            rehab: s.rehab ?? 0
          };
        }));
      });
    });
  }

  riskBucket(score: number) {
    if (score >= 100) return 'High';
    if (score >= 30) return 'Medium';
    return 'Low';
  }

  riskSeverity(score: number): 'danger' | 'warn' | 'success' {
    if (score >= 100) return 'danger';
    if (score >= 30) return 'warn';
    return 'success';
  }

  stepName(s: number) { return STEP_NAMES[s] ?? '—'; }
}
