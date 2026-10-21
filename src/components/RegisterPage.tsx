import BrandMark from './BrandMark';
import React, { FormEvent, useEffect, useRef, useState } from 'react';

import {
  getActiveUserAgreement,
  register,
  RegisterRequest,
  UserAgreementResponse,
} from '../api/auth';

interface RegisterPageProps {
  onBackToLogin: () => void;
  onRegisterSuccess: () => void;
}

export function RegisterPage({
  onBackToLogin,
  onRegisterSuccess,
}: RegisterPageProps) {
  const [step, setStep] = useState<1 | 2>(1);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] =
    useState('');

  const [pharmacyName, setPharmacyName] =
    useState('');
  const [licenseNumber, setLicenseNumber] =
    useState('');
  const [technicalManager, setTechnicalManager] =
    useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] =
    useState('');
  const [address, setAddress] =
    useState('');
  const [phone, setPhone] = useState('');
  const [acceptUserAgreement, setAcceptUserAgreement] =
    useState(false);

  const [agreementRead, setAgreementRead] =
    useState(false);

  const [agreementOpen, setAgreementOpen] =
    useState(false);

  const [agreementLoading, setAgreementLoading] =
    useState(false);

  const [agreementError, setAgreementError] =
    useState<string | null>(null);

  const [agreement, setAgreement] =
    useState<UserAgreementResponse | null>(null);

  const agreementScrollRef =
    useRef<HTMLDivElement | null>(null);

  const [showPassword, setShowPassword] =
    useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);
  const [error, setError] =
    useState<string | null>(null);
  const [success, setSuccess] =
    useState(false);

  function handleAccountStep(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setError(null);

    if (!email.trim() || !password || !confirmPassword) {
      setError(
        'لطفاً ایمیل و رمز عبور را کامل وارد کنید.',
      );
      return;
    }

    if (password.length < 8) {
      setError(
        'رمز عبور باید حداقل ۸ کاراکتر باشد.',
      );
      return;
    }

    if (password !== confirmPassword) {
      setError(
        'تکرار رمز عبور با رمز عبور یکسان نیست.',
      );
      return;
    }

    setStep(2);
  }

  async function openUserAgreement() {
    setAgreementError(null);
    setAgreementOpen(true);

    if (agreement) {
      return;
    }

    try {
      setAgreementLoading(true);

      const data =
        await getActiveUserAgreement();

      setAgreement(data);
    } catch (err) {
      setAgreementError(
        err instanceof Error
          ? err.message
          : 'دریافت توافق‌نامه انجام نشد.',
      );
    } finally {
      setAgreementLoading(false);
    }
  }

  useEffect(() => {
    if (!agreementOpen || !agreement || agreementLoading) {
      return;
    }

    const element = agreementScrollRef.current;
    if (!element) {
      return;
    }

    const reachedBottom =
      element.scrollTop + element.clientHeight >=
      element.scrollHeight - 12;

    if (reachedBottom) {
      setAgreementRead(true);
    }
  }, [agreementOpen, agreement, agreementLoading]);

  async function handlePharmacyStep(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setError(null);

    if (
      !pharmacyName.trim() ||
      !licenseNumber.trim() ||
      !technicalManager.trim() ||
      !city.trim() ||
      !province.trim() ||
      !address.trim() ||
      !phone.trim()
    ) {
      setError(
        'لطفاً تمام اطلاعات داروخانه را وارد کنید.',
      );
      return;
    }

    if (!acceptUserAgreement) {
      setError(
        'برای تکمیل ثبت‌نام باید توافق‌نامه کاربری را بپذیرید.',
      );
      return;
    }

    const data: RegisterRequest = {
      email: email.trim(),
      password,
      pharmacyName: pharmacyName.trim(),
      licenseNumber: licenseNumber.trim(),
      technicalManager: technicalManager.trim(),
      city: city.trim(),
      province: province.trim(),
      address: address.trim(),
      phone: phone.trim(),
      acceptUserAgreement,
    };

    try {
      setLoading(true);

      await register(data);

      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'ثبت‌نام انجام نشد. لطفاً اطلاعات واردشده را بررسی کنید.',
      );
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div
        dir="rtl"
        className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-['Vazirmatn',sans-serif]"
      >
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-200/60">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <svg
              viewBox="0 0 24 24"
              className="h-8 w-8"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="m5 12 4 4L19 6" />
            </svg>
          </div>

          <h1 className="mt-6 text-2xl font-black text-slate-900">
            ثبت‌نام با موفقیت انجام شد
          </h1>

          <p className="mt-3 text-sm leading-7 text-slate-500">
            حساب مالک داروخانه ایجاد شد. اکنون می‌توانید
            با ایمیل و رمز عبور خود وارد سامانه شوید.
          </p>

          <button
            type="button"
            onClick={onRegisterSuccess}
            className="mt-7 h-12 w-full rounded-xl bg-medical-600 text-sm font-extrabold text-white shadow-lg shadow-medical-600/20 transition hover:bg-medical-700"
          >
            ورود به سامانه
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 font-['Vazirmatn',sans-serif]"
      dir="rtl"
    >
      {agreementOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4"
          dir="rtl"
        >
          <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-5">
              <div>
                <h2 className="text-lg font-black text-slate-900">
                  {agreement?.title ?? 'توافق‌نامه کاربری'}
                </h2>

                {agreement && (
                  <div className="mt-1 text-xs text-slate-400">
                    نسخه {agreement.version}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => setAgreementOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100"
              >
                بستن
              </button>
            </div>

            <div
              ref={agreementScrollRef}
              id="user-agreement-scroll"
              className="min-h-0 flex-1 overflow-y-auto p-6"
              onScroll={(event) => {
                const element = event.currentTarget;

                const reachedBottom =
                  element.scrollTop +
                    element.clientHeight >=
                  element.scrollHeight - 12;

                if (reachedBottom) {
                  setAgreementRead(true);
                }
              }}
            >
              {agreementLoading ? (
                <div className="py-16 text-center text-sm text-slate-500">
                  در حال دریافت توافق‌نامه...
                </div>
              ) : agreementError ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-7 text-red-700">
                  {agreementError}
                </div>
              ) : agreement ? (
                <div className="whitespace-pre-line text-sm leading-8 text-slate-700">
                  {agreement.content}
                </div>
              ) : null}
            </div>

            <div className="border-t border-slate-200 bg-slate-50 p-4">
              <div className="mb-3 text-xs leading-6 text-slate-500">
                برای فعال شدن پذیرش، لطفاً متن را تا انتها
                پیمایش کنید.
              </div>

              <button
                type="button"
                disabled={!agreementRead}
                onClick={() => setAgreementOpen(false)}
                className="h-12 w-full rounded-xl bg-medical-600 text-sm font-extrabold text-white transition hover:bg-medical-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {agreementRead
                  ? 'مطالعه توافق‌نامه به پایان رسید'
                  : 'لطفاً متن را تا انتها مطالعه کنید'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-6xl">
        <div className="grid lg:grid-cols-2 overflow-hidden bg-white border border-slate-200 rounded-3xl shadow-xl shadow-slate-200/60">
          {/* Brand Panel */}
          <div className="relative hidden lg:flex min-h-[760px] overflow-hidden bg-slate-900 p-10 text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.28),transparent_32%),radial-gradient(circle_at_80%_80%,rgba(20,184,166,0.18),transparent_30%)]" />

            <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full border border-emerald-400/10" />
            <div className="absolute -left-12 -top-12 h-48 w-48 rounded-full border border-emerald-400/10" />

            <div className="relative z-10 flex w-full flex-col">
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

              <div className="my-auto max-w-md">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-bold text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  شروع همکاری با PharmArt
                </div>

                <h1 className="text-4xl font-black leading-[1.35] tracking-tight xl:text-5xl">
                  داروخانه خود را
                  <br />
                  <span className="text-emerald-400">
                    به شبکه متصل کنید
                  </span>
                </h1>

                <p className="mt-6 text-sm leading-8 text-slate-300">
                  حساب مالک داروخانه خود را ایجاد کنید و
                  مدیریت موجودی و تبادل بین‌داروخانه‌ای را
                  در یک پلتفرم یکپارچه آغاز کنید.
                </p>

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
                <span>PharmArt</span>
                <span>پلتفرم تخصصی داروخانه‌ها</span>
              </div>
            </div>
          </div>

          {/* Register Panel */}
          <div className="flex min-h-[760px] items-center justify-center p-6 sm:p-10 lg:p-14">
            <div className="w-full max-w-md">
              <div className="mb-8 flex items-center gap-3 lg:hidden">
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

              <div className="mb-7">
                <div className="mb-3 text-sm font-bold text-emerald-600">
                  ثبت‌نام داروخانه
                </div>

                <h2 className="text-3xl font-black tracking-tight text-slate-900">
                  ایجاد حساب مالک
                </h2>

                <p className="mt-3 text-sm leading-7 text-slate-500">
                  {step === 1
                    ? 'ابتدا اطلاعات حساب مالک داروخانه را وارد کنید.'
                    : 'سپس اطلاعات داروخانه را برای تکمیل ثبت‌نام وارد کنید.'}
                </p>
              </div>

              {/* Steps */}
              <div className="mb-7 flex items-center gap-3">
                <div className="flex flex-1 items-center gap-2">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-black ${
                      step >= 1
                        ? 'bg-medical-600 text-white'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    ۱
                  </div>

                  <div
                    className={`h-1 flex-1 rounded-full ${
                      step === 2
                        ? 'bg-medical-600'
                        : 'bg-slate-100'
                    }`}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-black ${
                      step === 2
                        ? 'bg-medical-600 text-white'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    ۲
                  </div>
                </div>
              </div>

              {error && (
                <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
                  {error}
                </div>
              )}

              {step === 1 ? (
                <form
                  onSubmit={handleAccountStep}
                  className="space-y-5"
                >
                  <div>
                    <label
                      htmlFor="register-email"
                      className="mb-2 block text-xs font-extrabold text-slate-700"
                    >
                      ایمیل
                    </label>

                    <input
                      id="register-email"
                      type="email"
                      dir="ltr"
                      autoComplete="email"
                      value={email}
                      onChange={(event) =>
                        setEmail(event.target.value)
                      }
                      placeholder="name@example.com"
                      className="h-13 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-medical-500 focus:bg-white focus:ring-4 focus:ring-medical-500/10"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="register-password"
                      className="mb-2 block text-xs font-extrabold text-slate-700"
                    >
                      رمز عبور
                    </label>

                    <div className="relative">
                      <input
                        id="register-password"
                        type={
                          showPassword
                            ? 'text'
                            : 'password'
                        }
                        dir="ltr"
                        autoComplete="new-password"
                        value={password}
                        onChange={(event) =>
                          setPassword(event.target.value)
                        }
                        placeholder="حداقل ۸ کاراکتر"
                        className="h-13 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 pl-12 text-sm tracking-wider text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-medical-500 focus:bg-white focus:ring-4 focus:ring-medical-500/10"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(
                            (value) => !value,
                          )
                        }
                        className="absolute inset-y-0 left-0 flex w-12 items-center justify-center text-slate-400 transition hover:text-slate-700"
                        aria-label={
                          showPassword
                            ? 'مخفی کردن رمز عبور'
                            : 'نمایش رمز عبور'
                        }
                      >
                        {showPassword ? '◉' : '○'}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="register-confirm-password"
                      className="mb-2 block text-xs font-extrabold text-slate-700"
                    >
                      تکرار رمز عبور
                    </label>

                    <div className="relative">
                      <input
                        id="register-confirm-password"
                        type={
                          showConfirmPassword
                            ? 'text'
                            : 'password'
                        }
                        dir="ltr"
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(event) =>
                          setConfirmPassword(
                            event.target.value,
                          )
                        }
                        placeholder="رمز عبور را دوباره وارد کنید"
                        className="h-13 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 pl-12 text-sm tracking-wider text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-medical-500 focus:bg-white focus:ring-4 focus:ring-medical-500/10"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(
                            (value) => !value,
                          )
                        }
                        className="absolute inset-y-0 left-0 flex w-12 items-center justify-center text-slate-400 transition hover:text-slate-700"
                        aria-label={
                          showConfirmPassword
                            ? 'مخفی کردن رمز عبور'
                            : 'نمایش رمز عبور'
                        }
                      >
                        {showConfirmPassword ? '◉' : '○'}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="h-13 w-full rounded-xl bg-medical-600 text-sm font-extrabold text-white shadow-lg shadow-medical-600/20 transition hover:bg-medical-700"
                  >
                    ادامه
                  </button>
                </form>
              ) : (
                <form
                  onSubmit={handlePharmacyStep}
                  className="space-y-4"
                >
                  <div>
                    <label
                      htmlFor="pharmacy-name"
                      className="mb-2 block text-xs font-extrabold text-slate-700"
                    >
                      نام داروخانه
                    </label>

                    <input
                      id="pharmacy-name"
                      value={pharmacyName}
                      onChange={(event) =>
                        setPharmacyName(event.target.value)
                      }
                      placeholder="مثلاً داروخانه مرکزی"
                      className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-medical-500 focus:bg-white focus:ring-4 focus:ring-medical-500/10"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="license-number"
                        className="mb-2 block text-xs font-extrabold text-slate-700"
                      >
                        شماره مجوز
                      </label>

                      <input
                        id="license-number"
                        dir="ltr"
                        value={licenseNumber}
                        onChange={(event) =>
                          setLicenseNumber(event.target.value)
                        }
                        placeholder="شماره مجوز"
                        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-medical-500 focus:bg-white focus:ring-4 focus:ring-medical-500/10"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="technical-manager"
                        className="mb-2 block text-xs font-extrabold text-slate-700"
                      >
                        مسئول فنی
                      </label>

                      <input
                        id="technical-manager"
                        value={technicalManager}
                        onChange={(event) =>
                          setTechnicalManager(event.target.value)
                        }
                        placeholder="نام مسئول فنی"
                        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-medical-500 focus:bg-white focus:ring-4 focus:ring-medical-500/10"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="province"
                        className="mb-2 block text-xs font-extrabold text-slate-700"
                      >
                        استان
                      </label>

                      <input
                        id="province"
                        value={province}
                        onChange={(event) =>
                          setProvince(event.target.value)
                        }
                        placeholder="استان"
                        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-medical-500 focus:bg-white focus:ring-4 focus:ring-medical-500/10"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="city"
                        className="mb-2 block text-xs font-extrabold text-slate-700"
                      >
                        شهر
                      </label>

                      <input
                        id="city"
                        value={city}
                        onChange={(event) =>
                          setCity(event.target.value)
                        }
                        placeholder="شهر"
                        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-medical-500 focus:bg-white focus:ring-4 focus:ring-medical-500/10"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-2 block text-xs font-extrabold text-slate-700"
                    >
                      تلفن
                    </label>

                    <input
                      id="phone"
                      type="tel"
                      dir="ltr"
                      autoComplete="tel"
                      value={phone}
                      onChange={(event) =>
                        setPhone(event.target.value)
                      }
                      placeholder="02112345678"
                      className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-medical-500 focus:bg-white focus:ring-4 focus:ring-medical-500/10"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="address"
                      className="mb-2 block text-xs font-extrabold text-slate-700"
                    >
                      آدرس
                    </label>

                    <textarea
                      id="address"
                      value={address}
                      onChange={(event) =>
                        setAddress(event.target.value)
                      }
                      placeholder="آدرس کامل داروخانه"
                      rows={3}
                      className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-medical-500 focus:bg-white focus:ring-4 focus:ring-medical-500/10"
                    />
                  </div>

                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={() => void openUserAgreement()}
                      className={`flex w-full items-center justify-between rounded-xl border p-4 text-right transition ${
                        agreementRead
                          ? 'border-emerald-200 bg-emerald-50'
                          : 'border-amber-200 bg-amber-50 hover:border-medical-300'
                      }`}
                    >
                      <div>
                        <div className="text-sm font-extrabold text-slate-800">
                          {agreementRead
                            ? 'توافق‌نامه مطالعه شد'
                            : 'مطالعه توافق‌نامه کاربری'}
                        </div>

                        <div className="mt-1 text-xs leading-6 text-slate-500">
                          برای فعال شدن پذیرش، متن توافق‌نامه را تا انتها مطالعه کنید.
                        </div>
                      </div>

                      <span
                        className={`rounded-lg px-3 py-2 text-xs font-extrabold ${
                          agreementRead
                            ? 'bg-medical-600 text-white'
                            : 'bg-white text-amber-700'
                        }`}
                      >
                        {agreementRead ? '✓ مطالعه شد' : 'باز کردن'}
                      </span>
                    </button>

                    <label
                      htmlFor="accept-user-agreement"
                      className={`flex items-start gap-3 rounded-xl border p-4 transition ${
                        agreementRead
                          ? 'cursor-pointer border-slate-200 bg-slate-50 hover:border-medical-200'
                          : 'cursor-not-allowed border-slate-100 bg-slate-50 opacity-60'
                      }`}
                    >
                      <input
                        id="accept-user-agreement"
                        type="checkbox"
                        checked={acceptUserAgreement}
                        disabled={!agreementRead}
                        onChange={(event) =>
                          setAcceptUserAgreement(event.target.checked)
                        }
                        className="mt-1 h-4 w-4 shrink-0 accent-emerald-600"
                      />

                      <span className="text-xs leading-6 text-slate-600">
                        توافق‌نامه کاربری را مطالعه کرده‌ام و
                        <span className="font-extrabold text-slate-800">
                          {' '}می‌پذیرم.
                        </span>
                      </span>
                    </label>
                  </div>

                  <div className="flex gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setError(null);
                        setStep(1);
                      }}
                      disabled={loading}
                      className="h-12 flex-1 rounded-xl border border-slate-200 bg-white text-sm font-extrabold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      بازگشت
                    </button>

                    <button
                      type="submit"
                      disabled={
                        loading ||
                        !agreementRead ||
                        !acceptUserAgreement
                      }
                      className="h-12 flex-[2] rounded-xl bg-medical-600 text-sm font-extrabold text-white shadow-lg shadow-medical-600/20 transition hover:bg-medical-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loading
                        ? 'در حال ثبت‌نام...'
                        : 'ایجاد حساب'}
                    </button>
                  </div>
                </form>
              )}

              <div className="mt-7 border-t border-slate-100 pt-6 text-center">
                <span className="text-xs text-slate-500">
                  قبلاً حساب دارید؟
                </span>

                <button
                  type="button"
                  onClick={onBackToLogin}
                  className="mr-2 text-xs font-extrabold text-medical-600 transition hover:text-medical-700"
                >
                  ورود به سامانه
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
