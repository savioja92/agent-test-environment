import { useEffect, useReducer, useCallback, useRef } from 'react';
import { ticketData } from './ticketData';
import { aiTrapData } from './aiTrapData';
import { createInitialState, testReducer } from './testReducer';
import type { AiTrapDecision, TestVariant, TicketCategory } from './types';

export function useTestEngine(variant: TestVariant) {
  const [state, dispatch] = useReducer(testReducer, variant, (v) =>
    createInitialState(ticketData, aiTrapData[v])
  );

  const timeoutIdsRef = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      timeoutIdsRef.current.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  // Debug Metric 1: Log whenever solvedCount increments
  useEffect(() => {
    if (state.solvedCount > 0) {
      console.log(
        `[TestEngine]: Tickets solved: ${state.solvedCount} (Correct: ${state.correctCount}, Wrong: ${state.wrongCount}).`
      );
    }
  }, [state.solvedCount, state.correctCount, state.wrongCount]);

  // Debug Metric 2: Log whenever an AI Trap modal is resolved
  useEffect(() => {
    const totalResolved = state.aiTrapsAccepted + state.aiTrapsRejected;
    if (totalResolved > 0) {
      console.log(
        `[TestEngine]: AI Traps resolved: ${totalResolved}/${state.aiTraps.length} | Correct: ${state.aiTrapsCorrect}, Wrong: ${state.aiTrapsWrong} (Accepted: ${state.aiTrapsAccepted}, Rejected: ${state.aiTrapsRejected}).`
      );
    }
  }, [
    state.aiTrapsAccepted,
    state.aiTrapsRejected,
    state.aiTrapsCorrect,
    state.aiTrapsWrong,
    state.aiTraps.length,
  ]);

  const startTest = useCallback(() => {
    timeoutIdsRef.current.forEach((id) => window.clearTimeout(id));
    timeoutIdsRef.current = [];
    dispatch({ type: 'START_TEST' });
  }, []);

  const solveTicket = useCallback(
    (ticketId: string, selectedCategory: TicketCategory) => {
      dispatch({
        type: 'SOLVE_TICKET',
        payload: { ticketId, selectedCategory },
      });

      const timeoutId = window.setTimeout(() => {
        dispatch({
          type: 'REMOVE_SOLVED_TICKET',
          payload: { ticketId },
        });
        timeoutIdsRef.current = timeoutIdsRef.current.filter(
          (id) => id !== timeoutId
        );
      }, 1500);

      timeoutIdsRef.current.push(timeoutId);
    },
    []
  );

  const resolveAiModal = useCallback((decision: AiTrapDecision) => {
    dispatch({ type: 'RESOLVE_AI_MODAL', payload: { decision } });
  }, []);

  return {
    state,
    dispatch,
    startTest,
    solveTicket,
    resolveAiModal,
  };
}