// API Configuration Module
// By default, uses relative URLs ('') so requests go to the current host/origin (e.g. Vercel, Cloud Run, or localhost).
// You can override this by setting VITE_API_BASE_URL in your environment or setting window.__API_BASE_URL__.

const envBaseUrl = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_API_BASE_URL : '';
const customWindowUrl = typeof window !== 'undefined' ? (window as any).__API_BASE_URL__ : undefined;
const customStoredUrl = typeof localStorage !== 'undefined' ? localStorage.getItem('CUSTOM_API_BASE_URL') : null;

export const API_BASE_URL: string = (customWindowUrl || customStoredUrl || envBaseUrl || '').replace(/\/$/, '');

/**
 * Returns the full API URL for a given endpoint.
 * Example: getApiUrl('/api/ai/chat') => 'https://your-app.vercel.app/api/ai/chat' or '/api/ai/chat'
 */
export function getApiUrl(endpoint: string): string {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return API_BASE_URL ? `${API_BASE_URL}${cleanEndpoint}` : cleanEndpoint;
}
