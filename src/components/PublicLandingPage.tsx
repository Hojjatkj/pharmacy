import BrandMark from './BrandMark';
import React from 'react';

type PublicLandingPageProps = {
  onLogin: () => void;
  onRegister: () => void;
  onBrowseCatalog: () => void;
};

const categories = [
  {
    icon: '✳',
    title: 'مکمل‌ها و ویتامین‌ها',
    description: 'محصولات تغذیه و تندرستی',
    color: 'bg-emerald-100 text-emerald-800',
  },
  {
    icon: '♡',
    title: 'مراقبت شخصی',
    description: 'محصولات بهداشت و مراقبت',
    color: 'bg-rose-100 text-rose-800',
  },
  {
    icon: '✚',
    title: 'سلامت روزمره',
    description: 'محصولات مرتبط با سلامت',
    color: 'bg-sky-100 text-sky-800',
  },
  {
    icon: '↗',
    title: 'تغذیه ورزشی',
    description: 'محصولات مرتبط با فعالیت بدنی',
    color: 'bg-amber-100 text-amber-800',
  },
];

const faqs = [
  {
    question: 'چطور محصولات را پیدا کنم؟',
    answer:
      'کاتالوگ محصولات را باز کنید و از جست‌وجو و فیلترهای موجود برای پیدا کردن گزینه‌های موردنظر خود استفاده کنید.',
  },
  {
    question: 'آیا بدون ورود می‌توانم کاتالوگ را ببینم؟',
    answer:
      'بله؛ می‌توانید کاتالوگ عمومی را مشاهده کنید. برای ادامهٔ خرید یا استفاده از امکانات حساب کاربری، ممکن است لازم باشد وارد شوید یا ثبت‌نام کنید.',
  },
  {
    question: 'اطلاعات موجودی و قیمت را کجا ببینم؟',
    answer:
      'در کاتالوگ، جزئیات و اطلاعاتی را که برای هر محصول ارائه شده است بررسی کنید. موجودی و قیمت ممکن است با توجه به محصول و داروخانه متفاوت باشد.',
  },
  {
    question: 'چطور داروخانه می‌تواند همکاری را شروع کند؟',
    answer:
      'از گزینهٔ ثبت‌نام یا همکاری با داروخانه استفاده کنید تا وارد مسیر ثبت‌نام سامانه شوید.',
  },
];

