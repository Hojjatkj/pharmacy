import { apiRequest } from './client';

export type StorefrontProduct = {
  stockItemId: string;
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
  sellingPrice: number;
  availableQuantity: number;
  expiryDate: string;
};

export type PublicStorefrontProduct = Omit<
  StorefrontProduct,
  'expiryDate'
>;

export type StorefrontFilters = {
  search?: string;
  category?: string;
  pharmacyId?: string;
  minPrice?: string;
  maxPrice?: string;
};

export async function getPublicStorefrontProducts(
  filters: StorefrontFilters = {},
): Promise<PublicStorefrontProduct[]> {
  const params = new URLSearchParams();

  if (filters.search?.trim()) {
    params.set('search', filters.search.trim());
  }

  if (filters.category) {
    params.set('category', filters.category);
  }

  if (filters.pharmacyId) {
    params.set('pharmacyId', filters.pharmacyId);
  }

  if (filters.minPrice) {
    params.set('minPrice', filters.minPrice);
  }

  if (filters.maxPrice) {
    params.set('maxPrice', filters.maxPrice);
  }

  const query = params.toString();

  return apiRequest<PublicStorefrontProduct[]>(
    `/storefront/public-products${query ? `?${query}` : ''}`,
  );
}

export async function getStorefrontProducts(
  filters: StorefrontFilters = {},
): Promise<StorefrontProduct[]> {
  const params = new URLSearchParams();

  if (filters.search?.trim()) {
    params.set('search', filters.search.trim());
  }

  if (filters.category) {
    params.set('category', filters.category);
  }

  if (filters.pharmacyId) {
    params.set('pharmacyId', filters.pharmacyId);
  }

  if (filters.minPrice) {
    params.set('minPrice', filters.minPrice);
  }

  if (filters.maxPrice) {
    params.set('maxPrice', filters.maxPrice);
  }

  const query = params.toString();

  return apiRequest<StorefrontProduct[]>(
    `/storefront/products${query ? `?${query}` : ''}`,
  );
}
