export type TicketCategory = 'helpdesk' | 'billing';
export type AiTrapDecision = 'accepted' | 'rejected';

export interface Ticket {
  id: string;
  ticketNr: string;
  title: string;
  description: string;
  category: TicketCategory;
  status: 'open' | 'solved';
}

export interface AiTrapPayload {
  id: string;
  title: string;
  description: string;
  severity: 'moderate' | 'critical';
  blastRadius: {
    target: string;
    action: string;
    impact: string;
  };
  expectedInput?: string; // Only used if severity is 'critical'
  correctDecision: AiTrapDecision;
}

export interface State {
  allTickets: Ticket[];
  visibleTickets: Ticket[];
  solvedCount: number;
  correctCount: number;
  wrongCount: number;
  aiTrapsAccepted: number;
  aiTrapsRejected: number;
  aiTrapsCorrect: number;
  aiTrapsWrong: number;
  timeElapsedSeconds: number;
  activeAiTrap: AiTrapPayload | null;
  isTestActive: boolean;
  nextTicketIndex: number;
}

export type Action =
  | { type: 'START_TEST' }
  | { type: 'TICK_TIME' }
  | {
      type: 'SOLVE_TICKET';
      payload: { ticketId: string; selectedCategory: TicketCategory };
    }
  | {
      type: 'REMOVE_SOLVED_TICKET';
      payload: { ticketId: string };
    }
  | { type: 'TRIGGER_AI_MODAL'; payload: AiTrapPayload }
  | { type: 'RESOLVE_AI_MODAL'; payload: { decision: AiTrapDecision } };