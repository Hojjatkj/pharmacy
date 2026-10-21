import React, { useState } from 'react';
import { B2BExchangeMatch, Pharmacy } from '../types';
import { 
  Sparkles, 
  ArrowRightLeft, 
  TrendingDown, 
  ShieldCheck, 
  Building2, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  RefreshCw,
  Coins,
  ChevronLeft,
  Calendar
} from 'lucide-react';

interface AiExchangeEngineProps {
  matches: B2BExchangeMatch[];
  activePharmacy: Pharmacy;
  onAcceptMatch: (match: B2BExchangeMatch) => void;
  onNavigateToEscrow: (match: B2BExchangeMatch) => void;
}

export const AiExchangeEngine: React.FC<AiExchangeEngineProps> = ({
  matches,
  activePharmacy,
  onAcceptMatch,
  onNavigateToEscrow
}) => {
  const [exchangeList, setExchangeList] = useState<B2BExchangeMatch[]>(matches);
  const [isScanning, setIsScanning] = useState(false);
  const [customQuantities, setCustomQuantities] = useState<Record<string, number>>({});
  const [acceptedMatches, setAcceptedMatches] = useState<Record<string, boolean>>({});

  const triggerRescan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 900);
  };

  const handleQtyChange = (matchId: string, val: number) => {
    setCustomQuantities(prev => ({ ...prev, [matchId]: Math.max(1, val) }));
  };

  const totalLossAvoided = exchangeList.reduce((acc, m) => acc + m.estimatedLossAvoided, 0);

  return (
    <div className="space-y-6 pb-12" id="ai-exchange-engine-view">
      
      {/* Top Value Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 relative overflow-hidden shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Sparkles className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-black">موتور هوش مصنوعی تبادل و بالانس بین‌داروخانه‌ای</h2>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              هوش مصنوعی با پردازش همزمان داده‌های ۳ گانه (<strong>تاریخ انقضا</strong>، <strong>موجودی انبار</strong> و <strong>آهنگ فروش</strong>) در پنل تمام داروخانه‌ها، عدم تعادل زنجیره تأمین را شناسایی کرده و پیش از سوختن سرمایه، مبادله برد-برد پیشنهاد می‌دهد.
            </p>
          </div>

          <div className="flex flex-row md:flex-col items-end gap-3 bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
            <div className="text-left">
              <span className="text-[11px] text-slate-400 block">ارزش سرمایه نجات‌یافته در این سناریو:</span>
              <span className="text-lg font-black text-emerald-400 font-mono">
                {totalLossAvoided.toLocaleString('fa-IR')} <span className="text-xs text-slate-300 font-sans">تومان</span>
              </span>
            </div>
            <button
              onClick={triggerRescan}
              disabled={isScanning}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-medical-600 hover:bg-medical-700 text-xs font-bold text-white transition-all shadow"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
              <span>{isScanning ? 'درحال اسکن انبارها...' : 'اسکن مجدد شبکه داروخانه‌ها'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Matching Opportunities List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>فرصت‌های فعال تبادل هوشمند با سایر داروخانه‌ها</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
              {exchangeList.length} مورد کشف شده
            </span>
          </h3>
          <span className="text-xs text-slate-500">
            داروخانه فعال: {activePharmacy.name}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {exchangeList.map((match) => {
            const isSource = match.sourcePharmacy.id === activePharmacy.id;
            const currentQty = customQuantities[match.id] ?? match.recommendedTransferQty;
            const isAccepted = acceptedMatches[match.id];
            const totalPrice = currentQty * match.aiSuggestedPrice;

            return (
              <div 
                key={match.id} 
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:border-emerald-300 transition-all space-y-4"
                id={`match-card-${match.id}`}
              >
                {/* Header info */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl">
                      {match.product.category === 'supplement' ? '💊' : match.product.category === 'sports_nutrition' ? '🏋️‍♂️' : '✨'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-sm sm:text-base text-slate-900">{match.product.name}</h4>
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                          بچ: {match.batchNumber}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-mono">IRC: {match.product.ircCode} | برند: {match.product.brand}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 rounded-lg text-amber-800 text-xs font-medium border border-amber-200">
                      <Calendar className="w-3.5 h-3.5 text-amber-600" />
                      <span>انقضا: {match.expiryDate}</span>
                    </div>
                    <div className="px-2.5 py-1 bg-emerald-50 rounded-lg text-emerald-800 text-xs font-bold border border-emerald-200">
                      انطباق هوش مصنوعی: {match.matchScore}٪
                    </div>
                  </div>
                </div>

                {/* Transfer Path / Route Visualization */}
                <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
                  {/* Source */}
                  <div className="flex items-center gap-2.5 w-full md:w-auto">
                    <span className="text-base">{match.sourcePharmacy.avatar}</span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-800">{match.sourcePharmacy.name}</span>
                        {isSource && (
                          <span className="bg-medical-600 text-white text-[10px] px-1.5 py-0.2 rounded font-semibold">شما (مبدا)</span>
                        )}
                      </div>
                      <span className="text-slate-500 text-[11px]">{match.sourcePharmacy.city} • مازاد انبار</span>
                    </div>
                  </div>

                  {/* Transfer Indicator */}
                  <div className="flex items-center gap-2 text-emerald-600 font-semibold px-3 py-1 bg-white rounded-lg border border-slate-200 shadow-2xs">
                    <span>انتقال بهینه هوش مصنوعی</span>
                    <ArrowRightLeft className="w-4 h-4" />
                  </div>

                  {/* Target */}
                  <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
                    <div className="text-left">
                      <div className="flex items-center gap-1.5 justify-end">
                        {!isSource && (
                          <span className="bg-medical-600 text-white text-[10px] px-1.5 py-0.2 rounded font-semibold">شما (مقصد)</span>
                        )}
                        <span className="font-bold text-slate-800">{match.targetPharmacy.name}</span>
                      </div>
                      <span className="text-slate-500 text-[11px]">{match.targetPharmacy.city} • کشش بازار بالا ({match.targetDemandVelocity} در روز)</span>
                    </div>
                    <span className="text-base">{match.targetPharmacy.avatar}</span>
                  </div>
                </div>

                {/* AI Reasoning Insight Box */}
                <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200 text-xs text-slate-700 leading-relaxed space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>تحلیل محاسباتی هوش مصنوعی:</span>
                  </div>
                  <p>{match.reasoning}</p>
                </div>

                {/* Financial & Volume Controls */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-3 rounded-xl border border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">قیمت مصوب کاتالوگ:</span>
                    <span className="font-bold text-slate-800 font-mono line-through">
                      {match.originalPrice.toLocaleString('fa-IR')} ت
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">قیمت رقابتی هوش مصنوعی:</span>
                    <div className="flex items-center gap-1">
                      <span className="font-extrabold text-emerald-700 font-mono text-sm">
                        {match.aiSuggestedPrice.toLocaleString('fa-IR')} ت
                      </span>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1 py-0.2 rounded">
                        %{match.discountPercentage}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">تعداد انتقال پیشنهادی:</span>
                    <div className="flex items-center gap-1 mt-0.5">
                      <input
                        type="number"
                        min="1"
                        max={match.availableQuantity}
                        value={currentQty}
                        onChange={(e) => handleQtyChange(match.id, parseInt(e.target.value) || 1)}
                        className="w-16 px-1.5 py-0.5 border border-slate-300 rounded font-mono text-center font-bold text-slate-800 text-xs focus:ring-1 focus:ring-medical-500"
                      />
                      <span className="text-slate-500 text-[11px]">از {match.availableQuantity} موجود</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">مبلغ کل تبادل فاکتور:</span>
                    <span className="font-black text-slate-900 font-mono text-sm">
                      {totalPrice.toLocaleString('fa-IR')} <span className="text-[11px] font-sans font-normal">تومان</span>
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>تضمین سلامت از طریق واریز به درگاه امانی شاپرک</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isAccepted ? (
                      <button
                        onClick={() => onNavigateToEscrow(match)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-all"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>انتقال به درگاه امن امانی جهت تسویه</span>
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setAcceptedMatches(prev => ({ ...prev, [match.id]: true }));
                            onAcceptMatch({ ...match, recommendedTransferQty: currentQty });
                          }}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow transition-all"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>تایید و آغاز فرآیند تبادل B2B</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
