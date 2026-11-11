import type { Action, State, Ticket } from './types';

export const createInitialState = (allTickets: Ticket[]): State => ({
  allTickets,
  visibleTickets: allTickets.slice(0, 5),
  solvedCount: 0,
  correctCount: 0,
  wrongCount: 0,
  aiTrapsAccepted: 0,
  aiTrapsRejected: 0,
  aiTrapsCorrect: 0,
  aiTrapsWrong: 0,
  timeElapsedSeconds: 0,
  activeAiTrap: null,
  isTestActive: false,
  nextTicketIndex: 5,
});

export function testReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'START_TEST':
      return {
        ...state,
        isTestActive: true,
      };

    case 'TICK_TIME':
      if (!state.isTestActive) return state;
      return {
        ...state,
        timeElapsedSeconds: state.timeElapsedSeconds + 1,
      };

    case 'SOLVE_TICKET': {
      const targetTicket = state.visibleTickets.find(
        (ticket) =>
          ticket.id === action.payload.ticketId && ticket.status === 'open'
      );

      if (!targetTicket) {
        return state;
      }

      const isCorrect =
        targetTicket.category === action.payload.selectedCategory;

      // Mark the solved ticket in-place so it stays in its current slot for 1.5s
      const updatedVisibleTickets = state.visibleTickets.map((ticket) =>
        ticket.id === action.payload.ticketId
          ? { ...ticket, status: 'solved' as const }
          : ticket
      );

      // Pull the next open ticket immediately so 5 open tickets remain available
      const baseNextTicket = state.allTickets[state.nextTicketIndex];
      const nextTicket: Ticket = {
        ...baseNextTicket,
        id: `${baseNextTicket.id}-${state.solvedCount + 5}`,
        status: 'open',
      };

      const nextIndex =
        state.nextTicketIndex + 1 > 19 ? 0 : state.nextTicketIndex + 1;

      return {
        ...state,
        visibleTickets: [...updatedVisibleTickets, nextTicket],
        solvedCount: state.solvedCount + 1,
        correctCount: isCorrect ? state.correctCount + 1 : state.correctCount,
        wrongCount: !isCorrect ? state.wrongCount + 1 : state.wrongCount,
        nextTicketIndex: nextIndex,
      };
    }

    case 'REMOVE_SOLVED_TICKET': {
      return {
        ...state,
        visibleTickets: state.visibleTickets.filter(
          (ticket) => ticket.id !== action.payload.ticketId
        ),
      };
    }

    case 'TRIGGER_AI_MODAL':
      return {
        ...state,
        activeAiTrap: action.payload,
      };

    case 'RESOLVE_AI_MODAL': {
      if (!state.activeAiTrap) return state;

      const { decision } = action.payload;
      const isAccepted = decision === 'accepted';
      const isCorrect = decision === state.activeAiTrap.correctDecision;

      return {
        ...state,
        activeAiTrap: null,
        aiTrapsAccepted: isAccepted
          ? state.aiTrapsAccepted + 1
          : state.aiTrapsAccepted,
        aiTrapsRejected: !isAccepted
          ? state.aiTrapsRejected + 1
          : state.aiTrapsRejected,
        aiTrapsCorrect: isCorrect
          ? state.aiTrapsCorrect + 1
          : state.aiTrapsCorrect,
        aiTrapsWrong: !isCorrect
          ? state.aiTrapsWrong + 1
          : state.aiTrapsWrong,
      };
    }

    default:
      return state;
  }
}