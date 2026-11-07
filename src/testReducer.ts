import type { Action, State, Ticket } from './types';

export const createInitialState = (allTickets: Ticket[]): State => ({
  allTickets,
  visibleTickets: allTickets.slice(0, 5),
  solvedCount: 0,
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
      const remainingTickets = state.visibleTickets.filter(
        (ticket) => ticket.id !== action.payload.ticketId
      );

      // Guard in case the ticketId wasn't found in visibleTickets
      if (remainingTickets.length === state.visibleTickets.length) {
        return state;
      }

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