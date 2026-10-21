const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001/api/v1';

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = localStorage.getItem('accessToken');

  const headers = new Headers(options.headers);

  if (
    !headers.has('Content-Type') &&
    options.body &&
    !(options.body instanceof FormData)
  ) {
    headers.set(
      'Content-Type',
      'application/json',
    );
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get('content-type') ?? '';

  let data: unknown;

  if (contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const message =
      typeof data === 'object' &&
      data !== null &&
      'message' in data
        ? String((data as { message: unknown }).message)
        : typeof data === 'string' && data
          ? data
          : `Request failed with status ${response.status}`;

    throw new Error(message);
  }

  return data as T;
}

export function getApiBaseUrl(): string {
  return API_BASE_URL;
}
