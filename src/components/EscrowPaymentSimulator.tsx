import { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  KeyRound,
  Lock,
  QrCode,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import { DemoNotice } from './DemoNotice';
import { formatMoney } from '../lib/format';

interface EscrowPaymentSimulatorProps {
  onBack: () => void;
}

/**
 * Demonstration-only walkthrough of the escrow lifecycle.
 *
 * It deliberately contains no real payment, OTP or settlement integration.
 * A production escrow flow must run through a licensed PSP/bank partner and
 * its state must come from the backend, never from client-side steps.
 */
const DEMO_INVOICE_TOTAL = 49_725_000; // Rial
const PLATFORM_FEE_RATE = 0.025;
const LOGISTICS_FEE = 250_000; // Rial

type Step = 1 | 2 | 3 | 4;

const STEPS: Array<{
  step: Step;
  title: string;
  description: string;
  icon: typeof CreditCard;
}> = [
  {
    step: 1,
    title: 'واریز به حساب امانی',
    description: 'تأیید پیش‌فاکتور و مسدودی وجه در حساب واسط',
    icon: CreditCard,
  },
  {
    step: 2,
    title: 'ارسال با پلمپ و رهگیری',
    description: 'تحویل به ناوگان حمل تخصصی همراه با بارنامه',
    icon: Truck,
  },
  {
    step: 3,
    title: 'بازرسی و تأیید اصالت',
    description: 'بررسی فیزیکی بچ و ثبت تأیید مسئول فنی',
    icon: QrCode,
  },
  {
    step: 4,
    title: 'تسهیم و تسویه',
    description: 'آزادسازی وجه برای فروشنده و کسر کارمزد پلتفرم',
    icon: CheckCircle2,
  },
];

export function EscrowPaymentSimulator({ onBack }: EscrowPaymentSimulatorProps) {
  const platformFee = Math.round(DEMO_INVOICE_TOTAL * PLATFORM_FEE_RATE);
  const sellerPayout = DEMO_INVOICE_TOTAL - platformFee;

  const [currentStep, setCurrentStep] = useState<Step>(2);
  const [otpInput, setOtpInput] = useState('');

  const handleAdvanceStep = () => {
    setCurrentStep((previous) => (previous < 4 ? ((previous + 1) as Step) : previous));
  };

  const handleVerifyOtp = () => {
    if (otpInput.trim().length < 6) return;
    setCurrentStep(4);
  };

  return (
    <div dir="rtl" className="space-y-6 pb-12" id="escrow-payment-view">
      <DemoNotice>
        این صفحه فقط چرخه پیشنهادی پرداخت امانی را نمایش می‌دهد. هیچ پرداخت، کد پیامکی یا
        تسویه واقعی انجام نمی‌شود و ارقام نمونه هستند.
      </DemoNotice>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-white shadow-lg">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/20 px-2.5 py-1 text-xs font-semibold text-emerald-300">
              <Lock className="h-3 w-3" aria-hidden="true" />
              <span>پیش‌نمایش چرخه پرداخت امانی</span>
            </div>

            <h1 className="text-xl font-black">تبادل امن کالا بین داروخانه‌ها</h1>

            <p className="max-w-2xl text-xs leading-6 text-slate-300">
              در نسخه نهایی، وجه تا تأیید دریافت و اصالت محموله نزد نهاد مجاز نگهداری و سپس
              تسویه می‌شود. پیاده‌سازی واقعی نیازمند قرارداد با درگاه پرداخت و نهاد امانی دارای
              مجوز است.
            </p>

            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-xs font-bold text-slate-200 transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
              بازگشت به تبادل B2B
            </button>
          </div>

          <div className="min-w-[220px] rounded-xl border border-slate-700 bg-slate-800 p-4 text-left">
            <span className="block text-[11px] text-slate-400">مبلغ نمونه فاکتور:</span>

            <div className="mt-1 font-mono text-lg font-black text-emerald-400">
              {formatMoney(DEMO_INVOICE_TOTAL)}
            </div>

            <span className="mt-1 block text-[10px] text-slate-400">
              رقم ساختگی برای نمایش رابط کاربری
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2 border-b border-slate-100 pb-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
            <ShieldCheck className="h-4 w-4 text-emerald-600" aria-hidden="true" />
            چرخه پیشنهادی تراکنش امانی
          </h2>

          <span className="text-xs font-semibold text-slate-500" aria-live="polite">
            مرحله {currentStep} از ۴
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
          {STEPS.map((item) => {
            const Icon = item.icon;
            const isDone = currentStep > item.step;
            const isCurrent = currentStep === item.step;

            return (
              <button
                key={item.step}
                type="button"
                onClick={() => setCurrentStep(item.step)}
                aria-current={isCurrent ? 'step' : undefined}
                className={`rounded-xl border p-4 text-right text-xs transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medical-500 ${
                  isCurrent
                    ? 'border-emerald-500 bg-emerald-50/50 shadow-sm ring-2 ring-emerald-500/20'
                    : isDone
                      ? 'border-slate-200 bg-slate-50'
                      : 'border-slate-100 bg-white opacity-70'
                }`}
              >
                <div className="mb-2 flex items-center justify-between">
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                      isDone
                        ? 'bg-medical-600 text-white'
                        : isCurrent
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {isDone ? '✓' : item.step}
                  </span>

                  <Icon
                    className={`h-4 w-4 ${isCurrent ? 'text-emerald-600' : 'text-slate-400'}`}
                    aria-hidden="true"
                  />
                </div>

                <div className="mb-1 font-bold text-slate-900">{item.title}</div>

                <p className="text-[11px] leading-normal text-slate-500">{item.description}</p>
              </button>
            );
          })}
        </div>

        <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-5">
          {currentStep === 1 && (
            <div className="space-y-3">
              <p className="text-xs font-bold text-slate-800">
                وضعیت: انتظار برای تأیید پیش‌فاکتور توسط خریدار
              </p>

              <p className="text-xs leading-6 text-slate-600">
                در پیاده‌سازی واقعی، خریدار به درگاه پرداخت منتقل می‌شود و تأیید تراکنش از سمت
                سرور و درگاه دریافت می‌شود.
              </p>

              <button
                type="button"
                onClick={handleAdvanceStep}
                className="rounded-lg bg-medical-600 px-4 py-2 text-xs font-bold text-white shadow transition hover:bg-medical-700"
              >
                نمایش مرحله بعد (شبیه‌سازی)
              </button>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-3">
              <p className="text-xs font-bold text-slate-800">
                وضعیت: کالا در مسیر تحویل فیزیکی است
              </p>

              <p className="text-xs leading-6 text-slate-600">
                کد رهگیری و وضعیت حمل باید از سرویس لجستیک خوانده شود؛ این صفحه هیچ داده‌ای ثبت
                نمی‌کند.
              </p>

              <button
                type="button"
                onClick={handleAdvanceStep}
                className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow transition hover:bg-slate-800"
              >
                اعلام رسیدن بار (شبیه‌سازی)
              </button>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-3">
              <p className="text-xs font-bold text-slate-800">
                مرحله بازرسی سلامت فیزیکی و تأیید مسئول فنی
              </p>

              <p className="text-xs leading-6 text-slate-600">
                در نسخه واقعی، کد تأیید یک‌بارمصرف از سمت سرور ارسال و اعتبارسنجی می‌شود. در این
                شبیه‌ساز هر ۶ رقم پذیرفته می‌شود.
              </p>

              <div className="flex max-w-sm flex-col gap-2 pt-1 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                  <KeyRound
                    className="absolute right-3 top-2.5 h-4 w-4 text-slate-400"
                    aria-hidden="true"
                  />

                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    value={otpInput}
                    onChange={(event) => setOtpInput(event.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="کد ۶ رقمی نمونه"
                    aria-label="کد تأیید نمونه"
                    className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-3 pr-9 text-center font-mono text-sm font-bold tracking-widest text-slate-900 focus:ring-2 focus:ring-medical-500"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={otpInput.length < 6}
                  className="whitespace-nowrap rounded-lg bg-medical-600 px-4 py-2 text-xs font-bold text-white shadow transition hover:bg-medical-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  تأیید نمونه
                </button>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-extrabold text-emerald-800">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" aria-hidden="true" />
                <span>نمایش تسویه و تسهیم (بدون تراکنش واقعی)</span>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-lg border border-slate-200 bg-white p-3">
                  <span className="block text-[11px] text-slate-400">سهم فروشنده:</span>
                  <span className="mt-0.5 block font-mono text-sm font-black text-slate-900">
                    {formatMoney(sellerPayout)}
                  </span>
                </div>

                <div className="rounded-lg border border-slate-200 bg-white p-3">
                  <span className="block text-[11px] text-slate-400">کارمزد پلتفرم (۲.۵٪):</span>
                  <span className="mt-0.5 block font-mono text-sm font-black text-emerald-700">
                    {formatMoney(platformFee)}
                  </span>
                </div>

                <div className="rounded-lg border border-slate-200 bg-white p-3">
                  <span className="block text-[11px] text-slate-400">هزینه لجستیک نمونه:</span>
                  <span className="mt-0.5 block font-mono text-sm font-black text-blue-700">
                    {formatMoney(LOGISTICS_FEE)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="text-xs font-semibold text-slate-600 underline hover:text-slate-900"
              >
                اجرای مجدد شبیه‌ساز
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
