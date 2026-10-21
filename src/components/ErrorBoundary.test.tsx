import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from './ErrorBoundary';

function ExplodingChild(): never {
  throw new Error('boom');
}

function ChunkErrorChild(): never {
  throw new Error('Failed to fetch dynamically imported module');
}

describe('ErrorBoundary', () => {
  it('renders a recoverable fallback instead of a white screen', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    render(
      <ErrorBoundary>
        <ExplodingChild />
      </ErrorBoundary>,
    );

    expect(screen.getByRole('alert')).toHaveTextContent('خطای غیرمنتظره‌ای رخ داد');
    expect(screen.getByRole('button', { name: /بارگذاری دوباره/ })).toBeInTheDocument();
  });

  it('explains stale chunks after a deployment', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    render(
      <ErrorBoundary>
        <ChunkErrorChild />
      </ErrorBoundary>,
    );

    expect(screen.getByRole('alert')).toHaveTextContent('نسخه جدید برنامه در دسترس است');
  });
});
