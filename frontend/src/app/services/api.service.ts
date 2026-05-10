import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Athlete, Dashboard, ReadinessResult, AuditEntry, EstimateReturn,
  SymptomReportedEvent, ExertionAttemptEvent, SymptomDuringExertionEvent,
  StepAdvancementEvent, MedicalClearanceEvent, ObjectiveTestEvent
} from '../models/domain';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private base = 'http://localhost:8080/api';

  listAthletes(): Observable<Athlete[]> { return this.http.get<Athlete[]>(`${this.base}/athletes`); }
  getAthlete(id: string): Observable<Athlete> { return this.http.get<Athlete>(`${this.base}/athletes/${id}`); }
  registerAthlete(payload: { athlete: Athlete; username: string; password: string }): Observable<Athlete> {
    return this.http.post<Athlete>(`${this.base}/athletes`, payload);
  }
  dashboard(id: string): Observable<Dashboard> { return this.http.get<Dashboard>(`${this.base}/athletes/${id}/dashboard`); }
  allowedActivities(id: string): Observable<{ activities: string[] }> { return this.http.get<{ activities: string[] }>(`${this.base}/athletes/${id}/allowed-activities`); }
  readyToAdvance(id: string, targetStep: number): Observable<ReadinessResult> {
    return this.http.get<ReadinessResult>(`${this.base}/athletes/${id}/ready-to-advance?targetStep=${targetStep}`);
  }
  symptomHistory(id: string): Observable<SymptomReportedEvent[]> {
    return this.http.get<SymptomReportedEvent[]>(`${this.base}/athletes/${id}/symptom-history`);
  }
  estimatedReturn(id: string): Observable<EstimateReturn> {
    return this.http.get<EstimateReturn>(`${this.base}/athletes/${id}/estimated-return`);
  }

  reportSymptom(ev: SymptomReportedEvent) { return this.http.post(`${this.base}/events/symptom`, ev); }
  reportExertion(ev: ExertionAttemptEvent) { return this.http.post(`${this.base}/events/exertion-attempt`, ev); }
  reportSymptomDuringExertion(ev: SymptomDuringExertionEvent) { return this.http.post(`${this.base}/events/symptom-during-exertion`, ev); }
  recordAdvancement(ev: StepAdvancementEvent) { return this.http.post(`${this.base}/events/step-advancement`, ev); }
  recordClearance(ev: MedicalClearanceEvent) { return this.http.post(`${this.base}/events/medical-clearance`, ev); }
  recordObjectiveTest(ev: ObjectiveTestEvent) { return this.http.post(`${this.base}/events/objective-test`, ev); }

  byStep() { return this.http.get<{ [step: number]: number }>(`${this.base}/reports/athletes-by-step`); }
  bySport() { return this.http.get<{ [sport: string]: number }>(`${this.base}/reports/by-sport`); }
  avgRecovery() { return this.http.get<{ count: number; avgDays: number; note?: string }>(`${this.base}/reports/avg-recovery-days`); }
  riskSummary() { return this.http.get<any[]>(`${this.base}/reports/risk-summary`); }
  adherence(id: string) { return this.http.get<{ daysSinceInjury: number; daysWithReport: number; adherencePct: number }>(`${this.base}/reports/adherence/${id}`); }

  audit(): Observable<AuditEntry[]> { return this.http.get<AuditEntry[]>(`${this.base}/audit`); }
  auditFor(id: string): Observable<AuditEntry[]> { return this.http.get<AuditEntry[]>(`${this.base}/audit/${id}`); }

  listTemplates() { return this.http.get<string[]>(`${this.base}/admin/templates`); }
  getTemplate(name: string) { return this.http.get<{ name: string; csv: string }>(`${this.base}/admin/templates/${name}`); }
  putTemplate(name: string, csv: string) { return this.http.put<{ ok: boolean; rebuiltAt: string }>(`${this.base}/admin/templates/${name}`, { csv }); }
}
