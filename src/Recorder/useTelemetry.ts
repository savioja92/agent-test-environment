import { useRef, useEffect, useCallback } from 'react';
import type { AiTrapDecision } from '../types';
import type {
  AiOutcomeCategory,
  LogAiModalOpenParams,
  LogTicketSolveParams,
  RunningMetricsSnapshot,
  TelemetrySessionData,
  TestVariant,
} from './telemetryTypes';
import {
  clearTelemetryStorage,
  loadTelemetryFromStorage,
  saveTelemetryToStorage,
} from './telemetryStorage';
import { triggerCsvDownload } from './csvExporter';

interface ActiveAiTrapTimingState {
  aiTrapId: string;
  triggerTimestampSeconds: number;
  severity: 'moderate' | 'critical';
  isHallucination: boolean;
  openedAtPerfMs: number;
  timeToFirstFrictionActionMs: number | null;
  muscleMemoryClicks: number;
}

function createFreshSession(variant: TestVariant): TelemetrySessionData {
  const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
  return {
    sessionId: `SES-${Date.now()}-${randomSuffix}`,
    startedAtIso: new Date().toISOString(),
    variant,
    totalTestDurationSeconds: 0,
    clickCadence: {
      totalGeneralClicks: 0,
      clickIntervalsCount: 0,
      cumulativeClickIntervalMs: 0,
      meanTimeBetweenClicksMs: 0,
    },
    counters: {
      totalSolved: 0,
      hallucinationsSeen: 0,
      caughtErrors: 0,
      validAiSeen: 0,
      falseRejections: 0,
      aiEventsCount: 0,
    },
    events: [],
  };
}

function computeOutcomeCategory(
  isHallucination: boolean,
  decision: AiTrapDecision
): AiOutcomeCategory {
  if (isHallucination && decision === 'rejected') return 'CAUGHT_ERROR';
  if (isHallucination && decision === 'accepted') return 'AUTOMATION_BIAS_ERROR';
  if (!isHallucination && decision === 'accepted') return 'VALID_ACCEPT';
  return 'FALSE_REJECTION';
}

function computeRunningSnapshot(
  session: TelemetrySessionData
): RunningMetricsSnapshot {
  const { totalSolved, hallucinationsSeen, caughtErrors, validAiSeen, falseRejections } =
    session.counters;

  const errorCatchRate =
    hallucinationsSeen > 0
      ? Number((caughtErrors / hallucinationsSeen).toFixed(4))
      : 0;

  const falseRejectionRate =
    validAiSeen > 0
      ? Number((falseRejections / validAiSeen).toFixed(4))
      : 0;

  return {
    totalSolved,
    errorCatchRate,
    falseRejectionRate,
  };
}

