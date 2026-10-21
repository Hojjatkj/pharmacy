import React, {
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  getMe,
  logout,
  MeResponse,
} from './api/auth';

import {
  getInventory,
} from './api/inventory';

import {
  getPharmacies,
} from './api/pharmacies';

import {
  getProducts,
} from './api/products';

import {
  ActiveTab,
  Pharmacy,
  PharmacyStockItem,
  ProductItem,
} from './types';

import { AppShell } from './components/AppShell';
import { FullPageLoader, StartupError } from './components/FullPageStates';
import { Modal } from './components/Modal';
import { createExchangeOffer } from './api/exchange';
import {
  ACCESS_TOKEN_KEY,
  getAccessToken,
  isTokenExpired,
} from './lib/auth-token';
import { getUserMessage, isUnauthorized } from './lib/errors';
import { reportError } from './lib/telemetry';
import { UNAUTHORIZED_EVENT } from './api/client';

const LoginPage = lazy(() =>
  import('./components/LoginPage').then((m) => ({ default: m.LoginPage })),
);
const PublicLandingPage = lazy(() =>
  import('./components/PublicLandingPage').then((m) => ({ default: m.PublicLandingPage })),
);
const RegisterPage = lazy(() =>
  import('./components/RegisterPage').then((m) => ({ default: m.RegisterPage })),
);
const PublicProductCatalog = lazy(() => import('./components/PublicProductCatalog'));
const CustomerRegisterPage = lazy(() => import('./components/CustomerRegisterPage'));
const CustomerStorefront = lazy(() => import('./components/CustomerStorefront'));
const ProfilePage = lazy(() => import('./components/ProfilePage').then((m) => ({ default: m.ProfilePage })));
const InventoryManager = lazy(() => import('./components/InventoryManager').then((m) => ({ default: m.InventoryManager })));
const ExchangeManager = lazy(() => import('./components/ExchangeManager').then((m) => ({ default: m.ExchangeManager })));
const EscrowPaymentSimulator = lazy(() => import('./components/EscrowPaymentSimulator').then((m) => ({ default: m.EscrowPaymentSimulator })));
const OperationalPlanView = lazy(() => import('./components/OperationalPlanView').then((m) => ({ default: m.OperationalPlanView })));
const PharmacyDashboard = lazy(() => import('./components/PharmacyDashboard').then((m) => ({ default: m.PharmacyDashboard })));
const StorefrontPreview = lazy(() => import('./components/StorefrontPreview').then((m) => ({ default: m.StorefrontPreview })));
const AdminUsersPage = lazy(() => import('./components/AdminUsersPage').then((m) => ({ default: m.AdminUsersPage })));
const PromotionCampaignManager = lazy(() => import('./components/PromotionCampaignManager'));

const EMPTY_PLATFORM_PHARMACY: Pharmacy = {
  id: '',
  name: 'مدیریت پلتفرم',
  licenseNumber: '',
  technicalManager: '',
  city: '',
  province: '',
  address: '',
  phone: '',
  trustScore: 0,
  activeB2BExchange: false,
  avatar: '',
};

