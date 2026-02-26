import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Public client (for frontend reads)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client (for server-side operations with full access)
export function getAdminClient() {
  return createClient(
    supabaseUrl,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

// ============================================================
// DATA FETCHING FUNCTIONS
// ============================================================

export async function getSchemes() {
  const { data: schemes } = await supabase
    .from('schemes')
    .select(`*, scheme_details(*), scheme_tags(*)`)
    .eq('is_published', true)
    .order('sort_order');
  return schemes || [];
}

export async function getGovernmentOrders(limit = 20, category = null) {
  let query = supabase
    .from('government_orders')
    .select('*')
    .eq('is_published', true)
    .order('is_pinned', { ascending: false })
    .order('go_date', { ascending: false })
    .limit(limit);

  if (category && category !== 'all') {
    query = query.eq('category', category);
  }

  const { data } = await query;
  return data || [];
}

export async function getQuickLinks() {
  const { data } = await supabase
    .from('quick_links')
    .select('*')
    .eq('is_published', true)
    .order('sort_order');
  return data || [];
}

export async function getSiteStats() {
  const { data } = await supabase
    .from('site_stats')
    .select('*')
    .order('sort_order');
  return data || [];
}

export async function getHighlights() {
  const { data } = await supabase
    .from('highlights')
    .select(`*, highlight_tags(*)`)
    .eq('is_published', true)
    .order('sort_order');
  return data || [];
}
