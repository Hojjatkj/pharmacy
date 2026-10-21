import { apiRequest } from './client';

export type ExchangeOfferStatus =
  | 'ACTIVE'
  | 'PAUSED'
  | 'SOLD_OUT'
  | 'EXPIRED'
  | 'CANCELLED';

export type OrderStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'RESERVED'
  | 'PAID'
  | 'SHIPPED'
  | 'RECEIVED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'DISPUTED';

export interface ExchangeProduct {
  id: string;
  name: string;
  genericName: string;
  brand: string;
  ircCode: string;
  category: string;
}

export interface ExchangeStockItem {
  id: string;
  batchNumber: string;
  expiryDate: string;
  product: ExchangeProduct;
}

export interface ExchangeSeller {
  id: string;
  name: string;
  city: string;
  trustScore: number;
}

export interface ExchangeOffer {
  id: string;
  quantity: number;
  remainingQuantity: number;
  unitPrice: number;
  expiresAt: string | null;
  createdAt: string;
  sellerPharmacy: ExchangeSeller;
  stockItem: ExchangeStockItem;
}

export interface MyExchangeOffer extends ExchangeOffer {
  sellerPharmacyId: string;
  stockItemId: string;
  status: ExchangeOfferStatus;
  updatedAt: string;
}

export interface ExchangeOrder {
  id: string;
  offerId: string;
  buyerPharmacyId: string;
  sellerPharmacyId: string;
  quantity: number;
  agreedUnitPrice: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  offer: {
    stockItem: ExchangeStockItem;
  };
  transfer: {
    id: string;
    status: 'PENDING' | 'SHIPPED';
    shippedAt: string | null;
    receivedAt: string | null;
    completedAt: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
}

export interface CreateOfferPayload {
  stockItemId: string;
  quantity: number;
  unitPrice: number;
  expiresAt: string;
}

export interface CreateOrderPayload {
  offerId: string;
  quantity: number;
}

export async function getExchangeOffers(): Promise<ExchangeOffer[]> {
  return apiRequest<ExchangeOffer[]>('/exchange/offers');
}

export async function getMyExchangeOffers(): Promise<MyExchangeOffer[]> {
  return apiRequest<MyExchangeOffer[]>('/exchange/offers/mine');
}

export async function createExchangeOffer(
  payload: CreateOfferPayload,
): Promise<MyExchangeOffer> {
  return apiRequest<MyExchangeOffer>('/exchange/offers', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function cancelExchangeOffer(
  id: string,
): Promise<MyExchangeOffer> {
  return apiRequest<MyExchangeOffer>(`/exchange/offers/${id}/cancel`, {
    method: 'PATCH',
  });
}

export async function createExchangeOrder(
  payload: CreateOrderPayload,
): Promise<ExchangeOrder> {
  return apiRequest<ExchangeOrder>('/exchange/orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getExchangeOrders(): Promise<ExchangeOrder[]> {
  return apiRequest<ExchangeOrder[]>('/exchange/orders');
}

export async function getExchangeOrder(
  id: string,
): Promise<ExchangeOrder> {
  return apiRequest<ExchangeOrder>(`/exchange/orders/${id}`);
}

export async function acceptExchangeOrder(
  id: string,
): Promise<ExchangeOrder> {
  return apiRequest<ExchangeOrder>(`/exchange/orders/${id}/accept`, {
    method: 'PATCH',
  });
}

export async function shipExchangeOrder(
  id: string,
): Promise<ExchangeOrder> {
  return apiRequest<ExchangeOrder>(`/exchange/orders/${id}/ship`, {
    method: 'PATCH',
  });
}

export async function receiveExchangeOrder(
  id: string,
): Promise<ExchangeOrder> {
  return apiRequest<ExchangeOrder>(`/exchange/orders/${id}/receive`, {
    method: 'PATCH',
  });
}

export async function completeExchangeOrder(
  id: string,
): Promise<ExchangeOrder> {
  return apiRequest<ExchangeOrder>(`/exchange/orders/${id}/complete`, {
    method: 'PATCH',
  });
}

export async function cancelExchangeOrder(
  id: string,
): Promise<ExchangeOrder> {
  return apiRequest<ExchangeOrder>(`/exchange/orders/${id}/cancel`, {
    method: 'PATCH',
  });
}
