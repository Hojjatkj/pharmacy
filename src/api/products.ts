import { apiRequest } from './client';
import { ProductItem } from '../types';

export async function getProducts(): Promise<ProductItem[]> {
  return apiRequest<ProductItem[]>('/products');
}
