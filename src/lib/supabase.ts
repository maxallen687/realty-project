import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// =============================================================================
// CONFIGURAÇÃO DO SUPABASE  —  preencha os dois valores abaixo.
// -----------------------------------------------------------------------------
// Copie-os do painel do Supabase em:  Settings > API
//   • Project URL      -> SUPABASE_URL
//   • anon public key  -> SUPABASE_ANON_KEY
//
// A chave "anon public" foi feita para ficar visível no navegador — pode
// deixá-la aqui e commitar sem problema. A proteção real dos dados vem das
// regras de segurança (RLS) definidas em supabase/schema.sql.
//
// Deixar estes valores AQUI (em vez de depender das variáveis da Vercel)
// garante que TODO deploy — em qualquer serviço — já sai conectado ao banco.
// Se preferir, ainda pode usar as variáveis VITE_SUPABASE_* na Vercel; elas
// têm prioridade sobre os valores abaixo.
// =============================================================================
const SUPABASE_URL = 'https://tyzcbxmbqvxwolrctsfo.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_16cQVG1hjyPHzTQeRH0qyw_6IamziwX';

// As variáveis de ambiente (se existirem) têm prioridade; senão usa os valores acima.
const envUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const envAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

const url = (envUrl || SUPABASE_URL || '').trim() || undefined;
const anonKey = (envAnonKey || SUPABASE_ANON_KEY || '').trim() || undefined;

// When the keys are not configured yet, the site keeps working in "demo mode"
// (local browser storage). As soon as the keys are present, every read/write
// goes to the real database and is shared with all visitors.
export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url!, anonKey!)
  : null;

export const PROPERTY_IMAGES_BUCKET = 'property-images';
