import type { Action, AiTrapPayload, State, Ticket } from './types';

export const createInitialState = (
  allTickets: Ticket[],
  aiTraps: AiTrapPayload[]
): State => ({
  allTickets,
  visibleTickets: allTickets.slice(0, 5),
  aiTraps,
  nextTrapIndex: 0,
  solvedCount: 0,
  correctCount: 0,
  wrongCount: 0,
  aiTrapsAccepted: 0,
  aiTrapsRejected: 0,
  aiTrapsCorrect: 0,
  aiTrapsWrong: 0,
  activeAiTrap: null,
  isTestActive: false,
  isTestCompleted: false,
  nextTicketIndex: 5 % allTickets.length,
});

export function testReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'START_TEST':
      return {
        ...createInitialState(state.allTickets, state.aiTraps),
        isTestActive: true,
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

      const updatedVisibleTickets = state.visibleTickets.map((ticket) =>
        ticket.id === action.payload.ticketId
          ? { ...ticket, status: 'solved' as const }
          : ticket
      );

      const baseNextTicket = state.allTickets[state.nextTicketIndex];
      const nextTicket: Ticket = {
        ...baseNextTicket,
        id: `${baseNextTicket.id}-${state.solvedCount + 5}`,
        status: 'open',
      };

      const nextIndex = (state.nextTicketIndex + 1) % state.allTickets.length;
      const newSolvedCount = state.solvedCount + 1;

      // Trigger the next scheduled AI modal when solvedCount reaches its threshold
      let nextActiveAiTrap = state.activeAiTrap;
      let updatedNextTrapIndex = state.nextTrapIndex;

      if (
        state.isTestActive &&
        !state.isTestCompleted &&
        state.activeAiTrap === null
      ) {
        const scheduledTrap = state.aiTraps[state.nextTrapIndex];
        if (
          scheduledTrap &&
          newSolvedCount >= scheduledTrap.triggerAtSolvedCount
        ) {
          nextActiveAiTrap = scheduledTrap;
          updatedNextTrapIndex = state.nextTrapIndex + 1;
        }
      }

      return {
        ...state,
        visibleTickets: [...updatedVisibleTickets, nextTicket],
        solvedCount: newSolvedCount,
        correctCount: isCorrect ? state.correctCount + 1 : state.correctCount,
        wrongCount: !isCorrect ? state.wrongCount + 1 : state.wrongCount,
        nextTicketIndex: nextIndex,
        activeAiTrap: nextActiveAiTrap,
        nextTrapIndex: updatedNextTrapIndex,
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

    case 'RESOLVE_AI_MODAL': {
      if (!state.activeAiTrap) return state;

      const { decision } = action.payload;
      const isAccepted = decision === 'accepted';
      const isCorrect = decision === state.activeAiTrap.correctDecision;

      const isLastModalResolved = state.nextTrapIndex >= state.aiTraps.length;

      return {
        ...state,
        activeAiTrap: null,
        isTestCompleted: isLastModalResolved,
        isTestActive: isLastModalResolved ? false : state.isTestActive,
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