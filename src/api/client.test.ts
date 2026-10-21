import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiError, UNAUTHORIZED_EVENT, apiRequest } from './client';
import { clearAccessToken, setAccessToken } from '../lib/auth-token';

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

afterEach(() => {
  clearAccessToken();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe('apiRequest', () => {
  it('calls the configured relative API base and parses JSON', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ ok: true }));
    vi.stubGlobal('fetch', fetchMock);

    const result = await apiRequest<{ ok: boolean }>('/health');

    expect(result).toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0]?.[0]).toBe('/api/v1/health');

    const init = fetchMock.mock.calls[0]?.[1] as RequestInit;
    const headers = init.headers as Headers;

    expect(headers.get('Accept')).toBe('application/json');
    expect(headers.get('X-Request-Id')).toBeTruthy();
  });

  it('attaches the bearer token unless skipAuth is set', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ ok: true }));
    vi.stubGlobal('fetch', fetchMock);
    setAccessToken('test-token');

    await apiRequest('/me');

    const authHeaders = (fetchMock.mock.calls[0]?.[1] as RequestInit).headers as Headers;
    expect(authHeaders.get('Authorization')).toBe('Bearer test-token');

    fetchMock.mockClear();

    await apiRequest('/auth/login', { skipAuth: true });

    const anonymousHeaders = (fetchMock.mock.calls[0]?.[1] as RequestInit).headers as Headers;
    expect(anonymousHeaders.get('Authorization')).toBeNull();
  });

  it('throws a typed error with server code and trace id', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        jsonResponse(
          { code: 'VALIDATION_ERROR', message: 'شماره پروانه معتبر نیست.', traceId: 'trace-1' },
          422,
        ),
      ),
    );

    await expect(apiRequest('/inventory')).rejects.toMatchObject({
      name: 'ApiError',
      status: 422,
      code: 'VALIDATION_ERROR',
      traceId: 'trace-1',
    });
  });

  it('emits a single global event when a request with a token gets 401', async () => {
    setAccessToken('expired-token');
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(jsonResponse({ code: 'UNAUTHENTICATED' }, 401)),
    );

    const listener = vi.fn();
    window.addEventListener(UNAUTHORIZED_EVENT, listener);

    await expect(apiRequest('/me')).rejects.toBeInstanceOf(ApiError);

    expect(listener).toHaveBeenCalledTimes(1);

    window.removeEventListener(UNAUTHORIZED_EVENT, listener);
  });

  it('does not emit the unauthorized event for a failed login', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(jsonResponse({ code: 'INVALID_CREDENTIALS' }, 401)),
    );

    const listener = vi.fn();
    window.addEventListener(UNAUTHORIZED_EVENT, listener);

    await expect(apiRequest('/auth/login', { skipAuth: true })).rejects.toMatchObject({
      status: 401,
    });

    expect(listener).not.toHaveBeenCalled();

    window.removeEventListener(UNAUTHORIZED_EVENT, listener);
  });

  it('aborts a hanging request and reports a timeout', async () => {
    vi.useFakeTimers();

    vi.stubGlobal(
      'fetch',
      vi.fn(
        (_url: string, init: RequestInit) =>
          new Promise((_resolve, reject) => {
            init.signal?.addEventListener('abort', () => {
              reject(new DOMException('Aborted', 'AbortError'));
            });
          }),
      ),
    );

    const request = apiRequest('/slow', { timeoutMs: 1_000 });

    vi.advanceTimersByTime(1_000);

    await expect(request).rejects.toMatchObject({ code: 'TIMEOUT', status: 0 });
  });
});
