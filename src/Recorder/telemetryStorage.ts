import type { TelemetrySessionData } from './telemetryTypes';

const STORAGE_KEY = 'usability_test_telemetry_v1';

export function saveTelemetryToStorage(data: TelemetrySessionData): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('[TelemetryStorage]: Failed to persist session data', error);
  }
}

export function loadTelemetryFromStorage(): TelemetrySessionData | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as TelemetrySessionData;
  } catch (error) {
    console.error('[TelemetryStorage]: Failed to parse stored session data', error);
    return null;
  }
}

export function clearTelemetryStorage(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('[TelemetryStorage]: Failed to clear storage', error);
  }
}