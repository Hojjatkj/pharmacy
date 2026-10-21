import { createContext } from 'react';

export interface ConfirmOptions {
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** `danger` renders a destructive red action. */
  tone?: 'default' | 'danger';
}

export type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>;

/** @internal — use the `useConfirm` hook instead of consuming directly. */
export const ConfirmContext = createContext<ConfirmFn | null>(null);
