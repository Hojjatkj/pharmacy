/**
 * Application configuration.
 *
 * Rules:
 * - Never hard-code an API host in source. Production must serve the API from
 *   the same origin (recommended) or provide VITE_API_BASE_URL at build time.
 * - The default is a relative path, so a missing environment variable can
 *   never make the browser call the user's localhost.
 */

const DEFAULT_API_BASE_URL = '/api/v1';
const DEFAULT_TIMEOUT_MS = 15_000;

function normalizeBaseUrl(value: string): string {
  const trimmed = value.trim().replace(/\/+$/, '');

  if (!trimmed) {
    return DEFAULT_API_BASE_URL;
  }

  if (trimmed.startsWith('/')) {
    return trimmed;
  }

  try {
    const url = new URL(trimmed);

    if (url.protocol !== 'https:' && url.protocol !== 'http:') {
      throw new Error('unsupported protocol');
    }

    return trimmed;
  } catch {
    // A malformed absolute URL should fail the build/startup, not silently
    // fall back to another host.
    throw new Error(
      `VITE_API_BASE_URL must be a relative path or an absolute http(s) URL. Received: "${value}"`,
    );
  }
}

function readTimeout(value: string | undefined): number {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed < 1_000 || parsed > 120_000) {
    return DEFAULT_TIMEOUT_MS;
  }

  return Math.round(parsed);
}

export const API_BASE_URL = normalizeBaseUrl(
  import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL,
);

export const API_TIMEOUT_MS = readTimeout(import.meta.env.VITE_API_TIMEOUT_MS);

/**
 * Demo mode controls simulated screens (escrow simulator, sample flows).
 * It defaults to true only while running `vite dev`, and must be explicitly
 * enabled with VITE_DEMO_MODE=true for any hosted demo.
 */
export const DEMO_MODE =
  import.meta.env.VITE_DEMO_MODE === 'true' ||
  (import.meta.env.DEV && import.meta.env.VITE_DEMO_MODE !== 'false');

export const IS_PRODUCTION = import.meta.env.PROD;

/**
 * Monetary values are integers and their unit must be explicit everywhere.
 *
 * The API contract is not versioned yet and different screens were built with
 * different assumptions (Rial vs Toman). The default matches Iranian retail
 * convention and the label comes from one place, so switching to Rial after
 * backend confirmation is a configuration change, not a code change.
 *
 * Open item: confirm the stored unit with the backend team before release.
 */
export const MONEY_UNIT_LABEL = (
  import.meta.env.VITE_MONEY_UNIT_LABEL === 'ریال' ? 'ریال' : 'تومان'
) as 'تومان' | 'ریال';
