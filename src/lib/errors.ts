import { ApiError } from '../api/client';
import { formatNumber } from './format';

const FALLBACK_MESSAGE = 'انجام عملیات ممکن نشد. دوباره تلاش کنید.';

function cleanServerMessage(message: string): string | null {
  const cleaned = message.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

  if (!cleaned || cleaned.length > 300) return null;

  // Stack traces and English framework errors are not user-facing copy.
  if (/ (at |Error:|TypeError|Prisma|SQL|stack)/i.test(cleaned)) return null;

  return cleaned;
}

/**
 * Maps transport/HTTP failures to safe, actionable Persian messages.
 * Server messages are shown only for 4xx validation errors and after cleanup.
 */
export function getUserMessage(
  error: unknown,
  fallback = FALLBACK_MESSAGE,
): string {
  if (!(error instanceof ApiError)) {
    if (error instanceof Error && error.message) {
      return cleanServerMessage(error.message) ?? fallback;
    }

    return fallback;
  }

  switch (error.status) {
    case 0:
      return error.code === 'TIMEOUT'
        ? 'زمان پاسخ‌گویی سرور به پایان رسید. دوباره تلاش کنید.'
        : 'ارتباط با سرور برقرار نشد. اتصال اینترنت را بررسی کنید.';
    case 401:
      return 'نشست شما منقضی شده است. لطفاً دوباره وارد شوید.';
    case 403:
      return 'برای انجام این عملیات دسترسی ندارید.';
    case 404:
      return 'موردی که درخواست کردید پیدا نشد.';
    case 409:
      return cleanServerMessage(error.message) ?? 'این عملیات با وضعیت فعلی سامانه هم‌خوان نیست.';
    case 429: {
      const wait = error.retryAfterSeconds;

      return wait
        ? `تعداد درخواست‌ها زیاد است. ${formatNumber(wait)} ثانیه دیگر تلاش کنید.`
        : 'تعداد درخواست‌ها زیاد است. کمی بعد تلاش کنید.';
    }
    case 422:
      return cleanServerMessage(error.message) ?? 'اطلاعات واردشده معتبر نیست.';
    default:
      if (error.status >= 500) {
        return 'خطای سرور رخ داد. اگر ادامه داشت با پشتیبانی تماس بگیرید.';
      }

      return cleanServerMessage(error.message) ?? fallback;
  }
}

export function isUnauthorized(error: unknown): boolean {
  return error instanceof ApiError && error.status === 401;
}
