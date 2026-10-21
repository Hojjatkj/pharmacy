import { AlertTriangle, Loader2, RefreshCw } from 'lucide-react';

export function FullPageLoader({ label = 'در حال دریافت اطلاعات...' }: { label?: string }) {
  return (
    <div dir="rtl" className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="text-center" role="status" aria-live="polite">
        <Loader2 className="mx-auto h-10 w-10 animate-spin text-medical-600" aria-hidden="true" />
        <p className="mt-4 text-sm font-bold text-slate-600">{label}</p>
      </div>
    </div>
  );
}

interface StartupErrorProps {
  message: string;
  onRetry: () => void;
  onLogout: () => void;
}

/**
 * Shown when the user has a valid-looking session but the application could
 * not load its data. Previously this case silently fell back to the login
 * page, which made backend outages look like a wrong password.
 */
export function StartupError({ message, onRetry, onLogout }: StartupErrorProps) {
  return (
    <div dir="rtl" className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md rounded-3xl border border-amber-200 bg-white p-8 text-center shadow-xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-600">
          <AlertTriangle className="h-7 w-7" aria-hidden="true" />
        </div>

        <h1 className="mt-5 text-lg font-black text-slate-900">بارگذاری اطلاعات انجام نشد</h1>

        <p className="mt-3 text-sm leading-7 text-slate-500" role="alert">
          {message}
        </p>

        <button
          type="button"
          onClick={onRetry}
          className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-medical-600 text-sm font-extrabold text-white transition hover:bg-medical-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-medical-500/30"
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          تلاش مجدد
        </button>

        <button
          type="button"
          onClick={onLogout}
          className="mt-3 h-11 w-full rounded-xl border border-slate-200 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
        >
          خروج از حساب
        </button>
      </div>
    </div>
  );
}