export const PublicLandingPage: React.FC<PublicLandingPageProps> = ({
  onLogin,
  onRegister,
  onBrowseCatalog,
}) => (
  <main dir="rtl" className="min-h-screen overflow-hidden bg-white text-slate-800">
    {/* Announcement */}
    <div className="bg-emerald-950 px-4 py-2.5 text-center text-xs font-bold text-white sm:text-sm">
      PharmArt؛ مسیری ساده‌تر برای پیدا کردن محصولات سلامت
    </div>

    {/* Header */}
    <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3.5 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onBrowseCatalog}
          aria-label="مشاهده محصولات PharmArt"
          className="flex shrink-0 items-center gap-3 text-right"
        >
          <BrandMark size={44} className="shrink-0 rounded-2xl shadow-lg shadow-emerald-900/15" />
          <span>
            <span className="block text-xl font-black tracking-tight text-emerald-950">
              PharmArt
            </span>
            <span className="block text-[10px] font-semibold text-slate-500">
              همراه سلامت روزمره شما
            </span>
          </span>
        </button>

        <nav aria-label="ناوبری اصلی" className="hidden items-center gap-6 lg:flex">
          <a href="#categories" className="text-sm font-bold text-slate-600 transition hover:text-emerald-700">
            دسته‌بندی‌ها
          </a>
          <a href="#benefits" className="text-sm font-bold text-slate-600 transition hover:text-emerald-700">
            مزایای سامانه
          </a>
          <a href="#how-it-works" className="text-sm font-bold text-slate-600 transition hover:text-emerald-700">
            راهنمای شروع
          </a>
          <a href="#faq" className="text-sm font-bold text-slate-600 transition hover:text-emerald-700">
            پرسش‌های متداول
          </a>
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={onLogin}
            className="rounded-xl px-3 py-2.5 text-sm font-extrabold text-emerald-800 transition hover:bg-emerald-50 sm:px-4"
          >
            ورود
          </button>
          <button
            type="button"
            onClick={onBrowseCatalog}
            className="rounded-xl bg-emerald-700 px-3 py-2.5 text-xs font-black text-white transition hover:bg-emerald-800 sm:px-5 sm:text-sm"
          >
            مشاهده محصولات
          </button>
        </div>
      </div>
    </header>

    {/* Hero */}
    <section className="relative isolate overflow-hidden bg-gradient-to-bl from-emerald-50 via-white to-teal-50">
      <div aria-hidden="true" className="pointer-events-none absolute -left-28 top-12 h-80 w-80 rounded-full bg-teal-200/40 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/90 px-4 py-2 text-xs font-extrabold text-emerald-800 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            کشف آسان‌تر محصولات سلامت
          </span>

          <h1 className="mt-6 max-w-2xl text-4xl font-black leading-[1.55] tracking-tight text-emerald-950 sm:text-5xl lg:text-6xl">
            زمان کمتر برای جست‌وجو،
            <span className="block text-emerald-700">انتخاب آگاهانه‌تر</span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-8 text-slate-600 sm:text-lg sm:leading-9">
            محصولات سلامت و تندرستی را در کاتالوگ PharmArt جست‌وجو کنید،
            اطلاعات ارائه‌شده را بررسی کنید و گزینه‌های مناسب خود را آسان‌تر پیدا کنید.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onBrowseCatalog}
              className="inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-emerald-700 px-7 py-4 text-sm font-black text-white shadow-xl shadow-emerald-900/20 transition hover:-translate-y-0.5 hover:bg-emerald-800"
            >
              جست‌وجوی محصولات
              <span aria-hidden="true">←</span>
            </button>
            <button
              type="button"
              onClick={onRegister}
              className="inline-flex min-h-14 items-center justify-center rounded-2xl border border-emerald-200 bg-white px-7 py-4 text-sm font-extrabold text-emerald-900 transition hover:bg-emerald-50"
            >
              همکاری با داروخانه
            </button>
          </div>

          <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-xs font-bold text-slate-600 sm:text-sm">
            <span className="inline-flex items-center gap-2">
              <span className="text-emerald-700">✓</span>
              کاتالوگ آنلاین محصولات
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="text-emerald-700">✓</span>
              جست‌وجو و فیلتر محصولات
            </span>
          </div>
        </div>

        {/* Original inline SVG illustration: no external image dependency */}
        <div className="relative mx-auto w-full max-w-lg">
          <div aria-hidden="true" className="absolute inset-4 rounded-full bg-emerald-200/60 blur-3xl" />
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white bg-white/80 p-5 shadow-2xl shadow-emerald-950/10 backdrop-blur sm:p-8">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-emerald-700">PharmArt</p>
                <h2 className="mt-1 text-xl font-black text-slate-900 sm:text-2xl">
                  سلامت، با انتخابی روشن‌تر
                </h2>
                <p className="mt-2 text-sm leading-7 text-slate-500">
                  از جست‌وجو تا بررسی محصولات
                </p>
              </div>
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-2xl text-emerald-800">
                ♡
              </span>
            </div>

            <div className="mt-5 overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-100 via-teal-50 to-sky-100 p-3 sm:p-5">
              <svg
                viewBox="0 0 420 300"
                role="img"
                aria-label="تصویرسازی گرافیکی از محصولات سلامت، برگ و کپسول"
                className="h-auto w-full"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
              >
                <circle cx="210" cy="150" r="112" fill="#D1FAE5" />
                <circle cx="210" cy="150" r="83" fill="#ECFDF5" />
                <path d="M68 226C100 204 119 181 126 148" stroke="#059669" strokeWidth="4" strokeLinecap="round" />
                <path d="M91 208C62 204 48 187 47 166C72 167 91 180 91 208Z" fill="#34D399" />
                <path d="M110 184C107 157 120 139 143 130C147 154 135 175 110 184Z" fill="#10B981" />
                <path d="M329 231C310 203 303 181 305 153" stroke="#059669" strokeWidth="4" strokeLinecap="round" />
                <path d="M309 192C333 182 351 190 362 210C339 218 319 210 309 192Z" fill="#6EE7B7" />
                <path d="M306 169C283 153 281 132 292 112C312 128 316 150 306 169Z" fill="#34D399" />
                <g transform="translate(144 60)">
                  <rect x="30" y="0" width="72" height="28" rx="8" fill="#047857" />
                  <rect x="20" y="22" width="92" height="145" rx="20" fill="#FFFFFF" stroke="#A7F3D0" strokeWidth="3" />
                  <rect x="29" y="64" width="74" height="61" rx="10" fill="#D1FAE5" />
                  <path d="M66 75V112M48 93H84" stroke="#059669" strokeWidth="7" strokeLinecap="round" />
                  <path d="M46 143H86" stroke="#6EE7B7" strokeWidth="4" strokeLinecap="round" />
                </g>
                <g transform="translate(245 177) rotate(-30)">
                  <rect width="80" height="35" rx="17.5" fill="#FFFFFF" stroke="#0D9488" strokeWidth="3" />
                  <path d="M40 2V33" stroke="#0D9488" strokeWidth="3" />
                  <path d="M4 17.5C4 9 10 3 19 3H40V32H19C10 32 4 26 4 17.5Z" fill="#5EEAD4" />
                </g>
                <g transform="translate(87 87)">
                  <rect width="43" height="43" rx="13" fill="#FFFFFF" />
                  <path d="M21.5 10V33M10 21.5H33" stroke="#059669" strokeWidth="4" strokeLinecap="round" />
                </g>
                <circle cx="331" cy="77" r="7" fill="#10B981" />
                <circle cx="101" cy="251" r="5" fill="#0D9488" />
                <circle cx="344" cy="250" r="4" fill="#34D399" />
              </svg>
            </div>

            <button
              type="button"
              onClick={onBrowseCatalog}
              className="mt-5 flex w-full items-center gap-4 rounded-2xl border border-emerald-100 bg-emerald-50/80 p-4 text-right transition hover:border-emerald-300 hover:bg-emerald-50"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-2xl text-emerald-700 shadow-sm">
                ⌕
              </span>
              <span className="flex-1">
                <span className="block font-black text-slate-900">کاتالوگ محصولات</span>
                <span className="mt-1 block text-xs leading-6 text-slate-500">
                  جست‌وجو، فیلتر و بررسی اطلاعات محصولات
                </span>
              </span>
              <span aria-hidden="true" className="text-lg text-emerald-700">←</span>
            </button>
          </div>
          <div className="absolute -bottom-4 -left-1 hidden rounded-2xl border border-white bg-white px-5 py-3 shadow-lg sm:block">
            <p className="text-xs font-extrabold text-emerald-800">یک مسیر ساده‌تر برای کشف محصولات</p>
          </div>
        </div>
      </div>
    </section>

    {/* Benefits */}
    <section id="benefits" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
        <div>
          <p className="text-sm font-black text-emerald-700">تجربهٔ کاربری ساده</p>
          <h2 className="mt-3 text-2xl font-black leading-relaxed text-slate-950 sm:text-3xl">
            محصولات را راحت‌تر پیدا کنید و اطلاعاتشان را بررسی کنید
          </h2>
        </div>
        <p className="max-w-2xl text-sm leading-8 text-slate-600">
          PharmArt فضایی برای مرور کاتالوگ محصولات سلامت فراهم می‌کند؛
          با ابزارهای جست‌وجو و فیلتر و مسیرهای مشخص برای مشتریان و داروخانه‌ها.
        </p>
      </div>

      <div className="mt-9 grid gap-5 md:grid-cols-3">
        <article className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:p-8">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-2xl text-emerald-800">⌕</span>
          <h3 className="mt-5 text-base font-black text-slate-900">جست‌وجوی هدفمند</h3>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            از جست‌وجو و فیلترهای کاتالوگ برای محدود کردن گزینه‌ها و یافتن محصولات موردنظر استفاده کنید.
          </p>
        </article>
        <article className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:p-8">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-2xl text-sky-800">▦</span>
          <h3 className="mt-5 text-base font-black text-slate-900">اطلاعات در یک کاتالوگ</h3>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            اطلاعات ارائه‌شده برای محصول، قیمت و داروخانهٔ عرضه‌کننده را در کاتالوگ بررسی کنید.
          </p>
        </article>
        <article className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:p-8">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-2xl text-amber-800">♡</span>
          <h3 className="mt-5 text-base font-black text-slate-900">مسیر روشن برای هر کاربر</h3>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            مشتریان کاتالوگ را مرور می‌کنند و داروخانه‌ها از مسیر ثبت‌نام و همکاری وارد سامانه می‌شوند.
          </p>
        </article>
      </div>
    </section>

    {/* Categories */}
    <section id="categories" className="bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-black text-emerald-700">کشف محصولات</p>
            <h2 className="mt-2 text-2xl font-black text-slate-950 sm:text-3xl">
              از کدام دسته شروع می‌کنید؟
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
              دستهٔ موردنظر را انتخاب کنید و برای مشاهدهٔ محصولات به کاتالوگ بروید.
            </p>
          </div>
          <button
            type="button"
            onClick={onBrowseCatalog}
            className="self-start text-sm font-black text-emerald-700 hover:text-emerald-900 sm:self-auto"
          >
            مشاهدهٔ کاتالوگ ←
          </button>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <button
              type="button"
              key={category.title}
              onClick={onBrowseCatalog}
              className="group rounded-3xl border border-slate-200 bg-white p-6 text-right transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-950/5"
            >
              <span className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl font-black ${category.color}`}>
                {category.icon}
              </span>
              <h3 className="mt-5 text-base font-black text-slate-900">{category.title}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-500">{category.description}</p>
              <span className="mt-4 inline-block text-sm font-black text-emerald-700">
                بررسی کاتالوگ ←
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>

    {/* How it works */}
    <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-sm font-black text-emerald-700">شروع در چند قدم ساده</p>
          <h2 className="mt-3 text-2xl font-black leading-relaxed text-slate-950 sm:text-3xl">
            از جست‌وجو تا ادامهٔ مسیر، همه‌چیز روشن‌تر
          </h2>
          <p className="mt-4 text-sm leading-8 text-slate-600">
            برای شروع لازم نیست مسیر پیچیده‌ای را طی کنید. کاتالوگ را باز کنید،
            گزینه‌های موجود را بررسی کنید و در صورت نیاز وارد حساب کاربری شوید.
          </p>
          <button
            type="button"
            onClick={onBrowseCatalog}
            className="mt-6 rounded-2xl bg-emerald-700 px-6 py-4 text-sm font-black text-white transition hover:bg-emerald-800"
          >
            شروع مشاهدهٔ محصولات ←
          </button>
        </div>

        <div className="space-y-4">
          {[
            {
              number: '۰۱',
              title: 'کاتالوگ را باز کنید',
              description: 'به فهرست محصولات سلامت و تندرستی دسترسی پیدا کنید.',
            },
            {
              number: '۰۲',
              title: 'جست‌وجو و بررسی کنید',
              description: 'از ابزارهای جست‌وجو و فیلتر استفاده کنید و اطلاعات موجود را بخوانید.',
            },
            {
              number: '۰۳',
              title: 'برای ادامه وارد شوید',
              description: 'اگر قصد ادامهٔ خرید یا استفاده از امکانات حساب را دارید، وارد شوید یا ثبت‌نام کنید.',
            },
          ].map((step) => (
            <article key={step.number} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-sm font-black text-emerald-800">
                {step.number}
              </span>
              <div>
                <h3 className="font-black text-slate-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{step.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>

    {/* FAQ */}
    <section id="faq" className="bg-slate-50">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="text-center">
          <p className="text-sm font-black text-emerald-700">پاسخ به پرسش‌های شما</p>
          <h2 className="mt-3 text-2xl font-black text-slate-950 sm:text-3xl">
            پرسش‌های متداول
          </h2>
        </div>

        <div className="mt-8 space-y-3">
          {faqs.map((faq) => (
            <details key={faq.question} className="group rounded-2xl border border-slate-200 bg-white p-5 open:border-emerald-200 sm:p-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-black text-slate-900">
                <span>{faq.question}</span>
                <span aria-hidden="true" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-4 text-sm leading-8 text-slate-600">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>

    {/* Final CTA */}
    <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-emerald-950 px-6 py-10 text-white sm:px-10 lg:px-14 lg:py-14">
        <div aria-hidden="true" className="pointer-events-none absolute -left-16 -top-24 h-64 w-64 rounded-full bg-emerald-700/40 blur-3xl" />
        <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-bold text-emerald-300">قدم بعدی با شماست</p>
            <h2 className="mt-3 text-2xl font-black leading-relaxed sm:text-3xl">
              آماده‌اید محصولات را بررسی کنید؟
            </h2>
            <p className="mt-4 text-sm leading-8 text-emerald-100/80">
              کاتالوگ PharmArt را باز کنید و جست‌وجوی خود را شروع کنید.
              داروخانه‌ها نیز می‌توانند از مسیر همکاری وارد سامانه شوند.
            </p>
          </div>
          <div className="relative flex shrink-0 flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onBrowseCatalog}
              className="rounded-2xl bg-white px-7 py-4 text-sm font-black text-emerald-950 transition hover:bg-emerald-50"
            >
              مشاهدهٔ محصولات
            </button>
            <button
              type="button"
              onClick={onRegister}
              className="rounded-2xl border border-emerald-700 px-7 py-4 text-sm font-extrabold text-white transition hover:bg-emerald-900"
            >
              ثبت‌نام داروخانه
            </button>
          </div>
        </div>
      </div>
    </section>

    {/* Footer */}
    <footer className="border-t border-slate-100 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div>
          <p className="flex items-center gap-2 font-black text-emerald-950">
            <BrandMark size={22} className="shrink-0 rounded-md" />
            PharmArt
          </p>
          <p className="mt-1 text-xs leading-6 text-slate-500">
            تجربه‌ای دیجیتال برای دسترسی به محصولات سلامت و تندرستی
          </p>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-3 text-sm font-bold text-slate-600">
          <button type="button" onClick={onBrowseCatalog} className="hover:text-emerald-700">
            کاتالوگ محصولات
          </button>
          <button type="button" onClick={onLogin} className="hover:text-emerald-700">
            ورود مشتری
          </button>
          <button type="button" onClick={onRegister} className="hover:text-emerald-700">
            همکاری با داروخانه
          </button>
          <a href="#faq" className="hover:text-emerald-700">
            پرسش‌های متداول
          </a>
        </div>
      </div>
    </footer>
  </main>
);
