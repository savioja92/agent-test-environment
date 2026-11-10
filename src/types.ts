export type TicketCategory = 'helpdesk' | 'billing';

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
  triggeredAtSecond: number;
}

export interface State {
  allTickets: Ticket[];
  visibleTickets: Ticket[];
  solvedCount: number;
  correctCount: number;
  wrongCount: number;
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
  | { type: 'TRIGGER_AI_MODAL'; payload: AiTrapPayload }
  | { type: 'RESOLVE_AI_MODAL' };