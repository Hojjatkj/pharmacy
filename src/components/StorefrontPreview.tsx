import React, { useState } from 'react';
import { Pharmacy, ProductItem } from '../types';
import { mockCatalogProducts } from '../data/mockData';
import { 
  Store, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Award, 
  Clock, 
  CheckCircle2, 
  AlertOctagon, 
  Sliders, 
  ShoppingBag,
  Info,
  CalendarCheck,
  Search
} from 'lucide-react';

interface StorefrontPreviewProps {
  pharmacy: Pharmacy;
}

export const StorefrontPreview: React.FC<StorefrontPreviewProps> = ({ pharmacy }) => {
  const [activeSubTab, setActiveSubTab] = useState<'storefront' | 'comparison' | 'settings'>('storefront');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Pharmacy customizable settings
  const [storeTitle, setStoreTitle] = useState(pharmacy.name);
  const [shippingTime, setShippingTime] = useState('تحویل فوری درون‌شهری (زیر ۲ ساعت)');
  const [acceptsConsultation, setAcceptsConsultation] = useState(true);

  const filteredProducts = mockCatalogProducts.filter(p => {
    const matchesSearch = p.name.includes(searchQuery) || p.brand.includes(searchQuery);
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 pb-12" id="storefront-preview-view">
      
      {/* Top Banner Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-base font-extrabold text-slate-900">
            ویترین اختصاصی و شفاف داروخانه (Dedicated Storefront)
          </h2>
          <p className="text-xs text-slate-500">
            پاسخ به چالش فایل صوتی: اعطای هویت مستقل و تنظیمات اختصاصی به هر داروخانه در برابر مدل بسته اسنپ/تپسی
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setActiveSubTab('storefront')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeSubTab === 'storefront' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            نمای ویترین عمومی داروخانه
          </button>
          <button
            onClick={() => setActiveSubTab('comparison')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeSubTab === 'comparison' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            مقایسه با اسنپ / تپسی
          </button>
          <button
            onClick={() => setActiveSubTab('settings')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeSubTab === 'settings' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            تنظیمات اختصاصی پنل
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: STOREFRONT VIEW */}
      {activeSubTab === 'storefront' && (
        <div className="space-y-6">
          
          {/* Pharmacy Brand Hero Card */}
          <div className="bg-gradient-to-r from-slate-900 to-emerald-950 text-white rounded-2xl p-6 shadow-md border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white text-slate-900 flex items-center justify-center text-3xl shadow-lg">
                  {pharmacy.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-black">{storeTitle}</h3>
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      دارای پروانه معتبر سازمان غذا و دارو
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    مسئول فنی: <strong className="text-white">{pharmacy.technicalManager}</strong> | شماره پروانه: {pharmacy.licenseNumber}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:items-end gap-1.5 text-xs text-slate-300">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{pharmacy.address}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>تلفن تماس: {pharmacy.phone}</span>
                </div>
                <div className="flex items-center gap-1 text-emerald-400 font-semibold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{shippingTime}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Search & Categories */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
              <input
                type="text"
                placeholder="جستجوی مکمل، برند یا شناسه IRC..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-3 pr-9 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-medical-500"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 text-xs">
              {[
                { id: 'all', label: 'همه مکمل‌ها' },
                { id: 'supplement', label: 'ویتامین و تقویتی' },
                { id: 'sports_nutrition', label: 'مکمل ورزشی' },
                { id: 'cosmetic', label: 'پوست، مو و زیبایی' },
                { id: 'otc_health', label: 'سلامت عمومی' },
              ].map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all ${
                    selectedCategory === c.id
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredProducts.map(prod => (
              <div 
                key={prod.id} 
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="h-32 rounded-xl bg-slate-50 flex items-center justify-center text-4xl border border-slate-100 relative">
                    {prod.category === 'sports_nutrition' ? '🏋️‍♂️' : prod.category === 'cosmetic' ? '✨' : '💊'}
                    <span className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                      {prod.brand}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-xs text-slate-900 leading-snug line-clamp-2">
                    {prod.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 font-mono">IRC: {prod.ircCode}</p>

                  {/* Guaranteed Expiration Date Feature */}
                  <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-emerald-50 text-emerald-800 text-[11px] font-medium border border-emerald-200">
                    <CalendarCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>انقضای تضمین شده: ۲۰۲۷/۰۶</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">قیمت مصوب:</span>
                    <span className="text-sm font-black text-slate-900 font-mono">
                      {prod.basePrice.toLocaleString('fa-IR')} <span className="text-[10px] font-sans font-normal text-slate-500">تومان</span>
                    </span>
                  </div>

                  <button className="px-3 py-1.5 bg-medical-600 hover:bg-medical-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs">
                    خرید از داروخانه
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: COMPARISON WITH SNAPP/TAPSI */}
      {activeSubTab === 'comparison' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-slate-900 text-base">
              کالبدشکافی تفاوت‌های بنیادین با پلتفرم‌های سوپراپی (اسنپ و تپسی)
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              تحلیل دقیق نکاتی که در صوت اول اشاره شد در مورد عدم شفافیت و نادیده گرفته شدن موقعیت داروخانه‌ها
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Snapp / Tapsi critique */}
            <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-200 space-y-4">
              <div className="flex items-center gap-2 text-rose-800 font-black text-sm">
                <AlertOctagon className="w-5 h-5 text-rose-600" />
                <span>مدل فعلی اسنپ و تپسی (اکوسیستم بسته واسطه‌ای)</span>
              </div>

              <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
                <div className="p-3 bg-white rounded-xl border border-rose-100">
                  <strong className="block text-slate-900 font-bold mb-1">۱. خریدار نمی‌داند از کدام داروخانه می‌خرد:</strong>
                  تمام فرآیند در برند اسنپ ادغام شده است. اصالت داروخانه و مسئول فنی برای مشتری محو است.
                </div>
                <div className="p-3 bg-white rounded-xl border border-rose-100">
                  <strong className="block text-slate-900 font-bold mb-1">۲. تاریخ انقضای کالا برای مشتری مخفی است:</strong>
                  تا زمان رسیدن بسته به دست مشتری، هیچ تضمینی در مورد مدت زمان باقی‌مانده انقضا وجود ندارد.
                </div>
                <div className="p-3 bg-white rounded-xl border border-rose-100">
                  <strong className="block text-slate-900 font-bold mb-1">۳. انفعال کامل در حل بحران مازاد انبار:</strong>
                  اگر داروخانه‌ای اقلام رو به انقضا داشته باشد، پلتفرم هیچ سازوکاری برای نجات سرمایه یا تبادل B2B ندارد.
                </div>
              </div>
            </div>

            {/* PharmArt Differentiator */}
            <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-4">
              <div className="flex items-center gap-2 text-emerald-800 font-black text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>مدل PharmArt (سامانه شفاف و داروخانه‌محور)</span>
              </div>

              <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
                <div className="p-3 bg-white rounded-xl border border-emerald-100">
                  <strong className="block text-slate-900 font-bold mb-1">۱. برند و هویت مستقل برای هر داروخانه:</strong>
                  مشتری مشخصاً از «داروخانه دکتر راد» خرید می‌کند، سوابق پروانه و مسئول فنی را مشاهده می‌نماید.
                </div>
                <div className="p-3 bg-white rounded-xl border border-emerald-100">
                  <strong className="block text-slate-900 font-bold mb-1">۲. تضمین رسمی تاریخ انقضا و بچ قبل از پرداخت:</strong>
                  در کارت محصول تاریخ انقضای دقیق همان بچ درج شده و در صورت مغایرت، وجه از حساب امانی بازگردانده می‌شود.
                </div>
                <div className="p-3 bg-white rounded-xl border border-emerald-100">
                  <strong className="block text-slate-900 font-bold mb-1">۳. شبکه تبادل B2B هوشمند:</strong>
                  داروخانه‌ها علاوه بر فروش مستقیم، مازاد انبار خود را با سایر داروخانه‌ها تهاتر و متوازن می‌کنند.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: PHARMACY SETTINGS */}
      {activeSubTab === 'settings' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 max-w-2xl">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-600" />
              <span>پنل تنظیمات و شخصی‌سازی داروخانه</span>
            </h3>
            <p className="text-xs text-slate-500">قابلیت تنظیمات اختصاصی که در صوت اول خواسته شده بود</p>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">عنوان فروشگاه اختصاصی آنلاین:</label>
              <input
                type="text"
                value={storeTitle}
                onChange={(e) => setStoreTitle(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg font-semibold text-slate-900 text-xs focus:ring-2 focus:ring-medical-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">متن شیوه و زمان ارسال به مشتریان:</label>
              <input
                type="text"
                value={shippingTime}
                onChange={(e) => setShippingTime(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg text-slate-900 text-xs focus:ring-2 focus:ring-medical-500"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <span className="font-bold text-slate-900 block">فعال بودن مشاوره دارویی آنلاین:</span>
                <span className="text-slate-500 text-[11px]">امکان ارسال پیام توسط خریداران به مسئول فنی</span>
              </div>
              <input
                type="checkbox"
                checked={acceptsConsultation}
                onChange={(e) => setAcceptsConsultation(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-medical-500 cursor-pointer"
              />
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-800">
              کلیه تغییرات فوراً در صفحه اختصاصی داروخانه به آدرس <span className="font-mono text-emerald-950 font-bold">pharmaconnect.ir/{pharmacy.id}</span> منعکس می‌گردد.
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
