import { useContext } from 'react';
import { ConfirmContext, type ConfirmFn } from '../components/confirm-context';

/** Promise-based confirmation dialog: replaces `window.confirm`. */
export function useConfirm(): ConfirmFn {
  const context = useContext(ConfirmContext);

  if (!context) {
    throw new Error('useConfirm must be used inside <ConfirmProvider>');
  }

  return context;
}
