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

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <p-card header="Athletes by step">
        <div class="space-y-2">
          <div *ngFor="let item of byStepRows()" class="flex items-center justify-between border-b border-slate-100 py-2">
            <div>
              <p-tag [value]="'Step ' + item.step" severity="info"></p-tag>
              <span class="ml-2 text-slate-600 text-sm">{{ stepName(item.step) }}</span>
            </div>
            <span class="font-semibold">{{ item.count }}</span>
          </div>
          <div *ngIf="!byStepRows().length" class="text-slate-500">No data.</div>
        </div>
      </p-card>

      <p-card header="Risk summary">
        <p-table [value]="riskRows()" responsiveLayout="scroll">
          <ng-template pTemplate="header">
            <tr>
              <th>Athlete</th>
              <th>Step</th>
              <th>Alerts</th>
              <th>Intolerance</th>
              <th>Persisting</th>
              <th>Rehab</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-r>
            <tr>
              <td>
                <a [routerLink]="['/athletes', r.id]" class="text-indigo-600 hover:underline">{{ r.name }}</a>
              </td>
              <td>{{ r.currentStep }}</td>
              <td><span [class]="r.alerts > 0 ? 'text-red-600 font-semibold' : 'text-slate-600'">{{ r.alerts }}</span></td>
              <td>{{ r.intolerance }}</td>
              <td>{{ r.persisting }}</td>
              <td>{{ r.rehab }}</td>
            </tr>
          </ng-template>
          <ng-template pTemplate="emptymessage">
            <tr><td colspan="6" class="text-center py-6 text-slate-500">No athletes registered.</td></tr>
          </ng-template>
        </p-table>
      </p-card>
    </div>
  `
})
export class ReportsComponent implements OnInit {
  private api = inject(ApiService);
  byStepRows = signal<{ step: number; count: number }[]>([]);
  riskRows = signal<any[]>([]);

  ngOnInit() {
    this.api.byStep().subscribe(map => {
      const rows = Object.entries(map).map(([k, v]) => ({ step: parseInt(k, 10), count: v }));
      rows.sort((a, b) => a.step - b.step);
      this.byStepRows.set(rows);
    });
    this.api.riskSummary().subscribe(r => this.riskRows.set(r));
  }

  stepName(s: number) { return STEP_NAMES[s] ?? '—'; }
}
