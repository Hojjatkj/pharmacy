import { apiRequest } from './client';

export interface ShippingAddress {
  id: string;
  recipientName: string;
  phone: string;
  province: string;
  city: string;
  address: string;
  postalCode: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ShippingAddressInput {
  recipientName: string;
  phone: string;
  province: string;
  city: string;
  address: string;
  postalCode: string;
  isDefault?: boolean;
}

export function getShippingAddresses() {
  return apiRequest<ShippingAddress[]>('/shipping-addresses');
}

export function createShippingAddress(data: ShippingAddressInput) {
  return apiRequest<ShippingAddress>('/shipping-addresses', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateShippingAddress(
  id: string,
  data: Partial<ShippingAddressInput>,
) {
  return apiRequest<ShippingAddress>(`/shipping-addresses/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export function deleteShippingAddress(id: string) {
  return apiRequest<{ message: string }>(`/shipping-addresses/${id}`, {
    method: 'DELETE',
  });
}
