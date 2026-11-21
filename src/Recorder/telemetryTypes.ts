import type { AiTrapDecision, TicketCategory } from '../types';

export type TestVariant = 'A' | 'B';

export type AiOutcomeCategory =
  | 'CAUGHT_ERROR'
  | 'AUTOMATION_BIAS_ERROR'
  | 'VALID_ACCEPT'
  | 'FALSE_REJECTION';

export type TelemetryEventType = 'TICKET_SOLVE' | 'AI_INTERVENTION';

export interface RunningMetricsSnapshot {
  totalSolved: number;
  errorCatchRate: number; // 0 to 1 (e.g. 0.75 = 75%)
  falseRejectionRate: number; // 0 to 1
}

export interface TicketSolveEvent {
  eventType: 'TICKET_SOLVE';
  chronologicalIndex: number;
  loggedAtIso: string;
  elapsedSessionSeconds: number;
  ticketId: string;
  selectedCategory: TicketCategory;
  correctCategory: TicketCategory;
  isCorrect: boolean;
  ticketSolveDurationMs: number;
  timeSinceLastSolveMs: number;
  occurredImmediatelyAfterAi: boolean;
  runningTotals: RunningMetricsSnapshot;
}

export interface AiInterventionEvent {
  eventType: 'AI_INTERVENTION';
  chronologicalIndex: number;
  loggedAtIso: string;
  eventIndex: number;
  aiTrapId: string;
  triggerTimestampSeconds: number;
  isHallucination: boolean;
  severity: 'moderate' | 'critical';
  userDecision: AiTrapDecision;
  outcomeCategory: AiOutcomeCategory;
  timeToDecisionMs: number;
  timeToFirstFrictionActionMs: number | null;
  muscleMemoryClicks: number;
  runningTotals: RunningMetricsSnapshot;
}

export type TelemetryTimelineEvent = TicketSolveEvent | AiInterventionEvent;

export interface ClickCadenceTracker {
  totalGeneralClicks: number;
  clickIntervalsCount: number;
  cumulativeClickIntervalMs: number;
  meanTimeBetweenClicksMs: number;
}

export interface TelemetrySessionData {
  sessionId: string;
  startedAtIso: string;
  variant: TestVariant;
  totalTestDurationSeconds: number;
  clickCadence: ClickCadenceTracker;
  counters: {
    totalSolved: number;
    hallucinationsSeen: number;
    caughtErrors: number;
    validAiSeen: number;
    falseRejections: number;
    aiEventsCount: number;
  };
  events: TelemetryTimelineEvent[];
}

export interface LogAiModalOpenParams {
  aiTrapId: string;
  triggerTimestampSeconds?: number;
  severity: 'moderate' | 'critical';
  isHallucination: boolean;
}

export interface LogTicketSolveParams {
  ticketId: string;
  selectedCategory: TicketCategory;
  correctCategory: TicketCategory;
  elapsedSessionSeconds?: number;
}