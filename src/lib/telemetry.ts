/**
 * Minimal error reporting seam.
 *
 * Today it keeps a bounded in-memory buffer and logs in development. In
 * production it should forward to the chosen APM/Sentry pipeline; keeping the
 * call sites behind this function avoids sprinkling `console.error` across the
 * app and makes adding a vendor a one-file change.
 */

interface ErrorRecord {
  timestamp: string;
  context: string;
  message: string;
  stack?: string;
}

const MAX_RECORDS = 50;
const buffer: ErrorRecord[] = [];

export function reportError(context: string, error: unknown): void {
  const record: ErrorRecord = {
    timestamp: new Date().toISOString(),
    context,
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
  };

  buffer.push(record);

  if (buffer.length > MAX_RECORDS) {
    buffer.shift();
  }

  if (import.meta.env.DEV) {
    console.error(`[${context}]`, error);
  }
}

export function getRecentErrors(): readonly ErrorRecord[] {
  return buffer;
}
