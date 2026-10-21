import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import {
  BarChart3,
  Boxes,
  Building2,
  CheckCircle2,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Menu,
  ShieldCheck,
  Sparkles,
  Store,
  Tag,
  UserCircle,
  Users,
  WifiOff,
  X,
} from 'lucide-react';

import BrandMark from './BrandMark';
import { ActiveTab, Pharmacy } from '../types';
import { MeResponse } from '../api/auth';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

interface AppShellProps {
  children: ReactNode;
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  selectedPharmacy: Pharmacy;
  allPharmacies: Pharmacy[];
  onSelectPharmacy: (pharmacy: Pharmacy) => void;
  currentUser?: MeResponse | null;
  onProfileClick?: () => void;
  onLogout?: () => void;
}

interface NavItem {
  id: ActiveTab;
  label: string;
  icon: typeof LayoutDashboard;
}

const MAIN_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'داشبورد', icon: LayoutDashboard },
  { id: 'inventory_mgmt', label: 'موجودی', icon: Boxes },
  { id: 'ai_exchange', label: 'تبادل B2B', icon: Sparkles },
  { id: 'escrow_payment', label: 'پرداخت امانی', icon: ShieldCheck },
  { id: 'storefront_demo', label: 'ویترین', icon: Store },
];

const ROLE_LABELS: Record<MeResponse['role'], string> = {
  SUPER_ADMIN: 'مدیر ارشد سامانه',
  PLATFORM_ADMIN: 'مدیر پلتفرم',
  PHARMACY_OWNER: 'مالک داروخانه',
  PHARMACY_STAFF: 'کارمند داروخانه',
  USER: 'مشتری',
};

