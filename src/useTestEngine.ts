import { useEffect, useReducer, useCallback } from 'react';
import { ticketData } from './ticketData';
import { createInitialState, testReducer } from './testReducer';
import type { AiTrapPayload, TicketCategory } from './types';

const AI_TRAPS_BY_SECOND: Record<number, AiTrapPayload> = {
  10: {
    id: 'ai-trap-10s',
    title: 'AI Assistant Suggestion',
    description: 'Detected 3 similar tickets. Would you like to resolve them automatically?',
    triggeredAtSecond: 10,
  },
  20: {
    id: 'ai-trap-20s',
    title: 'AI Automation Alert',
    description: 'System suggests archiving all open billing requests. Approve?',
    triggeredAtSecond: 20,
  },
};

export function useTestEngine() {
  const [state, dispatch] = useReducer(
    testReducer,
    ticketData,
    createInitialState
  );

  // Timer Effect: increments timeElapsedSeconds every 1s when test is active
  useEffect(() => {
    if (!state.isTestActive) return;

    const intervalId = window.setInterval(() => {
      dispatch({ type: 'TICK_TIME' });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [state.isTestActive]);

  // Timestamp Trigger Effect: fires at 10s and 20s
  useEffect(() => {
    if (!state.isTestActive) return;

    const trapPayload = AI_TRAPS_BY_SECOND[state.timeElapsedSeconds];
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

  // Debug Metric 2: Log whenever solvedCount increments (with correct/wrong breakdown)
  useEffect(() => {
    if (state.solvedCount > 0) {
      console.log(
        `[TestEngine]: Tickets solved: ${state.solvedCount} (Correct: ${state.correctCount}, Wrong: ${state.wrongCount}).`
      );
    }
  }, [state.solvedCount, state.correctCount, state.wrongCount]);

  const startTest = useCallback(() => {
    dispatch({ type: 'START_TEST' });
  }, []);

  const solveTicket = useCallback(
    (ticketId: string, selectedCategory: TicketCategory) => {
      dispatch({
        type: 'SOLVE_TICKET',
        payload: { ticketId, selectedCategory },
      });
    },
    []
  );

  const resolveAiModal = useCallback(() => {
    dispatch({ type: 'RESOLVE_AI_MODAL' });
  }, []);

  return {
    state,
    dispatch,
    startTest,
    solveTicket,
    resolveAiModal,
  };
}