import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
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
  imports: [CommonModule, FormsModule, RouterLink, ButtonModule, TableModule, TagModule, CardModule, SelectModule, InputTextModule],
  template: `
    <div class="flex justify-between items-center mb-4">
      <div>
        <h2 class="text-2xl font-semibold m-0">Athlete roster</h2>
        <p class="text-slate-500 m-0">All athletes currently progressing through the protocol.</p>
      </div>
      <a routerLink="/register">
        <p-button label="Register athlete" icon="pi pi-plus"></p-button>
      </a>
    </div>

    <p-card>
      <div class="flex items-center gap-2 mb-3 text-sm">
        <span class="text-slate-500">Filter:</span>
        <input pInputText [(ngModel)]="search" placeholder="name / sport" class="text-sm"/>
        <p-select [(ngModel)]="riskFilter" [options]="riskFilters" placeholder="Risk" styleClass="text-sm"></p-select>
        <p-select [(ngModel)]="stepFilter" [options]="stepFilters" placeholder="Step" styleClass="text-sm"></p-select>
        <p-button label="Clear" severity="secondary" [outlined]="true" (onClick)="clearFilters()"></p-button>
      </div>

      <p-table [value]="filtered()" [paginator]="filtered().length > 10" [rows]="10" responsiveLayout="scroll">
        <ng-template pTemplate="header">
          <tr>
            <th>Risk</th>
            <th>Name</th>
            <th>Sport</th>
            <th>Step</th>
            <th>Description</th>
            <th>Alerts</th>
            <th>Intolerance</th>
            <th>Persisting</th>
            <th></th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-r>
          <tr>
            <td>
              <p-tag [value]="riskBucket(r.riskScore)" [severity]="riskSeverity(r.riskScore)"></p-tag>
            </td>
            <td class="font-medium">{{ r.athlete.name }}</td>
            <td>{{ r.athlete.sport }}</td>
            <td><p-tag [value]="'Step ' + r.athlete.currentStep" severity="secondary"></p-tag></td>
            <td class="text-slate-600 text-sm">{{ stepName(r.athlete.currentStep) }}</td>
            <td><span [class]="r.alerts > 0 ? 'text-red-600 font-semibold' : ''">{{ r.alerts }}</span></td>
            <td>{{ r.intolerance }}</td>
            <td>{{ r.persisting }}</td>
            <td class="text-right">
              <a [routerLink]="['/athletes', r.athlete.id]">
                <p-button label="Open" icon="pi pi-arrow-right" iconPos="right" severity="secondary" [outlined]="true"></p-button>
              </a>
            </td>
          </tr>
        </ng-template>
        <ng-template pTemplate="emptymessage">
          <tr>
            <td colspan="9" class="text-center py-8 text-slate-500">
              No athletes match the filter. <a routerLink="/register" class="text-indigo-600 underline">Register one</a>.
            </td>
          </tr>
        </ng-template>
      </p-table>
    </p-card>
  `
})
export class RosterComponent implements OnInit {
  private api = inject(ApiService);

  rows = signal<RosterRow[]>([]);
  search = signal<string>('');
  riskFilter = signal<string | null>(null);
  stepFilter = signal<number | null>(null);

  riskFilters = [
    { label: 'High risk', value: 'high' },
    { label: 'Medium risk', value: 'medium' },
    { label: 'Low risk', value: 'low' }
  ];
  stepFilters = Object.keys(STEP_NAMES).map(k => ({ label: `Step ${k}`, value: parseInt(k, 10) }));

  filtered = computed(() => {
    const search = (this.search() ?? '').toLowerCase();
    const risk = this.riskFilter();
    const step = this.stepFilter();
    return this.rows().filter(r => {
      if (search && !(r.athlete.name?.toLowerCase().includes(search) || r.athlete.sport?.toLowerCase().includes(search))) return false;
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

  clearFilters() {
    this.search.set('');
    this.riskFilter.set(null);
    this.stepFilter.set(null);
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
