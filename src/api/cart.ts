import { apiRequest } from './client';

export interface CartItem {
  id: string;
  stockItemId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  availableQuantity: number;
  product: {
    id: string;
    name: string;
    genericName: string;
    category: string;
    brand: string;
    unit: string;
  };
  pharmacy: {
    id: string;
    name: string;
    city: string;
    province: string;
  };
  expiryDate: string;
}

export interface Cart {
  id: string | null;
  items: CartItem[];
  totalItems: number;
  subtotal: number;
}

export interface B2CCheckoutResponse {
  orderId: string;
  status: string;
  pharmacyId: string;
  subtotal: number;
  discountAmount: number;
  couponCode: string | null;
  packagingServiceFee: number;
  shippingAmount: number;
  totalAmount: number;
  items: Array<{
    id: string;
    orderId: string;
    stockItemId: string;
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    createdAt: string;
  }>;
}

export interface B2COrderItem {
  id: string;
  orderId: string;
  stockItemId: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  createdAt: string;
}

export interface B2COrder {
  id: string;
  userId: string;
  pharmacyId: string;
  status: string;
  subtotal: number;
  discountAmount: number;
  couponCode: string | null;
  packagingServiceFee: number;
  shippingAmount: number;
  totalAmount: number;
  recipientName: string;
  phone: string;
  province: string;
  city: string;
  address: string;
  postalCode: string;
  createdAt: string;
  updatedAt: string;
  items: B2COrderItem[];
  pharmacy: {
    id: string;
    name: string;
    city: string;
    province: string;
  };
}

export function getOrders() {
  return apiRequest<B2COrder[]>('/cart/orders');
}

export interface CouponPreview {
  couponCode: string;
  discountAmount: number;
  packagingServiceFee: number;
  shippingAmount: number;
  subtotal: number;
  totalAmount: number;
  freeShipping: boolean;
}

export function previewCoupon(couponCode: string) {
  return apiRequest<CouponPreview>('/cart/coupon-preview', {
    method: 'POST',
    body: JSON.stringify({ couponCode }),
  });
}

export function checkoutCart(
  shippingAddressId: string,
  couponCode?: string,
) {
  return apiRequest<B2CCheckoutResponse>('/cart/checkout', {
    method: 'POST',
    body: JSON.stringify({
      shippingAddressId,
      ...(couponCode?.trim() ? { couponCode: couponCode.trim() } : {}),
    }),
  });
}

export interface CustomerNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  metadata: {
    campaignId?: string;
    couponCode?: string;
    discountType?: string;
    discountValue?: number;
    expiresAt?: string;
    freeShipping?: boolean;
    [key: string]: unknown;
  } | null;
  readAt: string | null;
  createdAt: string;
}

export function getMyNotifications() {
  return apiRequest<CustomerNotification[]>('/promotions/notifications');
}

export function markNotificationRead(notificationId: string) {
  return apiRequest<{ success: boolean }>(
    `/promotions/notifications/${encodeURIComponent(notificationId)}/read`,
    { method: 'PATCH' },
  );
}

export function getCart() {
  return apiRequest<Cart>('/cart');
}

export function addCartItem(stockItemId: string, quantity = 1) {
  return apiRequest<Cart>('/cart/items', {
    method: 'POST',
    body: JSON.stringify({
      stockItemId,
      quantity,
    }),
  });
}

export function updateCartItem(itemId: string, quantity: number) {
  return apiRequest<Cart>(`/cart/items/${itemId}`, {
    method: 'PATCH',
    body: JSON.stringify({ quantity }),
  });
}

export function removeCartItem(itemId: string) {
  return apiRequest<Cart>(`/cart/items/${itemId}`, {
    method: 'DELETE',
  });
}
