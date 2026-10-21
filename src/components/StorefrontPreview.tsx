import { useMemo, useState } from 'react';
import {
  CalendarCheck,
  Clock,
  MapPin,
  PackageSearch,
  Phone,
  Search,
  ShoppingBag,
  Store,
} from 'lucide-react';

import { Pharmacy, PharmacyStockItem } from '../types';
import { formatDate, formatMoney, formatNumber } from '../lib/format';

interface StorefrontPreviewProps {
  pharmacy: Pharmacy;
  stockItems: PharmacyStockItem[];
}

const CATEGORY_LABELS: Record<string, string> = {
  supplement: 'مکمل و ویتامین',
  cosmetic: 'آرایشی و بهداشتی',
  otc_health: 'سلامت بدون نسخه',
  sports_nutrition: 'تغذیه ورزشی',
};

/**
 * Read-only preview of the pharmacy's public storefront.
 *
 * Data comes from the same inventory the dashboard uses. The previous version
 * rendered a hard-coded sample catalog with a fixed expiry date, which made the
 * preview look complete while showing products the pharmacy does not have.
 */
export function StorefrontPreview({ pharmacy, stockItems }: StorefrontPreviewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const availableItems = useMemo(
    () =>
      stockItems.filter(
        (item) =>
          item.pharmacyId === pharmacy.id && item.currentStock - item.reservedStock > 0,
      ),
    [pharmacy.id, stockItems],
  );

  const categories = useMemo(
    () => Array.from(new Set(availableItems.map((item) => item.product.category))),
    [availableItems],
  );

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return availableItems.filter((item) => {
      const matchesCategory =
        selectedCategory === 'all' || item.product.category === selectedCategory;

      const matchesQuery =
        !query ||
        item.product.name.toLowerCase().includes(query) ||
        item.product.brand.toLowerCase().includes(query) ||
        item.product.ircCode.toLowerCase().includes(query);

      return matchesCategory && matchesQuery;
    });
  }, [availableItems, searchQuery, selectedCategory]);

  return (
    <div dir="rtl" className="space-y-6 pb-12" id="storefront-preview-view">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-base font-extrabold text-slate-900">
              <Store className="h-4 w-4 text-medical-600" aria-hidden="true" />
              پیش‌نمایش ویترین داروخانه
            </h1>

            <p className="mt-1 text-xs leading-6 text-slate-500">
              این ویترین فقط برای بازبینی داخلی است و از موجودی واقعی همین داروخانه ساخته می‌شود.
            </p>
          </div>

          <span className="inline-flex w-fit items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-[11px] font-bold text-slate-600">
            <ShoppingBag className="h-3.5 w-3.5" aria-hidden="true" />
            {formatNumber(availableItems.length)} قلم قابل فروش
          </span>
        </div>
      </div>

      <section className="rounded-2xl border border-slate-800 bg-gradient-to-l from-slate-900 to-emerald-950 p-6 text-white shadow-md">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div
              aria-hidden="true"
              className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-3xl text-slate-900 shadow-lg"
            >
              {pharmacy.avatar || '💊'}
            </div>

            <div>
              <h2 className="text-xl font-black">{pharmacy.name}</h2>

              <p className="mt-1 text-xs text-slate-300">
                مسئول فنی: <strong className="text-white">{pharmacy.technicalManager}</strong>
                {' · '}
                شماره پروانه: {pharmacy.licenseNumber}
              </p>
            </div>
          </div>

          <div className="space-y-1 text-xs text-slate-300">
            <div className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
              <span>{pharmacy.address}</span>
            </div>

            <div className="flex items-center gap-1">
              <Phone className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
              <span>{pharmacy.phone}</span>
            </div>

            <div className="flex items-center gap-1 font-semibold text-emerald-400">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              <span>زمان ارسال توسط داروخانه تعیین می‌شود</span>
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
        <div className="relative w-full sm:w-80">
          <Search
            className="absolute right-3 top-2.5 h-4 w-4 text-slate-400"
            aria-hidden="true"
          />

          <label htmlFor="storefront-search" className="sr-only">
            جست‌وجوی محصول
          </label>

          <input
            id="storefront-search"
            type="search"
            placeholder="جستجوی نام، برند یا کد IRC..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white py-2 pl-3 pr-9 text-xs outline-none focus:ring-2 focus:ring-medical-500"
          />
        </div>

        <div className="flex w-full items-center gap-1.5 overflow-x-auto pb-1 text-xs sm:w-auto">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            aria-pressed={selectedCategory === 'all'}
            className={`whitespace-nowrap rounded-lg px-3 py-1.5 font-medium transition ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white'
                : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            همه دسته‌ها
          </button>

          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              aria-pressed={selectedCategory === category}
              className={`whitespace-nowrap rounded-lg px-3 py-1.5 font-medium transition ${
                selectedCategory === category
                  ? 'bg-slate-900 text-white'
                  : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              {CATEGORY_LABELS[category] ?? category}
            </button>
          ))}
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <PackageSearch className="mx-auto h-8 w-8 text-slate-400" aria-hidden="true" />

          <h2 className="mt-3 text-sm font-black text-slate-900">
            {availableItems.length === 0
              ? 'موجودی قابل فروشی برای نمایش وجود ندارد'
              : 'محصولی با این فیلتر پیدا نشد'}
          </h2>

          <p className="mt-2 text-xs leading-6 text-slate-500">
            {availableItems.length === 0
              ? 'پس از ثبت بچ‌های موجود با موجودی آزاد، ویترین به‌صورت خودکار پر می‌شود.'
              : 'عبارت جست‌وجو یا دسته‌بندی را تغییر دهید.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filteredItems.map((item) => {
            const available = Math.max(0, item.currentStock - item.reservedStock);

            return (
              <article
                key={item.id}
                className="flex flex-col justify-between space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-emerald-300 hover:shadow-md"
              >
                <div className="space-y-2">
                  <div className="relative flex h-28 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 text-4xl">
                    <span aria-hidden="true">
                      {item.product.category === 'sports_nutrition'
                        ? '🏋️'
                        : item.product.category === 'cosmetic'
                          ? '✨'
                          : '💊'}
                    </span>

                    <span className="absolute right-2 top-2 rounded border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-bold text-slate-700">
                      {item.product.brand}
                    </span>
                  </div>

                  <h3 className="line-clamp-2 text-xs font-extrabold leading-snug text-slate-900">
                    {item.product.name}
                  </h3>

                  <p className="font-mono text-[11px] text-slate-400">
                    IRC: {item.product.ircCode}
                  </p>

                  <div className="flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 p-1.5 text-[11px] font-medium text-emerald-800">
                    <CalendarCheck className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                    <span>انقضا: {formatDate(item.expiryDate)}</span>
                  </div>

                  <p className="text-[11px] text-slate-500">
                    موجودی قابل فروش: {formatNumber(available)} {item.product.unit}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-2">
                  <div>
                    <span className="block text-[10px] text-slate-400">قیمت فروش</span>

                    <span className="font-mono text-sm font-black text-slate-900">
                      {formatMoney(item.sellingPrice)}
                    </span>
                  </div>

                  <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-[10px] font-bold text-slate-500">
                    پیش‌نمایش
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