function SidebarNav({
  activeTab,
  onTabChange,
  currentUser,
  onProfileClick,
  onLogout,
}: Pick<AppShellProps, 'activeTab' | 'onTabChange' | 'currentUser' | 'onProfileClick' | 'onLogout'>) {
  const isPlatformAdmin =
    currentUser?.role === 'SUPER_ADMIN' || currentUser?.role === 'PLATFORM_ADMIN';

  const renderNavButton = (item: NavItem) => {
    const Icon = item.icon;
    const active = activeTab === item.id;

    return (
      <button
        key={item.id}
        type="button"
        onClick={() => onTabChange(item.id)}
        aria-current={active ? 'page' : undefined}
        className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-right text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
          active
            ? 'bg-emerald-500/15 text-emerald-300 shadow-sm ring-1 ring-emerald-400/20'
            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
        }`}
      >
        <Icon
          className={`h-5 w-5 ${active ? 'text-emerald-300' : 'text-slate-400'}`}
          aria-hidden="true"
        />
        <span>{item.label}</span>
      </button>
    );
  };

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-slate-700 px-5 py-5">
        <div className="flex items-center gap-3">
          <BrandMark size={44} className="shrink-0 rounded-xl shadow-sm" />

          <div className="min-w-0">
            <div className="truncate text-sm font-black text-white">PharmArt</div>
            <div className="mt-0.5 text-[11px] font-medium text-slate-400">
              مرکز تصمیم‌گیری داروخانه
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-5">
        <div className="mb-3 px-3 text-[11px] font-black text-slate-400">خدمات</div>

        <nav aria-label="ناوبری اصلی" className="space-y-1">
          {MAIN_ITEMS.map(renderNavButton)}
        </nav>

        <div className="my-5 border-t border-slate-700" />

        <nav aria-label="گزارش‌ها" className="space-y-1">
          <button
            type="button"
            onClick={() => onTabChange('operational_plan')}
            aria-current={activeTab === 'operational_plan' ? 'page' : undefined}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-right text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
              activeTab === 'operational_plan'
                ? 'bg-emerald-500/15 text-emerald-300 shadow-sm ring-1 ring-emerald-400/20'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <BarChart3 className="h-5 w-5 text-slate-400" aria-hidden="true" />
            <span>طرح عملیاتی</span>
          </button>
        </nav>

        {isPlatformAdmin && (
          <>
            <div className="my-5 border-t border-slate-700" />

            <div className="mb-3 px-3 text-[11px] font-black text-slate-400">
              مدیریت سیستم
            </div>

            <nav aria-label="مدیریت سیستم" className="space-y-1">
              <button
                type="button"
                onClick={() => onTabChange('admin_users')}
                aria-current={activeTab === 'admin_users' ? 'page' : undefined}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-right text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                  activeTab === 'admin_users'
                    ? 'bg-emerald-500/15 text-emerald-300 shadow-sm ring-1 ring-emerald-400/20'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Users className="h-5 w-5 text-slate-400" aria-hidden="true" />
                <span>مدیریت کاربران</span>
              </button>

              <button
                type="button"
                onClick={() => onTabChange('promotions')}
                aria-current={activeTab === 'promotions' ? 'page' : undefined}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-right text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                  activeTab === 'promotions'
                    ? 'bg-emerald-500/15 text-emerald-300 shadow-sm ring-1 ring-emerald-400/20'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Tag className="h-5 w-5 text-slate-400" aria-hidden="true" />
                <span>مدیریت کمپین‌ها</span>
              </button>
            </nav>
          </>
        )}
      </div>

      <div className="border-t border-slate-700 p-4">
        {currentUser && (
          <button
            type="button"
            onClick={onProfileClick}
            className="mb-2 flex w-full items-center gap-3 rounded-xl p-2 text-right transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            <UserCircle className="h-8 w-8 shrink-0 text-medical-400" aria-hidden="true" />

            <span className="min-w-0 flex-1">
              <span dir="ltr" className="block truncate text-xs font-bold text-white">
                {currentUser.email}
              </span>

              <span className="mt-1 block text-[11px] text-slate-400">
                {ROLE_LABELS[currentUser.role]}
              </span>
            </span>
          </button>
        )}

        {onLogout && (
          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-300 transition hover:bg-rose-500/10 hover:text-rose-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            خروج از حساب
          </button>
        )}
      </div>
    </div>
  );
}

export function AppShell({
  children,
  activeTab,
  onTabChange,
  selectedPharmacy,
  allPharmacies,
  onSelectPharmacy,
  currentUser,
  onProfileClick,
  onLogout,
}: AppShellProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const online = useOnlineStatus();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const isPlatformAdmin =
    currentUser?.role === 'SUPER_ADMIN' || currentUser?.role === 'PLATFORM_ADMIN';

  const handleTabChange = useCallback(
    (tab: ActiveTab) => {
      onTabChange(tab);
      setMobileNavOpen(false);
    },
    [onTabChange],
  );

  useEffect(() => {
    if (!mobileNavOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileNavOpen(false);
      }
    };

    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [mobileNavOpen]);

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 text-slate-900">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:right-4 focus:top-4 focus:z-[200] focus:rounded-xl focus:bg-slate-900 focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-white"
      >
        پرش به محتوای اصلی
      </a>

      {!online && (
        <div
          role="status"
          className="flex items-center justify-center gap-2 bg-amber-100 px-4 py-2 text-xs font-bold text-amber-900"
        >
          <WifiOff className="h-4 w-4" aria-hidden="true" />
          اتصال اینترنت قطع است؛ تغییرات ذخیره نمی‌شوند.
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 right-0 z-40 hidden w-64 border-l border-slate-700 bg-slate-900 text-white lg:block">
        <SidebarNav
          activeTab={activeTab}
          onTabChange={handleTabChange}
          currentUser={currentUser}
          onProfileClick={onProfileClick}
          onLogout={onLogout}
        />
      </aside>

      {/* Mobile drawer */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="بستن منو"
            onClick={() => setMobileNavOpen(false)}
            className="absolute inset-0 h-full w-full bg-slate-950/60"
          />

          <div
            id="mobile-navigation"
            role="dialog"
            aria-modal="true"
            aria-label="منوی اصلی"
            className="absolute inset-y-0 right-0 flex w-72 max-w-[85%] flex-col bg-slate-900 text-white shadow-2xl"
          >
            <button
              ref={closeButtonRef}
              type="button"
              onClick={() => setMobileNavOpen(false)}
              aria-label="بستن منو"
              className="absolute left-3 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>

            <SidebarNav
              activeTab={activeTab}
              onTabChange={handleTabChange}
              currentUser={currentUser}
              onProfileClick={onProfileClick}
              onLogout={onLogout}
            />
          </div>
        </div>
      )}

      <div className="lg:ms-64">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
          <div className="flex min-h-16 items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-2">
              <button
                type="button"
                onClick={() => setMobileNavOpen(true)}
                aria-label="باز کردن منو"
                aria-expanded={mobileNavOpen}
                aria-controls="mobile-navigation"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medical-500 lg:hidden"
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
              </button>

              <div className="min-w-0">
                <div className="text-[11px] font-bold text-slate-400">داروخانه فعال</div>

                <div className="mt-0.5 flex min-w-0 items-center gap-2">
                  <Building2 className="h-4 w-4 shrink-0 text-medical-600" aria-hidden="true" />

                  {isPlatformAdmin && allPharmacies.length > 0 ? (
                    <select
                      aria-label="انتخاب داروخانه فعال"
                      value={selectedPharmacy.id}
                      onChange={(event) => {
                        const pharmacy = allPharmacies.find(
                          (item) => item.id === event.target.value,
                        );

                        if (pharmacy) {
                          onSelectPharmacy(pharmacy);
                        }
                      }}
                      className="max-w-[220px] cursor-pointer truncate border-0 bg-transparent p-0 text-sm font-black text-slate-900 outline-none focus:ring-0"
                    >
                      {allPharmacies.map((pharmacy) => (
                        <option key={pharmacy.id} value={pharmacy.id}>
                          {pharmacy.avatar} {pharmacy.name} ({pharmacy.city})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span
                      className="truncate text-sm font-black text-slate-900"
                      title={selectedPharmacy.name}
                    >
                      {selectedPharmacy.name}
                    </span>
                  )}

                  <CheckCircle2
                    className="h-4 w-4 shrink-0 text-medical-500"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <div className="hidden rounded-xl bg-slate-50 px-3 py-2 text-[11px] font-bold text-slate-500 sm:flex sm:items-center sm:gap-2">
                <ClipboardList className="h-4 w-4 text-medical-600" aria-hidden="true" />
                مرکز تصمیم‌گیری
              </div>

              <button
                type="button"
                onClick={onProfileClick}
                aria-label="پروفایل کاربر"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white transition hover:border-medical-200 hover:bg-medical-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medical-500"
              >
                <UserCircle className="h-5 w-5 text-medical-600" aria-hidden="true" />
              </button>
            </div>
          </div>
        </header>

        <main
          id="main-content"
          tabIndex={-1}
          className="min-h-[calc(100vh-64px)] p-4 outline-none sm:p-6 lg:p-8"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
