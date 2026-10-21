import { afterEach, describe, expect, it } from 'vitest';
import {
  ACCESS_TOKEN_KEY,
  clearAccessToken,
  getAccessToken,
  getTokenExpiry,
  isTokenExpired,
  setAccessToken,
} from './auth-token';

function createToken(payload: Record<string, unknown>): string {
  const encoded = window
    .btoa(JSON.stringify(payload))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  return `header.${encoded}.signature`;
}

afterEach(() => {
  clearAccessToken();
});

describe('access token storage', () => {
  it('stores and clears the token in one place', () => {
    expect(getAccessToken()).toBeNull();

    setAccessToken('token-1');

    expect(getAccessToken()).toBe('token-1');
    expect(window.localStorage.getItem(ACCESS_TOKEN_KEY)).toBe('token-1');

    clearAccessToken();

    expect(getAccessToken()).toBeNull();
  });

  it('detects an expired JWT without trusting the client for authorization', () => {
    const expired = createToken({ exp: Math.floor(Date.now() / 1000) - 60 });
    const valid = createToken({ exp: Math.floor(Date.now() / 1000) + 3_600 });

    expect(isTokenExpired(expired)).toBe(true);
    expect(isTokenExpired(valid)).toBe(false);
  });

  it('exposes the expiry timestamp for proactive logout', () => {
    const exp = Math.floor(Date.now() / 1000) + 600;

    expect(getTokenExpiry(createToken({ exp }))).toBe(exp * 1_000);
  });

  it('treats opaque tokens as non-expiring client-side', () => {
    expect(isTokenExpired('opaque-token')).toBe(false);
  });

  it('treats a missing token as expired', () => {
    expect(isTokenExpired(null)).toBe(true);
  });
});