const IDLE_WARNING_MS = 18 * 60 * 1000;
const IDLE_TIMEOUT_MS = 20 * 60 * 1000;
const IDLE_WARNING_SECONDS =
  Math.floor((IDLE_TIMEOUT_MS - IDLE_WARNING_MS) / 1000);

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] =
    useState<ActiveTab>('dashboard');

  const [currentUser, setCurrentUser] =
    useState<MeResponse | null>(null);

  const [authScreen, setAuthScreen] =
    useState<'login' | 'register' | 'customer-register'>('login');

  const [showPublicLanding, setShowPublicLanding] =
    useState(true);

  const [showPublicCatalog, setShowPublicCatalog] =
    useState(false);



  const [authenticated, setAuthenticated] = useState(() => {
    const token = getAccessToken();

    return Boolean(token) && !isTokenExpired(token);
  });

  const [startupError, setStartupError] = useState<string | null>(null);
  const [sessionNotice, setSessionNotice] = useState<string | null>(null);
  const requestSequence = useRef(0);

  // Keep browser Back/Forward synchronized with public landing and catalog.
  useEffect(() => {
    if (authenticated) return;

    const currentState = window.history.state;
    if (!currentState?.pharmartPublicPage) {
      window.history.replaceState(
        { ...(currentState ?? {}), pharmartPublicPage: 'landing' },
        '',
        window.location.href,
      );
    }

    const handlePublicHistory = (event: PopStateEvent) => {
      const page = event.state?.pharmartPublicPage;

      if (page === 'landing' || page === 'catalog') {
        setAuthScreen('login');
        setShowPublicLanding(page === 'landing');
        setShowPublicCatalog(page === 'catalog');
      }
    };

    window.addEventListener('popstate', handlePublicHistory);
    return () => window.removeEventListener('popstate', handlePublicHistory);
  }, [authenticated]);

  const [loading, setLoading] =
    useState(true);



  const lastActivityRef =
    useRef(Date.now());

  const [showIdleWarning, setShowIdleWarning] =
    useState(false);

  const [idleSecondsLeft, setIdleSecondsLeft] =
    useState(IDLE_WARNING_SECONDS);
  const initialLoadStartedRef =
    useRef(false);

  const [error, setError] =
    useState<string | null>(null);

  const [pharmacies, setPharmacies] =
    useState<Pharmacy[]>([]);

  const [products, setProducts] =
    useState<ProductItem[]>([]);

  const [stockItems, setStockItems] =
    useState<PharmacyStockItem[]>([]);

  const [selectedPharmacy, setSelectedPharmacy] =
    useState<Pharmacy | null>(null);

  const [showProfile, setShowProfile] =
    useState(false);

  /*
   * بارگذاری اطلاعات Backend
   *
   * نکته مهم:
   * این تابع به selectedPharmacy وابسته نیست.
   * بنابراین تغییر selectedPharmacy باعث loop
   * در useEffect نمی‌شود.
   */
  const clearSession = useCallback(
    (options: { notice?: string; goToCatalog?: boolean } = {}) => {
      logout();

      initialLoadStartedRef.current = false;
      requestSequence.current += 1;

      setAuthenticated(false);
      setCurrentUser(null);
      setPharmacies([]);
      setProducts([]);
      setStockItems([]);
      setSelectedPharmacy(null);
      setShowProfile(false);
      setActiveTab('operational_plan');
      setError(null);
      setStartupError(null);
      setLoading(false);
      setAuthScreen('login');
      setSessionNotice(options.notice ?? null);

      if (options.goToCatalog) {
        setShowPublicCatalog(true);
        setShowPublicLanding(false);
      } else {
        setShowPublicCatalog(false);
        setShowPublicLanding(false);
      }
    },
    [],
  );

  /*
   * Loads the session and all data required by the authenticated shell.
   *
   * A sequence guard prevents a slow response for a previously selected
   * pharmacy from overwriting the data of the currently selected one.
   */
  const loadBackendData = useCallback(
    async (user?: MeResponse, pharmacyIdOverride?: string) => {
      const sequence = ++requestSequence.current;

      setLoading(true);
      setError(null);
      setStartupError(null);

      try {
        const me = user ?? (await getMe());

        if (sequence !== requestSequence.current) return;

        setCurrentUser(me);

        /*
         * USER is a retail customer and must never enter the pharmacy
         * operational UI. The storefront has its own data path.
         */
        if (me.role === 'USER') {
          setPharmacies([]);
          setStockItems([]);
          setProducts([]);
          setSelectedPharmacy(null);
          return;
        }

        const pharmacyData = await getPharmacies();

        if (sequence !== requestSequence.current) return;

        const isPlatformAdmin =
          me.role === 'SUPER_ADMIN' || me.role === 'PLATFORM_ADMIN';

        const inventoryPharmacyId = isPlatformAdmin
          ? pharmacyIdOverride ?? pharmacyData[0]?.id
          : me.pharmacyId ?? undefined;

        const [inventoryData, productData] = await Promise.all([
          getInventory(inventoryPharmacyId),
          getProducts(),
        ]);

        if (sequence !== requestSequence.current) return;

        setPharmacies(pharmacyData);
        setStockItems(inventoryData);
        setProducts(productData);

        if (isPlatformAdmin) {
          const targetPharmacy =
            pharmacyData.find((pharmacy) => pharmacy.id === inventoryPharmacyId) ??
            pharmacyData[0] ??
            null;

          setSelectedPharmacy(targetPharmacy);
        } else {
          const ownPharmacy = me.pharmacyId
            ? pharmacyData.find((pharmacy) => pharmacy.id === me.pharmacyId) ?? null
            : null;

          setSelectedPharmacy(ownPharmacy);
        }
      } catch (err) {
        if (sequence !== requestSequence.current) return;

        reportError('loadBackendData', err);

        if (isUnauthorized(err)) {
          clearSession({
            notice: 'نشست شما منقضی شده است. لطفاً دوباره وارد شوید.',
          });
          return;
        }

        const message = getUserMessage(err, 'دریافت اطلاعات سامانه انجام نشد.');

        setStartupError(message);
        setError(message);
      } finally {
        if (sequence === requestSequence.current) {
          setLoading(false);
        }
      }
    },
    [clearSession],
  );

  /*
   * Refresh فقط Inventory
   *
   * بعد از Excel Import لازم نیست کل Backend Data
   * دوباره بارگذاری شود؛ فقط موجودی Pharmacy فعال
   * از Backend خوانده می‌شود.
   */
  const refreshInventory = useCallback(
    async (pharmacyId?: string) => {
      const targetPharmacyId =
        pharmacyId ??
        selectedPharmacy?.id ??
        (currentUser?.role !== 'SUPER_ADMIN' &&
        currentUser?.role !== 'PLATFORM_ADMIN'
          ? currentUser?.pharmacyId
          : undefined);

      if (!targetPharmacyId) {
        return;
      }

      try {
        const inventoryData = await getInventory(targetPharmacyId);
        setStockItems(inventoryData);
        setError(null);
      } catch (err) {
        reportError('refreshInventory', err);

        if (isUnauthorized(err)) {
          clearSession({ notice: 'نشست شما منقضی شده است. لطفاً دوباره وارد شوید.' });
          return;
        }

        setError(getUserMessage(err, 'به‌روزرسانی موجودی انجام نشد.'));
      }
    },
    [clearSession, currentUser, selectedPharmacy],
  );

  /*
   * بعد از Login فقط authenticated تغییر می‌کند.
   *
   * loadBackendData در اینجا صدا زده نمی‌شود،
   * چون useEffect مسئول Load اولیه است.
   *
   * این کار مشکل پرش صفحه را برطرف می‌کند.
   */
  const handleLoginSuccess = useCallback(() => {
    setSessionNotice(null);
    initialLoadStartedRef.current = false;
    setAuthenticated(true);
  }, []);

  const extendSession = useCallback(() => {
    lastActivityRef.current = Date.now();
    setShowIdleWarning(false);
    setIdleSecondsLeft(IDLE_WARNING_SECONDS);
  }, []);

  useEffect(() => {
    if (!authenticated) {
      initialLoadStartedRef.current = false;
      setLoading(false);
      return;
    }

    if (initialLoadStartedRef.current) {
      return;
    }

    initialLoadStartedRef.current = true;

    void loadBackendData();
  }, [
    authenticated,
    loadBackendData,
  ]);
  /*
   * Logout
   */
  const handleLogout = useCallback(() => {
    clearSession({ goToCatalog: true });
  }, [clearSession]);

  /*
   * Session hardening:
   * - any 401 from the API ends the local session exactly once
   * - logging out in one tab logs out the other tabs
   * - an expired JWT is detected before the next request
   */
  useEffect(() => {
    if (!authenticated) return undefined;

    const endSession = () =>
      clearSession({
        notice: 'نشست شما منقضی شده است. لطفاً دوباره وارد شوید.',
      });

    const onStorage = (event: StorageEvent) => {
      if (event.key === ACCESS_TOKEN_KEY && !event.newValue) {
        endSession();
      }
    };

    const checkExpiry = () => {
      if (document.visibilityState === 'visible' && isTokenExpired()) {
        endSession();
      }
    };

    window.addEventListener(UNAUTHORIZED_EVENT, endSession);
    window.addEventListener('storage', onStorage);
    document.addEventListener('visibilitychange', checkExpiry);

    const interval = window.setInterval(checkExpiry, 30_000);

    return () => {
      window.removeEventListener(UNAUTHORIZED_EVENT, endSession);
      window.removeEventListener('storage', onStorage);
      document.removeEventListener('visibilitychange', checkExpiry);
      window.clearInterval(interval);
    };
  }, [authenticated, clearSession]);

  /*
   * تغییر Pharmacy فقط برای PLATFORM_ADMIN
   *
   * با تغییر Pharmacy:
   * - Pharmacy انتخاب می‌شود
   * - Inventory همان Pharmacy از Backend خوانده می‌شود
   */

    useEffect(() => {
      if (!authenticated) {
        setShowIdleWarning(false);
        setIdleSecondsLeft(IDLE_WARNING_SECONDS);
        return;
      }

      lastActivityRef.current = Date.now();
      setShowIdleWarning(false);
      setIdleSecondsLeft(IDLE_WARNING_SECONDS);

      const markActivity = () => {
        lastActivityRef.current = Date.now();

        setShowIdleWarning(false);
        setIdleSecondsLeft(IDLE_WARNING_SECONDS);
      };

      const events = [
        'mousedown',
        'keydown',
        'scroll',
        'touchstart',
        'pointerdown',
      ];

      events.forEach((eventName) => {
        window.addEventListener(
          eventName,
          markActivity,
          { passive: true },
        );
      });

      const interval = window.setInterval(() => {
        const idleFor =
          Date.now() -
          lastActivityRef.current;

        if (idleFor >= IDLE_TIMEOUT_MS) {
          window.clearInterval(interval);
          setShowIdleWarning(false);
          clearSession({
            goToCatalog: true,
            notice: 'به دلیل عدم فعالیت از حساب خارج شدید.',
          });
          return;
        }

        if (idleFor >= IDLE_WARNING_MS) {
          const remaining = Math.max(
            0,
            Math.ceil(
              (IDLE_TIMEOUT_MS - idleFor) /
                1000,
            ),
          );

          setIdleSecondsLeft(remaining);
          setShowIdleWarning(true);
        }
      }, 1000);

      return () => {
        window.clearInterval(interval);

        events.forEach((eventName) => {
          window.removeEventListener(
            eventName,
            markActivity,
          );
        });
      };
    }, [
      authenticated,
      clearSession,
    ]);
  const handleSelectPharmacy =
    useCallback(
      (pharmacy: Pharmacy) => {
        if (
          currentUser?.role !== 'SUPER_ADMIN' &&
          currentUser?.role !== 'PLATFORM_ADMIN'
        ) {
          return;
        }

        setSelectedPharmacy(
          pharmacy,
        );

        void loadBackendData(
          currentUser,
          pharmacy.id,
        );
      },
      [
        currentUser,
        loadBackendData,
      ],
    );

  /*
   * چون Backend برای Non-Admin فقط موجودی
   * Pharmacy خودش را برمی‌گرداند، این فیلتر
   * یک لایه دفاعی اضافی در UI است.
   */
  const visibleStockItems =
    useMemo(() => {
      if (!selectedPharmacy) {
        return [];
      }

      return stockItems.filter(
        (item) =>
          item.pharmacyId ===
          selectedPharmacy.id,
      );
    }, [
      stockItems,
      selectedPharmacy,
    ]);

  /*
   * Create inventory item
   */
  const handleAddStockItem =
    useCallback(
      (item: PharmacyStockItem) => {
        setStockItems((current) => {
          const exists =
            current.some(
              (existing) =>
                existing.id ===
                item.id,
            );

          if (exists) {
            return current.map(
              (existing) =>
                existing.id ===
                item.id
                  ? item
                  : existing,
            );
          }

          return [
            ...current,
            item,
          ];
        });
      },
      [],
    );

  /*
   * Update inventory item
   */
  const handleUpdateStockItem =
    useCallback(
      (item: PharmacyStockItem) => {
        setStockItems((current) =>
          current.map(
            (existing) =>
              existing.id ===
              item.id
                ? item
                : existing,
          ),
        );
      },
      [],
    );

  /*
   * Delete inventory item
   */
  const handleDeleteStockItem =
    useCallback(
      (id: string) => {
        setStockItems((current) =>
          current.filter(
            (item) =>
              item.id !== id,
          ),
        );
      },
      [],
    );

  /*
   * Publishes a stock batch as a real B2B exchange offer.
   *
   * The previous implementation only created an in-memory "AI match" object
   * that was never sent to the server and disappeared on reload. This now uses
   * the exchange API that already exists in the backend.
   */
  const handlePushToExchange = useCallback(async (item: PharmacyStockItem) => {
    const availableQuantity = Math.max(0, Math.floor(item.currentStock - item.reservedStock));

    if (availableQuantity < 1) {
      throw new Error('موجودی آزاد این بچ برای عرضه در تبادل کافی نیست.');
    }

    if (!Number.isFinite(item.minAcceptablePriceB2B) || item.minAcceptablePriceB2B <= 0) {
      throw new Error('برای عرضه در تبادل، حداقل قیمت قابل قبول را در موجودی ثبت کنید.');
    }

    const expiry = item.expiryDate
      ? new Date(`${item.expiryDate.slice(0, 10)}T23:59:59`)
      : null;

    const expiresAt =
      expiry && !Number.isNaN(expiry.getTime())
        ? expiry.toISOString()
        : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    await createExchangeOffer({
      stockItemId: item.id,
      quantity: availableQuantity,
      unitPrice: Math.round(item.minAcceptablePriceB2B),
      expiresAt,
    });
  }, []);

  /*
   * Public landing, pharmacy registration, and login.
   * Authenticated role-based routing below remains unchanged.
   */
  if (!authenticated) {
    if (authScreen === 'register') {
      return (
        <RegisterPage
          onBackToLogin={() => {
            setShowPublicCatalog(false);
            setShowPublicLanding(false);
            setAuthScreen('login');
          }}
          onRegisterSuccess={() => {
            setShowPublicCatalog(false);
            setShowPublicLanding(false);
            setAuthScreen('login');
          }}
        />
      );
    }

    if (authScreen === 'customer-register') {
      return (
        <CustomerRegisterPage
          onBackToCatalog={() => {
            setAuthScreen('login');
            setShowPublicCatalog(true);
            setShowPublicLanding(false);
          }}
          onBackToLogin={() => {
            setAuthScreen('login');
            setShowPublicCatalog(false);
            setShowPublicLanding(false);
          }}
          onRegisterSuccess={() => {
            setAuthScreen('login');
            setShowPublicCatalog(false);
            setShowPublicLanding(false);
          }}
        />
      );
    }

    if (showPublicCatalog) {
      return (
        <PublicProductCatalog
          onPurchase={() => setAuthScreen('customer-register')}
          onLogin={() => {
            setShowPublicCatalog(false);
            setShowPublicLanding(false);
            setAuthScreen('login');
          }}
          onPharmacyRegister={() => {
            setShowPublicCatalog(false);
            setShowPublicLanding(false);
            setAuthScreen('register');
          }}
          onBackToLanding={() => {
            if (window.history.state?.pharmartPublicPage === 'catalog') {
              window.history.back();
              return;
            }
            setShowPublicCatalog(false);
            setShowPublicLanding(true);
          }}
        />
      );
    }

    if (showPublicLanding) {
      return (
        <PublicLandingPage
          onLogin={() => {
            setShowPublicLanding(false);
            setShowPublicCatalog(false);
            setAuthScreen('login');
          }}
          onRegister={() => {
            setShowPublicLanding(false);
            setShowPublicCatalog(false);
            setAuthScreen('register');
          }}
          onBrowseCatalog={() => {
            window.history.pushState(
              { ...(window.history.state ?? {}), pharmartPublicPage: 'catalog' },
              '',
              window.location.href,
            );
            setShowPublicLanding(false);
            setShowPublicCatalog(true);
          }}
        />
      );
    }

    return (
      <LoginPage
        notice={sessionNotice}
        onLoginSuccess={handleLoginSuccess}
        onRegister={() => {
          setSessionNotice(null);
          setShowPublicCatalog(false);
          setShowPublicLanding(false);
          setAuthScreen('register');
        }}
        onBackToLanding={() => {
          setSessionNotice(null);
          setAuthScreen('login');
          setShowPublicCatalog(false);
          setShowPublicLanding(true);
        }}
      />
    );
  }

  /*
   * Initial backend loading
   */
  if (loading) {
    return <FullPageLoader />;
  }

  if (!currentUser) {
    if (startupError) {
      return (
        <StartupError
          message={startupError}
          onRetry={() => void loadBackendData()}
          onLogout={() => clearSession({ goToCatalog: true })}
        />
      );
    }

    return (
      <LoginPage
        notice={sessionNotice}
        onLoginSuccess={handleLoginSuccess}
        onRegister={() => setAuthScreen('register')}
        onBackToLanding={() => clearSession({ goToCatalog: true })}
      />
    );
  }

  /*
   * Ordinary customer storefront.
   * USER must never enter the pharmacy/admin operational UI.
   */
  if (currentUser.role === 'USER') {
    return (
      <CustomerStorefront
        onLogout={handleLogout}
      />
    );
  }

  /*
   * Non-admin باید Pharmacy داشته باشد.
   */
  const requiresPharmacy =
    currentUser.role !== 'SUPER_ADMIN' &&
    currentUser.role !== 'PLATFORM_ADMIN';

  if (
    requiresPharmacy &&
    !selectedPharmacy
  ) {
    return (
      <div
        dir="rtl"
        className="flex min-h-screen items-center justify-center bg-slate-50 p-6"
      >
        <div className="w-full max-w-md rounded-2xl border border-amber-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-600">
            !
          </div>

          <h1 className="mt-4 text-lg font-black text-slate-900">
            داروخانه‌ای برای حساب کاربری پیدا نشد
          </h1>

          <p className="mt-3 text-sm leading-7 text-slate-500">
            حساب کاربری شما به یک داروخانه متصل نیست.
            لطفاً اتصال حساب به داروخانه را بررسی کنید.
          </p>

          <button
            type="button"
            onClick={
              handleLogout
            }
            className="mt-6 h-11 rounded-xl bg-slate-900 px-6 text-sm font-extrabold text-white transition hover:bg-slate-800"
          >
            خروج از حساب
          </button>
        </div>
      </div>
    );
  }

  /*
   * Profile page
   */
  if (showProfile) {
    const profilePharmacy =
      selectedPharmacy ??
      pharmacies[0] ??
      EMPTY_PLATFORM_PHARMACY;

    return (
      <AppShell
        selectedPharmacy={profilePharmacy}
        allPharmacies={pharmacies}
        onSelectPharmacy={handleSelectPharmacy}
        currentUser={currentUser}
        onProfileClick={() => setShowProfile(false)}
        onLogout={handleLogout}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      >
        <Suspense fallback={<PageLoadingFallback />}>
          <ProfilePage
            user={currentUser}
            onCancel={() => setShowProfile(false)}
          />
        </Suspense>
      </AppShell>
    );
  }

  const navbarPharmacy =
    selectedPharmacy ??
    pharmacies[0] ??
    EMPTY_PLATFORM_PHARMACY;

  let pageContent: React.ReactNode;

  switch (activeTab) {
    case 'dashboard':
      pageContent = selectedPharmacy ? (
        <PharmacyDashboard
          pharmacy={selectedPharmacy}
          canContactOwner={
            currentUser.role === 'PHARMACY_OWNER' ||
            currentUser.role === 'PHARMACY_STAFF'
          }
          stockItems={visibleStockItems}
          onNavigate={setActiveTab}
          onRefresh={() =>
            refreshInventory(selectedPharmacy.id)
          }
        />
      ) : (
        <div
          dir="rtl"
          className="rounded-2xl border border-slate-200 bg-white p-8 text-center"
        >
          <h2 className="text-lg font-black text-slate-900">
            ابتدا یک داروخانه انتخاب کنید
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            برای مشاهده داشبورد، یک داروخانه را انتخاب کنید.
          </p>
        </div>
      );

      break;

    case 'inventory_mgmt':
      pageContent =
        selectedPharmacy ? (
          <InventoryManager
            activePharmacy={
              selectedPharmacy
            }
            pharmacies={
              pharmacies
            }
            currentUser={
              currentUser
            }
            products={
              products
            }
            stockItems={
              visibleStockItems
            }
            onAddStockItem={
              handleAddStockItem
            }
            onUpdateStockItem={
              handleUpdateStockItem
            }
            onDeleteStockItem={
              handleDeleteStockItem
            }
            onPushToExchange={
              handlePushToExchange
            }
            onPharmacyChange={
              handleSelectPharmacy
            }
            onRefreshInventory={
              refreshInventory
            }
          />
        ) : (
          <div
            dir="rtl"
            className="rounded-2xl border border-slate-200 bg-white p-8 text-center"
          >
            <h2 className="text-lg font-black text-slate-900">
              ابتدا یک داروخانه انتخاب کنید
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              برای مشاهده و مدیریت موجودی، یک داروخانه را انتخاب کنید.
            </p>
          </div>
        );

      break;

    case 'ai_exchange':
      pageContent = currentUser ? (
        <ExchangeManager
          currentUser={currentUser}
          stockItems={visibleStockItems}
        />
      ) : (
        <div
          dir="rtl"
          className="rounded-2xl border border-slate-200 bg-white p-8 text-center"
        >
          <h2 className="text-lg font-black text-slate-900">
            اطلاعات کاربر در دسترس نیست
          </h2>
        </div>
      );

      break;
    case 'escrow_payment':
      pageContent = (
        <EscrowPaymentSimulator
          onBack={() => setActiveTab('ai_exchange')}
        />
      );

      break;

    case 'storefront_demo':
      pageContent = (
        <StorefrontPreview
          pharmacy={selectedPharmacy ?? navbarPharmacy}
          stockItems={visibleStockItems}
        />
      );

      break;

    case 'promotions':
      pageContent =
        (currentUser?.role === 'SUPER_ADMIN' ||
         currentUser?.role === 'PLATFORM_ADMIN') ? (
          <PromotionCampaignManager />
        ) : (
          <div dir="rtl" className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center">
            <h2 className="text-lg font-black text-rose-900">دسترسی غیرمجاز</h2>
            <p className="mt-2 text-sm text-rose-700">این بخش فقط برای مدیران سامانه قابل دسترسی است.</p>
          </div>
        );
      break;

    case 'admin_users':
      pageContent =
        (
          currentUser?.role === 'SUPER_ADMIN' ||
          currentUser?.role === 'PLATFORM_ADMIN'
        ) ? (
          <AdminUsersPage
            pharmacies={pharmacies}
            currentUser={currentUser}
          />
        ) : (
          <div
            dir="rtl"
            className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center"
          >
            <h2 className="text-lg font-black text-rose-900">
              دسترسی غیرمجاز
            </h2>

            <p className="mt-2 text-sm text-rose-700">
              این بخش فقط برای مدیران سامانه قابل دسترسی است.
            </p>
          </div>
        );

      break;

    case 'operational_plan':
    default:
      pageContent = (
        <OperationalPlanView />
      );

      break;
  }

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-slate-50"
    >
      <Modal
        open={showIdleWarning}
        onClose={extendSession}
        title="نشست شما در حال پایان است"
        description="به دلیل عدم فعالیت، حساب شما به‌صورت خودکار از سامانه خارج خواهد شد."
        size="sm"
      >
        <div className="space-y-4 text-center">
          <div
            className="font-mono text-3xl font-black text-amber-600"
            dir="ltr"
            aria-live="polite"
          >
            {String(Math.floor(idleSecondsLeft / 60)).padStart(2, '0')}:
            {String(idleSecondsLeft % 60).padStart(2, '0')}
          </div>

          <button
            type="button"
            onClick={extendSession}
            className="h-12 w-full rounded-xl bg-medical-600 text-sm font-extrabold text-white shadow-lg shadow-medical-600/20 transition hover:bg-medical-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-medical-500/30"
          >
            ادامه فعالیت
          </button>
        </div>
      </Modal>

      <AppShell
        selectedPharmacy={navbarPharmacy}
        allPharmacies={pharmacies}
        onSelectPharmacy={handleSelectPharmacy}
        currentUser={currentUser}
        onProfileClick={() =>
          setShowProfile(true)
        }
        onLogout={handleLogout}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      >
{error && (
          <div className="mb-6 flex items-start justify-between gap-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            <div>
              <div className="font-black">
                خطا در دریافت اطلاعات
              </div>

              <div className="mt-1">
                {error}
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                void loadBackendData(
                  currentUser,
                  currentUser.role === 'SUPER_ADMIN' ||
                  currentUser.role === 'PLATFORM_ADMIN'
                    ? selectedPharmacy?.id
                    : undefined,
                )
              }
              className="shrink-0 rounded-xl bg-white px-4 py-2 text-xs font-extrabold text-rose-700 shadow-sm ring-1 ring-rose-200 transition hover:bg-rose-100"
            >
              تلاش مجدد
            </button>
          </div>
        )}

        <Suspense fallback={<PageLoadingFallback />}>
          {pageContent}
        </Suspense>
      </AppShell>
    </div>
  );
};
function App() {
  return (
    <Suspense fallback={<FullPageLoader />}>
      <AppContent />
    </Suspense>
  );
}

const PageLoadingFallback = () => (
  <div
    dir="rtl"
    className="flex min-h-[240px] items-center justify-center p-8"
    role="status"
    aria-live="polite"
  >
    <div className="flex items-center gap-3 text-sm font-bold text-medical-700">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-medical-200 border-t-medical-600" />
      در حال بارگذاری صفحه...
    </div>
  </div>
);

export default App;
