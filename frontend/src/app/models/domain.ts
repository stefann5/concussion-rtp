export interface Athlete {
  id: string;
  name: string;
  age: number;
  sex?: 'MALE' | 'FEMALE' | 'OTHER';
  sport: string;
  position?: string;
  competitionLevel?: string;
  contactLevel: 'CONTACT' | 'NONCONTACT';
  historyFlag: 'NONE' | 'SINGLE' | 'MULTIPLE';
  riskFactors: RiskFactors;
  previousConcussions: PreviousConcussion[];
  baselineSymptoms: { [key: string]: number };
  currentStep: number;
  stepEnteredAt?: string;
  injuryAt?: string;
}

export interface RiskFactors {
  migraine: boolean;
  adhd: boolean;
  anxiety: boolean;
  learningDifficulties: boolean;
  mentalHealthHistory: boolean;
  sleepDisorder: boolean;
}

export interface PreviousConcussion {
  date: string;
  recoveryDays: number;
}

export interface SymptomReportedEvent {
  athleteId: string;
  symptom: string;
  level: number;
  timestamp?: string;
}

export interface ExertionAttemptEvent {
  athleteId: string;
  activity: string;
  timestamp?: string;
}

export interface SymptomDuringExertionEvent {
  athleteId: string;
  symptom: string;
  delta: number;
  durationMinutes: number;
  timestamp?: string;
}

export interface StepAdvancementEvent {
  athleteId: string;
  fromStep: number;
  toStep: number;
  timestamp?: string;
}

export interface MedicalClearanceEvent {
  athleteId: string;
  clearanceForStep: number;
  note: string;
  timestamp?: string;
}

export interface ObjectiveTestEvent {
  athleteId: string;
  testType: string;
  value: number;
  timestamp?: string;
}

export interface StepRecommendation {
  athleteId: string;
  action: string;
  currentStep: number;
  recommendedStep: number;
  retryAfterHours: number;
  explanation: string;
}

export interface EmergencyAlert {
  athleteId: string;
  flagType: string;
  severity: string;
  actionType: string;
  message: string;
}

export interface ActivityBlockedAlert {
  athleteId: string;
  activity: string;
  currentStep: number;
  message: string;
}

export interface Dashboard {
  athlete: Athlete;
  recommendations: StepRecommendation[];
  alerts: EmergencyAlert[];
  blocks: ActivityBlockedAlert[];
  intoleranceFlags: { athleteId: string; reason: string }[];
  regressTriggers: { athleteId: string; reason: string }[];
  exacerbations: { athleteId: string; symptom: string; delta: number; durationMinutes: number }[];
  persisting: { athleteId: string; reason: string }[];
  rehabIndications: { athleteId: string; reason: string }[];
  locks: { athleteId: string; lockUntilHours: number; reason: string; lockedAt: string }[];
  individualizedAssessments: { athleteId: string; reason: string }[];
}

export interface AuditEntry {
  timestamp: string;
  athleteId: string;
  trigger: string;
  actor: string;
  rulesFired: string[];
  factsInserted: string[];
}

export interface EstimateReturn {
  currentStep: number;
  stepsRemaining: number;
  minHoursPerStep: number;
  earliestReturn: string;
  assumesNoSetbacks: boolean;
  note: string;
  error?: string;
}

export interface ReadinessResult {
  ready: boolean;
  unmetConditions: string[];
}

export const SCAT6_SYMPTOMS = [
  'HEADACHE', 'PRESSURE_IN_HEAD', 'NECK_PAIN', 'NAUSEA', 'DIZZINESS', 'BLURRED_VISION',
  'BALANCE_PROBLEMS', 'SENSITIVITY_TO_LIGHT', 'SENSITIVITY_TO_NOISE', 'FEELING_SLOWED_DOWN',
  'FEELING_IN_A_FOG', 'DONT_FEEL_RIGHT', 'DIFFICULTY_CONCENTRATING', 'DIFFICULTY_REMEMBERING',
  'FATIGUE', 'CONFUSION', 'DROWSINESS', 'TROUBLE_FALLING_ASLEEP', 'MORE_EMOTIONAL',
  'IRRITABILITY', 'SADNESS', 'NERVOUS_OR_ANXIOUS'
];

export const RED_FLAG_TYPES = [
  'LOSS_OF_CONSCIOUSNESS', 'SEIZURE', 'DETERIORATING_CONSCIOUSNESS', 'WEAKNESS_IN_LIMBS',
  'VISIBLE_SKULL_DEFORMITY', 'SEVERE_HEADACHE', 'REPEATED_VOMITING', 'DOUBLE_VISION',
  'NECK_PAIN', 'AGITATION'
];

export const STEP_NAMES: { [key: number]: string } = {
  1: 'Symptom-limited activity',
  2: 'Aerobic exercise',
  3: 'Sport-specific exercise',
  4: 'Non-contact training drills',
  5: 'Full-contact practice',
  6: 'Return to sport'
};
