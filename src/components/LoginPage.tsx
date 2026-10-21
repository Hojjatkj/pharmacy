import BrandMark from './BrandMark';
import { useState, type FormEvent } from 'react';

import { login } from '../api/auth';
import { getUserMessage } from '../lib/errors';

interface LoginPageProps {
  onLoginSuccess: () => void;
  onRegister: () => void;
  onBackToLanding?: () => void;
  /** Session-expiry / forced-logout message shown above the form. */
  notice?: string | null;
}

export function LoginPage({
    onLoginSuccess,
    onRegister,
    onBackToLanding,
    notice,
  }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError(null);

    if (!email.trim() || !password) {
      setError('لطفاً ایمیل و رمز عبور را وارد کنید.');
      return;
    }

    try {
      setLoading(true);

      await login(email.trim(), password);

      onLoginSuccess();
    } catch (err) {
      setError(getUserMessage(err, 'ورود انجام نشد. لطفاً اطلاعات حساب را بررسی کنید.'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 font-['Vazirmatn',sans-serif]"
      dir="rtl"
    >
      <div className="w-full max-w-6xl">
        <div className="grid lg:grid-cols-2 overflow-hidden bg-white border border-slate-200 rounded-3xl shadow-xl shadow-slate-200/60">
          {/* Brand Panel */}
          <div className="relative hidden lg:flex min-h-[680px] overflow-hidden bg-slate-900 p-10 text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.28),transparent_32%),radial-gradient(circle_at_80%_80%,rgba(20,184,166,0.18),transparent_30%)]" />

            <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full border border-emerald-400/10" />
            <div className="absolute -left-12 -top-12 h-48 w-48 rounded-full border border-emerald-400/10" />

            <div className="relative z-10 flex w-full flex-col">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 shadow-lg shadow-emerald-500/20">
                  <BrandMark size={44} className="shrink-0 rounded-xl" />
                </div>

                <div>
                  <div className="text-lg font-extrabold tracking-tight">
                    PharmArt
                  </div>
                  <div className="text-[11px] text-slate-400">
                    PharmArt
                  </div>
                </div>
              </div>

              {/* Hero */}
              <div className="my-auto max-w-md">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-bold text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  سامانه هوشمند تبادل دارویی
                </div>

                <h1 className="text-4xl font-black leading-[1.35] tracking-tight xl:text-5xl">
                  مدیریت هوشمند
                  <br />
                  <span className="text-emerald-400">
                    زنجیره داروخانه
                  </span>
                </h1>

                <p className="mt-6 text-sm leading-8 text-slate-300">
                  موجودی، تبادل بین‌داروخانه‌ای و تصمیم‌گیری عملیاتی
                  را در یک پلتفرم یکپارچه مدیریت کنید.
                </p>

                {/* Feature cards */}
                <div className="mt-10 grid grid-cols-3 gap-3">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                    <div className="text-2xl font-black text-emerald-400">
                      AI
                    </div>
                    <div className="mt-1 text-[11px] text-slate-400">
                      تحلیل هوشمند
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                    <div className="text-2xl font-black text-emerald-400">
                      B2B
                    </div>
                    <div className="mt-1 text-[11px] text-slate-400">
                      تبادل داروخانه‌ای
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                    <div className="text-2xl font-black text-emerald-400">
                      24/7
                    </div>
                    <div className="mt-1 text-[11px] text-slate-400">
                      مدیریت مداوم
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-white/10 pt-6 text-[11px] text-slate-500">
                <span>
                  PharmArt
                </span>

                <span>
                  پلتفرم تخصصی داروخانه‌ها
                </span>
              </div>
            </div>
          </div>

          {/* Login Panel */}
          <div className="flex min-h-[680px] items-center justify-center p-6 sm:p-10 lg:p-14">
            <div className="w-full max-w-md">
              {onBackToLanding && (
                <button
                  type="button"
                  onClick={onBackToLanding}
                  className="mb-6 inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-bold text-medical-700 transition hover:bg-medical-50"
                >
                  <span aria-hidden="true">→</span>
                  بازگشت به صفحه اصلی
                </button>
              )}

              {/* Mobile logo */}
              <div className="mb-10 flex items-center gap-3 lg:hidden">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-medical-600 shadow-lg shadow-medical-600/20">
                  <BrandMark size={44} className="shrink-0 rounded-xl" />
                </div>

                <div>
                  <div className="font-extrabold text-slate-900">
                    PharmArt
                  </div>
                  <div className="text-[10px] text-slate-400">
                    PharmArt
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <div className="mb-3 text-sm font-bold text-emerald-600">
                  خوش آمدید
                </div>

                <h2 className="text-3xl font-black tracking-tight text-slate-900">
                  ورود به پنل مدیریت
                </h2>

                <p className="mt-3 text-sm leading-7 text-slate-500">
                  برای دسترسی به داشبورد داروخانه، اطلاعات حساب
                  خود را وارد کنید.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-xs font-extrabold text-slate-700"
                  >
                    ایمیل
                  </label>

                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex w-12 items-center justify-center text-slate-400">
                      <svg
                        viewBox="0 0 24 24"
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <rect
                          x="3"
                          y="5"
                          width="18"
                          height="14"
                          rx="2"
                        />
                        <path d="m3 7 9 6 9-6" />
                      </svg>
                    </div>

                    <input
                      id="email"
                      type="email"
                      dir="ltr"
                      autoComplete="email"
                      value={email}
                      onChange={(event) =>
                        setEmail(event.target.value)
                      }
                      placeholder="name@example.com"
                      className="h-13 w-full rounded-xl border border-slate-200 bg-slate-50 pr-12 pl-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-medical-500 focus:bg-white focus:ring-4 focus:ring-medical-500/10"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-xs font-extrabold text-slate-700"
                    >
                      رمز عبور
                    </label>
                  </div>

                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex w-12 items-center justify-center text-slate-400">
                      <svg
                        viewBox="0 0 24 24"
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <rect
                          x="5"
                          y="10"
                          width="14"
                          height="10"
                          rx="2"
                        />
                        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                      </svg>
                    </div>

                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      dir="ltr"
                      autoComplete="current-password"
                      value={password}
                      onChange={(event) =>
                        setPassword(event.target.value)
                      }
                      placeholder="••••••••"
                      className="h-13 w-full rounded-xl border border-slate-200 bg-slate-50 pr-12 pl-12 text-sm tracking-wider text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-medical-500 focus:bg-white focus:ring-4 focus:ring-medical-500/10"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((value) => !value)
                      }
                      className="absolute inset-y-0 left-0 flex w-12 items-center justify-center text-slate-400 transition hover:text-slate-700"
                      aria-label={
                        showPassword
                          ? 'مخفی کردن رمز عبور'
                          : 'نمایش رمز عبور'
                      }
                    >
                      {showPassword ? (
                        <svg
                          viewBox="0 0 24 24"
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        >
                          <path d="M3 3l18 18" />
                          <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                          <path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c5.2 0 9 5.5 9 7s-3.8 7-9 7a9.9 9.9 0 0 1-5.2-1.5" />
                          <path d="M4.8 15.2C3.6 13.9 3 12.7 3 12c0-1 2.2-4.5 5.6-6.2" />
                        </svg>
                      ) : (
                        <svg
                          viewBox="0 0 24 24"
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        >
                          <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
                          <circle cx="12" cy="12" r="2.5" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {notice && !error && (
                  <div
                    role="status"
                    className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-sm text-amber-800"
                  >
                    <span className="leading-6">{notice}</span>
                  </div>
                )}

                {/* Error */}
                {error && (
                  <div
                    role="alert"
                    className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-sm text-rose-700"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="mt-0.5 h-5 w-5 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 8v5" />
                      <path d="M12 16h.01" />
                    </svg>

                    <span className="leading-6">{error}</span>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative h-13 w-full overflow-hidden rounded-xl bg-medical-600 text-sm font-extrabold text-white shadow-lg shadow-medical-600/20 transition hover:bg-medical-700 hover:shadow-medical-600/30 focus:outline-none focus:ring-4 focus:ring-medical-500/20 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        در حال ورود...
                      </>
                    ) : (
                      <>
                        ورود به سامانه
                        <svg
                          viewBox="0 0 24 24"
                          className="h-4 w-4 transition-transform group-hover:-translate-x-1"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M19 12H5" />
                          <path d="m12 19-7-7 7-7" />
                        </svg>
                      </>
                    )}
                  </span>
                </button>
              </form>

              {/* Register */}
              <div className="mt-7 border-t border-slate-100 pt-6 text-center">
                <span className="text-xs text-slate-500">
                  داروخانه شما هنوز حساب ندارد؟
                </span>

                <button
                  type="button"
                  onClick={onRegister}
                  className="mr-2 text-xs font-extrabold text-medical-600 transition hover:text-medical-700"
                >
                  ثبت‌نام داروخانه
                </button>
              </div>

              {/* Security notice */}
              <div className="mt-8 flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <div className="text-xs font-bold text-slate-700">
                    دسترسی امن
                  </div>

                  <div className="mt-0.5 text-[10px] leading-5 text-slate-400">
                    ارتباط حساب شما با سامانه به‌صورت امن مدیریت می‌شود.
                  </div>
                </div>


              <div className="mt-8 text-center text-[10px] text-slate-400">
                © {new Date().getFullYear()} PharmArt
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}