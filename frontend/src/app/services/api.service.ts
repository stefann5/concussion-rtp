import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Athlete, Dashboard, ReadinessResult,
  SymptomReportedEvent, ExertionAttemptEvent, SymptomDuringExertionEvent,
  StepAdvancementEvent, MedicalClearanceEvent, ObjectiveTestEvent
} from '../models/domain';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private base = 'http://localhost:8080/api';

  listAthletes(): Observable<Athlete[]> { return this.http.get<Athlete[]>(`${this.base}/athletes`); }
  getAthlete(id: string): Observable<Athlete> { return this.http.get<Athlete>(`${this.base}/athletes/${id}`); }
  registerAthlete(a: Athlete): Observable<Athlete> { return this.http.post<Athlete>(`${this.base}/athletes`, a); }
  dashboard(id: string): Observable<Dashboard> { return this.http.get<Dashboard>(`${this.base}/athletes/${id}/dashboard`); }
  allowedActivities(id: string): Observable<{ activities: string[] }> { return this.http.get<{ activities: string[] }>(`${this.base}/athletes/${id}/allowed-activities`); }
  readyToAdvance(id: string, targetStep: number): Observable<ReadinessResult> {
    return this.http.get<ReadinessResult>(`${this.base}/athletes/${id}/ready-to-advance?targetStep=${targetStep}`);
  }

  reportSymptom(ev: SymptomReportedEvent) { return this.http.post(`${this.base}/events/symptom`, ev); }
  reportExertion(ev: ExertionAttemptEvent) { return this.http.post(`${this.base}/events/exertion-attempt`, ev); }
  reportSymptomDuringExertion(ev: SymptomDuringExertionEvent) { return this.http.post(`${this.base}/events/symptom-during-exertion`, ev); }
  recordAdvancement(ev: StepAdvancementEvent) { return this.http.post(`${this.base}/events/step-advancement`, ev); }
  recordClearance(ev: MedicalClearanceEvent) { return this.http.post(`${this.base}/events/medical-clearance`, ev); }
  recordObjectiveTest(ev: ObjectiveTestEvent) { return this.http.post(`${this.base}/events/objective-test`, ev); }

  byStep() { return this.http.get<{ [step: number]: number }>(`${this.base}/reports/athletes-by-step`); }
  riskSummary() { return this.http.get<any[]>(`${this.base}/reports/risk-summary`); }
}
