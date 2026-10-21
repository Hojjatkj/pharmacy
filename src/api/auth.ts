import { apiRequest } from './client';
import {
  clearAccessToken,
  getAccessToken,
  setAccessToken,
} from '../lib/auth-token';

export interface LoginResponse {
  accessToken: string;
  user: MeResponse;
}

export interface RegisterRequest {
  email: string;
  password: string;
  pharmacyName: string;
  licenseNumber: string;
  technicalManager: string;
  city: string;
  province: string;
  address: string;
  phone: string;
  acceptUserAgreement: boolean;
}

export interface CustomerRegisterRequest {
  email: string;
  password: string;
  acceptUserAgreement: boolean;
}

export interface RegisterResponse {
  user: MeResponse;
}

export interface UserAgreementResponse {
  id: string;
  version: string;
  title: string;
  content: string;
  effectiveAt: string;
}

export interface MeResponse {
  id: string;
  email: string;
  role:
    | 'USER'
    | 'SUPER_ADMIN'
    | 'PLATFORM_ADMIN'
    | 'PHARMACY_OWNER'
    | 'PHARMACY_STAFF';
  pharmacyId: string | null;
  createdAt?: string;
}

export interface UpdateProfileResponse {
  message: string;
}

export async function login(
  email: string,
  password: string,
): Promise<LoginResponse> {
  const result = await apiRequest<LoginResponse>(
    '/auth/login',
    {
      method: 'POST',
      skipAuth: true,
      body: JSON.stringify({
        email,
        password,
      }),
    },
  );

  setAccessToken(result.accessToken);

  return result;
}

export async function getActiveUserAgreement(): Promise<UserAgreementResponse> {
  return apiRequest<UserAgreementResponse>(
    '/auth/user-agreement',
  );
}

export async function register(
  data: RegisterRequest,
): Promise<RegisterResponse> {
  return apiRequest<RegisterResponse>(
    '/auth/register',
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
  );
}

export async function registerUser(
  data: CustomerRegisterRequest,
): Promise<RegisterResponse> {
  return apiRequest<RegisterResponse>(
    '/auth/register-user',
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
  );
}

export async function getMe(): Promise<MeResponse> {
  return apiRequest<MeResponse>('/auth/me');
}

export async function updatePassword(
  currentPassword: string,
  newPassword: string,
): Promise<UpdateProfileResponse> {
  return apiRequest<UpdateProfileResponse>('/auth/me', {
    method: 'PATCH',
    body: JSON.stringify({
      currentPassword,
      newPassword,
    }),
  });
}

export function logout() {
  clearAccessToken();
}

export { getAccessToken };