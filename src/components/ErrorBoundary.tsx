import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { reportError } from '../lib/telemetry';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  isChunkError: boolean;
}

function isChunkLoadError(error: Error): boolean {
  return /Loading chunk|dynamically imported module|Importing a module script failed/i.test(
    error.message,
  );
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, isChunkError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, isChunkError: isChunkLoadError(error) };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    reportError('react-error-boundary', error);
    reportError('react-error-boundary:component-stack', info.componentStack ?? '');
  }

  handleReload = (): void => {
    window.location.reload();
  };

  render(): ReactNode {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div
        dir="rtl"
        className="flex min-h-screen items-center justify-center bg-slate-50 p-6"
        role="alert"
      >
        <div className="w-full max-w-md rounded-3xl border border-rose-200 bg-white p-8 text-center shadow-xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-600">
            <AlertTriangle className="h-7 w-7" aria-hidden="true" />
          </div>

          <h1 className="mt-5 text-xl font-black text-slate-900">
            {this.state.isChunkError
              ? 'نسخه جدید برنامه در دسترس است'
              : 'خطای غیرمنتظره‌ای رخ داد'}
          </h1>

          <p className="mt-3 text-sm leading-7 text-slate-500">
            {this.state.isChunkError
              ? 'برای دریافت آخرین نسخه، صفحه را دوباره بارگذاری کنید.'
              : 'اگر مشکل ادامه داشت، صفحه را بارگذاری کنید و در صورت تکرار با پشتیبانی تماس بگیرید.'}
          </p>

          <button
            type="button"
            onClick={this.handleReload}
            className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-medical-600 text-sm font-extrabold text-white transition hover:bg-medical-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-medical-500/30"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            بارگذاری دوباره
          </button>
        </div>
      </div>
    );
  }
}
