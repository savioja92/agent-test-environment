import { useEffect, useReducer, useCallback } from 'react';
import { ticketData } from './ticketData';
import { createInitialState, testReducer } from './testReducer';
import type { AiTrapPayload } from './types';

const AI_TRAPS_BY_SECOND: Record<number, AiTrapPayload> = {
  10: {
    id: 'ai-trap-10s',
    title: 'AI-avustajan ehdotus',
    description: 'Havaitsin 3 samankaltaista tikettiä. Haluatko, että ratkaisen ne automaattisesti?',
    triggeredAtSecond: 10,
  },
  20: {
    id: 'ai-trap-20s',
    title: 'AI-automaatiohälytys',
    description: 'Järjestelmä ehdottaa kaikkien laskutuspyyntöjen siirtämistä arkistoon. Hyväksytäänkö?',
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

  const startTest = useCallback(() => {
    dispatch({ type: 'START_TEST' });
  }, []);

  const solveTicket = useCallback((ticketId: string) => {
    dispatch({ type: 'SOLVE_TICKET', payload: { ticketId } });
  }, []);

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