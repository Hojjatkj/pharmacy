import React, { useState } from 'react';
import { B2BExchangeMatch, EscrowTransaction } from '../types';
import { 
  ShieldCheck, 
  Lock, 
  Truck, 
  CheckCircle2, 
  CreditCard, 
  ArrowRight, 
  AlertCircle, 
  Building, 
  QrCode,
  Sparkles,
  DollarSign,
  KeyRound
} from 'lucide-react';

interface EscrowPaymentSimulatorProps {
  selectedMatch: B2BExchangeMatch | null;
}

export const EscrowPaymentSimulator: React.FC<EscrowPaymentSimulatorProps> = ({
  selectedMatch
}) => {
  // Mock transaction based on selected match or default
  const defaultTotal = selectedMatch ? selectedMatch.recommendedTransferQty * selectedMatch.aiSuggestedPrice : 49725000;
  const platformFee = Math.round(defaultTotal * 0.025); // 2.5% platform fee
  const logisticsFee = 250000; // Flat courier shipping
  const sellerPayout = defaultTotal - platformFee;

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(2);
  const [otpInput, setOtpInput] = useState('734912');
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  const handleAdvanceStep = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => (prev + 1) as any);
    }
  };

  const handleVerifyOtp = () => {
    setIsOtpVerified(true);
    setCurrentStep(4);
  };

  return (
    <div className="space-y-6 pb-12" id="escrow-payment-view">
      
      {/* Header Info */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
              <Lock className="w-3 h-3" />
              <span>پروتکل تسویه امانی شاپرک (Shaparak Escrow Architecture)</span>
            </div>
            <h2 className="text-xl font-black">درگاه پرداخت امن و سیستم امانی تبادل کالا</h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              وجه تراکنش تا زمان رسیدن فیزیکی محموله و تطبیق اصالت توسط داروساز مسئول فنی در حساب واسط امانی مسدود می‌ماند. پس از تایید نهایی، تسویه هوشمند شبا انجام می‌شود.
            </p>
          </div>

          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 text-left min-w-[220px]">
            <span className="text-[11px] text-slate-400 block">ارزش کل فاکتور در گردش:</span>
            <div className="text-xl font-black text-emerald-400 font-mono">
              {defaultTotal.toLocaleString('fa-IR')} <span className="text-xs text-slate-300 font-sans font-normal">تومان</span>
            </div>
            <span className="text-[10px] text-emerald-300 block mt-1">تضمین شده توسط پروتکل چندامضایی</span>
          </div>
        </div>
      </div>

      {/* 4-Step Interactive Pipeline */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>چرخه حیات تراکنش امانی (Escrow Lifecycle Pipeline)</span>
          </h3>
          <span className="text-xs font-semibold text-slate-500">
            مرحله فعلی: {currentStep} از ۴
          </span>
        </div>

        {/* Visual Stepper */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {[
            { step: 1, title: 'واریز به حساب امانی', desc: 'تایید پیش‌فاکتور توسط خریدار و مسدودی وجه در شاپرک', icon: CreditCard },
            { step: 2, title: 'ارسال با پلمپ و رهگیری', desc: 'تحویل به ناوگان حمل تخصصی دارویی همراه با بارنامه', icon: Truck },
            { step: 3, title: 'اسکن IRC و احراز OTP', desc: 'بازرسی فیزیکی، استعلام سلامت و صدور کد تایید', icon: QrCode },
            { step: 4, title: 'تسهیم آنی شبا (Split)', desc: 'آزادسازی وجه به حساب فروشنده و کارمزد پلتفرم', icon: CheckCircle2 },
          ].map((s) => {
            const Icon = s.icon;
            const isDone = currentStep > s.step;
            const isCurrent = currentStep === s.step;

            return (
              <div
                key={s.step}
                onClick={() => setCurrentStep(s.step as any)}
                className={`p-4 rounded-xl border text-xs cursor-pointer transition-all ${
                  isCurrent
                    ? 'border-emerald-500 bg-emerald-50/50 shadow-sm ring-2 ring-emerald-500/20'
                    : isDone
                    ? 'border-slate-200 bg-slate-50'
                    : 'border-slate-100 bg-white opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                    isDone 
                      ? 'bg-medical-600 text-white'
                      : isCurrent 
                      ? 'bg-slate-900 text-white' 
                      : 'bg-slate-200 text-slate-600'
                  }`}>
                    {isDone ? '✓' : s.step}
                  </span>
                  <Icon className={`w-4 h-4 ${isCurrent ? 'text-emerald-600' : 'text-slate-400'}`} />
                </div>
                <div className="font-bold text-slate-900 mb-1">{s.title}</div>
                <p className="text-[11px] text-slate-500 leading-normal">{s.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Interactive Step Content Area */}
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-4">
          
          {/* Step 1 Details */}
          {currentStep === 1 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800">وضعیت: انتظار برای پرداخت خریدار</span>
                <span className="text-amber-700 bg-amber-100 px-2 py-0.5 rounded font-mono">شناسه پرداخت: SHP-98412093</span>
              </div>
              <p className="text-xs text-slate-600">
                داروخانه خریدار به درگاه امن متصل می‌شود. وجه در شبستان امن واسط بانک مرکزی ثبت شده و فروشنده اجازه ارسال بار را دریافت می‌کند.
              </p>
              <button 
                onClick={handleAdvanceStep}
                className="px-4 py-2 bg-medical-600 hover:bg-medical-700 text-white rounded-lg text-xs font-bold shadow"
              >
                شبیه‌سازی واریز موفق به حساب امانی
              </button>
            </div>
          )}

          {/* Step 2 Details */}
          {currentStep === 2 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800">وضعیت: کالا در مسیر تحویل فیزیکی است</span>
                <span className="text-blue-700 bg-blue-100 px-2 py-0.5 rounded font-mono">کد رهگیری پست/پیک: TRK-140288</span>
              </div>
              <p className="text-xs text-slate-600">
                محموله مکمل‌ها با رعایت زنجیره دما و پلمپ امن تحویل سفیر لجستیک شده است. داروخانه خریدار می‌تواند لحظه‌ای موقعیت را رصد کند.
              </p>
              <button 
                onClick={handleAdvanceStep}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold shadow"
              >
                اعلام رسیدن بار به داروخانه مقصد
              </button>
            </div>
          )}

          {/* Step 3 Details */}
          {currentStep === 3 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800">مرحله حیاتی: بازرسی سلامت فیزیکی و اسکن کد IRC</span>
                <span className="text-purple-700 bg-purple-100 px-2 py-0.5 rounded">نیاز به تایید مسئول فنی</span>
              </div>
              <p className="text-xs text-slate-600">
                دکتر مسئول فنی داروخانه مقصد بارکد جعبه‌ها را بررسی نموده و کد تایید یکبار مصرف پیامک‌شده به شماره نظام پزشکی را وارد می‌نماید:
              </p>
              
              <div className="flex items-center gap-3 max-w-sm pt-1">
                <div className="relative flex-1">
                  <KeyRound className="w-4 h-4 absolute right-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    placeholder="کد ۶ رقمی OTP"
                    className="w-full pl-3 pr-9 py-2 bg-white border border-slate-300 rounded-lg font-mono text-center font-bold text-slate-900 tracking-widest text-sm focus:ring-2 focus:ring-medical-500"
                  />
                </div>
                <button
                  onClick={handleVerifyOtp}
                  className="px-4 py-2 bg-medical-600 hover:bg-medical-700 text-white text-xs font-bold rounded-lg shadow whitespace-nowrap"
                >
                  تایید اصالت کالا و صدور حواله
                </button>
              </div>
            </div>
          )}

          {/* Step 4 Details */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>تراکنش با موفقیت تسویه و تسهیم شد!</span>
              </div>
              <p className="text-xs text-slate-600">
                سیستم با بهره‌گیری از API تسهیم هوشمند (Split Payment)، وجه امانی را تفکیک و به مقاصد بانکی واریز نمود:
              </p>

              {/* Split Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <span className="text-[11px] text-slate-400 block">واریز خالص به شبای فروشنده:</span>
                  <span className="text-sm font-black text-slate-900 font-mono mt-0.5 block">
                    {sellerPayout.toLocaleString('fa-IR')} تومان
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">IR980170000000123456789001</span>
                </div>

                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <span className="text-[11px] text-slate-400 block">کارمزد پلتفرم (۲.۵٪):</span>
                  <span className="text-sm font-black text-emerald-700 font-mono mt-0.5 block">
                    {platformFee.toLocaleString('fa-IR')} تومان
                  </span>
                  <span className="text-[10px] text-slate-500">سرویس مچینگ و انبارداری</span>
                </div>

                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <span className="text-[11px] text-slate-400 block">هزینه لجستیک و بیمه حمل:</span>
                  <span className="text-sm font-black text-blue-700 font-mono mt-0.5 block">
                    {logisticsFee.toLocaleString('fa-IR')} تومان
                  </span>
                  <span className="text-[10px] text-slate-500">ناوگان دارویی امین</span>
                </div>
              </div>

              <button
                onClick={() => setCurrentStep(1)}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 underline"
              >
                اجرای مجدد شبیه‌ساز چرخه پرداخت
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
