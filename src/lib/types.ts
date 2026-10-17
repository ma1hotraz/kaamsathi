export type Language = 'en' | 'hi' | 'hinglish';

export interface ShiftEntry {
  id: string;
  date: string;
  platform: string;
  hoursWorked: number;
  grossEarnings: number;
  expenses: number;
  expenseType?: string;
  notes?: string;
  createdAt: number;
}

export interface EarningsSummary {
  totalGross: number;
  totalExpenses: number;
  netEarnings: number;
  totalHours: number;
  effectiveHourlyRate: number;
  expenseRatioPercentage: number;
  shiftCount: number;
}

export interface CalculationValidationResult {
  isValid: boolean;
  errors: string[];
}

export type IssueCategory =
  | 'penalty_dispute'
  | 'delayed_payout'
  | 'distance_mismatch'
  | 'app_glitch'
  | 'deactivation'
  | 'harassment'
  | 'other';

export interface GrievanceInput {
  platform: string;
  workerName?: string;
  workerId?: string;
  issueCategory: IssueCategory;
  dateOfIncident: string;
  expectedAmount?: number | null;
  receivedAmount?: number | null;
  tripOrOrderId?: string;
  description: string;
  desiredOutcome?: string;
  language: Language;
}

export interface GrievanceDraft {
  subject: string;
  formalLetter: string;
  inAppChatVersion: string;
  placeholdersFound: string[];
  disputedAmount: number | null;
  timestamp: string;
}

export interface WelfareScheme {
  id: string;
  name: {
    en: string;
    hi: string;
    hinglish: string;
  };
  category: 'insurance' | 'pension' | 'welfare' | 'health';
  targetGroup: string;
  keyBenefits: string[];
  officialPortal: string;
  howToApply: string[];
  documentsNeeded: string[];
  uncertaintyDisclaimer: string;
}

export interface EmergencyContact {
  service: string;
  number: string;
  description: string;
}
