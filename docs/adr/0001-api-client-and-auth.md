# ADR 0001 — API client and authentication seam

- Status: accepted (2026-10-21)
- Scope: browser SPA (`src/api/client.ts`, `src/lib/auth-token.ts`, `src/App.tsx`)

## Context

The first version duplicated the API base URL in several modules, fell back to
`http://localhost:3001/api/v1` when configuration was missing, read the access
token with `localStorage.getItem('accessToken')` in four places, had no timeout,
and detected expired sessions by matching the text `401` in error messages.
Those choices fail in production (wrong host), hide failures (raw server strings
shown to users) and make any auth change a repo-wide edit.

## Decision

1. **One HTTP entry point.** All requests go through `apiRequest` /
   `apiRequestBlob` in `src/api/client.ts`.
2. **Relative base URL by default.** `VITE_API_BASE_URL` defaults to `/api/v1`,
   so production is same-origin. Absolute URLs are accepted only for
   http(s) and are validated at startup. No implicit localhost fallback.
3. **One token seam.** `src/lib/auth-token.ts` owns storage, expiry decoding and
   the `pharmart:auth-changed` event. No other module touches the storage key.
4. **Typed error envelope.** `ApiError` carries `status`, `code`, `traceId`,
   `details` and `retryAfterSeconds`; `getUserMessage()` maps it to Persian copy
   and never renders stack traces or HTML.
5. **Global session signal.** A `401` on a request that carried a token emits
   `pharmart:unauthorized`; `App` clears the session exactly once. A failed
   login is also `401` but carries no token, so it does not emit the event.
6. **Timeouts and no silent retries.** 15 s default via `AbortController`
   (`VITE_API_TIMEOUT_MS`, 1–120 s). Mutations are never retried automatically;
   TanStack Query retries only non-4xx queries once.
7. **Traceability.** Every request gets `X-Request-Id`; responses are expected to
   return `traceId` in the error body for support tickets.

## Known limitation: token storage

The access token currently lives in `localStorage` (key `accessToken`) for
compatibility with the existing backend contract. It is readable by any script
on the origin, so an XSS becomes a session theft.

Migration path (requires backend work, tracked as a separate task):

1. Backend sets the access/refresh pair as `HttpOnly; Secure; SameSite=Lax`
   cookies on login and refresh.
2. Frontend stops reading the token; `apiRequest` relies on
   `credentials: 'same-origin'` only.
3. Add CSRF protection for cookie-authenticated mutations (double-submit token
   or `SameSite=Strict` on the refresh cookie).
4. Keep the `pharmart:unauthorized` event as the single logout trigger.

## Consequences

- A missing or typo'd `VITE_API_BASE_URL` fails fast instead of silently calling
  localhost.
- Call sites cannot invent their own auth headers or error strings.
- Revoking a session still depends on the backend expiring the token; client-side
  expiry checks are UX, not security.
- Authorization remains a server responsibility. UI role checks are cosmetic and
  must be re-enforced by every endpoint.
