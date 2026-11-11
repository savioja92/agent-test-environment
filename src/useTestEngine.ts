import { useEffect, useReducer, useCallback, useRef } from 'react';
import { ticketData } from './ticketData';
import { aiTrapData } from './aiTrapData';
import { createInitialState, testReducer } from './testReducer';
import type { AiTrapDecision, TicketCategory } from './types';

export function useTestEngine() {
  const [state, dispatch] = useReducer(
    testReducer,
    ticketData,
    createInitialState
  );

  const timeoutIdsRef = useRef<number[]>([]);

  // Cleanup any pending ticket removal timers on unmount
  useEffect(() => {
    return () => {
      timeoutIdsRef.current.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  // Timer Effect: increments timeElapsedSeconds every 1s when test is active
  useEffect(() => {
    if (!state.isTestActive) return;

    const intervalId = window.setInterval(() => {
      dispatch({ type: 'TICK_TIME' });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [state.isTestActive]);

  // Timestamp Trigger Effect: fires when timeElapsedSeconds matches a key in aiTrapData
  useEffect(() => {
    if (!state.isTestActive) return;

    const trapPayload = aiTrapData[state.timeElapsedSeconds];
    if (trapPayload) {
      dispatch({ type: 'TRIGGER_AI_MODAL', payload: trapPayload });
    }
  }, [state.timeElapsedSeconds, state.isTestActive]);

  // Debug Metric 1: Log every 10 seconds elapsed
  useEffect(() => {
    if (state.timeElapsedSeconds > 0 && state.timeElapsedSeconds % 10 === 0) {
      console.log(`[TestEngine]: ${state.timeElapsedSeconds} seconds elapsed.`);
    }
  }, [state.timeElapsedSeconds]);

  // Debug Metric 2: Log whenever solvedCount increments
  useEffect(() => {
    if (state.solvedCount > 0) {
      console.log(
        `[TestEngine]: Tickets solved: ${state.solvedCount} (Correct: ${state.correctCount}, Wrong: ${state.wrongCount}).`
      );
    }
  }, [state.solvedCount, state.correctCount, state.wrongCount]);

  // Debug Metric 3: Log whenever an AI Trap modal is resolved
  useEffect(() => {
    const totalResolved = state.aiTrapsAccepted + state.aiTrapsRejected;
    if (totalResolved > 0) {
      console.log(
        `[TestEngine]: AI Traps resolved: ${totalResolved} | Correct: ${state.aiTrapsCorrect}, Wrong: ${state.aiTrapsWrong} (Accepted: ${state.aiTrapsAccepted}, Rejected: ${state.aiTrapsRejected}).`
      );
    }
  }, [
    state.aiTrapsAccepted,
    state.aiTrapsRejected,
    state.aiTrapsCorrect,
    state.aiTrapsWrong,
  ]);

  const startTest = useCallback(() => {
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