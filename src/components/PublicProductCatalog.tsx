import BrandMark from './BrandMark';
import { useCallback, useEffect, useState, type FormEvent } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  Dumbbell,
  HeartPulse,
  MapPin,
  PackageCheck,
  Pill,
  RotateCcw,
  Search,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Store,
} from 'lucide-react';

import {
  getPublicStorefrontProducts,
  PublicStorefrontProduct,
  StorefrontFilters,
} from '../api/storefront';
import { getUserMessage } from '../lib/errors';
import { formatMoney } from '../lib/format';

type Props = {
  onPurchase: () => void;
  onLogin: () => void;
  onPharmacyRegister: () => void;
  onBackToLanding: () => void;
};

const categories = [
  { value: '', label: 'همه دسته‌بندی‌ها', icon: ShoppingBag, tone: 'bg-slate-100 text-slate-700' },
  { value: 'supplement', label: 'مکمل', icon: Pill, tone: 'bg-violet-50 text-violet-700' },
  { value: 'cosmetic', label: 'آرایشی و بهداشتی', icon: Sparkles, tone: 'bg-pink-50 text-pink-700' },
  { value: 'otc_health', label: 'سلامت بدون نسخه', icon: HeartPulse, tone: 'bg-emerald-50 text-emerald-700' },
  { value: 'sports_nutrition', label: 'تغذیه ورزشی', icon: Dumbbell, tone: 'bg-amber-50 text-amber-700' },
];

const numberFormat = new Intl.NumberFormat('fa-IR');
const formatNumber = (value: number) => numberFormat.format(value);
const categoryLabel = (value: string) =>
  categories.find((item) => item.value === value)?.label ?? value;
const categoryTone = (value: string) =>
  categories.find((item) => item.value === value)?.tone ?? 'bg-slate-100 text-slate-700';
const categoryIcon = (value: string) =>
  categories.find((item) => item.value === value)?.icon ?? PackageCheck;

