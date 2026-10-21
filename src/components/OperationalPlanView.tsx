import React, { useState } from 'react';
import { 
  FileCheck2, 
  Layers, 
  Boxes, 
  Bot, 
  ShieldCheck, 
  Scale, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles,
  TrendingDown,
  Building,
  Copy,
  Check
} from 'lucide-react';

type PlanSection =
  | 'overview'
  | 'requirements'
  | 'inventory'
  | 'ai_matching'
  | 'ui_ux'
  | 'payment_escrow'
  | 'legal';

export const OperationalPlanView: React.FC = () => {
  const [activeSection, setActiveSection] = useState<PlanSection>('overview');
  const [copied, setCopied] = useState(false);

  const handleCopySummary = () => {
    const text = `طرح جامع عملیاتی راه‌اندازی پلتفرم هوشمند دارویی و مکمل با سیستم تبادل بین‌داروخانه‌ای B2B، الگوریتم انقضا-محور FEFO و پرداخت امانی امن.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12" id="operational-plan-container">
      
      {/* Executive Header Banner */}
      <div className="bg-gradient-to-l from-emerald-900 via-slate-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-emerald-800/40">
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
        <div className="relative z-10 max-w-4xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>مستند استراتژیک و نقشه راه فنی</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug">
            طرح عملیاتی جامع پیاده‌سازی سامانه دارویی و پلتفرم تبادل بین‌داروخانه‌ای
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            مبتنی بر تحلیل دقیق دغدغه‌های مطرح‌شده در فایل‌های صوتی: ایجاد ویترین مستقل برای داروخانه‌ها (در تقابل با مدل غیرشفاف اسنپ و تپسی)، سیستم انبارداری انقضامحور مکمل‌ها، موتور هوش مصنوعی تطبیق و نجات سرمایه، و درگاه پرداخت امن امانی (Escrow).
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button 
              onClick={handleCopySummary}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white border border-white/15 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'کپی شد' : 'کپی خلاصه اجرایی'}</span>
            </button>
            <span className="text-xs text-slate-400">
              ویژه: مکمل‌های غذایی، ورزشی، رژیمی و اقلام آرایشی و بهداشتی مجاز
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3" id="plan-sections-nav">
        {[
          { id: 'overview', label: '۱. خلاصه استراتژیک و تحلیل رقبا', icon: Layers },
          { id: 'requirements', label: '۲. تحلیل نیازمندی‌های تفصیلی', icon: FileCheck2 },
          { id: 'inventory', label: '۳. سیستم انبارداری ۳ عامله انقضا', icon: Boxes },
          { id: 'ai_matching', label: '۴. موتور هوش مصنوعی تبادل B2B', icon: Bot },
          { id: 'ui_ux', label: '۵. طراحی رابط کاربری و پنل اختصاصی', icon: Building },
          { id: 'payment_escrow', label: '۶. درگاه پرداخت امن و امانی (Escrow)', icon: ShieldCheck },
          { id: 'legal', label: '۷. رگولاتوری و مجوزهای ایران', icon: Scale },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id as PlanSection)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive 
                  ? 'bg-slate-900 text-white shadow'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content Sections */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        
        {/* SECTION 1: OVERVIEW & COMPETITOR ANALYSIS */}
        {activeSection === 'overview' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-emerald-600">بخش اول</span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                  خلاصه استراتژیک، صورت مسئله و آسیب‌شناسی بازار
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                مزیت رقابتی محوری
              </span>
            </div>

            {/* Pain Point vs Solution Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl bg-rose-50/60 border border-rose-200 space-y-3">
                <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  <span>آسیب‌شناسی مدل موجود (اسنپ‌دکتر / تپسی)</span>
                </div>
                <ul className="text-xs text-slate-700 space-y-2 leading-relaxed list-disc list-inside">
                  <li><strong>عدم شفافیت در زنجیره تأمین:</strong> مشتری هویت و اصالت داروخانه واقعی را نمی‌بیند؛ کالا از یک واسطه گمنام ارسال می‌شود.</li>
                  <li><strong>نادیده گرفتن هویت داروخانه‌ها:</strong> داروخانه‌ها به عنوان انباردار پشت صحنه عمل می‌کنند و برند مستقل خود را از دست می‌دهند.</li>
                  <li><strong>فقدان سازوکار رفع معضل انقضا:</strong> هیچ مکانیزمی برای بالانس کردن مازاد موجودی انبار داروخانه‌ها پیش از تاریخ انقضا وجود ندارد.</li>
                  <li><strong>کارمزدهای بالا و یک‌طرفه:</strong> سیاست‌های تحمیلی بدون قابلیت شخصی‌سازی قیمت و تخفیف توسط مدیر داروخانه.</li>
                </ul>
              </div>

              <div className="p-5 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-3">
                <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>راهکار متمایز PharmArt (طرح پیشنهادی ما)</span>
                </div>
                <ul className="text-xs text-slate-700 space-y-2 leading-relaxed list-disc list-inside">
                  <li><strong>پنل و ویترین اختصاصی (Storefront):</strong> هر داروخانه مانند یک شعبه آنلاین با لوگو، مسئول فنی و تنظیمات مستقل فعالیت می‌کند.</li>
                  <li><strong>شبکه تبادل بین داروخانه‌ای (B2B Marketplace):</strong> اولین شبکه تهاتر و تبادل مستقیم کالا میان خود داروخانه‌های کشور.</li>
                  <li><strong>موتور پیش‌بینی هوش مصنوعی:</strong> تحلیل ۳ شاخص (تاریخ انقضا، حجم موجودی، آهنگ فروش) برای نجات سرمایه پیش از فاسد شدن کالا.</li>
                  <li><strong>پرداخت امن امانی (Escrow):</strong> تسویه منوط به دریافت فیزیکی و تایید سلامت بارکد کالا توسط داروخانه خریدار.</li>
                </ul>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <h4 className="text-sm font-bold text-slate-800 mb-2">استراتژی تمرکز بر مکمل‌ها و اقلام آرایشی-بهداشتی (OTC):</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                بر اساس تذکر مهم در فایل صوتی دوم، شروع پروسه با داروهای نسخه‌ای (Rx) به دلیل قوانین وزارت بهداشت با سد رگولاتوری مواجه خواهد شد. بنابراین، فاز نخست پلتفرم منحصراً روی <strong>مکمل‌های غذایی، ورزشی، ویتامین‌ها، اقلام رژیمی، مادر و کودک و محصولات بهداشتی-مراقبتی</strong> متمرکز است که دارای دیتا‌بیس‌های آماده شرکتی و مجوزهای عمومی فروش مجازی هستند.
              </p>
            </div>
          </div>
        )}

        {/* SECTION 2: REQUIREMENTS ANALYSIS */}
        {activeSection === 'requirements' && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-xs font-bold text-emerald-600">بخش دوم</span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                تحلیل نیازمندی‌های عملکردی و فنی سامانه
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <div className="w-6 h-6 rounded-md bg-emerald-600 text-white flex items-center justify-center text-xs">۱</div>
                  <span>دیتابیس متمرکز کاتالوگ</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  بارگذاری دیتابیس جامع مکمل‌های ایران با فیلدهای استاندارد سازمان غذا و دارو شامل کدهای <strong>IRC</strong>, <strong>GTIN</strong>, سری ساخت (Batch)، شرکت واردکننده/تولیدکننده، فرم دارویی و قیمت پایه مصوب.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <div className="w-6 h-6 rounded-md bg-emerald-600 text-white flex items-center justify-center text-xs">۲</div>
                  <span>پنل اختصاصی داروخانه</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  امکان تعریف انبار فیزیکی، همگام‌سازی از طریق فایل اکسل یا وب‌سرویس با نرم‌افزارهای حسابداری داروخانه (مانند ایمن‌افزار، تبیان، یاس)، تعریف سقف تخفیف و انتخاب اقلام مجاز برای تبادل.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <div className="w-6 h-6 rounded-md bg-emerald-600 text-white flex items-center justify-center text-xs">۳</div>
                  <span>موتور مچینگ B2B هوشمند</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  اسکن پیوسته وضعیت انبارهای همه داروخانه‌های عضو پلتفرم و برقراری ارتباط خودکار بین داروخانه‌ای که محصولی در آستانه انقضا دارد با داروخانه‌ای که تقاضای بالایی برای همان محصول دارد.
                </p>
              </div>
            </div>

            {/* Technical Stack Architecture */}
            <div className="mt-4 p-5 rounded-xl border border-slate-200 space-y-3">
              <h4 className="text-sm font-bold text-slate-900">معماری پیشنهادی فناوری (Tech Stack):</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="font-semibold block text-slate-800">فرانت‌اند:</span>
                  <span className="text-slate-600">React 18 / Next.js با Tailwind CSS و طراحی واکنش‌گرا</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="font-semibold block text-slate-800">بک‌اند و API:</span>
                  <span className="text-slate-600">Node.js Express / NestJS با معماری ماژولار و امن</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="font-semibold block text-slate-800">پایگاه داده:</span>
                  <span className="text-slate-600">PostgreSQL برای تراکنش‌های مالی + Redis برای کَشینگ</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="font-semibold block text-slate-800">موتور هوش مصنوعی:</span>
                  <span className="text-slate-600">Gemini 2.5 Flash / الگوریتم‌های بهینه‌سازی خطی سیمپلکس</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 3: INVENTORY ENGINE */}
        {activeSection === 'inventory' && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-xs font-bold text-emerald-600">بخش سوم</span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                سیستم مدیریت موجودی انقضامحور (متدولوژی ۳ عاملی FEFO)
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              در انبارهای دارویی متدولوژی سنتی FIFO (First-In, First-Out) ناکارآمد است؛ باید از متدولوژی <strong>FEFO (First-Expired, First-Out)</strong> استفاده شود که بر سه فاکتور کلیدی تأکید شده در پیام صوتی استوار است:
            </p>

            {/* The 3 Golden Factors */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200">
                <div className="text-xs font-bold text-amber-900 mb-1">فاکتور ۱: تاریخ انقضا (Expiry Date)</div>
                <div className="text-xl font-extrabold text-amber-700">Days to Expiry (DTE)</div>
                <p className="text-xs text-slate-600 mt-2">
                  تعداد روزهای باقی‌مانده تا تاریخ انقضای رسمی درج‌شده روی بسته‌بندی کالا.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200">
                <div className="text-xs font-bold text-blue-900 mb-1">فاکتور ۲: میزان موجودی در انبار</div>
                <div className="text-xl font-extrabold text-blue-700">Current Stock (Qty)</div>
                <p className="text-xs text-slate-600 mt-2">
                  موجودی فیزیکی آزاد منهای مقادیر رزرو شده در سبدهای خرید B2C و سفارشات جاری.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200">
                <div className="text-xs font-bold text-purple-900 mb-1">فاکتور ۳: آهنگ فروش روزانه</div>
                <div className="text-xl font-extrabold text-purple-700">Sales Velocity (V)</div>
                <p className="text-xs text-slate-600 mt-2">
                  میانگین وزنی تعداد فروش این قلم در روز (محاسبه شده در بازه‌های ۳۰ و ۹۰ روز گذشته).
                </p>
              </div>
            </div>

            {/* Formula Card */}
            <div className="p-5 rounded-xl bg-slate-900 text-white space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400">فرمول طلایی تخمین زمان اتمام انبار و ریسک انقضا:</span>
                <span className="text-[11px] bg-slate-800 px-2 py-1 rounded text-slate-300 font-mono">Run-Out Days vs DTE</span>
              </div>
              <div className="p-3 bg-slate-800/80 rounded-lg text-center font-mono text-sm sm:text-base text-amber-300">
                Days of Inventory Left = Current Stock ÷ Daily Sales Velocity
              </div>
              <div className="text-xs text-slate-300 space-y-1">
                <p>• <strong>حالت بحرانی (Critical Risk):</strong> اگر <code className="text-rose-400">Days of Inventory Left &gt; Days to Expiry</code> باشد، یعنی داروخانه پیش از انقضا قادر به فروش همه کالاها با آهنگ عادی نیست و سرمایه حتماً می‌سوزد!</p>
                <p>• <strong>اقدام سیستمی:</strong> کالا فوراً وارد لیست تبادل هوشمند B2B می‌شود و با قیمت رقابتی به داروخانه‌ای که آهنگ فروش بالایی دارد پیشنهاد می‌گردد.</p>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 4: AI MATCHING ENGINE */}
        {activeSection === 'ai_matching' && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-xs font-bold text-emerald-600">بخش چهارم</span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                موتور هوش مصنوعی مچینگ بین داروخانه‌ای و قیمت‌گذاری پویا
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Bot className="w-4 h-4 text-emerald-600" />
                  <span>سازوکار تطبیق عرضه و تقاضا (Supply-Demand Matching)</span>
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  هوش مصنوعی به صورت ۲۴ ساعته ماتریس انبارهای داروخانه‌ها را تحلیل می‌کند. برای مثال:
                </p>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                  <div className="flex items-center justify-between text-slate-800 font-semibold">
                    <span>داروخانه مبدا (دکتر راد - شریعتی):</span>
                    <span className="text-rose-600 font-bold">۱۲۰ بسته کلاژینو مازاد (انقضا ۶۴ روز)</span>
                  </div>
                  <div className="text-slate-500">آهنگ فروش: فقط ۰.۶ بسته در روز (نیاز به ۲۰۰ روز برای فروش عادی)</div>
                  <div className="h-px bg-slate-200 my-2" />
                  <div className="flex items-center justify-between text-slate-800 font-semibold">
                    <span>داروخانه مقصد (رازی - ونک):</span>
                    <span className="text-emerald-600 font-bold">تقاضای بالا (۴.۸ بسته در روز) و کمبود موجودی</span>
                  </div>
                  <div className="text-slate-500">نتیجه مچینگ: پیشنهاد انتقال ۸۵ بسته با تخفیف بهینه ۱۵٪</div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-emerald-600" />
                  <span>الگوریتم قیمت‌گذاری پویا و برد-برد (Win-Win Pricing)</span>
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  اگر داروخانه کالا را نگه دارد، با گذشت تاریخ انقضا ۱۰۰٪ ارزش خرید آن معدوم خواهد شد. الگوریتم هوش مصنوعی یک قیمت طلایی محاسبه می‌کند:
                </p>
                <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs space-y-2">
                  <p><strong>۱. حفظ اصل سرمایه فروشنده:</strong> قیمت پیشنهادی بالاتر از قیمت خرید فاکتور رسمی است یا در بدترین حالت، معادل قیمت خرید، تا داروخانه زیان نکند.</p>
                  <p><strong>۲. حاشیه سود خریدار:</strong> داروخانه خریدار به دلیل تخفیف اعمال شده، مارجین سود بیشتری نسبت به خرید از شرکت‌های پخش کسب می‌کند.</p>
                  <p><strong>۳. محاسبه خودکار ارزش سرمایه نجات‌یافته:</strong> پلتفرم در هر تبادل مقدار ریالی سودی که از خطر انقضا نجات داده شده را به داروخانه‌ها گزارش می‌دهد.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 5: UI/UX & DEDICATED STOREFRONT */}
        {activeSection === 'ui_ux' && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-xs font-bold text-emerald-600">بخش پنجم</span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                طراحی رابط کاربری و معماری پنل اختصاصی داروخانه‌ها
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-xl border border-slate-200 space-y-3">
                <h4 className="text-sm font-bold text-slate-900">امکانات پنل اختصاصی داروخانه (B2B Portal):</h4>
                <ul className="text-xs text-slate-600 space-y-2 leading-relaxed list-disc list-inside">
                  <li><strong>شخصی‌سازی هویت بصری:</strong> بارگذاری لوگوی داروخانه، معرفی مسئول فنی، نمایش گواهی‌ها و پروانه تأسیس.</li>
                  <li><strong>مدیریت انبار بصری:</strong> تفکیک رنگی کالاها بر اساس میزان خطر انقضا (سبز، زرد، قرمز).</li>
                  <li><strong>میز کار تبادلات B2B:</strong> نوتیفیکیشن لحظه‌ای پیشنهادهای هوش مصنوعی با دکمه‌های تایید، مذاکره یا رد.</li>
                  <li><strong>گزارش‌های گردش مالی:</strong> گزارش تسویه‌های پایا و مبالغ امانی در شرف آزادسازی.</li>
                </ul>
              </div>

              <div className="p-5 rounded-xl border border-slate-200 space-y-3">
                <h4 className="text-sm font-bold text-slate-900">ویترین اختصاصی مشتری نهایی (B2C Storefront):</h4>
                <ul className="text-xs text-slate-600 space-y-2 leading-relaxed list-disc list-inside">
                  <li><strong>شفافیت مطلق اصالت:</strong> نمایش نام دقیق داروخانه تأمین‌کننده، فاصله جغرافیایی و زمان تخمینی پیک.</li>
                  <li><strong>نمایش شفاف تاریخ انقضا:</strong> بر خلاف پلتفرم‌های دیگر که تاریخ انقضا مجهول است، مشتری تاریخ انقضای دقیق همان بچ ارسالی را قبل از خرید می‌بیند.</li>
                  <li><strong>امکان گفتگوی مستقیم با مشاور دارویی:</strong> چت امن با مسئول فنی داروخانه برای مشاوره مکمل.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 6: PAYMENT & ESCROW */}
        {activeSection === 'payment_escrow' && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-xs font-bold text-emerald-600">بخش ششم</span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                معماری درگاه پرداخت امن و سیستم امانی (Escrow & Split Payment)
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              در تبادلات داروخانه‌ای B2B که مبالغ ده‌ها یا صدها میلیون تومان است، ریسک عدم تطابق بچ ارسالی یا مخدوش بودن پلمپ بسیار حساس است. بنابراین سیستم پرداخت امانی چهارمرحله‌ای طراحی شده است:
            </p>

            {/* 4-Step Escrow Pipeline */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-2">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold mx-auto">۱</div>
                <div className="text-xs font-bold text-slate-800">تایید فاکتور و واریز امانی</div>
                <p className="text-[11px] text-slate-500">داروخانه خریدار مبلغ را به حساب واسط امن شاپرک واریز می‌کند.</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-2">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold mx-auto">۲</div>
                <div className="text-xs font-bold text-slate-800">حمل اختصاصی با کد رهگیری</div>
                <p className="text-[11px] text-slate-500">محموله توسط ناوگان معتمد با برچسب سلامت بارگیری و پلمپ می‌شود.</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-2">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold mx-auto">۳</div>
                <div className="text-xs font-bold text-slate-800">تطبیق بارکد و بازرسی (OTP)</div>
                <p className="text-[11px] text-slate-500">مسئول فنی خریدار، اصالت و سلامت اقلام را اسکن و تایید می‌کند.</p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-center space-y-2">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold mx-auto">۴</div>
                <div className="text-xs font-bold text-emerald-900">تسهیم خودکار شبا (Split)</div>
                <p className="text-[11px] text-emerald-800">وجه فوراً به شماره شبای فروشنده واریز و کارمزد پلتفرم کسر می‌گردد.</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
              <span className="font-bold block text-slate-900">پروتکل حل اختلاف (Dispute Resolution):</span>
              <p>در صورت هرگونه مغایرت در تعداد یا آسیب فیزیکی به کالا، وجه تا بررسی کارشناس داروساز مرضی‌الطرفین در حساب امانی محفوظ خواهد ماند یا برگشت می‌خورد.</p>
            </div>
          </div>
        )}

        {/* SECTION 7: LEGAL & COMPLIANCE */}
        {activeSection === 'legal' && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-xs font-bold text-emerald-600">بخش هفتم</span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                الزامات حقوقی، رگولاتوری و مجوزهای رسمی در ایران
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-bold text-sm text-slate-900 block">مجوزهای پلتفرم (Platform Licenses):</span>
                <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                  <li><strong>اینماد (e-Namad):</strong> کسب نماد اعتماد الکترونیکی دو ستاره از مرکز توسعه تجارت الکترونیکی.</li>
                  <li><strong>درگاه پرداخت شاپرکی:</strong> عقد قرارداد با پرداخت‌یارهای رسمی مجاز به تسویه امانی و تسهیم شبا.</li>
                  <li><strong>نظام صنفی رایانه‌ای:</strong> ثبت به عنوان شرکت دانش‌بنیان / استارتاپ خدمات سلامت الکترونیک.</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-bold text-sm text-slate-900 block">مجوزهای داروخانه‌های همکار:</span>
                <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                  <li><strong>پروانه تأسیس و مسئول فنی:</strong> احراز هویت داروساز صاحب پروانه و کد نظام داروپزشکی معتبر.</li>
                  <li><strong>مجوز فروش اینترنتی مکمل‌ها:</strong> اخذ مجوز فروش غیرحضوری اقلام سلامت‌محور از دانشگاه علوم پزشکی مربوطه.</li>
                  <li><strong>قرارداد تهاتر قانونی:</strong> امضای الکترونیکی قرارداد تبادل کالا و صدور فاکتور رسمی معتبر جهت ارائه به دارایی.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
