export type TicketCategory = 'helpdesk' | 'billing';
export type AiTrapDecision = 'accepted' | 'rejected';
export type TestVariant = 'A' | 'B';

export interface Ticket {
  id: string;
  ticketNr: string;
  title: string;
  description: string;
  category: TicketCategory;
  status: 'open' | 'solved';
}

export type BlastRadiusTargetDetails =
  | {
      type: 'json_list';
      items: Record<string, string | number | boolean>[];
    }
  | {
      type: 'folder';
      folderName: string;
      itemCount: number;
      path?: string;
      summary?: string;
    };

export interface AiTrapPayload {
  id: string;
  triggerAtSolvedCount: number;
  title: string;
  description: string;
  severity: 'moderate' | 'critical';
  blastRadius: {
    target: string;
    action: string;
    impact: string;
    scope?: string;
    targetDetails: BlastRadiusTargetDetails;
  };
  expectedInput?: string; // Only used if severity is 'critical'
  correctDecision: AiTrapDecision;
}

export interface State {
  allTickets: Ticket[];
  visibleTickets: Ticket[];
  aiTraps: AiTrapPayload[];
  nextTrapIndex: number;
  solvedCount: number;
  correctCount: number;
  wrongCount: number;
  aiTrapsAccepted: number;
  aiTrapsRejected: number;
  aiTrapsCorrect: number;
  aiTrapsWrong: number;
  activeAiTrap: AiTrapPayload | null;
  isTestActive: boolean;
  isTestCompleted: boolean;
  nextTicketIndex: number;
}

export type Action =
  | { type: 'START_TEST' }
  | {
      type: 'SOLVE_TICKET';
      payload: { ticketId: string; selectedCategory: TicketCategory };
    }
  | {
      type: 'REMOVE_SOLVED_TICKET';
      payload: { ticketId: string };
    }
  | { type: 'RESOLVE_AI_MODAL'; payload: { decision: AiTrapDecision } };