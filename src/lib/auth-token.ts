/**
 * Single point of access for the access token.
 *
 * Current constraint: the backend issues a bearer token and has no refresh
 * endpoint yet, so the token is persisted in localStorage. That is an XSS
 * liability. The planned migration is an HttpOnly, Secure, SameSite cookie
 * with a short-lived access token and rotating refresh token (see
 * docs/adr/0001-api-client-and-auth.md). Keeping every read/write here makes
 * that migration a one-file change.
 */

export const ACCESS_TOKEN_KEY = 'accessToken';
export const AUTH_CHANGED_EVENT = 'pharmart:auth-changed';

function notifyAuthChanged(): void {
  window.dispatchEvent(new CustomEvent(AUTH_CHANGED_EVENT));
}

export function getAccessToken(): string | null {
  try {
    return window.localStorage.getItem(ACCESS_TOKEN_KEY);
  } catch {
    // Storage can be blocked (privacy mode, embedded webview).
    return null;
  }
}

export function setAccessToken(token: string): void {
  try {
    window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
  } catch {
    // Ignore: the in-memory request will still work for this page load.
  }

  notifyAuthChanged();
}

export function clearAccessToken(): void {
  try {
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  } catch {
    // Ignore.
  }

  notifyAuthChanged();
}

interface JwtPayload {
  exp?: number;
  iat?: number;
}

function decodeJwtPayload(token: string): JwtPayload | null {
  const parts = token.split('.');

  if (parts.length !== 3) {
    return null;
  }

  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
    const binary = window.atob(padded);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    const json = new TextDecoder().decode(bytes);

    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

/**
 * Returns the token expiry in milliseconds, or null for opaque tokens.
 * This is a UX guard only; the server remains the authority.
 */
export function getTokenExpiry(token: string | null = getAccessToken()): number | null {
  if (!token) return null;

  const payload = decodeJwtPayload(token);

  if (!payload?.exp) return null;

  return payload.exp * 1_000;
}

export function isTokenExpired(
  token: string | null = getAccessToken(),
  skewSeconds = 30,
): boolean {
  if (!token) return true;

  const expiry = getTokenExpiry(token);

  if (expiry === null) {
    // Opaque token: let the API decide.
    return false;
  }

  return expiry <= Date.now() + skewSeconds * 1_000;
}