export function useTelemetry(defaultVariant: TestVariant = 'A') {
  // Primary session store in useRef (recover from localStorage if page was refreshed)
  const sessionRef = useRef<TelemetrySessionData>(
    loadTelemetryFromStorage() ?? createFreshSession(defaultVariant)
  );

  // High-precision performance.now() refs
  const isSessionActiveRef = useRef<boolean>(false);
  const sessionStartPerfMsRef = useRef<number | null>(null);
  const lastClickPerfMsRef = useRef<number | null>(null);
  const ticketOpenedPerfMsRef = useRef<number | null>(null);
  const lastTicketSolvedPerfMsRef = useRef<number | null>(null);
  const interruptedByAiRef = useRef<boolean>(false);
  const activeAiModalRef = useRef<ActiveAiTrapTimingState | null>(null);

  const updateDurationAndPersist = useCallback(() => {
    if (sessionStartPerfMsRef.current !== null) {
      const elapsedMs = performance.now() - sessionStartPerfMsRef.current;
      sessionRef.current.totalTestDurationSeconds = Math.round(elapsedMs / 1000);
    }
    saveTelemetryToStorage(sessionRef.current);
  }, []);

  // Global passive click cadence listener (never triggers re-renders)
  useEffect(() => {
    const handleGlobalClick = () => {
      if (!isSessionActiveRef.current) return;

      const now = performance.now();
      const cadence = sessionRef.current.clickCadence;
      cadence.totalGeneralClicks += 1;

      if (lastClickPerfMsRef.current !== null) {
        const deltaMs = now - lastClickPerfMsRef.current;
        cadence.clickIntervalsCount += 1;
        cadence.cumulativeClickIntervalMs += deltaMs;
        cadence.meanTimeBetweenClicksMs = Math.round(
          cadence.cumulativeClickIntervalMs / cadence.clickIntervalsCount
        );
      }

      lastClickPerfMsRef.current = now;
    };

    window.addEventListener('click', handleGlobalClick, { capture: true });
    return () => {
      window.removeEventListener('click', handleGlobalClick, { capture: true });
    };
  }, []);

  const startSession = useCallback(
    (variant: TestVariant, clearExistingStorage: boolean = true) => {
      if (clearExistingStorage) {
        clearTelemetryStorage();
      }

      const now = performance.now();
      sessionRef.current = createFreshSession(variant);
      isSessionActiveRef.current = true;
      sessionStartPerfMsRef.current = now;
      lastClickPerfMsRef.current = null;
      ticketOpenedPerfMsRef.current = null;
      lastTicketSolvedPerfMsRef.current = now;
      interruptedByAiRef.current = false;
      activeAiModalRef.current = null;

      saveTelemetryToStorage(sessionRef.current);
    },
    []
  );

  const logTicketOpen = useCallback((_ticketId?: string) => {
    ticketOpenedPerfMsRef.current = performance.now();
  }, []);

  const logTicketSolve = useCallback(
    ({
      ticketId,
      selectedCategory,
      correctCategory,
      elapsedSessionSeconds,
    }: LogTicketSolveParams) => {
      const now = performance.now();
      const session = sessionRef.current;

      const solveDurationMs =
        ticketOpenedPerfMsRef.current !== null
          ? Math.round(now - ticketOpenedPerfMsRef.current)
          : 0;

      const referenceLastSolveMs =
        lastTicketSolvedPerfMsRef.current ?? sessionStartPerfMsRef.current ?? now;
      const timeSinceLastSolveMs = Math.round(now - referenceLastSolveMs);

      const isCorrect = selectedCategory === correctCategory;
      session.counters.totalSolved += 1;

      const elapsedSec =
        elapsedSessionSeconds ??
        (sessionStartPerfMsRef.current !== null
          ? Math.round((now - sessionStartPerfMsRef.current) / 1000)
          : 0);

      session.events.push({
        eventType: 'TICKET_SOLVE',
        chronologicalIndex: session.events.length + 1,
        loggedAtIso: new Date().toISOString(),
        elapsedSessionSeconds: elapsedSec,
        ticketId,
        selectedCategory,
        correctCategory,
        isCorrect,
        ticketSolveDurationMs: solveDurationMs,
        timeSinceLastSolveMs,
        occurredImmediatelyAfterAi: interruptedByAiRef.current,
        runningTotals: computeRunningSnapshot(session),
      });

      // Reset per-ticket tracking refs
      ticketOpenedPerfMsRef.current = null;
      lastTicketSolvedPerfMsRef.current = now;
      interruptedByAiRef.current = false;

      updateDurationAndPersist();
    },
    [updateDurationAndPersist]
  );

  const logAiModalOpen = useCallback(
    ({
      aiTrapId,
      triggerTimestampSeconds,
      severity,
      isHallucination,
    }: LogAiModalOpenParams) => {
      interruptedByAiRef.current = true;
      activeAiModalRef.current = {
        aiTrapId,
        triggerTimestampSeconds,
        severity,
        isHallucination,
        openedAtPerfMs: performance.now(),
        timeToFirstFrictionActionMs: null,
        muscleMemoryClicks: 0,
      };
    },
    []
  );

  const logFrictionInteraction = useCallback(() => {
    const activeModal = activeAiModalRef.current;
    if (!activeModal) return;

    // Only capture the timestamp of the very first friction interaction
    if (activeModal.timeToFirstFrictionActionMs === null) {
      activeModal.timeToFirstFrictionActionMs = Math.round(
        performance.now() - activeModal.openedAtPerfMs
      );
    }
  }, []);

  const logDisabledButtonClick = useCallback(() => {
    const activeModal = activeAiModalRef.current;
    if (!activeModal) return;

    activeModal.muscleMemoryClicks += 1;
  }, []);

  const logAiModalResolve = useCallback(
    (userDecision: AiTrapDecision) => {
      const activeModal = activeAiModalRef.current;
      if (!activeModal) return;

      const now = performance.now();
      const session = sessionRef.current;

      const timeToDecisionMs = Math.round(now - activeModal.openedAtPerfMs);
      const outcomeCategory = computeOutcomeCategory(
        activeModal.isHallucination,
        userDecision
      );

      // Update running AI counters
      session.counters.aiEventsCount += 1;
      if (activeModal.isHallucination) {
        session.counters.hallucinationsSeen += 1;
        if (outcomeCategory === 'CAUGHT_ERROR') {
          session.counters.caughtErrors += 1;
        }
      } else {
        session.counters.validAiSeen += 1;
        if (outcomeCategory === 'FALSE_REJECTION') {
          session.counters.falseRejections += 1;
        }
      }

      session.events.push({
        eventType: 'AI_INTERVENTION',
        chronologicalIndex: session.events.length + 1,
        loggedAtIso: new Date().toISOString(),
        eventIndex: session.counters.aiEventsCount,
        aiTrapId: activeModal.aiTrapId,
        triggerTimestampSeconds: activeModal.triggerTimestampSeconds,
        isHallucination: activeModal.isHallucination,
        severity: activeModal.severity,
        userDecision,
        outcomeCategory,
        timeToDecisionMs,
        timeToFirstFrictionActionMs: activeModal.timeToFirstFrictionActionMs,
        muscleMemoryClicks: activeModal.muscleMemoryClicks,
        runningTotals: computeRunningSnapshot(session),
      });

      activeAiModalRef.current = null;
      updateDurationAndPersist();
    },
    [updateDurationAndPersist]
  );

  const exportToCsv = useCallback(() => {
    updateDurationAndPersist();
    triggerCsvDownload(sessionRef.current);
  }, [updateDurationAndPersist]);

  const clearTelemetry = useCallback(() => {
    clearTelemetryStorage();
    sessionRef.current = createFreshSession(defaultVariant);
  }, [defaultVariant]);

  return {
    startSession,
    logTicketOpen,
    logTicketSolve,
    logAiModalOpen,
    logFrictionInteraction,
    logDisabledButtonClick,
    logAiModalResolve,
    exportToCsv,
    clearTelemetry,
    getSessionSnapshot: () => sessionRef.current,
  };
}