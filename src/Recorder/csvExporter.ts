import type { TelemetrySessionData } from './telemetryTypes';

const CSV_HEADERS = [
  // Session Metadata & Global Cadence
  'sessionId',
  'variant',
  'totalTestDurationSeconds',
  'totalGeneralClicks',
  'meanTimeBetweenClicksMs',
  // Event Identification
  'chronologicalIndex',
  'eventType',
  'loggedAtIso',
  // Running Totals
  'totalSolved',
  'errorCatchRate',
  'falseRejectionRate',
  // Decoy Ticket Metrics
  'ticketId',
  'selectedCategory',
  'correctCategory',
  'isCorrect',
  'ticketSolveDurationMs',
  'timeSinceLastSolveMs',
  'occurredImmediatelyAfterAi',
  // AI Intervention Metrics
  'aiEventIndex',
  'aiTrapId',
  'triggerTimestampSeconds',
  'isHallucination',
  'severity',
  'userDecision',
  'outcomeCategory',
  'timeToDecisionMs',
  'timeToFirstFrictionActionMs',
  'muscleMemoryClicks',
] as const;

function escapeCsvCell(value: string | number | boolean | null | undefined): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function buildTelemetryCsvString(session: TelemetrySessionData): string {
  const headerRow = CSV_HEADERS.join(',');

  const rows = session.events.map((event) => {
    const baseCols = [
      session.sessionId,
      session.variant,
      session.totalTestDurationSeconds,
      session.clickCadence.totalGeneralClicks,
      session.clickCadence.meanTimeBetweenClicksMs,
      event.chronologicalIndex,
      event.eventType,
      event.loggedAtIso,
      event.runningTotals.totalSolved,
      event.runningTotals.errorCatchRate,
      event.runningTotals.falseRejectionRate,
    ];

    if (event.eventType === 'TICKET_SOLVE') {
      const ticketCols = [
        event.ticketId,
        event.selectedCategory,
        event.correctCategory,
        event.isCorrect,
        event.ticketSolveDurationMs,
        event.timeSinceLastSolveMs,
        event.occurredImmediatelyAfterAi,
      ];
      const emptyAiCols = Array(10).fill('');
      return [...baseCols, ...ticketCols, ...emptyAiCols]
        .map(escapeCsvCell)
        .join(',');
    } else {
      const emptyTicketCols = Array(7).fill('');
      const aiCols = [
        event.eventIndex,
        event.aiTrapId,
        event.triggerTimestampSeconds,
        event.isHallucination,
        event.severity,
        event.userDecision,
        event.outcomeCategory,
        event.timeToDecisionMs,
        event.timeToFirstFrictionActionMs,
        event.muscleMemoryClicks,
      ];
      return [...baseCols, ...emptyTicketCols, ...aiCols]
        .map(escapeCsvCell)
        .join(',');
    }
  });

  return [headerRow, ...rows].join('\n');
}

export function triggerCsvDownload(session: TelemetrySessionData): void {
  const csvContent = buildTelemetryCsvString(session);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const timestamp = new Date()
    .toISOString()
    .replace(/[:.]/g, '-')
    .slice(0, 19);
  const filename = `telemetry_variant_${session.variant}_${timestamp}.csv`;

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}