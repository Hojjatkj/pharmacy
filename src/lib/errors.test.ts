import { describe, expect, it } from 'vitest';
import { ApiError } from '../api/client';
import { getUserMessage } from './errors';

function apiError(status: number, message = 'server said no'): ApiError {
  return new ApiError({ status, code: `HTTP_${status}`, message });
}

describe('getUserMessage', () => {
  it('never renders a raw 401/403/500 server message', () => {
    expect(getUserMessage(apiError(401, 'jwt malformed'))).not.toContain('jwt');
    expect(getUserMessage(apiError(403))).toContain('دسترسی');
    expect(getUserMessage(apiError(500, 'PrismaClientKnownRequestError'))).not.toContain('Prisma');
  });

  it('keeps safe validation messages for 422', () => {
    expect(getUserMessage(apiError(422, 'شماره پروانه معتبر نیست.'))).toBe(
      'شماره پروانه معتبر نیست.',
    );
  });

  it('strips HTML from server messages', () => {
    const message = getUserMessage(apiError(400, '<b>خطای</b> ورودی'));

    expect(message).not.toContain('<b>');
    expect(message).toContain('خطای');
  });

  it('mentions the retry window for 429', () => {
    const error = new ApiError({
      status: 429,
      code: 'RATE_LIMITED',
      message: 'too many requests',
      retryAfterSeconds: 30,
    });

    expect(getUserMessage(error)).toContain('۳۰');
  });

  it('falls back for unknown errors', () => {
    expect(getUserMessage(null, 'پیام جایگزین')).toBe('پیام جایگزین');
  });
});
