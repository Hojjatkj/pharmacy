import React, { useState } from 'react';
import {
  createPromotionCampaign,
  type CampaignDiscountType,
  type CreateCampaignResponse,
} from '../api/promotions';

const inputClass =
  'mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100';

const toman = (value: number) =>
  `${value.toLocaleString('fa-IR')} تومان`;

export function PromotionCampaignManager() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [discountType, setDiscountType] =
    useState<CampaignDiscountType>('PERCENTAGE');
  const [discountValue, setDiscountValue] = useState('10');
  const [maxDiscountAmount, setMaxDiscountAmount] = useState('');
  const [minSubtotal, setMinSubtotal] = useState('0');
  const [startsAt, setStartsAt] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [freeShipping, setFreeShipping] = useState(false);
  const [sendEmail, setSendEmail] = useState(true);
  const [showOnsite, setShowOnsite] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<CreateCampaignResponse | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setResult(null);

    const value = Number(discountValue);
    const minimum = Number(minSubtotal || 0);
    const cap = maxDiscountAmount.trim()
      ? Number(maxDiscountAmount)
      : undefined;

    if (!Number.isInteger(value) || value < 1) {
      setError('مقدار تخفیف باید عدد صحیح مثبت باشد.');
      return;
    }
    if (discountType === 'PERCENTAGE' && value > 100) {
      setError('درصد تخفیف نمی‌تواند بیشتر از ۱۰۰ باشد.');
      return;
    }
    if (!Number.isInteger(minimum) || minimum < 0) {
      setError('حداقل خرید معتبر نیست.');
      return;
    }
    if (cap !== undefined && (!Number.isInteger(cap) || cap < 1)) {
      setError('سقف تخفیف باید عدد صحیح مثبت باشد.');
      return;
    }
    if (!expiresAt) {
      setError('تاریخ پایان کمپین را مشخص کن.');
      return;
    }

    const startDate = startsAt ? new Date(startsAt) : new Date();
    const endDate = new Date(expiresAt);
    if (
      !Number.isFinite(startDate.getTime()) ||
      !Number.isFinite(endDate.getTime()) ||
      endDate <= startDate
    ) {
      setError('تاریخ پایان باید بعد از تاریخ شروع باشد.');
      return;
    }

    setLoading(true);
    try {
      const created = await createPromotionCampaign({
        name: name.trim(),
        message: message.trim(),
        discountType,
        discountValue: value,
        ...(cap === undefined ? {} : { maxDiscountAmount: cap }),
        minSubtotal: minimum,
        ...(startsAt ? { startsAt: startDate.toISOString() } : {}),
        expiresAt: endDate.toISOString(),
        isActive,
        freeShipping,
        sendEmail,
        showOnsite,
      });
      setResult(created);
      setName('');
      setMessage('');
    } catch (e) {
      setError(
        e instanceof Error ? e.message : 'ساخت کمپین ناموفق بود.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section dir="rtl" className="space-y-6">
      <header>
        <h1 className="text-2xl font-black text-slate-900">
          مدیریت کمپین‌های تخفیف
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          ایجاد کد اختصاصی برای مشتریان فعال و اطلاع‌رسانی از طریق ایمیل یا اعلان داخل سایت.
        </p>
      </header>

      {error && (
        <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      )}

      {result && (
        <div role="status" className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <h2 className="font-black text-emerald-900">پاسخ ثبت کمپین</h2>
          <p className="mt-2 text-sm text-emerald-800">
            کمپین «{result.campaign.name}» با موفقیت ثبت شد.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl bg-white p-3">
              <p className="text-xs text-slate-500">مشتریان هدف</p>
              <p className="mt-1 text-xl font-black">{result.targetedCustomers.toLocaleString('fa-IR')}</p>
            </div>
            <div className="rounded-xl bg-white p-3">
              <p className="text-xs text-slate-500">اعلان‌های داخل سایت</p>
              <p className="mt-1 text-xl font-black">{result.onsiteNotifications.toLocaleString('fa-IR')}</p>
            </div>
            <div className="rounded-xl bg-white p-3">
              <p className="text-xs text-slate-500">ایمیل‌های ارسال‌شده</p>
              <p className="mt-1 text-xl font-black">{result.emailSent.toLocaleString('fa-IR')}</p>
            </div>
            <div className="rounded-xl bg-white p-3">
              <p className="text-xs text-slate-500">ایمیل‌های ناموفق</p>
              <p className="mt-1 text-xl font-black">{result.emailFailed.toLocaleString('fa-IR')}</p>
            </div>
            <div className="rounded-xl bg-white p-3">
              <p className="text-xs text-slate-500">ایمیل‌های صرف‌نظرشده</p>
              <p className="mt-1 text-xl font-black">{result.emailSkipped.toLocaleString('fa-IR')}</p>
            </div>
            <div className="rounded-xl bg-white p-3">
              <p className="text-xs text-slate-500">وضعیت کمپین</p>
              <p className="mt-1 font-bold">{result.campaign.isActive ? 'فعال' : 'غیرفعال'}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="grid gap-5 md:grid-cols-2">
          <label className="text-sm font-bold text-slate-700">
            نام کمپین
            <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} maxLength={120} required />
          </label>

          <label className="text-sm font-bold text-slate-700">
            نوع تخفیف
            <select className={inputClass} value={discountType} onChange={(e) => setDiscountType(e.target.value as CampaignDiscountType)}>
              <option value="PERCENTAGE">درصدی</option>
              <option value="FIXED">مبلغ ثابت (تومان)</option>
            </select>
          </label>

          <label className="text-sm font-bold text-slate-700">
            {discountType === 'PERCENTAGE' ? 'درصد تخفیف' : 'مبلغ تخفیف (تومان)'}
            <input className={inputClass} type="number" min={1} max={discountType === 'PERCENTAGE' ? 100 : undefined} step={1} value={discountValue} onChange={(e) => setDiscountValue(e.target.value)} required />
          </label>

          <label className="text-sm font-bold text-slate-700">
            سقف تخفیف (تومان، اختیاری)
            <input className={inputClass} type="number" min={1} step={1} value={maxDiscountAmount} onChange={(e) => setMaxDiscountAmount(e.target.value)} placeholder="بدون سقف اختصاصی" />
          </label>

          <label className="text-sm font-bold text-slate-700">
            حداقل مبلغ خرید (تومان)
            <input className={inputClass} type="number" min={0} step={1} value={minSubtotal} onChange={(e) => setMinSubtotal(e.target.value)} required />
          </label>

          <label className="text-sm font-bold text-slate-700">
            شروع اعتبار (اختیاری)
            <input className={inputClass} type="datetime-local" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} />
          </label>

          <label className="text-sm font-bold text-slate-700">
            پایان اعتبار
            <input className={inputClass} type="datetime-local" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} required />
          </label>

          <label className="text-sm font-bold text-slate-700 md:col-span-2">
            متن پیام کمپین
            <textarea className={inputClass} value={message} onChange={(e) => setMessage(e.target.value)} maxLength={2000} rows={4} required />
          </label>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {([
            [isActive, setIsActive, 'کمپین فعال باشد'],
            [freeShipping, setFreeShipping, 'ارسال رایگان برای این کمپین'],
            [sendEmail, setSendEmail, 'ارسال کد اختصاصی با ایمیل'],
            [showOnsite, setShowOnsite, 'ایجاد اعلان داخل سایت'],
          ] as const).map(([checked, setter, label]) => (
            <label key={label} className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-3 text-sm font-medium text-slate-700">
              <input type="checkbox" checked={checked} onChange={(e) => setter(e.target.checked)} className="h-4 w-4 accent-emerald-600" />
              {label}
            </label>
          ))}
        </div>

        <p className="mt-5 text-xs leading-6 text-slate-500">
          تخفیف و ارسال رایگان در سمت سرور اعتبارسنجی می‌شوند. مبلغ تخفیف ثابت و سقف تخفیف بر حسب تومان وارد می‌شوند.
        </p>

        <button type="submit" disabled={loading} className="mt-5 w-full rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">
          {loading ? 'در حال ثبت کمپین…' : 'ایجاد کمپین و صدور کدهای اختصاصی'}
        </button>
      </form>
    </section>
  );
}

export default PromotionCampaignManager;
