import { apiRequest } from './client';
import { Pharmacy } from '../types';

export async function getPharmacies(): Promise<Pharmacy[]> {
  return apiRequest<Pharmacy[]>('/pharmacies');
}

