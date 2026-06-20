import { useSyncExternalStore } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

// ---------------------------------------------------------------------------
// Two modes:
//  - Supabase configured  -> real, server-side login (email + password).
//  - Not configured (demo) -> local login checked against a SHA-256 hash.
// ---------------------------------------------------------------------------

const ADMIN_KEY = 'machado_admin_auth';
const SESSION_HOURS = 12;

// Demo-mode credentials. The plaintext password is NOT stored — only its hash.
// (Used only until the Supabase keys are configured.)
const USERNAME = import.meta.env.VITE_ADMIN_USER ?? 'admin';
const PASSWORD_HASH =
  import.meta.env.VITE_ADMIN_PASSWORD_HASH ??
  'e9fc5d91c70d1228cbeb6b5eaf50157d8e04717f05b506aa1fdd7f34d30053ac';

// ---- shared store so every component sees the same auth state ----
let authed = false;
let loading = true;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach(l => l());
const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => { listeners.delete(cb); };
};

async function sha256(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

function readDemoSession(): boolean {
  const raw = localStorage.getItem(ADMIN_KEY);
  if (!raw) return false;
  const expiresAt = Number(raw);
  if (!expiresAt || Date.now() > expiresAt) {
    localStorage.removeItem(ADMIN_KEY);
    return false;
  }
  return true;
}

// ---- one-time initialization ----
if (isSupabaseConfigured && supabase) {
  supabase.auth.getSession().then(({ data }) => {
    authed = Boolean(data.session);
    loading = false;
    emit();
  });
  supabase.auth.onAuthStateChange((_event, session) => {
    authed = Boolean(session);
    loading = false;
    emit();
  });
} else {
  authed = readDemoSession();
  loading = false;
}

async function login(identifier: string, password: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.auth.signInWithPassword({
      email: identifier.trim(),
      password,
    });
    return !error; // onAuthStateChange flips the shared state on success
  }

  const hashed = await sha256(password);
  if (identifier === USERNAME && hashed === PASSWORD_HASH) {
    localStorage.setItem(ADMIN_KEY, String(Date.now() + SESSION_HOURS * 60 * 60 * 1000));
    authed = true;
    emit();
    return true;
  }
  return false;
}

async function logout(): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    await supabase.auth.signOut();
    return; // onAuthStateChange flips the shared state
  }
  localStorage.removeItem(ADMIN_KEY);
  authed = false;
  emit();
}

export function useAdmin() {
  const isAuthenticated = useSyncExternalStore(subscribe, () => authed, () => authed);
  const authLoading = useSyncExternalStore(subscribe, () => loading, () => loading);
  return { isAuthenticated, authLoading, login, logout, usesEmail: isSupabaseConfigured };
}
