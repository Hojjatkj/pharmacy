import { apiRequest } from './client';
import { PharmacyStockItem } from '../types';

export interface CreateStockItemPayload {
  pharmacyId?: string;
  productId: string;
  batchNumber: string;
  expiryDate: string;
  currentStock: number;
  dailySalesVelocity?: number;
  originalCost: number;
  sellingPrice: number;
  minAcceptablePriceB2B: number;
}

export interface UpdateStockItemPayload {
  batchNumber?: string;
  expiryDate?: string;
  currentStock?: number;
  dailySalesVelocity?: number;
  originalCost?: number;
  sellingPrice?: number;
  minAcceptablePriceB2B?: number;
}

export interface InventoryImportResponse {
  success: boolean;
  imported: number;
  totalRows: number;
}

export async function getInventory(
  pharmacyId?: string,
): Promise<PharmacyStockItem[]> {
  const query = pharmacyId
    ? `?pharmacyId=${encodeURIComponent(pharmacyId)}`
    : '';

  return apiRequest<PharmacyStockItem[]>(
    `/inventory${query}`,
  );
}

export async function getInventoryItem(
  id: string,
): Promise<PharmacyStockItem> {
  return apiRequest<PharmacyStockItem>(
    `/inventory/${id}`,
  );
}

export async function createInventoryItem(
  payload: CreateStockItemPayload,
): Promise<PharmacyStockItem> {
  return apiRequest<PharmacyStockItem>('/inventory', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateInventoryItem(
  id: string,
  payload: UpdateStockItemPayload,
): Promise<PharmacyStockItem> {
  return apiRequest<PharmacyStockItem>(
    `/inventory/${id}`,
    {
      method: 'PATCH',
      body: JSON.stringify(payload),
    },
  );
}

export interface DeleteInventoryResponse {
  id: string;
}

export async function deleteInventoryItem(
  id: string,
): Promise<DeleteInventoryResponse> {
  return apiRequest<DeleteInventoryResponse>(
    `/inventory/${id}`,
    {
      method: 'DELETE',
    },
  );
}

export async function importInventoryExcel(
  file: File,
  pharmacyId?: string,
): Promise<InventoryImportResponse> {
  const formData = new FormData();

  formData.append('file', file);

  if (pharmacyId) {
    formData.append('pharmacyId', pharmacyId);
  }

  return apiRequest<InventoryImportResponse>(
    '/inventory/import',
    {
      method: 'POST',
      body: formData,
    },
  );
}

export async function downloadInventoryImportTemplate(): Promise<Blob> {
  const token = localStorage.getItem('accessToken');

  const response = await fetch(
    `${getInventoryApiBaseUrl()}/inventory/import/template`,
    {
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : undefined,
    },
  );

  if (!response.ok) {
    const contentType =
      response.headers.get('content-type') ?? '';

    let message = `Request failed with status ${response.status}`;

    if (contentType.includes('application/json')) {
      const data = (await response.json()) as {
        message?: unknown;
      };

      if (data.message) {
        message = String(data.message);
      }
    }

    throw new Error(message);
  }

  return response.blob();
}

function getInventoryApiBaseUrl(): string {
  return import.meta.env.VITE_API_BASE_URL ??
    'http://localhost:3001/api/v1';
}
