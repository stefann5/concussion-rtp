import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ChipModule } from 'primeng/chip';
import { TagModule } from 'primeng/tag';
import { ApiService } from '../../services/api.service';
import { AuditEntry } from '../../models/domain';

@Component({
  selector: 'app-audit',
  standalone: true,
  imports: [CommonModule, CardModule, TableModule, ChipModule, TagModule],
  template: `
    <h2 class="text-2xl font-semibold mb-1">System audit log</h2>
    <p class="text-sm text-slate-500 mb-4">Every event handled by the rule engine, with the chain of rules that fired and facts inserted.</p>
    <p-card>
      <p-table [value]="entries()" [paginator]="entries().length > 15" [rows]="15" responsiveLayout="scroll">
        <ng-template pTemplate="header">
          <tr>
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
            <td class="text-xs text-slate-500">{{ e.timestamp | date:'short' }}</td>
            <td><p-tag [value]="e.athleteId" severity="info"></p-tag></td>
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
          <tr><td colspan="6" class="text-center py-6 text-slate-500">No audit entries yet.</td></tr>
        </ng-template>
      </p-table>
    </p-card>
  `
})
export class AuditComponent implements OnInit {
  private api = inject(ApiService);
  entries = signal<AuditEntry[]>([]);

  ngOnInit() { this.api.audit().subscribe(e => this.entries.set(e)); }
}
