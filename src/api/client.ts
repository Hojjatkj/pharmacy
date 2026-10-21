import { API_BASE_URL, API_TIMEOUT_MS } from '../config';
import { getAccessToken } from '../lib/auth-token';

export const UNAUTHORIZED_EVENT = 'pharmart:unauthorized';

export interface ApiErrorPayload {
  code?: string;
  message?: string;
  traceId?: string;
  details?: unknown;
}

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly traceId?: string;
  readonly details?: unknown;
  readonly retryAfterSeconds?: number;

  constructor(options: {
    status: number;
    code: string;
    message: string;
    traceId?: string;
    details?: unknown;
    retryAfterSeconds?: number;
  }) {
    super(options.message);
    this.name = 'ApiError';
    this.status = options.status;
    this.code = options.code;
    this.traceId = options.traceId;
    this.details = options.details;
    this.retryAfterSeconds = options.retryAfterSeconds;
  }
}

export interface ApiRequestOptions extends RequestInit {
  /** Override the default request timeout (milliseconds). */
  timeoutMs?: number;
  /** Do not attach the bearer token (used by login/register). */
  skipAuth?: boolean;
}

function createRequestId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `req-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function readRetryAfter(response: Response): number | undefined {
  const raw = response.headers.get('retry-after');

  if (!raw) return undefined;

  const seconds = Number(raw);

  return Number.isFinite(seconds) && seconds >= 0 ? seconds : undefined;
}

async function parseBody(response: Response): Promise<unknown> {
  if (response.status === 204) {
    return undefined;
  }

  const contentType = response.headers.get('content-type') ?? '';

  if (contentType.includes('application/json')) {
    try {
      return await response.json();
    } catch {
      return undefined;
    }
  }

  try {
    return await response.text();
  } catch {
    return undefined;
  }
}

function toApiError(response: Response, body: unknown): ApiError {
  const payload =
    typeof body === 'object' && body !== null ? (body as ApiErrorPayload) : undefined;

  const fallbackMessage =
    typeof body === 'string' && body.trim() && body.length < 500
      ? body.trim()
      : `Request failed with status ${response.status}`;

  return new ApiError({
    status: response.status,
    code: payload?.code ?? `HTTP_${response.status}`,
    message: payload?.message ?? fallbackMessage,
    traceId: payload?.traceId,
    details: payload?.details,
    retryAfterSeconds: readRetryAfter(response),
  });
}

function dispatchUnauthorized(): void {
  window.dispatchEvent(new CustomEvent(UNAUTHORIZED_EVENT));
}

/**
 * Low-level HTTP client.
 *
 * Responsibilities kept here (and nowhere else):
 * - base URL and auth header
 * - request timeout / cancellation
 * - typed error envelope
 * - a single global signal when a session becomes invalid
 */
export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { timeoutMs = API_TIMEOUT_MS, skipAuth = false, signal, ...init } = options;

  const token = skipAuth ? null : getAccessToken();
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

  const abortFromCaller = () => controller.abort();
  signal?.addEventListener('abort', abortFromCaller, { once: true });

  const headers = new Headers(init.headers);

  headers.set('Accept', 'application/json');
  headers.set('X-Request-Id', createRequestId());

  if (init.body && !(init.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers,
      signal: controller.signal,
      credentials: 'same-origin',
    });

    const body = await parseBody(response);

    if (!response.ok) {
      const error = toApiError(response, body);

      // A 401 on a request that carried a token means the session is gone.
      // A failed login is also 401, but there is no token to invalidate.
      if (response.status === 401 && token) {
        dispatchUnauthorized();
      }

      throw error;
    }

    return body as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiError({
        status: 0,
        code: 'TIMEOUT',
        message: 'زمان پاسخ‌گویی سرور به پایان رسید. اتصال اینترنت را بررسی و دوباره تلاش کنید.',
      });
    }

    throw new ApiError({
      status: 0,
      code: 'NETWORK_ERROR',
      message: 'ارتباط با سرور برقرار نشد. اتصال اینترنت را بررسی کنید.',
    });
  } finally {
    window.clearTimeout(timeoutId);
    signal?.removeEventListener('abort', abortFromCaller);
  }
}

/** Downloads a binary response (Excel templates, invoices) with the same auth/error rules. */
export async function apiRequestBlob(
  path: string,
  options: ApiRequestOptions = {},
): Promise<Blob> {
  const { timeoutMs = API_TIMEOUT_MS, skipAuth = false, signal, ...init } = options;

  const token = skipAuth ? null : getAccessToken();
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

  const abortFromCaller = () => controller.abort();
  signal?.addEventListener('abort', abortFromCaller, { once: true });

  const headers = new Headers(init.headers);

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  headers.set('X-Request-Id', createRequestId());

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers,
      signal: controller.signal,
      credentials: 'same-origin',
    });

    if (!response.ok) {
      const body = await parseBody(response);
      const error = toApiError(response, body);

      if (response.status === 401 && token) {
        dispatchUnauthorized();
      }

      throw error;
    }

    return await response.blob();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiError({
        status: 0,
        code: 'TIMEOUT',
        message: 'زمان دریافت فایل به پایان رسید. دوباره تلاش کنید.',
      });
    }

    throw new ApiError({
      status: 0,
      code: 'NETWORK_ERROR',
      message: 'ارتباط با سرور برقرار نشد. اتصال اینترنت را بررسی کنید.',
    });
  } finally {
    window.clearTimeout(timeoutId);
    signal?.removeEventListener('abort', abortFromCaller);
  }
}

export function getApiBaseUrl(): string {
  return API_BASE_URL;
}
