import { FlaskConical } from 'lucide-react';
import { DEMO_MODE } from '../config';

interface DemoNoticeProps {
  /** What is simulated, in plain language. */
  children: string;
}

/**
 * Visible boundary between a demo and a real financial operation.
 * Never show a simulated payment/escrow screen without this notice.
 */
export function DemoNotice({ children }: DemoNoticeProps) {
  if (!DEMO_MODE) return null;

  return (
    <div
      role="note"
      className="flex items-start gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-xs leading-6 text-amber-900"
    >
      <FlaskConical className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />

      <div>
        <strong className="me-1 font-black">حالت دمو:</strong>
        {children}
      </div>
    </div>
  );
}
