import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ApiService } from '../../services/api.service';
import { STEP_NAMES } from '../../models/domain';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, RouterLink, TableModule, TagModule],
  template: `
    <h2 class="text-xl font-semibold m-0 mb-6">Reports</h2>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
      <section class="bg-white border border-neutral-200 rounded-lg p-4">
        <h3 class="text-xs uppercase tracking-wide text-neutral-500 m-0 mb-3">By step</h3>
        <div class="space-y-1">
          <div *ngFor="let item of byStepRows()" class="flex items-center justify-between text-sm py-1">
            <span class="text-neutral-700">Step {{ item.step }} <span class="text-neutral-400">{{ stepName(item.step) }}</span></span>
            <span class="font-medium tabular-nums">{{ item.count }}</span>
          </div>
          <div *ngIf="!byStepRows().length" class="text-sm text-neutral-400">—</div>
        </div>
      </section>

      <section class="bg-white border border-neutral-200 rounded-lg p-4">
        <h3 class="text-xs uppercase tracking-wide text-neutral-500 m-0 mb-3">By sport</h3>
        <div class="space-y-1">
          <div *ngFor="let s of bySportRows()" class="flex items-center justify-between text-sm py-1">
            <span class="text-neutral-700">{{ s.sport }}</span>
            <span class="font-medium tabular-nums">{{ s.count }}</span>
          </div>
          <div *ngIf="!bySportRows().length" class="text-sm text-neutral-400">—</div>
        </div>
      </section>

      <section class="bg-white border border-neutral-200 rounded-lg p-4">
        <h3 class="text-xs uppercase tracking-wide text-neutral-500 m-0 mb-3">Average recovery</h3>
        <div *ngIf="avgRecovery() as ar">
          <p class="text-3xl font-semibold tabular-nums m-0">{{ ar.avgDays | number:'1.1-1' }}<span class="text-base text-neutral-400 font-normal ml-1">days</span></p>
          <p class="text-xs text-neutral-500 m-0 mt-1">{{ ar.count }} previous concussion records</p>
        </div>
      </section>
    </div>

    <section class="bg-white border border-neutral-200 rounded-lg overflow-hidden">
      <div class="px-4 py-3 border-b border-neutral-200">
        <h3 class="text-xs uppercase tracking-wide text-neutral-500 m-0">Risk summary</h3>
      </div>
      <p-table [value]="riskRows()">
        <ng-template pTemplate="header">
          <tr class="text-xs uppercase tracking-wide text-neutral-500">
            <th>Athlete</th>
            <th>Sport</th>
            <th>Step</th>
            <th>Risk</th>
            <th>Alerts</th>
            <th>Intolerance</th>
            <th>Persisting</th>
            <th>Rehab</th>
            <th>Individualized</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-r>
          <tr>
            <td><a [routerLink]="['/athletes', r.id]" class="text-neutral-900 hover:underline font-medium">{{ r.name }}</a></td>
            <td class="text-neutral-600">{{ r.sport }}</td>
            <td class="text-neutral-600">{{ r.currentStep }}</td>
            <td><p-tag [value]="r.riskScore" [severity]="r.riskScore >= 100 ? 'danger' : r.riskScore >= 30 ? 'warn' : 'success'"></p-tag></td>
            <td><span [class.text-red-600]="r.alerts > 0" [class.font-semibold]="r.alerts > 0">{{ r.alerts }}</span></td>
            <td class="text-neutral-600">{{ r.intolerance }}</td>
            <td class="text-neutral-600">{{ r.persisting }}</td>
            <td class="text-neutral-600">{{ r.rehab }}</td>
            <td class="text-neutral-600">{{ r.individualized }}</td>
          </tr>
        </ng-template>
        <ng-template pTemplate="emptymessage">
          <tr><td colspan="9" class="text-center py-8 text-sm text-neutral-500">No athletes registered.</td></tr>
        </ng-template>
      </p-table>
    </section>
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
