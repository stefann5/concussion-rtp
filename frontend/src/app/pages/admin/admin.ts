import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { MessageModule } from 'primeng/message';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, CardModule, ButtonModule, SelectModule, TextareaModule, MessageModule],
  template: `
    <h2 class="text-2xl font-semibold mb-1">Template editor</h2>
    <p class="text-sm text-slate-500 mb-4">Edit CSV-driven rule templates. Saving rebuilds the knowledge base immediately.</p>

    <p-card>
      <div class="flex items-center gap-2 mb-3">
        <p-select [(ngModel)]="selectedName" [options]="templateOptions()" placeholder="Pick a template"
                  (onChange)="load()" styleClass="min-w-[16rem]"></p-select>
        <p-button label="Reload" icon="pi pi-refresh" severity="secondary" [outlined]="true" (onClick)="load()" [disabled]="!selectedName"></p-button>
      </div>

      <textarea pTextarea [(ngModel)]="csv" rows="14" class="w-full font-mono text-xs"
                placeholder="Pick a template above to load its CSV"></textarea>

      <p-message *ngIf="message() as msg" [severity]="msg.severity" styleClass="mt-3 w-full">{{ msg.text }}</p-message>

      <div class="mt-3 flex gap-2">
        <p-button label="Save and rebuild" icon="pi pi-save" (onClick)="save()" [disabled]="!selectedName || !csv"></p-button>
      </div>

      <div class="mt-6 text-xs text-slate-500">
        <p class="m-0"><strong>Format reference:</strong></p>
        <ul class="m-0 pl-4">
          <li>MinStepDwell: ageGroup, contactLevel, historyFlag, minHours</li>
          <li>RedFlagSeverity: flagType, severity, salienceLevel, actionType</li>
          <li>AllowedActivity: step, allowedCategory, sourceCitation</li>
        </ul>
      </div>
    </p-card>
  `
})
export class AdminComponent implements OnInit {
  private api = inject(ApiService);

  templates = signal<string[]>([]);
  templateOptions = () => this.templates().map(t => ({ label: t, value: t }));
  selectedName = '';
  csv = '';
  message = signal<{ severity: 'success' | 'error'; text: string } | null>(null);

  ngOnInit() {
    this.api.listTemplates().subscribe(t => this.templates.set(t));
  }

  load() {
    if (!this.selectedName) return;
    this.message.set(null);
    this.api.getTemplate(this.selectedName).subscribe(r => this.csv = r.csv);
  }

  save() {
    this.api.putTemplate(this.selectedName, this.csv).subscribe({
      next: r => this.message.set({ severity: 'success', text: `Saved and rebuilt at ${r.rebuiltAt}` }),
      error: e => this.message.set({ severity: 'error', text: e.error?.error ?? 'Failed to save' })
    });
  }
}
