import BrandMark from './BrandMark';
import React, { FormEvent, useEffect, useRef, useState } from 'react';
import {
  getActiveUserAgreement,
  registerUser,
  UserAgreementResponse,
} from '../api/auth';

type Props = {
  onBackToCatalog: () => void;
  onBackToLogin: () => void;
  onRegisterSuccess: () => void;
};

export default function CustomerRegisterPage({
  onBackToCatalog,
  onBackToLogin,
  onRegisterSuccess,
}: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreement, setAgreement] = useState<UserAgreementResponse | null>(null);
  const [agreementLoading, setAgreementLoading] = useState(false);
  const [agreementError, setAgreementError] = useState('');
  const [agreementOpen, setAgreementOpen] = useState(false);
  const [agreementRead, setAgreementRead] = useState(false);
  const [acceptUserAgreement, setAcceptUserAgreement] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const agreementScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!agreementOpen || !agreement || agreementLoading) return;

    const element = agreementScrollRef.current;
    if (!element) return;

    if (element.scrollHeight <= element.clientHeight + 12) {
      setAgreementRead(true);
    }
  }, [agreementOpen, agreement, agreementLoading]);

  async function openAgreement() {
    setAgreementError('');
    setAgreementOpen(true);

    if (agreement) return;

    try {
      setAgreementLoading(true);
      const result = await getActiveUserAgreement();
      setAgreement(result);
    } catch (err) {
      setAgreementError(
        err instanceof Error ? err.message : 'دریافت توافق‌نامه انجام نشد.',
      );
    } finally {
      setAgreementLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('لطفاً ایمیل خود را وارد کنید.');
      return;
    }

    if (password.length < 8) {
      setError('رمز عبور باید حداقل ۸ نویسه داشته باشد.');
      return;
    }

    if (password !== confirmPassword) {
      setError('تکرار رمز عبور با رمز عبور یکسان نیست.');
      return;
    }

    if (!agreement || !agreementRead || !acceptUserAgreement) {
      setError('لطفاً توافق‌نامه کاربری را مطالعه و تأیید کنید.');
      return;
    }

    try {
      setLoading(true);
      await registerUser({
        email: email.trim(),
        password,
        acceptUserAgreement: true,
      });
      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'ثبت‌نام انجام نشد. لطفاً اطلاعات را بررسی کنید.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main dir="rtl" className="flex min-h-screen items-center justify-center bg-slate-50 p-4 text-slate-800">
      {agreementOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
          <section className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
            <header className="flex items-center justify-between gap-3 border-b border-slate-200 p-5">
              <div>
                <h2 className="font-black">{agreement?.title ?? 'توافق‌نامه کاربری'}</h2>
                {agreement && (
                  <p className="mt-1 text-xs text-slate-500">نسخه {agreement.version}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setAgreementOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-bold hover:bg-slate-100"
              >
                بستن
              </button>
            </header>

            <div
              ref={agreementScrollRef}
              onScroll={(event) => {
                const element = event.currentTarget;
                if (element.scrollTop + element.clientHeight >= element.scrollHeight - 12) {
                  setAgreementRead(true);
                }
              }}
              className="min-h-0 flex-1 overflow-y-auto p-6"
            >
              {agreementLoading ? (
                <p className="py-12 text-center text-sm text-slate-500">در حال دریافت توافق‌نامه...</p>
              ) : agreementError ? (
                <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{agreementError}</p>
              ) : agreement ? (
                <div className="whitespace-pre-line text-sm leading-8 text-slate-700">{agreement.content}</div>
              ) : null}
            </div>

            <footer className="border-t border-slate-200 bg-slate-50 p-4">
              <p className="mb-3 text-xs leading-6 text-slate-500">
                برای فعال‌شدن تأیید، متن توافق‌نامه را تا انتها پیمایش کنید.
              </p>
              <button
                type="button"
                disabled={!agreementRead || !agreement}
                onClick={() => setAgreementOpen(false)}
                className="w-full rounded-xl bg-emerald-700 px-4 py-3 text-sm font-bold text-white disabled:bg-slate-300"
              >
                مطالعه توافق‌نامه به پایان رسید
              </button>
            </footer>
          </section>
        </div>
      )}

      <section className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <button type="button" onClick={onBackToCatalog} className="text-sm font-bold text-emerald-700 hover:underline">
          ← بازگشت به محصولات
        </button>

        <div className="mt-6">
          <BrandMark size={48} className="shrink-0 rounded-2xl shadow-lg shadow-emerald-600/20" />
          <h1 className="mt-4 text-2xl font-black">ساخت حساب مشتری</h1>
          <p className="mt-2 text-sm leading-7 text-slate-500">
            این فرم برای مشتریان است و از ثبت‌نام داروخانه جداست.
          </p>
        </div>

        {success ? (
          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
            <h2 className="font-black text-emerald-900">ثبت‌نام با موفقیت انجام شد</h2>
            <p className="mt-2 text-sm leading-7 text-emerald-800">
              برای ادامه خرید، با ایمیل و رمز عبوری که انتخاب کردید وارد حساب شوید.
            </p>
            <button
              type="button"
              onClick={onRegisterSuccess}
              className="mt-4 w-full rounded-xl bg-emerald-700 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-800"
            >
              رفتن به صفحه ورود
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {error && (
              <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm leading-6 text-red-700">
                {error}
              </div>
            )}

            <label className="block">
              <span className="mb-2 block text-sm font-bold">ایمیل</span>
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600"
                placeholder="you@example.com"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold">رمز عبور</span>
              <input
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                maxLength={128}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600"
                placeholder="حداقل ۸ نویسه"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold">تکرار رمز عبور</span>
              <input
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                maxLength={128}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600"
              />
            </label>

            <div className="rounded-xl border border-slate-200 p-4">
              <button type="button" onClick={() => void openAgreement()} className="text-sm font-bold text-emerald-700 hover:underline">
                مشاهده توافق‌نامه کاربری
              </button>
              <label className="mt-3 flex items-start gap-3 text-sm leading-6 text-slate-700">
                <input
                  type="checkbox"
                  checked={acceptUserAgreement}
                  disabled={!agreement || !agreementRead}
                  onChange={(event) => setAcceptUserAgreement(event.target.checked)}
                  className="mt-1 h-4 w-4 accent-emerald-700"
                />
                <span>توافق‌نامه کاربری را مطالعه کرده‌ام و می‌پذیرم.</span>
              </label>
              {!agreementRead && (
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  ابتدا توافق‌نامه را باز کرده و تا انتها مطالعه کنید.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-emerald-700 px-4 py-3.5 text-sm font-bold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {loading ? 'در حال ثبت‌نام...' : 'ایجاد حساب مشتری'}
            </button>
          </form>
        )}

        <div className="mt-6 border-t border-slate-100 pt-5 text-center text-sm text-slate-600">
          قبلاً حساب ساخته‌اید؟{' '}
          <button type="button" onClick={onBackToLogin} className="font-bold text-emerald-700 hover:underline">
            ورود
          </button>
        </div>
      </section>
    </main>
  );
}
