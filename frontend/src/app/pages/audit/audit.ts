import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ApiService } from '../../services/api.service';
import { AuditEntry } from '../../models/domain';

@Component({
  selector: 'app-audit',
  standalone: true,
  imports: [CommonModule, TableModule],
  template: `
    <h2 class="text-xl font-semibold m-0 mb-1">Audit log</h2>
    <p class="text-sm text-neutral-500 m-0 mb-6">Every event handled by the rule engine, with the chain of rules that fired and facts inserted.</p>

    <div class="bg-white border border-neutral-200 rounded-lg overflow-hidden">
      <p-table [value]="entries()" [paginator]="entries().length > 15" [rows]="15">
        <ng-template pTemplate="header">
          <tr class="text-xs uppercase tracking-wide text-neutral-500">
            <th>When</th>
            <th>Athlete</th>
            <th>Trigger</th>
            <th>By</th>
            <th>Rules fired</th>
            <th>Facts inserted</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-e>
          <tr>
            <td class="text-xs text-neutral-500">{{ e.timestamp | date:'short' }}</td>
            <td class="text-sm font-medium">{{ e.athleteId }}</td>
            <td class="text-sm">{{ e.trigger }}</td>
            <td class="text-sm text-neutral-600">{{ e.actor }}</td>
            <td>
              <span *ngIf="!e.rulesFired?.length" class="text-neutral-400 text-sm">—</span>
              <span *ngFor="let r of e.rulesFired" class="text-xs px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-700 mr-1 mb-1 inline-block">{{ r }}</span>
            </td>
            <td>
              <span *ngIf="!e.factsInserted?.length" class="text-neutral-400 text-sm">—</span>
              <span *ngFor="let f of e.factsInserted" class="text-xs px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-700 mr-1 mb-1 inline-block">{{ f }}</span>
            </td>
          </tr>
        </ng-template>
        <ng-template pTemplate="emptymessage">
          <tr><td colspan="6" class="text-center py-8 text-sm text-neutral-500">No audit entries yet.</td></tr>
        </ng-template>
      </p-table>
    </div>
  `
})
export class AuditComponent implements OnInit {
  private api = inject(ApiService);
  entries = signal<AuditEntry[]>([]);

  ngOnInit() { this.api.audit().subscribe(e => this.entries.set(e)); }
}
