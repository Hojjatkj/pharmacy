import React from 'react';
import { 
  GitCommitHorizontal, 
  Calendar, 
  CheckCircle2, 
  Layers, 
  Bot, 
  ShieldCheck, 
  Store, 
  Sparkles,
  Milestone
} from 'lucide-react';

export const RoadmapTimeline: React.FC = () => {
  const phases = [
    {
      month: 'ماه اول',
      title: 'تحلیل نیازمندی‌ها، دیتابیس مکمل‌ها و معماری امن',
      tag: 'زیرساخت',
      color: 'border-blue-500 bg-blue-50/40 text-blue-800',
      icon: Layers,
      deliverables: [
        'عقد قرارداد خرید یا وب‌سرویس دیتابیس جامع مکمل‌های ایران (شناسه‌های IRC و GTIN).',
        'طراحی معماری پایگاه داده تفکیک‌پذیر چندمستأجری (Multi-Tenant) برای داروخانه‌ها.',
        'تدوین اسناد حقوقی و چارچوب قرارداد تبادل بین داروخانه‌ای با مشاوران غذا و دارو.',
      ],
    },
    {
      month: 'ماه دوم',
      title: 'پیاده‌سازی انبارداری FEFO و پنل اختصاصی داروخانه',
      tag: 'هسته انبار',
      color: 'border-amber-500 bg-amber-50/40 text-amber-800',
      icon: Milestone,
      deliverables: [
        'توسعه سیستم مدیریت موجودی بر پایه ۳ فاکتور: تاریخ انقضا، موجودی انبار، آهنگ فروش.',
        'توسعه پنل اختصاصی با قابلیت بارگذاری هویت، لوگو، مجوزها و مینی‌استور داروخانه.',
        'پیاده‌سازی هشدارهای رنگی زودهنگام ریسک سوختن سرمایه (Risk Index ۹۰ روزه).',
      ],
    },
    {
      month: 'ماه سوم',
      title: 'توسعه موتور هوش مصنوعی تطبیق عرضه/تقاضا و قیمت‌گذاری',
      tag: 'هوش مصنوعی',
      color: 'border-purple-500 bg-purple-50/40 text-purple-800',
      icon: Bot,
      deliverables: [
        'الگوریتم مچینگ خودکار مازاد انبار داروخانه الف با کشش بازار داروخانه ب.',
        'توسعه موتور قیمت‌گذاری پویا و رقابتی جهت ترغیب خرید و حفظ اصل سرمایه.',
        'داشبورد مانیتورینگ ارزش سرمایه نجات‌یافته از انقضا برای مدیران داروخانه.',
      ],
    },
    {
      month: 'ماه چهارم',
      title: 'زیرساخت درگاه پرداخت امن امانی (Escrow) و لجستیک',
      tag: 'فین‌تک',
      color: 'border-emerald-500 bg-emerald-50/40 text-emerald-800',
      icon: ShieldCheck,
      deliverables: [
        'اتصال به درگاه پرداخت واسط شاپرک با پروتکل مسدودسازی امانی وجه.',
        'پیاده‌سازی مکانیزم احراز اصالت با کد یکبار مصرف (OTP Inspection Handshake).',
        'تسهیم خودکار شبا (Split Payment): واریز فروشنده + کارمزد پلتفرم + هزینه حمل.',
      ],
    },
    {
      month: 'ماه پنجم',
      title: 'ویترین شفاف B2C و پایلوت در ۲۰ داروخانه تهران',
      tag: 'پایلوت میدانی',
      color: 'border-indigo-500 bg-indigo-50/40 text-indigo-800',
      icon: Store,
      deliverables: [
        'راه‌اندازی ویترین عمومی خریداران با شفافیت کامل داروخانه مبدا و تاریخ انقضا.',
        'اجرای آزمایشی پایلوت تبادل B2B در ۲۰ داروخانه شاخص مناطق مختلف تهران.',
        'کالیبراسیون الگوریتم‌های هوش مصنوعی بر اساس بازخورد و رفتار واقعی داروسازان.',
      ],
    },
    {
      month: 'ماه ششم',
      title: 'لانچ سراسری کشوری و اتصال به نرم‌افزارهای داروخانه‌ای',
      tag: 'مقیاس‌پذیری',
      color: 'border-slate-800 bg-slate-50 text-slate-800',
      icon: Sparkles,
      deliverables: [
        'عرضه افزونه و وب‌سرویس اتصال مستقیم به نرم‌افزارهای ایمن‌افزار، تبیان، یاس و آریا.',
        'کمپین سراسری جذب ۵۰۰ داروخانه در ۵ کلان‌شهر ایران (تهران، اصفهان، مشهد، شیراز، تبریز).',
        'گزارش‌گیری جامع و توسعه فازهای مکمل‌های ارتوپدی، مادر و نوزاد و تجهیزات بهداشتی.',
      ],
    },
  ];

  return (
    <div className="space-y-6 pb-12" id="roadmap-timeline-view">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs">
          <GitCommitHorizontal className="w-4 h-4" />
          <span>برنامه اقدام و مایل‌استون‌های اجرایی</span>
        </div>
        <h2 className="text-xl font-extrabold text-slate-900 mt-1">
          نقشه راه ۶ ماهه پیاده‌سازی عملیاتی پلتفرم PharmArt
        </h2>
        <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
          برنامه‌ریزی فازبندی‌شده از مرحله طراحی مفهومی و انطباق با قوانین غذا و دارو تا استقرار موتور هوش مصنوعی و اتصال به شبکه سراسری داروخانه‌های کشور.
        </p>
      </div>

      {/* Grid Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {phases.map((p, idx) => {
          const Icon = p.icon;
          return (
            <div 
              key={idx} 
              className={`p-5 rounded-2xl border ${p.color} bg-white shadow-sm flex flex-col justify-between space-y-4`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold font-mono bg-slate-900 text-white">
                    {p.month}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {p.tag}
                  </span>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <Icon className="w-4 h-4 text-emerald-600 shrink-0" />
                  <h3 className="font-extrabold text-xs text-slate-900 leading-snug">
                    {p.title}
                  </h3>
                </div>

                <div className="h-px bg-slate-100 my-2" />

                <ul className="space-y-2 text-xs text-slate-600 leading-relaxed">
                  {p.deliverables.map((d, dIdx) => (
                    <li key={dIdx} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>مایل‌استون کلیدی شماره {idx + 1}</span>
                <span className="font-mono text-emerald-700 font-bold">تکمیل ۴ هفته‌ای</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
