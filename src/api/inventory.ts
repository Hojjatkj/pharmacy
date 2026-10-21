import { apiRequest, apiRequestBlob } from './client';
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
  return apiRequestBlob('/inventory/import/template');
}