export default function PublicProductCatalog({
  onPurchase,
  onLogin,
  onPharmacyRegister,
  onBackToLanding,
}: Props) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [filters, setFilters] = useState<StorefrontFilters>({});
  const [products, setProducts] = useState<PublicStorefrontProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadProducts = useCallback(async (activeFilters: StorefrontFilters) => {
    setLoading(true);
    setError('');
    try {
      const result = await getPublicStorefrontProducts(activeFilters);
      setProducts(result);
    } catch (err) {
      setError(
        getUserMessage(
          err,
          'دریافت فهرست محصولات انجام نشد. لطفاً دوباره تلاش کنید.',
        ),
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProducts(filters);
  }, [filters, loadProducts]);

  function handleFilterSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (minPrice.trim() &&
      (!Number.isInteger(Number(minPrice)) || Number(minPrice) < 0)) {
      setError('حداقل قیمت باید عددی صحیح و غیرمنفی باشد.');
      return;
    }

    if (maxPrice.trim() &&
      (!Number.isInteger(Number(maxPrice)) || Number(maxPrice) < 0)) {
      setError('حداکثر قیمت باید عددی صحیح و غیرمنفی باشد.');
      return;
    }

    if (minPrice.trim() && maxPrice.trim() &&
      Number(minPrice) > Number(maxPrice)) {
      setError('حداقل قیمت نمی‌تواند بیشتر از حداکثر قیمت باشد.');
      return;
    }

    setFilters({
      search: search.trim() || undefined,
      category: category || undefined,
      minPrice: minPrice.trim() || undefined,
      maxPrice: maxPrice.trim() || undefined,
    });
  }

  function resetFilters() {
    setSearch('');
    setCategory('');
    setMinPrice('');
    setMaxPrice('');
    setFilters({});
  }

  return (
    <main dir="rtl" className="min-h-screen overflow-hidden bg-[#f4f8f6] text-slate-800">
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
          <button type="button" onClick={onBackToLanding} className="group flex items-center gap-3 text-right">
            <BrandMark size={48} className="shrink-0 rounded-2xl shadow-lg shadow-emerald-900/20 transition group-hover:scale-105" />
            <span>
              <span className="block text-xl font-black tracking-tight text-slate-900">PharmArt</span>
              <span className="mt-0.5 block text-[11px] font-medium text-slate-500">بازار سلامت و داروخانه‌ها</span>
            </span>
          </button>

          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={onPharmacyRegister}
              className="rounded-xl px-3 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-100 sm:px-4">
              همکاری داروخانه‌ها
            </button>
            <button type="button" onClick={onLogin}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-slate-700">
              <ShoppingBag size={16} />
              ورود مشتری
            </button>
          </div>
        </div>
      </header>

      <section className="relative isolate overflow-hidden bg-gradient-to-l from-emerald-950 via-emerald-900 to-teal-900">
        <div className="pointer-events-none absolute -left-16 -top-24 -z-10 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-5 px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/20 bg-white/10 px-3 py-1.5 text-[11px] font-bold text-emerald-100">
              <ShieldCheck size={14} />
              کاتالوگ عمومی محصولات سلامت
            </div>
            <h1 className="mt-3 text-2xl font-black leading-relaxed tracking-tight text-white sm:text-3xl">
              محصولات سلامت را بررسی و قیمت‌ها را مقایسه کنید
            </h1>
            <p className="mt-2 text-sm leading-7 text-emerald-50/80">
              مشاهدهٔ محصولات و اطلاعات عرضه‌کنندگان بدون نیاز به ورود؛ برای ادامهٔ خرید، وارد حساب مشتری شوید.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <a href="#catalog" className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-extrabold text-emerald-900 shadow-sm transition hover:bg-emerald-50">
              مشاهده محصولات
              <ArrowLeft size={16} />
            </a>
            <button type="button" onClick={onPharmacyRegister}
              className="rounded-xl border border-white/25 bg-white/5 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/10">
              ثبت‌نام داروخانه
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 py-7 sm:px-6 lg:px-8 lg:py-9" id="catalog">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-xs font-extrabold tracking-wide text-emerald-700">جست‌وجو و انتخاب</div>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">کاتالوگ محصولات</h2>
            <p className="mt-2 text-sm leading-7 text-slate-500">با جست‌وجو و فیلتر قیمت، سریع‌تر به گزینه‌های مرتبط برسید.</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-600 shadow-sm">
            <SlidersHorizontal size={15} className="text-emerald-700" />
            فیلترهای پیشرفته
          </div>
        </div>

        <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {categories.map((item) => {
            const Icon = item.icon;
            const active = category === item.value;
            return (
              <button key={item.value} type="button" onClick={() => {
                setCategory(item.value);
                setFilters((previous) => ({ ...previous, category: item.value || undefined }));
              }}
                className={`flex items-center gap-3 rounded-2xl border p-4 text-right transition ${
                  active
                    ? 'border-emerald-500 bg-emerald-50 shadow-sm ring-1 ring-emerald-500/20'
                    : 'border-slate-200 bg-white hover:border-emerald-200 hover:shadow-sm'
                }`}>
                <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${item.tone}`}><Icon size={21} /></span>
                <span className="min-w-0 flex-1 text-sm font-extrabold text-slate-800">{item.label}</span>
                {active && <CheckCircle2 size={17} className="shrink-0 text-emerald-600" />}
              </button>
            );
          })}
        </div>

        <form onSubmit={handleFilterSubmit} className="mb-8 rounded-[1.75rem] border border-slate-200/80 bg-white p-4 shadow-md shadow-slate-900/[0.03] sm:p-5">
          <div className="grid gap-4 lg:grid-cols-12">
            <label className="block lg:col-span-5">
              <span className="mb-2 block text-xs font-extrabold text-slate-700">نام محصول، برند یا مادهٔ مؤثره</span>
              <span className="relative block">
                <Search size={19} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={search} onChange={(event) => setSearch(event.target.value)}
                  placeholder="مثلاً نام محصول یا برند"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-3 pr-11 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10" />
              </span>
            </label>
            <label className="block lg:col-span-2">
              <span className="mb-2 block text-xs font-extrabold text-slate-700">دسته‌بندی</span>
              <span className="relative block">
                <select value={category} onChange={(event) => setCategory(event.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-9 pr-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10">
                  {categories.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                </select>
                <ChevronDown size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </span>
            </label>
            <label className="block lg:col-span-2">
              <span className="mb-2 block text-xs font-extrabold text-slate-700">حداقل قیمت (تومان)</span>
              <input type="number" min="0" step="1" value={minPrice} onChange={(event) => setMinPrice(event.target.value)}
                placeholder="بدون محدودیت"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3.5 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10" />
            </label>
            <label className="block lg:col-span-2">
              <span className="mb-2 block text-xs font-extrabold text-slate-700">حداکثر قیمت (تومان)</span>
              <input type="number" min="0" step="1" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)}
                placeholder="بدون محدودیت"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3.5 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10" />
            </label>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
            <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-extrabold text-white shadow-md shadow-emerald-900/10 transition hover:-translate-y-0.5 hover:bg-emerald-800">
              <Search size={17} />
              اعمال فیلترها
            </button>
            <button type="button" onClick={resetFilters} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50">
              <RotateCcw size={16} />
              پاک‌کردن فیلترها
            </button>
            <span className="mr-auto text-xs text-slate-400">برای مشاهدهٔ محصولات، ورود الزامی نیست.</span>
          </div>
        </form>

        {error && (
          <div
            role="alert" className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm leading-7 text-red-700">
            <span>{error}</span>
            <button type="button" onClick={() => void loadProducts(filters)} className="rounded-lg border border-red-200 px-3 py-2 font-bold hover:bg-red-100">تلاش دوباره</button>
          </div>
        )}

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-black text-slate-900">محصولات قابل مشاهده</h3>
            {!loading && !error && <p className="mt-1 text-xs text-slate-500">{formatNumber(products.length)} نتیجه</p>}
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <ShieldCheck size={15} className="text-emerald-600" />
            قیمت‌ها بر اساس اطلاعات عرضه‌کننده نمایش داده می‌شوند.
          </span>
        </div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <div className="h-36 bg-slate-100" />
                <div className="space-y-3 p-4">
                  <div className="h-4 w-3/4 rounded bg-slate-100" />
                  <div className="h-3 w-1/2 rounded bg-slate-100" />
                  <div className="h-16 rounded-xl bg-slate-100" />
                  <div className="h-10 rounded-xl bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-5 py-16 text-center">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400"><Search size={28} /></span>
            <h3 className="mt-5 text-lg font-black text-slate-900">محصولی پیدا نشد</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-slate-500">عبارت جست‌وجو یا محدودهٔ قیمت را تغییر دهید؛ یا فیلترها را پاک کنید و دوباره تلاش کنید.</p>
            <button type="button" onClick={resetFilters} className="mt-5 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white hover:bg-slate-700">نمایش همهٔ محصولات</button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((item) => {
              const Icon = categoryIcon(item.product.category);
              const tone = categoryTone(item.product.category);
              const inStock = item.availableQuantity > 0;
              return (
                <article key={item.stockItemId} className="group flex min-w-0 flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-950/[0.07]">
                  <div className="relative flex h-40 items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-50/80 via-white to-teal-50">
                    <div className="absolute inset-0 opacity-60" style={{ backgroundImage: 'radial-gradient(#cbd5e1 0.7px, transparent 0.7px)', backgroundSize: '14px 14px' }} />
                    <span className={`relative flex h-20 w-20 items-center justify-center rounded-[1.7rem] shadow-md shadow-slate-900/[0.04] ring-1 ring-white ${tone}`}>
                      <Icon size={37} strokeWidth={1.6} />
                    </span>
                    <span className="absolute right-3 top-3 rounded-full border border-white/80 bg-white/90 px-2.5 py-1 text-[10px] font-extrabold text-slate-600 shadow-sm">
                      {categoryLabel(item.product.category)}
                    </span>
                    <span className={`absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${inStock ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${inStock ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                      {inStock ? 'موجود' : 'ناموجود'}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-4">
                    <div className="min-h-[4.5rem]">
                      <h4 className="line-clamp-2 text-sm font-extrabold leading-7 text-slate-900 transition group-hover:text-emerald-800">{item.product.name}</h4>
                      {item.product.genericName && <p className="mt-0.5 line-clamp-1 text-xs leading-6 text-slate-500">{item.product.genericName}</p>}
                      <p className="mt-1 text-[11px] text-slate-500">{item.product.brand || 'برند ثبت نشده'} <span className="mx-1 text-slate-300">•</span> {item.product.unit}</p>
                    </div>

                    <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50/80 p-3">
                      <div className="flex items-start gap-2.5">
                        <span className="mt-0.5 rounded-lg bg-white p-2 text-emerald-700 shadow-sm"><Store size={16} /></span>
                        <div className="min-w-0">
                          <p className="text-[10px] font-medium text-slate-500">عرضه‌کننده</p>
                          <p className="mt-1 truncate text-xs font-extrabold text-slate-800">{item.pharmacy.name}</p>
                          {(item.pharmacy.city || item.pharmacy.province) && (
                            <p className="mt-1 flex items-center gap-1 text-[10px] text-slate-500">
                              <MapPin size={11} />
                              {[item.pharmacy.city, item.pharmacy.province].filter(Boolean).join('، ')}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-end justify-between gap-2 border-t border-slate-100 pt-4">
                      <div className="min-w-0">
                        <p className="text-[10px] font-medium text-slate-500">قیمت عرضه</p>
                        <p className="mt-1 whitespace-nowrap text-xl font-black tracking-tight text-emerald-800">
                          {formatMoney(item.sellingPrice)}
                        </p>
                      </div>
                      <div className="text-left">
                        <p className="text-[10px] text-slate-500">موجودی</p>
                        <p className="mt-1 text-sm font-extrabold text-slate-700">{formatNumber(item.availableQuantity)} <span className="text-[10px] font-medium">عدد</span></p>
                      </div>
                    </div>

                    <button type="button" onClick={onPurchase} disabled={!inStock}
                      className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-3 py-3 text-xs font-extrabold text-white shadow-sm transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500">
                      <ShoppingBag size={15} />
                      {inStock ? 'ورود و ادامهٔ خرید' : 'فعلاً ناموجود'}
                      {inStock && <ArrowLeft size={14} className="mr-auto" />}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <footer className="mt-8 border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-4 px-4 py-7 sm:px-6 lg:px-8">
          <button type="button" onClick={onBackToLanding} className="flex items-center gap-2 text-sm font-black text-slate-800">
            <BrandMark size={22} className="shrink-0 rounded-md" />
            PharmArt
          </button>
          <p className="text-xs leading-6 text-slate-500">کاتالوگ محصولات و اطلاعات عرضه‌کنندگان</p>
          <button type="button" onClick={onLogin} className="inline-flex items-center gap-2 text-xs font-extrabold text-emerald-700 hover:text-emerald-900">
            قبلاً حساب دارید؟ وارد شوید
            <ArrowLeft size={14} />
          </button>
        </div>
      </footer>
    </main>
  );
}
