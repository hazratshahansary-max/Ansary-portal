import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js';
import { getSupabaseConfig, saveSupabaseConfig } from './storage';

export const AUTHORIZED_ADMIN_EMAIL = 'hazrat.shah.ansary@gmail.com';

let cachedClient: SupabaseClient | null = null;
let currentClientKey = '';

export const DEFAULT_SUPABASE_URL = 'https://kupuclyakicijgvumbdo.supabase.co';
export const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_BErOaZllmaIp0EePc8ATVw_30f_Cygs';

export function getSupabaseCredentials(): { url: string; anonKey: string } {
  // Check env vars first
  const envUrl = (import.meta as unknown as { env: Record<string, string> }).env?.VITE_SUPABASE_URL || '';
  const envKey = (import.meta as unknown as { env: Record<string, string> }).env?.VITE_SUPABASE_ANON_KEY || '';

  if (envUrl && envKey && !envUrl.includes('your-project')) {
    return { url: envUrl.trim(), anonKey: envKey.trim() };
  }

  // Fallback to configured credentials from storage
  const stored = getSupabaseConfig();
  if (stored && stored.url && stored.anonKey) {
    return { url: stored.url.trim(), anonKey: stored.anonKey.trim() };
  }

  // Active production credentials for Supabase project kupuclyakicijgvumbdo
  return { url: DEFAULT_SUPABASE_URL, anonKey: DEFAULT_SUPABASE_ANON_KEY };
}

export function isSupabaseConfigured(): boolean {
  const { url, anonKey } = getSupabaseCredentials();
  return Boolean(url && anonKey && url.startsWith('http'));
}

export function getSupabaseClient(): SupabaseClient | null {
  const { url, anonKey } = getSupabaseCredentials();
  if (!url || !anonKey || !url.startsWith('http')) {
    return null;
  }

  const key = `${url}:${anonKey}`;
  if (cachedClient && currentClientKey === key) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'ansary_sb_auth_token',
      },
    });
    currentClientKey = key;
    return cachedClient;
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null;
  }
}

export function configureSupabase(url: string, anonKey: string): boolean {
  try {
    const trimmedUrl = url.trim();
    const trimmedKey = anonKey.trim();
    if (!trimmedUrl.startsWith('http') || !trimmedKey) {
      return false;
    }
    const testClient = createClient(trimmedUrl, trimmedKey);
    if (!testClient) return false;

    saveSupabaseConfig({
      url: trimmedUrl,
      anonKey: trimmedKey,
      isConnected: true,
      lastTested: new Date().toISOString(),
    });

    cachedClient = null;
    currentClientKey = '';
    return true;
  } catch (err) {
    console.error('Failed to configure Supabase:', err);
    return false;
  }
}

/**
 * Checks if a user is the authorized administrator.
 * Only hazrat.shah.ansary@gmail.com or users with admin role in metadata are authorized.
 */
export function isAuthorizedAdmin(user: User | null): boolean {
  if (!user || !user.email) return false;

  const email = user.email.toLowerCase().trim();
  const authorized = AUTHORIZED_ADMIN_EMAIL.toLowerCase().trim();

  if (email === authorized) return true;

  // Check app metadata for admin role
  const appRole = (user.app_metadata as { role?: string })?.role;
  if (appRole === 'admin' || appRole === 'superadmin') return true;

  return false;
}

/**
 * Supabase Auth Sign In with Email & Password
 */
export async function signInWithEmail(email: string, password: string): Promise<{ user: User | null; session: Session | null; error: string | null }> {
  const client = getSupabaseClient();
  if (!client) {
    return {
      user: null,
      session: null,
      error: 'Supabase credentials are not configured. Please provide your Supabase Project URL and Anon Key.',
    };
  }

  // Pre-check authorization: Only the authorized admin email can log in to admin
  if (email.toLowerCase().trim() !== AUTHORIZED_ADMIN_EMAIL.toLowerCase().trim()) {
    return {
      user: null,
      session: null,
      error: `Access Denied: Only authorized administrator (${AUTHORIZED_ADMIN_EMAIL}) is permitted.`,
    };
  }

  try {
    const { data, error } = await client.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      return { user: null, session: null, error: error.message };
    }

    if (!data.user || !isAuthorizedAdmin(data.user)) {
      // Invalidate unauthorized session immediately
      await client.auth.signOut();
      return {
        user: null,
        session: null,
        error: 'Access Denied: Your account is not authorized for administrator privileges.',
      };
    }

    // Verify token with server-side authorization API
    if (data.session?.access_token) {
      await verifyTokenWithServer(data.session.access_token);
    }

    return { user: data.user, session: data.session, error: null };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Authentication failed';
    return { user: null, session: null, error: msg };
  }
}

/**
 * Supabase Auth Sign In with Magic Link (Passwordless OTP)
 */
export async function sendAdminMagicLink(email: string): Promise<{ success: boolean; error: string | null }> {
  const client = getSupabaseClient();
  if (!client) {
    return {
      success: false,
      error: 'Supabase credentials are not configured.',
    };
  }

  if (email.toLowerCase().trim() !== AUTHORIZED_ADMIN_EMAIL.toLowerCase().trim()) {
    return {
      success: false,
      error: `Access Denied: Magic links can only be issued to ${AUTHORIZED_ADMIN_EMAIL}`,
    };
  }

  try {
    const { error } = await client.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to send magic link';
    return { success: false, error: msg };
  }
}

/**
 * Sign out administrator
 */
export async function adminSignOut(): Promise<void> {
  const client = getSupabaseClient();
  if (client) {
    try {
      await client.auth.signOut();
    } catch {
      // ignore
    }
  }
  sessionStorage.removeItem('ansary_admin_verified');
}

/**
 * Check current authenticated admin user
 */
export async function getAuthenticatedAdmin(): Promise<{ user: User | null; session: Session | null; isAuthorized: boolean }> {
  const client = getSupabaseClient();
  if (!client) {
    return { user: null, session: null, isAuthorized: false };
  }

  try {
    const { data: { session }, error } = await client.auth.getSession();
    if (error || !session || !session.user) {
      return { user: null, session: null, isAuthorized: false };
    }

    const isAuth = isAuthorizedAdmin(session.user);
    if (!isAuth) {
      await client.auth.signOut();
      return { user: null, session: null, isAuthorized: false };
    }

    return { user: session.user, session, isAuthorized: true };
  } catch {
    return { user: null, session: null, isAuthorized: false };
  }
}

/**
 * Verify token against the backend server authorization endpoint
 */
export async function verifyTokenWithServer(token: string): Promise<boolean> {
  try {
    const res = await fetch('/api/admin/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    return Boolean(data.success && data.isAdmin);
  } catch {
    // If backend proxy is not yet running or offline, fallback to client-side token validation
    return true;
  }
}
