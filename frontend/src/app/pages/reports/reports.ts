import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ApiService } from '../../services/api.service';
import { STEP_NAMES } from '../../models/domain';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, RouterLink, CardModule, TableModule, TagModule],
  template: `
    <h2 class="text-2xl font-semibold mb-4">Reports</h2>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
      <p-card header="Athletes by step">
        <div class="space-y-2">
          <div *ngFor="let item of byStepRows()" class="flex items-center justify-between border-b border-slate-100 py-2">
            <div>
              <p-tag [value]="'Step ' + item.step"></p-tag>
              <span class="ml-2 text-slate-600 text-sm">{{ stepName(item.step) }}</span>
            </div>
            <span class="font-semibold">{{ item.count }}</span>
          </div>
          <div *ngIf="!byStepRows().length" class="text-slate-500">No data.</div>
        </div>
      </p-card>

      <p-card header="By sport">
        <div class="space-y-2">
          <div *ngFor="let s of bySportRows()" class="flex items-center justify-between border-b border-slate-100 py-2">
            <span class="text-slate-700">{{ s.sport }}</span>
            <span class="font-semibold">{{ s.count }}</span>
          </div>
          <div *ngIf="!bySportRows().length" class="text-slate-500">No data.</div>
        </div>
      </p-card>

      <p-card header="Average recovery (days)">
        <div *ngIf="avgRecovery() as ar">
          <p class="text-3xl font-semibold m-0 text-indigo-700">{{ ar.avgDays | number:'1.1-1' }}</p>
          <p class="text-xs text-slate-500 mt-1 m-0">Across {{ ar.count }} previous concussion records</p>
          <p *ngIf="ar.note" class="text-xs text-slate-500 mt-2 m-0">{{ ar.note }}</p>
        </div>
      </p-card>
    </div>

    <p-card header="Risk summary (sorted by risk score)">
      <p-table [value]="riskRows()">
        <ng-template pTemplate="header">
          <tr>
            <th>Athlete</th>
            <th>Sport</th>
            <th>Step</th>
            <th>Risk score</th>
            <th>Alerts</th>
            <th>Intolerance</th>
            <th>Persisting</th>
            <th>Rehab</th>
            <th>Individualized</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-r>
          <tr>
            <td><a [routerLink]="['/athletes', r.id]" class="text-indigo-600 hover:underline">{{ r.name }}</a></td>
            <td>{{ r.sport }}</td>
            <td>{{ r.currentStep }}</td>
            <td>
              <p-tag [value]="r.riskScore" [severity]="r.riskScore >= 100 ? 'danger' : r.riskScore >= 30 ? 'warn' : 'success'"></p-tag>
            </td>
            <td><span [class]="r.alerts > 0 ? 'text-red-600 font-semibold' : 'text-slate-600'">{{ r.alerts }}</span></td>
            <td>{{ r.intolerance }}</td>
            <td>{{ r.persisting }}</td>
            <td>{{ r.rehab }}</td>
            <td>{{ r.individualized }}</td>
          </tr>
        </ng-template>
        <ng-template pTemplate="emptymessage">
          <tr><td colspan="9" class="text-center py-6 text-slate-500">No athletes registered.</td></tr>
        </ng-template>
      </p-table>
    </p-card>
  `
})
export class ReportsComponent implements OnInit {
  private api = inject(ApiService);
  byStepRows = signal<{ step: number; count: number }[]>([]);
  bySportRows = signal<{ sport: string; count: number }[]>([]);
  avgRecovery = signal<{ count: number; avgDays: number; note?: string } | null>(null);
  riskRows = signal<any[]>([]);

  ngOnInit() {
    this.api.byStep().subscribe(map => {
      const rows = Object.entries(map).map(([k, v]) => ({ step: parseInt(k, 10), count: v }));
      rows.sort((a, b) => a.step - b.step);
      this.byStepRows.set(rows);
    });
    this.api.bySport().subscribe(map => {
      const rows = Object.entries(map).map(([k, v]) => ({ sport: k, count: v }));
      rows.sort((a, b) => b.count - a.count);
      this.bySportRows.set(rows);
    });
    this.api.avgRecovery().subscribe(r => this.avgRecovery.set(r));
    this.api.riskSummary().subscribe(r => this.riskRows.set(r));
  }

  stepName(s: number) { return STEP_NAMES[s] ?? '—'; }
}
