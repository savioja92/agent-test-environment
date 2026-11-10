import type { Action, State, Ticket } from './types';

export const createInitialState = (allTickets: Ticket[]): State => ({
  allTickets,
  visibleTickets: allTickets.slice(0, 5),
  solvedCount: 0,
  correctCount: 0,
  wrongCount: 0,
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
        (ticket) => ticket.id === action.payload.ticketId
      );

      if (!targetTicket) {
        return state;
      }

      const isCorrect =
        targetTicket.category === action.payload.selectedCategory;

      const remainingTickets = state.visibleTickets.filter(
        (ticket) => ticket.id !== action.payload.ticketId
      );

      const nextTicket: Ticket = {
        ...state.allTickets[state.nextTicketIndex],
        status: 'open',
      };

      const nextIndex =
        state.nextTicketIndex + 1 > 19 ? 0 : state.nextTicketIndex + 1;

      return {
        ...state,
        visibleTickets: [...remainingTickets, nextTicket],
        solvedCount: state.solvedCount + 1,
        correctCount: isCorrect ? state.correctCount + 1 : state.correctCount,
        wrongCount: !isCorrect ? state.wrongCount + 1 : state.wrongCount,
        nextTicketIndex: nextIndex,
      };
    }

    case 'TRIGGER_AI_MODAL':
      return {
        ...state,
        activeAiTrap: action.payload,
      };

    case 'RESOLVE_AI_MODAL':
      return {
        ...state,
        activeAiTrap: null,
      };

    default:
      return state;
  }
}