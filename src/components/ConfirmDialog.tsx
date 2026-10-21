import { useCallback, useState, type ReactNode } from 'react';
import { Modal } from './Modal';
import { ConfirmContext, type ConfirmFn, type ConfirmOptions } from './confirm-context';

interface PendingConfirm {
  options: ConfirmOptions;
  resolve: (value: boolean) => void;
}

/**
 * Promise-based replacement for `window.confirm`.
 *
 * Native confirm blocks the event loop, cannot be styled or translated
 * consistently, is not announced reliably by screen readers and looks like a
 * browser warning rather than part of the product.
 */
export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [pending, setPending] = useState<PendingConfirm | null>(null);

  const confirm = useCallback<ConfirmFn>(
    (options) =>
      new Promise<boolean>((resolve) => {
        setPending((current) => {
          // Resolve a previously queued request instead of dropping it.
          current?.resolve(false);
          return { options, resolve };
        });
      }),
    [],
  );

  const settle = useCallback((value: boolean) => {
    setPending((current) => {
      current?.resolve(value);
      return null;
    });
  }, []);

  const options = pending?.options;
  const isDanger = options?.tone === 'danger';

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}

      <Modal
        open={pending !== null}
        onClose={() => settle(false)}
        title={options?.title ?? ''}
        size="sm"
        footer={
          <div className="flex flex-wrap justify-end gap-2">
            <button
              type="button"
              onClick={() => settle(false)}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medical-500"
            >
              {options?.cancelLabel ?? 'انصراف'}
            </button>
            <button
              type="button"
              onClick={() => settle(true)}
              className={`rounded-xl px-4 py-2.5 text-sm font-black text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                isDanger
                  ? 'bg-rose-600 hover:bg-rose-700 focus-visible:ring-rose-500'
                  : 'bg-medical-600 hover:bg-medical-700 focus-visible:ring-medical-500'
              }`}
            >
              {options?.confirmLabel ?? 'تأیید'}
            </button>
          </div>
        }
      >
        {options?.message && (
          <p className="text-sm leading-7 text-slate-600">{options.message}</p>
        )}
      </Modal>
    </ConfirmContext.Provider>
  );
}
