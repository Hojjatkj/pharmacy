import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import {
  getStorefrontProducts,
  StorefrontProduct,
} from '../api/storefront';
import { updatePassword } from '../api/auth';
import {
  createShippingAddress,
  deleteShippingAddress,
  getShippingAddresses,
  updateShippingAddress,
  ShippingAddress,
  ShippingAddressInput,
} from '../api/shipping';
import {
  addCartItem,
  checkoutCart,
  getCart,
  getOrders,
  removeCartItem,
  updateCartItem,
  previewCoupon,
  getMyNotifications,
  markNotificationRead,
  Cart,
  B2CCheckoutResponse,
  B2COrder,
  CouponPreview,
  CustomerNotification,
} from '../api/cart';

type Props = {
  onLogout: () => void;
};

const categoryLabels: Record<string, string> = {
  supplement: 'مکمل',
  cosmetic: 'آرایشی و بهداشتی',
  otc_health: 'سلامت و بدون نسخه',
  sports_nutrition: 'تغذیه ورزشی',
};

function formatPrice(value: number) {
  return new Intl.NumberFormat('fa-IR').format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(value));
}

export default function CustomerStorefront({ onLogout }: Props) {
  const [products, setProducts] = useState<StorefrontProduct[]>([]);
  const [activeCustomerPage, setActiveCustomerPage] = useState<'products' | 'orders'>('products');
  const [cart, setCart] = useState<Cart | null>(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [pharmacyId, setPharmacyId] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [loading, setLoading] = useState(true);
  const [cartLoading, setCartLoading] = useState(true);
  const [addingStockItemId, setAddingStockItemId] = useState('');
  const [error, setError] = useState('');
  const [cartError, setCartError] = useState('');
  const [showCart, setShowCart] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const [checkoutOrder, setCheckoutOrder] =
    useState<B2CCheckoutResponse | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [couponPreview, setCouponPreview] = useState<CouponPreview | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [notifications, setNotifications] = useState<CustomerNotification[]>([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificationsError, setNotificationsError] = useState('');

  const [shippingAddresses, setShippingAddresses] = useState<ShippingAddress[]>([]);
  const [selectedShippingAddressId, setSelectedShippingAddressId] = useState('');
  const [shippingLoading, setShippingLoading] = useState(false);
  const [shippingSaving, setShippingSaving] = useState(false);
  const [shippingError, setShippingError] = useState('');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState<ShippingAddressInput>({
    recipientName: '',
    phone: '',
    province: '',
    city: '',
    address: '',
    postalCode: '',
    isDefault: false,
  });
  const [orders, setOrders] = useState<B2COrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState('');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');
  const [profileError, setProfileError] = useState('');

  async function loadProducts() {
    try {
      setLoading(true);
      setError('');

      const data = await getStorefrontProducts({
        search,
        category,
        pharmacyId,
        minPrice,
        maxPrice,
      });

      setProducts(data);
    } catch (err) {
      console.error(err);
      setError('دریافت محصولات با خطا مواجه شد.');
    } finally {
      setLoading(false);
    }
  }

  async function loadCart() {
    try {
      setCartLoading(true);
      const data = await getCart();
      setCart(data);
      setCartError('');
    } catch (err) {
      console.error(err);
      setCartError('دریافت سبد خرید با خطا مواجه شد.');
    } finally {
      setCartLoading(false);
    }
  }

  async function loadShippingAddresses() {
    try {
      setShippingLoading(true);
      setShippingError('');

      const data = await getShippingAddresses();
      setShippingAddresses(data);

      const defaultAddress =
        data.find((item) => item.isDefault) ?? data[0];

      if (defaultAddress) {
        setSelectedShippingAddressId(defaultAddress.id);
      } else {
        setSelectedShippingAddressId('');
      }
    } catch (err) {
      console.error(err);
      setShippingError('دریافت آدرس‌های ارسال انجام نشد.');
    } finally {
      setShippingLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
    loadCart();
    loadShippingAddresses();


    setOrdersLoading(true);
    setOrdersError('');
    getOrders()
      .then((data) => {
        setOrders(data);
        setOrdersError('');
      })
      .catch((err) => {
        console.error(err);
        setOrdersError('دریافت سفارش‌ها با خطا مواجه شد. لطفاً دوباره تلاش کنید.');
      })
      .finally(() => setOrdersLoading(false));

    getMyNotifications()
      .then(setNotifications)
      .catch((err) => {
        console.error(err);
        setNotificationsError('دریافت اعلان‌ها انجام نشد.');
      });
  }, []);

  const pharmacies = useMemo(() => {
    const map = new Map<string, StorefrontProduct['pharmacy']>();

    for (const item of products) {
      map.set(item.pharmacy.id, item.pharmacy);
    }

    return Array.from(map.values()).sort((a, b) =>
      a.name.localeCompare(b.name, 'fa'),
    );
  }, [products]);

  const categories = useMemo(() => {
    return Array.from(
      new Set(products.map((item) => item.product.category)),
    );
  }, [products]);

  function submitFilters(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    loadProducts();
  }

  function clearFilters() {
    setSearch('');
    setCategory('');
    setPharmacyId('');
    setMinPrice('');
    setMaxPrice('');

    setTimeout(() => {
      getStorefrontProducts()
        .then(setProducts)
        .catch(() => setError('دریافت محصولات با خطا مواجه شد.'));
    }, 0);
  }

  async function handleAddToCart(item: StorefrontProduct) {
    try {
      setAddingStockItemId(item.stockItemId);
      setCartError('');

      const updatedCart = await addCartItem(item.stockItemId, 1);
      setCart(updatedCart);
      setCouponPreview(null);
      setCouponError('');
      setShowCart(true);
    } catch (err) {
      console.error(err);
      setCartError(
        err instanceof Error
          ? err.message
          : 'افزودن محصول به سبد خرید انجام نشد.',
      );
    } finally {
      setAddingStockItemId('');
    }
  }

  async function handleUpdateQuantity(
    itemId: string,
    quantity: number,
  ) {
    try {
      setCartError('');

      if (quantity <= 0) {
        const updatedCart = await removeCartItem(itemId);
        setCart(updatedCart);
        setCouponPreview(null);
        setCouponError('');
        return;
      }

      const updatedCart = await updateCartItem(itemId, quantity);
      setCart(updatedCart);
      setCouponPreview(null);
      setCouponError('');
    } catch (err) {
      console.error(err);
      setCartError(
        err instanceof Error
          ? err.message
          : 'تغییر تعداد انجام نشد.',
      );
    }
  }

  async function handleRemoveItem(itemId: string) {
    try {
      setCartError('');
      const updatedCart = await removeCartItem(itemId);
      setCart(updatedCart);
      setCouponPreview(null);
      setCouponError('');
    } catch (err) {
      console.error(err);
      setCartError('حذف محصول از سبد انجام نشد.');
    }
  }

  function resetAddressForm() {
    setAddressForm({
      recipientName: '',
      phone: '',
      province: '',
      city: '',
      address: '',
      postalCode: '',
      isDefault: shippingAddresses.length === 0,
    });
    setEditingAddressId(null);
  }

  function startEditAddress(address: ShippingAddress) {
    setEditingAddressId(address.id);
    setAddressForm({
      recipientName: address.recipientName,
      phone: address.phone,
      province: address.province,
      city: address.city,
      address: address.address,
      postalCode: address.postalCode,
      isDefault: address.isDefault,
    });
    setShippingError('');
    setShowAddressForm(true);
  }

  async function handleSaveAddress() {
    setShippingError('');

    const fields = [
      addressForm.recipientName,
      addressForm.phone,
      addressForm.province,
      addressForm.city,
      addressForm.address,
      addressForm.postalCode,
    ];

    if (fields.some((value) => !value.trim())) {
      setShippingError('لطفاً همه اطلاعات آدرس را کامل کنید.');
      return;
    }

    if (!/^09\d{9}$/.test(addressForm.phone.trim())) {
      setShippingError('شماره موبایل معتبر نیست.');
      return;
    }

    if (!/^\d{10}$/.test(addressForm.postalCode.trim())) {
      setShippingError('کد پستی باید ۱۰ رقم باشد.');
      return;
    }

    try {
      setShippingSaving(true);

      if (editingAddressId) {
        const updated = await updateShippingAddress(
          editingAddressId,
          addressForm,
        );

        await loadShippingAddresses();
        setSelectedShippingAddressId(updated.id);
      } else {
        const created = await createShippingAddress(addressForm);

        await loadShippingAddresses();
        setSelectedShippingAddressId(created.id);
      }

      resetAddressForm();
      setShowAddressForm(false);
    } catch (err) {
      console.error(err);
      setShippingError(
        err instanceof Error
          ? err.message
          : 'ذخیره آدرس انجام نشد.',
      );
    } finally {
      setShippingSaving(false);
    }
  }

  async function handleDeleteAddress(id: string) {
    if (!window.confirm('آیا از حذف این آدرس مطمئن هستید؟')) {
      return;
    }

    try {
      setShippingError('');
      await deleteShippingAddress(id);

      const remaining = shippingAddresses.filter(
        (item) => item.id !== id,
      );

      setShippingAddresses(remaining);

      if (selectedShippingAddressId === id) {
        const replacement =
          remaining.find((item) => item.isDefault) ?? remaining[0];

        setSelectedShippingAddressId(
          replacement?.id ?? '',
        );
      }
    } catch (err) {
      console.error(err);
      setShippingError(
        err instanceof Error
          ? err.message
          : 'حذف آدرس انجام نشد.',
      );
    }
  }

  async function handleSetDefaultAddress(id: string) {
    try {
      setShippingError('');

      await updateShippingAddress(id, {
        isDefault: true,
      });

      await loadShippingAddresses();
      setSelectedShippingAddressId(id);
    } catch (err) {
      console.error(err);
      setShippingError(
        err instanceof Error
          ? err.message
          : 'تغییر آدرس پیش‌فرض انجام نشد.',
      );
    }
  }

  async function handlePreviewCoupon() {
    if (!cart || cart.items.length === 0 || couponLoading) return;

    if (!couponCode.trim()) {
      setCouponError('کد تخفیف را وارد کنید.');
      setCouponPreview(null);
      return;
    }

    try {
      setCouponLoading(true);
      setCouponError('');
      setCouponPreview(null);
      const preview = await previewCoupon(couponCode.trim());
      setCouponPreview(preview);
      setCouponCode(preview.couponCode);
    } catch (err) {
      setCouponError(
        err instanceof Error ? err.message : 'اعتبارسنجی کد تخفیف انجام نشد.',
      );
    } finally {
      setCouponLoading(false);
    }
  }

  async function handleMarkNotificationRead(notificationId: string) {
    try {
      await markNotificationRead(notificationId);
      setNotifications((current) =>
        current.map((item) =>
          item.id === notificationId
            ? { ...item, readAt: new Date().toISOString() }
            : item,
        ),
      );
    } catch (err) {
      console.error(err);
      setNotificationsError('علامت‌گذاری اعلان انجام نشد.');
    }
  }

  async function handleCheckout() {
    if (!cart || cart.items.length === 0 || checkoutLoading) {
      return;
    }

    if (!selectedShippingAddressId) {
      setCheckoutError('لطفاً ابتدا یک آدرس ارسال انتخاب کنید.');
      return;
    }

    try {
      setCheckoutLoading(true);
      setCheckoutError('');

      const order = await checkoutCart(
        selectedShippingAddressId,
        couponPreview?.couponCode,
      );

      setCheckoutOrder(order);
      setCouponCode('');
      setCouponPreview(null);
      setCouponError('');
      setOrdersLoading(true);
      setOrdersError('');
      try {
        const updatedOrders = await getOrders();
        setOrders(updatedOrders);
      } catch (err) {
        console.error(err);
        setOrdersError('سفارش ثبت شد، اما دریافت فهرست سفارش‌ها با خطا مواجه شد.');
      } finally {
        setOrdersLoading(false);
      }
      setCart({
        id: cart.id,
        items: [],
        totalItems: 0,
        subtotal: 0,
      });
      setShowCart(false);
    } catch (err) {
      console.error(err);
      setCheckoutError(
        err instanceof Error
          ? err.message
          : 'ثبت سفارش انجام نشد.',
      );
    } finally {
      setCheckoutLoading(false);
    }
  }

  function getOrderStatusLabel(status: string) {
    const labels: Record<string, string> = {
      PENDING: 'در انتظار تأیید',
      CONFIRMED: 'تأیید شده',
      PROCESSING: 'در حال پردازش',
      READY: 'آماده تحویل',
      COMPLETED: 'تکمیل شده',
      CANCELLED: 'لغو شده',
    };

    return labels[status] ?? status;
  }

  async function handlePasswordChange() {
    setProfileMessage('');
    setProfileError('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setProfileError('لطفاً هر سه فیلد رمز عبور را کامل کنید.');
      return;
    }

    if (newPassword.length < 8) {
      setProfileError('رمز عبور جدید باید حداقل ۸ کاراکتر باشد.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setProfileError('تکرار رمز عبور با رمز عبور جدید یکسان نیست.');
      return;
    }

    try {
      setProfileLoading(true);

      const result = await updatePassword(
        currentPassword,
        newPassword,
      );

      setProfileMessage(result.message);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setProfileError(
        err instanceof Error
          ? err.message
          : 'تغییر رمز عبور انجام نشد.',
      );
    } finally {
      setProfileLoading(false);
    }
  }

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-slate-50 text-slate-900"
    >
      {checkoutOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl text-emerald-700">
                ✓
              </div>

              <h2 className="mt-4 text-xl font-black text-slate-900">
                سفارش با موفقیت ثبت شد
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                سفارش شما در وضعیت «در انتظار تأیید» قرار گرفت.
              </p>
            </div>

            <div className="mt-6 space-y-3 rounded-2xl bg-slate-50 p-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">شماره سفارش</span>
                <span className="font-bold text-slate-900">
                  {checkoutOrder.orderId.slice(0, 8)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">مبلغ نهایی</span>
                <span className="font-black text-emerald-700">
                  {formatPrice(checkoutOrder.totalAmount)} تومان
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">تعداد اقلام</span>
                <span className="font-bold text-slate-900">
                  {formatPrice(
                    checkoutOrder.items.reduce(
                      (sum, item) => sum + item.quantity,
                      0,
                    ),
                  )}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setCheckoutOrder(null)}
              className="mt-5 w-full rounded-xl bg-medical-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-medical-700"
            >
              ادامه
            </button>
          </div>
        </div>
      )}

      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 lg:px-8">
          <div className="shrink-0">
            <div className="text-xl font-black tracking-tight text-emerald-700">
              PharmArt
            </div>
            <div className="text-xs text-slate-500">
              خرید از داروخانه‌ها
            </div>
          </div>

          {activeCustomerPage === 'products' && (
            <form
              onSubmit={submitFilters}
              className="flex min-w-0 flex-1"
            >
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="جستجوی نام محصول، برند یا ماده مؤثره..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-medical-500 focus:bg-white focus:ring-4 focus:ring-medical-100"
              />
            </form>
          )}

          <button
            type="button"
            onClick={() => setShowCart(true)}
            className="relative rounded-xl border border-medical-200 bg-medical-50 px-4 py-2 text-sm font-bold text-medical-700 hover:bg-medical-100"
          >
            سبد خرید
            {cart && cart.totalItems > 0 && (
              <span className="mr-2 inline-flex min-w-6 items-center justify-center rounded-full bg-medical-600 px-1.5 py-0.5 text-xs font-bold text-white">
                {formatPrice(cart.totalItems)}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setShowProfile(true);
              setProfileMessage('');
              setProfileError('');
            }}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            حساب کاربری
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            خروج
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
        <nav className="mb-6 flex gap-3" aria-label="ناوبری فروشگاه">
          <button type="button" onClick={() => setActiveCustomerPage('products')} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${activeCustomerPage === 'products' ? 'bg-medical-600 text-white' : 'border border-slate-200 bg-white text-slate-700'}`}>
            محصولات
          </button>
          <button type="button" onClick={() => setActiveCustomerPage('orders')} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${activeCustomerPage === 'orders' ? 'bg-medical-600 text-white' : 'border border-slate-200 bg-white text-slate-700'}`}>
            سفارش‌های من ({formatPrice(orders.length)})
          </button>
        </nav>

        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-4">
          <button
            type="button"
            onClick={() => setNotificationsOpen((open) => !open)}
            className="flex w-full items-center justify-between gap-3 text-right"
          >
            <span>
              <span className="block font-black text-slate-900">اعلان‌ها و تخفیف‌های من</span>
              <span className="mt-1 block text-xs text-slate-500">
                {formatPrice(notifications.filter((item) => !item.readAt).length)} اعلان خوانده‌نشده
              </span>
            </span>
            <span className="rounded-xl bg-medical-50 px-3 py-2 text-sm font-bold text-medical-700">
              {notificationsOpen ? 'بستن' : 'مشاهده'}
            </span>
          </button>

          {notificationsOpen && (
            <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
              {notificationsError && (
                <p role="alert" className="text-sm text-red-600">{notificationsError}</p>
              )}
              {notifications.length === 0 ? (
                <p className="text-sm text-slate-500">فعلاً اعلانی ندارید.</p>
              ) : notifications.map((item) => (
                <article key={item.id} className={`rounded-xl border p-4 ${item.readAt ? 'border-slate-200 bg-white' : 'border-emerald-200 bg-emerald-50/50'}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-bold text-slate-900">{item.title}</h3>
                      <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-600">{item.message}</p>
                      {item.metadata?.couponCode && (
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <span className="text-xs text-slate-500">کد اختصاصی شما:</span>
                          <code dir="ltr" className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-bold text-medical-700">{item.metadata.couponCode}</code>
                          <button
                            type="button"
                            onClick={() => {
                              setCouponCode(String(item.metadata?.couponCode ?? ''));
                              setCouponPreview(null);
                              setCouponError('');
                              setShowCart(true);
                              setNotificationsOpen(false);
                            }}
                            className="text-xs font-bold text-medical-700 hover:underline"
                          >
                            استفاده در سبد خرید
                          </button>
                        </div>
                      )}
                      <p className="mt-2 text-[11px] text-slate-400">{formatDate(item.createdAt)}</p>
                    </div>
                    {!item.readAt && (
                      <button
                        type="button"
                        onClick={() => handleMarkNotificationRead(item.id)}
                        className="shrink-0 text-xs font-bold text-medical-700 hover:underline"
                      >
                        خوانده شد
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {activeCustomerPage === 'orders' && (
        <section className="mb-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-slate-900">
                سفارش‌های من
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                وضعیت و جزئیات سفارش‌های ثبت‌شده
              </p>
            </div>

            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
              {formatPrice(orders.length)} سفارش
            </span>
          </div>

          {ordersError ? (
            <div
              role="alert"
              className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-6 text-center text-sm text-red-700"
            >
              {ordersError}
              <button
                type="button"
                onClick={async () => {
                  setOrdersLoading(true);
                  setOrdersError('');
                  try {
                    const data = await getOrders();
                    setOrders(data);
                  } catch (err) {
                    console.error(err);
                    setOrdersError('دریافت سفارش‌ها با خطا مواجه شد. لطفاً دوباره تلاش کنید.');
                  } finally {
                    setOrdersLoading(false);
                  }
                }}
                className="mr-3 font-bold underline underline-offset-4"
              >
                تلاش مجدد
              </button>
            </div>
          ) : ordersLoading ? (
            <div className="mt-5 rounded-2xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
              در حال دریافت سفارش‌ها...
            </div>
          ) : orders.length === 0 ? (
            <div className="mt-5 rounded-2xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
              هنوز سفارشی ثبت نکرده‌اید.
            </div>
          ) : (
            <div className="mt-5 space-y-4">
              {orders.map((order) => {
                const isExpanded = expandedOrderId === order.id;
                const itemCount = order.items.reduce(
                  (sum, item) => sum + item.quantity,
                  0,
                );

                return (
                  <div
                    key={order.id}
                    className="overflow-hidden rounded-2xl border border-slate-200"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedOrderId(
                          isExpanded ? null : order.id,
                        )
                      }
                      className="w-full p-4 text-right transition hover:bg-slate-50"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <div className="text-sm font-black text-slate-900">
                            سفارش #{order.id.slice(0, 8)}
                          </div>

                          <div className="mt-1 text-xs text-slate-500">
                            {order.pharmacy.name} — {order.pharmacy.city}
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${
                              order.status === 'CANCELLED'
                                ? 'bg-red-50 text-red-700'
                                : order.status === 'COMPLETED'
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : 'bg-amber-50 text-amber-700'
                            }`}
                          >
                            {getOrderStatusLabel(order.status)}
                          </span>

                          <span className="text-lg text-slate-400">
                            {isExpanded ? '⌃' : '⌄'}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-3 text-right sm:grid-cols-3">
                        <div className="rounded-xl bg-slate-50 p-3">
                          <div className="text-xs text-slate-500">
                            تاریخ ثبت
                          </div>
                          <div className="mt-1 text-sm font-bold text-slate-800">
                            {formatDate(order.createdAt)}
                          </div>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-3">
                          <div className="text-xs text-slate-500">
                            تعداد اقلام
                          </div>
                          <div className="mt-1 text-sm font-bold text-slate-800">
                            {formatPrice(itemCount)}
                          </div>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-3">
                          <div className="text-xs text-slate-500">
                            مبلغ نهایی
                          </div>
                          <div className="mt-1 text-sm font-black text-emerald-700">
                            {formatPrice(order.totalAmount)} تومان
                          </div>
                        </div>
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="border-t border-slate-200 bg-slate-50 p-4">
                        <div className="mb-4 grid gap-3 sm:grid-cols-2">
                          <div className="rounded-xl bg-white p-3">
                            <div className="text-xs text-slate-500">
                              شماره کامل سفارش
                            </div>
                            <div className="mt-1 break-all text-xs font-bold text-slate-800">
                              {order.id}
                            </div>
                          </div>

                          <div className="rounded-xl bg-white p-3">
                            <div className="text-xs text-slate-500">
                              وضعیت
                            </div>
                            <div className="mt-1 text-sm font-bold text-slate-800">
                              {getOrderStatusLabel(order.status)}
                            </div>
                          </div>
                        </div>

                        <div className="mb-4 rounded-xl bg-white p-4">
                          <h3 className="text-sm font-black text-slate-900">
                            آدرس ارسال
                          </h3>

                          <div className="mt-3 grid gap-3 sm:grid-cols-2">
                            <div>
                              <div className="text-xs text-slate-500">
                                گیرنده
                              </div>
                              <div className="mt-1 text-sm font-bold text-slate-800">
                                {order.recipientName}
                              </div>
                            </div>

                            <div>
                              <div className="text-xs text-slate-500">
                                شماره تماس
                              </div>
                              <div className="mt-1 text-sm font-bold text-slate-800">
                                {order.phone}
                              </div>
                            </div>

                            <div>
                              <div className="text-xs text-slate-500">
                                استان / شهر
                              </div>
                              <div className="mt-1 text-sm font-bold text-slate-800">
                                {order.province} / {order.city}
                              </div>
                            </div>

                            <div>
                              <div className="text-xs text-slate-500">
                                کد پستی
                              </div>
                              <div className="mt-1 text-sm font-bold text-slate-800">
                                {order.postalCode}
                              </div>
                            </div>

                            <div className="sm:col-span-2">
                              <div className="text-xs text-slate-500">
                                نشانی
                              </div>
                              <div className="mt-1 text-sm font-bold leading-6 text-slate-800">
                                {order.address}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="rounded-xl bg-white p-4">
                          <h3 className="text-sm font-black text-slate-900">
                            اقلام سفارش
                          </h3>

                          <div className="mt-3 space-y-3">
                            {order.items.map((item) => (
                              <div
                                key={item.id}
                                className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0"
                              >
                                <div>
                                  <div className="text-sm font-bold text-slate-800">
                                    {item.productName}
                                  </div>
                                  <div className="mt-1 text-xs text-slate-500">
                                    تعداد: {formatPrice(item.quantity)}
                                  </div>
                                </div>

                                <div className="text-left">
                                  <div className="text-xs text-slate-500">
                                    قیمت واحد
                                  </div>
                                  <div className="mt-1 text-sm font-bold text-slate-800">
                                    {formatPrice(item.unitPrice)} تومان
                                  </div>
                                  <div className="mt-1 text-xs font-bold text-emerald-700">
                                    جمع: {formatPrice(item.totalPrice)} تومان
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4">
                            <span className="text-sm font-bold text-slate-600">
                              مبلغ نهایی
                            </span>
                            <span className="text-lg font-black text-emerald-700">
                              {formatPrice(order.totalAmount)} تومان
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
        )}

        {activeCustomerPage === 'products' && (
      <main className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-black">
            فروشگاه داروخانه‌ها
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            محصولات موجود را از داروخانه‌های عضو مشاهده و انتخاب کنید.
          </p>
        </div>

        <form
          onSubmit={submitFilters}
          className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"
            >
              <option value="">همه دسته‌بندی‌ها</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {categoryLabels[item] ?? item}
                </option>
              ))}
            </select>

            <select
              value={pharmacyId}
              onChange={(e) => setPharmacyId(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"
            >
              <option value="">همه داروخانه‌ها</option>
              {pharmacies.map((pharmacy) => (
                <option key={pharmacy.id} value={pharmacy.id}>
                  {pharmacy.name}
                </option>
              ))}
            </select>

            <input
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              inputMode="numeric"
              placeholder="حداقل قیمت"
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
            />

            <input
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              inputMode="numeric"
              placeholder="حداکثر قیمت"
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
            />

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 rounded-xl bg-medical-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-medical-700"
              >
                اعمال فیلتر
              </button>

              <button
                type="button"
                onClick={clearFilters}
                className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
              >
                پاک
              </button>
            </div>
          </div>
        </form>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {cartError && (
          <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            {cartError}
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500">
            در حال دریافت محصولات...
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
            <div className="text-lg font-bold">
              محصولی پیدا نشد
            </div>
            <div className="mt-2 text-sm text-slate-500">
              فیلترها یا عبارت جستجو را تغییر دهید.
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-slate-500">
                {formatPrice(products.length)} گزینه موجود
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((item) => (
                <article
                  key={item.stockItemId}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex h-32 items-center justify-center bg-gradient-to-br from-emerald-50 to-slate-100">
                    <div className="rounded-full bg-white px-5 py-3 text-sm font-black text-emerald-700 shadow-sm">
                      {item.product.category === 'supplement'
                        ? 'مکمل'
                        : categoryLabels[item.product.category] ??
                          item.product.category}
                    </div>
                  </div>

                  <div className="p-4">
                    <h2 className="font-bold text-slate-900">
                      {item.product.name}
                    </h2>

                    <div className="mt-1 text-xs text-slate-500">
                      {item.product.brand}
                      {' · '}
                      {item.product.unit}
                    </div>

                    <div className="mt-3 rounded-xl bg-slate-50 p-3">
                      <div className="text-xs text-slate-500">
                        داروخانه
                      </div>
                      <div className="mt-1 text-sm font-bold">
                        {item.pharmacy.name}
                      </div>
                      <div className="mt-1 text-xs text-slate-500">
                        {item.pharmacy.city}، {item.pharmacy.province}
                      </div>
                    </div>

                    <div className="mt-3 flex items-end justify-between">
                      <div>
                        <div className="text-xs text-slate-500">
                          قیمت
                        </div>
                        <div className="text-lg font-black text-emerald-700">
                          {formatPrice(item.sellingPrice)}
                          <span className="mr-1 text-xs font-medium text-slate-500">
                            تومان
                          </span>
                        </div>
                      </div>

                      <div className="text-left text-xs text-slate-500">
                        موجودی
                        <div className="font-bold text-slate-700">
                          {formatPrice(item.availableQuantity)}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 text-xs text-slate-500">
                      انقضا: {formatDate(item.expiryDate)}
                    </div>

                    <button
                      type="button"
                      disabled={
                        addingStockItemId === item.stockItemId ||
                        item.availableQuantity <= 0
                      }
                      onClick={() => handleAddToCart(item)}
                      className="mt-4 w-full rounded-xl bg-medical-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-medical-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                      {addingStockItemId === item.stockItemId
                        ? 'در حال افزودن...'
                        : 'افزودن به سبد'}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </main>
        )}

      {showCart && (
        <div className="fixed inset-0 z-[100]">
          <button
            type="button"
            aria-label="بستن سبد خرید"
            onClick={() => setShowCart(false)}
            className="absolute inset-0 bg-slate-900/40"
          />

          <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h2 className="text-lg font-black">
                  سبد خرید
                </h2>
                <div className="text-xs text-slate-500">
                  {cart?.totalItems
                    ? `${formatPrice(cart.totalItems)} قلم`
                    : 'سبد خالی است'}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowCart(false)}
                className="rounded-lg px-3 py-2 text-slate-500 hover:bg-slate-100"
              >
                بستن
              </button>
            </div>

            {cartLoading ? (
              <div className="flex flex-1 items-center justify-center text-sm text-slate-500">
                در حال دریافت سبد...
              </div>
            ) : !cart || cart.items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
                <div className="text-lg font-bold">
                  سبد خرید خالی است
                </div>
                <div className="mt-2 text-sm text-slate-500">
                  از بین محصولات موجود، کالاهای موردنظر خود را انتخاب کنید.
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 space-y-3 overflow-y-auto p-4">
                  {cart.items.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-slate-200 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-bold">
                            {item.product.name}
                          </div>
                          <div className="mt-1 text-xs text-slate-500">
                            {item.product.brand}
                          </div>
                          <div className="mt-1 text-xs text-slate-500">
                            {item.pharmacy.name}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-xs font-medium text-red-600 hover:text-red-700"
                        >
                          حذف
                        </button>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="text-sm font-black text-emerald-700">
                          {formatPrice(item.totalPrice)} تومان
                        </div>

                        <div className="flex items-center gap-2 rounded-xl border border-slate-200 p-1">
                          <button
                            type="button"
                            onClick={() =>
                              handleUpdateQuantity(
                                item.id,
                                item.quantity - 1,
                              )
                            }
                            className="h-8 w-8 rounded-lg hover:bg-slate-100"
                          >
                            −
                          </button>

                          <span className="min-w-8 text-center text-sm font-bold">
                            {formatPrice(item.quantity)}
                          </span>

                          <button
                            type="button"
                            disabled={
                              item.quantity >= item.availableQuantity
                            }
                            onClick={() =>
                              handleUpdateQuantity(
                                item.id,
                                item.quantity + 1,
                              )
                            }
                            className="h-8 w-8 rounded-lg hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-300"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-200 bg-slate-50 p-5">
                  <div className="mb-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-black text-slate-900">
                          آدرس ارسال
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          سفارش به این آدرس ارسال خواهد شد.
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          resetAddressForm();
                          setShippingError('');
                          setShowAddressForm(true);
                        }}
                        className="rounded-lg border border-medical-200 bg-white px-3 py-2 text-xs font-bold text-medical-700 hover:bg-medical-50"
                      >
                        + افزودن آدرس
                      </button>
                    </div>

                    {shippingLoading ? (
                      <div className="mt-3 rounded-xl bg-white p-4 text-center text-xs text-slate-500">
                        در حال دریافت آدرس‌ها...
                      </div>
                    ) : shippingAddresses.length === 0 ? (
                      <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800">
                        برای ثبت سفارش ابتدا یک آدرس ارسال ثبت کنید.
                      </div>
                    ) : (
                      <div className="mt-3 max-h-48 space-y-2 overflow-y-auto">
                        {shippingAddresses.map((item) => (
                          <div
                            key={item.id}
                            className={`rounded-xl border p-3 ${
                              selectedShippingAddressId === item.id
                                ? 'border-emerald-400 bg-emerald-50'
                                : 'border-slate-200 bg-white'
                            }`}
                          >
                            <label className="flex cursor-pointer items-start gap-3">
                              <input
                                type="radio"
                                name="shipping-address"
                                value={item.id}
                                checked={
                                  selectedShippingAddressId === item.id
                                }
                                onChange={() =>
                                  setSelectedShippingAddressId(item.id)
                                }
                                className="mt-1"
                              />

                              <span className="min-w-0 flex-1">
                                <span className="flex flex-wrap items-center gap-2">
                                  <span className="text-sm font-bold text-slate-900">
                                    {item.recipientName}
                                  </span>

                                  {item.isDefault && (
                                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                                      پیش‌فرض
                                    </span>
                                  )}
                                </span>

                                <span className="mt-1 block text-xs text-slate-500">
                                  {item.province}، {item.city}
                                </span>

                                <span className="mt-1 block text-xs leading-5 text-slate-600">
                                  {item.address}
                                </span>

                                <span className="mt-1 block text-xs text-slate-500">
                                  {item.phone} · کد پستی {item.postalCode}
                                </span>
                              </span>
                            </label>

                            <div className="mt-2 flex justify-end gap-2">
                              {!item.isDefault && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleSetDefaultAddress(item.id)
                                  }
                                  className="text-[11px] font-bold text-medical-700 hover:underline"
                                >
                                  پیش‌فرض
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => startEditAddress(item)}
                                className="text-[11px] font-bold text-slate-600 hover:underline"
                              >
                                ویرایش
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleDeleteAddress(item.id)
                                }
                                className="text-[11px] font-bold text-red-600 hover:underline"
                              >
                                حذف
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="border-t border-slate-200 pt-4">
                    <label htmlFor="customer-coupon-code" className="mb-2 block text-sm font-bold text-slate-800">
                      کد تخفیف
                    </label>
                    <div className="flex gap-2">
                      <input
                        id="customer-coupon-code"
                        dir="ltr"
                        value={couponCode}
                        onChange={(event) => {
                          setCouponCode(event.target.value);
                          setCouponPreview(null);
                          setCouponError('');
                        }}
                        placeholder="PH..."
                        className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-medical-500"
                      />
                      <button
                        type="button"
                        disabled={couponLoading || !couponCode.trim()}
                        onClick={handlePreviewCoupon}
                        className="rounded-xl border border-medical-200 bg-white px-3 py-2 text-xs font-bold text-medical-700 disabled:opacity-50"
                      >
                        {couponLoading ? 'بررسی...' : 'اعمال'}
                      </button>
                    </div>
                    {couponError && (
                      <p role="alert" className="mt-2 text-xs text-red-600">{couponError}</p>
                    )}
                    {couponPreview && (
                      <p className="mt-2 text-xs font-bold text-emerald-700">
                        کد {couponPreview.couponCode} معتبر است.
                      </p>
                    )}
                  </div>

                  <div className="mt-4 space-y-3 border-t border-slate-200 pt-4 text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-slate-500">جمع اقلام</span>
                      <span className="font-bold text-slate-900">{formatPrice(couponPreview?.subtotal ?? cart.subtotal)} تومان</span>
                    </div>
                    {couponPreview && (
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-emerald-700">تخفیف</span>
                        <span className="font-bold text-emerald-700">− {formatPrice(couponPreview.discountAmount)} تومان</span>
                      </div>
                    )}
                    {couponPreview && (
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-slate-500">بسته‌بندی و خدمات</span>
                        <span className="font-bold text-slate-900">{formatPrice(couponPreview.packagingServiceFee)} تومان</span>
                      </div>
                    )}
                    {couponPreview && (
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-slate-500">هزینه ارسال</span>
                        <span className="font-bold text-slate-900">
                          {couponPreview.freeShipping ? 'رایگان' : `${formatPrice(couponPreview.shippingAmount)} تومان`}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between gap-3 border-t border-slate-200 pt-3">
                      <span className="font-bold text-slate-600">{couponPreview ? 'مبلغ نهایی با تخفیف' : 'جمع سبد'}</span>
                      <span className="text-xl font-black text-slate-900">
                        {formatPrice(couponPreview?.totalAmount ?? cart.subtotal)} تومان
                      </span>
                    </div>
                  </div>

                  {shippingError && (
                    <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {shippingError}
                    </div>
                  )}

                  {checkoutError && (
                    <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {checkoutError}
                    </div>
                  )}

                  <button
                    type="button"
                    disabled={
                      checkoutLoading ||
                      shippingLoading ||
                      !selectedShippingAddressId
                    }
                    onClick={handleCheckout}
                    className="mt-4 w-full rounded-xl bg-medical-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-medical-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    {checkoutLoading
                      ? 'در حال ثبت سفارش...'
                      : 'ثبت سفارش'}
                  </button>
                </div>
              </>
            )}
          </aside>
        </div>
      )}
      </main>

      {showAddressForm && (
        <div className="fixed inset-0 z-[115] flex items-center justify-center bg-slate-950/50 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  {editingAddressId ? 'ویرایش آدرس' : 'افزودن آدرس'}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  اطلاعات آدرس ارسال سفارش را وارد کنید.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowAddressForm(false);
                  resetAddressForm();
                }}
                className="rounded-xl px-3 py-2 text-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                aria-label="بستن"
              >
                ×
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="text-sm font-bold text-slate-700">
                  نام گیرنده
                </label>
                <input
                  value={addressForm.recipientName}
                  onChange={(e) =>
                    setAddressForm((current) => ({
                      ...current,
                      recipientName: e.target.value,
                    }))
                  }
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-medical-500 focus:ring-4 focus:ring-medical-100"
                  placeholder="نام و نام خانوادگی"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700">
                  شماره موبایل
                </label>
                <input
                  value={addressForm.phone}
                  onChange={(e) =>
                    setAddressForm((current) => ({
                      ...current,
                      phone: e.target.value,
                    }))
                  }
                  inputMode="numeric"
                  placeholder="09123456789"
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-medical-500 focus:ring-4 focus:ring-medical-100"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700">
                  کد پستی
                </label>
                <input
                  value={addressForm.postalCode}
                  onChange={(e) =>
                    setAddressForm((current) => ({
                      ...current,
                      postalCode: e.target.value,
                    }))
                  }
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="۱۰ رقم"
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-medical-500 focus:ring-4 focus:ring-medical-100"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700">
                  استان
                </label>
                <input
                  value={addressForm.province}
                  onChange={(e) =>
                    setAddressForm((current) => ({
                      ...current,
                      province: e.target.value,
                    }))
                  }
                  placeholder="استان"
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-medical-500 focus:ring-4 focus:ring-medical-100"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700">
                  شهر
                </label>
                <input
                  value={addressForm.city}
                  onChange={(e) =>
                    setAddressForm((current) => ({
                      ...current,
                      city: e.target.value,
                    }))
                  }
                  placeholder="شهر"
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-medical-500 focus:ring-4 focus:ring-medical-100"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-sm font-bold text-slate-700">
                  نشانی کامل
                </label>
                <textarea
                  value={addressForm.address}
                  onChange={(e) =>
                    setAddressForm((current) => ({
                      ...current,
                      address: e.target.value,
                    }))
                  }
                  rows={4}
                  placeholder="خیابان، کوچه، پلاک، واحد و ..."
                  className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-medical-500 focus:ring-4 focus:ring-medical-100"
                />
              </div>

              <label className="sm:col-span-2 flex cursor-pointer items-center gap-2 text-sm font-bold text-slate-700">
                <input
                  type="checkbox"
                  checked={addressForm.isDefault === true}
                  onChange={(e) =>
                    setAddressForm((current) => ({
                      ...current,
                      isDefault: e.target.checked,
                    }))
                  }
                />
                استفاده به عنوان آدرس پیش‌فرض
              </label>
            </div>

            {shippingError && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {shippingError}
              </div>
            )}

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowAddressForm(false);
                  resetAddressForm();
                }}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                انصراف
              </button>

              <button
                type="button"
                disabled={shippingSaving}
                onClick={handleSaveAddress}
                className="flex-1 rounded-xl bg-medical-600 px-4 py-3 text-sm font-bold text-white hover:bg-medical-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {shippingSaving
                  ? 'در حال ذخیره...'
                  : editingAddressId
                    ? 'ذخیره تغییرات'
                    : 'افزودن آدرس'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showProfile && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/50 p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  حساب کاربری
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  مدیریت امنیت حساب و تغییر رمز عبور
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowProfile(false)}
                className="rounded-xl px-3 py-2 text-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                aria-label="بستن"
              >
                ×
              </button>
            </div>

            <div className="mt-6 rounded-2xl bg-slate-50 p-4">
              <div className="text-xs font-bold text-slate-400">
                حساب کاربری
              </div>
              <div className="mt-1 break-all text-sm font-bold text-slate-800">
                کاربر عادی
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    آدرس‌های ارسال
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    آدرس‌های مورد استفاده برای ثبت سفارش
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    resetAddressForm();
                    setShowAddressForm(true);
                  }}
                  className="rounded-xl bg-medical-600 px-3 py-2 text-xs font-bold text-white hover:bg-medical-700"
                >
                  افزودن آدرس
                </button>
              </div>

              {shippingLoading ? (
                <div className="mt-4 rounded-xl bg-slate-50 px-4 py-4 text-center text-sm text-slate-500">
                  در حال دریافت آدرس‌ها...
                </div>
              ) : shippingAddresses.length === 0 ? (
                <div className="mt-4 rounded-xl bg-slate-50 px-4 py-4 text-center text-sm text-slate-500">
                  هنوز آدرس ارسالی ثبت نکرده‌اید.
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  {shippingAddresses.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-xl border border-slate-200 bg-slate-50 p-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-black text-slate-900">
                              {item.recipientName}
                            </span>

                            {item.isDefault && (
                              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                                پیش‌فرض
                              </span>
                            )}
                          </div>

                          <div className="mt-2 text-xs leading-5 text-slate-600">
                            {item.province} / {item.city}
                          </div>

                          <div className="mt-1 text-xs leading-5 text-slate-600">
                            {item.address}
                          </div>

                          <div className="mt-1 text-xs text-slate-500">
                            {item.phone} · کد پستی {item.postalCode}
                          </div>
                        </div>

                        <div className="flex shrink-0 flex-col items-end gap-2">
                          {!item.isDefault && (
                            <button
                              type="button"
                              onClick={() =>
                                void handleSetDefaultAddress(item.id)
                              }
                              className="text-[11px] font-bold text-medical-700 hover:underline"
                            >
                              پیش‌فرض کردن
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => startEditAddress(item)}
                            className="text-[11px] font-bold text-slate-600 hover:underline"
                          >
                            ویرایش
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              void handleDeleteAddress(item.id)
                            }
                            className="text-[11px] font-bold text-red-600 hover:underline"
                          >
                            حذف
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                void handlePasswordChange();
              }}
              className="mt-6 space-y-4"
            >
              <div>
                <label className="text-sm font-bold text-slate-700">
                  رمز عبور فعلی
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(event) =>
                    setCurrentPassword(event.target.value)
                  }
                  autoComplete="current-password"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-medical-500 focus:ring-4 focus:ring-medical-100"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700">
                  رمز عبور جدید
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(event) =>
                    setNewPassword(event.target.value)
                  }
                  autoComplete="new-password"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-medical-500 focus:ring-4 focus:ring-medical-100"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700">
                  تکرار رمز عبور جدید
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  autoComplete="new-password"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-medical-500 focus:ring-4 focus:ring-medical-100"
                />
              </div>

              {profileError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {profileError}
                </div>
              )}

              {profileMessage && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  {profileMessage}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowProfile(false)}
                  className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
                >
                  بستن
                </button>

                <button
                  type="submit"
                  disabled={profileLoading}
                  className="flex-1 rounded-xl bg-medical-600 px-4 py-3 text-sm font-bold text-white hover:bg-medical-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {profileLoading
                    ? 'در حال تغییر...'
                    : 'تغییر رمز عبور'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
