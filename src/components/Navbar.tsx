import React from 'react';
import BrandMark from './BrandMark';

import { ActiveTab, Pharmacy } from '../types';
import { MeResponse } from '../api/auth';

import {
  LayoutDashboard,
  Sparkles,
  Boxes,
  ShieldCheck,
  Store,
  Building2,
  CheckCircle2,
  LogOut,
  UserCircle,
  Users,
} from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  selectedPharmacy: Pharmacy;
  allPharmacies?: Pharmacy[];
  onSelectPharmacy?: (pharmacy: Pharmacy) => void;
  currentUser?: MeResponse | null;
  onProfileClick?: () => void;
  onLogout?: () => void;
}

function roleLabel(
  role: MeResponse['role'],
) {
  switch (role) {
    case 'SUPER_ADMIN':
      return 'مدیر ارشد سامانه';

    case 'PLATFORM_ADMIN':
      return 'مدیر پلتفرم';

    case 'PHARMACY_OWNER':
      return 'مالک داروخانه';

    case 'PHARMACY_STAFF':
      return 'کارمند داروخانه';

    default:
      return role;
  }
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  selectedPharmacy,
  allPharmacies = [],
  onSelectPharmacy,
  currentUser,
  onProfileClick,
  onLogout,
}) => {
  const tabs = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'داشبورد داروخانه',
      icon: LayoutDashboard,
      badge: 'خانه',
    },
    {
      id: 'ai_exchange' as ActiveTab,
      label: 'موتور هوش مصنوعی تبادل B2B',
      icon: Sparkles,
      badge: 'اختصاصی',
    },
    {
      id: 'inventory_mgmt' as ActiveTab,
      label: 'مدیریت موجودی انقضامحور',
      icon: Boxes,
      badge: 'FEFO',
    },
    {
      id: 'escrow_payment' as ActiveTab,
      label: 'درگاه پرداخت امن و امانی',
      icon: ShieldCheck,
      badge: 'شاپرک',
    },
    {
      id: 'storefront_demo' as ActiveTab,
      label: 'ویترین اختصاصی داروخانه',
      icon: Store,
      badge: 'B2C',
    },
  ];

  if (
    currentUser?.role === 'SUPER_ADMIN' ||
    currentUser?.role === 'PLATFORM_ADMIN'
  ) {
    tabs.push({
      id: 'admin_users' as ActiveTab,
      label: 'مدیریت کاربران',
      icon: Users,
      badge: 'Admin',
    });
  }

  return (
    <header
      className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur"
      id="main-header"
    >
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <BrandMark size={40} className="shrink-0 rounded-xl shadow-md" />

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
                  سامانه دارویی PharmArt
                </h1>

                <span className="rounded-full border border-medical-300 bg-medical-100 px-2 py-0.5 text-xs font-semibold text-medical-800">
                  نسخه ۳.۲ عملیاتی
                </span>
              </div>

              <p className="text-xs font-medium text-slate-500">
                طرح جامع پلتفرم مکمل‌ها، تبادل هوشمند بین داروخانه‌ای
                (B2B) و پرداخت امانی
              </p>
            </div>
          </div>

          {/* Pharmacy + Profile + Logout */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-1.5 text-xs">
              <div className="flex items-center gap-1.5 pr-2 text-slate-600">
                <Building2 className="h-4 w-4 text-medical-600" />

                <span className="font-medium text-slate-700">
                  داروخانه فعال:
                </span>
              </div>

              <select
                id="pharmacy-selector"
                value={selectedPharmacy.id}
                onChange={(event) => {
                  const found = allPharmacies.find(
                    (pharmacy) =>
                      pharmacy.id === event.target.value,
                  );

                  if (found && onSelectPharmacy) {
                    onSelectPharmacy(found);
                  }
                }}
                disabled={allPharmacies.length === 0}
                className="cursor-pointer rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-medical-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {allPharmacies.map((pharmacy) => (
                  <option
                    key={pharmacy.id}
                    value={pharmacy.id}
                  >
                    {pharmacy.avatar} {pharmacy.name} (
                    {pharmacy.city})
                  </option>
                ))}
              </select>

              <div className="flex items-center gap-1 rounded-lg border border-medical-200 bg-medical-50 px-2 py-1 text-[11px] font-medium text-medical-700">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>پروانه فعال</span>
              </div>
            </div>

            {currentUser && onProfileClick && (
              <button
                type="button"
                onClick={onProfileClick}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-right transition hover:border-medical-200 hover:bg-medical-50"
                title="پروفایل کاربری"
              >
                <UserCircle className="h-5 w-5 text-medical-600" />

                <span className="max-w-[180px]">
                  <span
                    dir="ltr"
                    className="block truncate text-xs font-bold text-slate-700"
                  >
                    {currentUser.email}
                  </span>

                  <span className="mt-0.5 block text-[10px] font-medium text-slate-400">
                    {roleLabel(currentUser.role)}
                  </span>
                </span>
              </button>
            )}

            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                title="خروج از حساب"
              >
                <LogOut className="h-4 w-4" />
                <span>خروج</span>
              </button>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav
          className="scrollbar-none mt-3 flex items-center gap-1 overflow-x-auto pb-1 sm:gap-2"
          id="main-navigation-tabs"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                id={`tab-btn-${tab.id}`}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-medical-600 text-white shadow-sm shadow-medical-200'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon
                  className={`h-4 w-4 ${
                    isActive
                      ? 'text-white'
                      : 'text-slate-500'
                  }`}
                />

                <span>{tab.label}</span>

                {tab.badge && (
                  <span
                    className={`rounded px-1.5 py-0.5 font-mono text-[10px] ${
                      isActive
                        ? 'bg-medical-700 text-medical-100'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};