import { MONEY_UNIT_LABEL } from '../config';

const numberFormatter = new Intl.NumberFormat('fa-IR');
const percentFormatter = new Intl.NumberFormat('fa-IR', {
  maximumFractionDigits: 1,
});
const dateFormatter = new Intl.DateTimeFormat('fa-IR', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});
const dateTimeFormatter = new Intl.DateTimeFormat('fa-IR', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
});

/**
 * Parses a date-only string (YYYY-MM-DD) as a local date.
 *
 * `new Date('2026-10-21')` is parsed as UTC midnight, which can render as the
 * previous day for users west of UTC. Date-only values in this product always
 * describe a local calendar day (expiry, invoice date), so parse them locally.
 */
export function parseDateOnly(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());

  if (match) {
    const [, year, month, day] = match;
    const date = new Date(Number(year), Number(month) - 1, Number(day));

    return Number.isNaN(date.getTime()) ? null : date;
  }

  const parsed = new Date(value);

  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return '—';
  return numberFormatter.format(value);
}

export function formatPercent(value: number): string {
  if (!Number.isFinite(value)) return '—';
  return `${percentFormatter.format(value)}٪`;
}

/**
 * Formats an integer amount that the API provides in Rial.
 * Never accept a value whose unit is unknown; the unit is part of the label.
 */
export function formatMoney(value: number): string {
  if (!Number.isFinite(value)) return '—';
  return `${numberFormatter.format(Math.round(value))} ${MONEY_UNIT_LABEL}`;
}

/** Formats a count with Persian digits (no currency suffix). */
export function formatCount(value: number): string {
  return formatNumber(Math.round(value));
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return '—';

  const date = parseDateOnly(value);

  return date ? dateFormatter.format(date) : '—';
}

export function formatDateTime(value: string | null | undefined): string {
  if (!value) return '—';

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? '—' : dateTimeFormatter.format(date);
}

export function formatDaysLeft(days: number): string {
  if (!Number.isFinite(days)) return '—';
  if (days < 0) return 'منقضی شده';
  if (days === 0) return 'امروز';
  return `${formatNumber(days)} روز`;
}
