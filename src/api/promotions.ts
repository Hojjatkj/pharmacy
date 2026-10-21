import { apiRequest } from './client';

export type CampaignDiscountType = 'PERCENTAGE' | 'FIXED';

export interface CreateCampaignRequest {
  name: string;
  message: string;
  discountType: CampaignDiscountType;
  discountValue: number;
  maxDiscountAmount?: number;
  minSubtotal?: number;
  startsAt?: string;
  expiresAt: string;
  isActive: boolean;
  freeShipping: boolean;
  sendEmail: boolean;
  showOnsite: boolean;
}

export interface CreateCampaignResponse {
  campaign: {
    id: string;
    name: string;
    discountType: CampaignDiscountType;
    discountValue: number;
    startsAt: string;
    expiresAt: string;
    isActive: boolean;
    freeShipping: boolean;
  };
  targetedCustomers: number;
  onsiteNotifications: number;
  emailSent: number;
  emailFailed: number;
  emailSkipped: number;
}

export async function createPromotionCampaign(
  data: CreateCampaignRequest,
): Promise<CreateCampaignResponse> {
  return apiRequest<CreateCampaignResponse>('/promotions/campaigns', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
