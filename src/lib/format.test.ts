import { describe, expect, it } from 'vitest';
import {
  formatDate,
  formatDaysLeft,
  formatMoney,
  formatNumber,
  formatPercent,
  parseDateOnly,
} from './format';

describe('format helpers', () => {
  it('formats integers with Persian digits', () => {
    expect(formatNumber(1234)).toBe(new Intl.NumberFormat('fa-IR').format(1234));
  });

  it('always renders the configured currency unit', () => {
    const formatted = formatMoney(1_250_000);

    expect(formatted).toMatch(/(تومان|ریال)$/);
    expect(formatted).toContain(new Intl.NumberFormat('fa-IR').format(1_250_000));
  });

  it('parses date-only values as local dates (no UTC day shift)', () => {
    const date = parseDateOnly('2026-03-21');

    expect(date).not.toBeNull();
    expect(date?.getFullYear()).toBe(2026);
    expect(date?.getMonth()).toBe(2);
    expect(date?.getDate()).toBe(21);
  });

  it('renders invalid or missing dates as a dash', () => {
    expect(formatDate(null)).toBe('—');
    expect(formatDate('not-a-date')).toBe('—');
  });

  it('formats a known date in the Persian calendar', () => {
    expect(formatDate('2026-03-21')).toContain('۱۴۰۵');
  });

  it('describes remaining days in plain language', () => {
    expect(formatDaysLeft(0)).toBe('امروز');
    expect(formatDaysLeft(-2)).toBe('منقضی شده');
    expect(formatDaysLeft(12)).toContain('۱۲');
  });

  it('formats percentages with one decimal at most', () => {
    expect(formatPercent(12.34)).toContain('۱۲٫۳');
  });
});
