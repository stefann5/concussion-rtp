import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { ApiService } from '../../services/api.service';
import { Athlete, STEP_NAMES } from '../../models/domain';

@Component({
  selector: 'app-roster',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonModule, TableModule, TagModule, CardModule],
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
      <p-table [value]="athletes()" [paginator]="athletes().length > 10" [rows]="10" responsiveLayout="scroll">
        <ng-template pTemplate="header">
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Sport</th>
            <th>Contact</th>
            <th>Step</th>
            <th>Step description</th>
            <th></th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-a>
          <tr>
            <td class="font-medium">{{ a.name }}</td>
            <td>{{ a.age }}</td>
            <td>{{ a.sport }}</td>
            <td>
              <p-tag [value]="a.contactLevel" [severity]="a.contactLevel === 'CONTACT' ? 'danger' : 'info'"></p-tag>
            </td>
            <td>
              <p-tag [value]="'Step ' + a.currentStep" severity="secondary"></p-tag>
            </td>
            <td class="text-slate-600 text-sm">{{ stepName(a.currentStep) }}</td>
            <td class="text-right">
              <a [routerLink]="['/athletes', a.id]">
                <p-button label="Open" icon="pi pi-arrow-right" iconPos="right" severity="secondary" [outlined]="true"></p-button>
              </a>
            </td>
          </tr>
        </ng-template>
        <ng-template pTemplate="emptymessage">
          <tr>
            <td colspan="7" class="text-center py-8 text-slate-500">
              No athletes registered yet. <a routerLink="/register" class="text-indigo-600 underline">Register one</a>.
            </td>
          </tr>
        </ng-template>
      </p-table>
    </p-card>
  `
})
export class RosterComponent implements OnInit {
  private api = inject(ApiService);
  athletes = signal<Athlete[]>([]);

  ngOnInit() { this.api.listAthletes().subscribe(a => this.athletes.set(a)); }

  stepName(s: number) { return STEP_NAMES[s] ?? '—'; }
}
