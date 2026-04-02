import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// വാർത്തകൾ വെബ്‌സൈറ്റിൽ കാണിക്കാൻ (Fetch News)
export async function getNews() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('category', 'news')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function getSchemes() {
  if (!supabase) return [];
  const { data, error } = await supabase.from('schemes').select('*')
  if (error) throw error
  return data
}

export async function getGovernmentOrders() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('government_orders')
    .select('*')
    .order('go_date', { ascending: false })
  if (error) throw error
  // PDF orders first, then no-PDF orders
  return (data || []).sort((a, b) => {
    if (a.pdf_url && !b.pdf_url) return -1;
    if (!a.pdf_url && b.pdf_url) return 1;
    return 0;
  });
}

export async function getQuickLinks() {
  if (!supabase) return [];
  const { data, error } = await supabase.from('quick_links').select('*')
  if (error) throw error
  return data
}

export async function getSiteStats() {
  if (!supabase) return [];
  const { data, error } = await supabase.from('site_stats').select('*')
  if (error) throw error
  return data
}

export async function getHighlights() {
  if (!supabase) return [];
  const { data, error } = await supabase.from('highlights').select('*')
  if (error) throw error
  return data
}

// വാർത്തകൾ അഡ്മിൻ പേജിൽ നിന്ന് ചേർക്കാൻ (Add News)
export async function getAudioClasses() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('audio_classes')
    .select('*')
    .order('episode_number', { ascending: true });
  if (error) throw error;
  return data;
}

export async function getNpsDocuments() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('nps_documents')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return [];
  return data || [];
}

export async function getArticles(category = 'all', limit = 13, offset = 0) {
  if (!supabase) return [];
  let query = supabase
    .from('articles')
    .select('id,title_ml,title_en,summary_ml,image_url,category,created_at')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);
  if (category !== 'all') query = query.eq('category', category);
  const { data, error } = await query;
  if (error) return [];
  return data || [];
}

export async function getAllNews(limit = 20, offset = 0) {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('news')
    .select('id,title_ml,category,created_at')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);
  if (error) return [];
  return data || [];
}

export async function getNpsArticles() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('category', 'nps')
    .order('created_at', { ascending: false });
  if (error) return [];
  return data || [];
}

export async function submitNpsQuery(name, question) {
  if (!supabase) throw new Error('Supabase not configured');
  const { error } = await supabase
    .from('nps_queries')
    .insert([{ name, question }]);
  if (error) throw error;
}

export const addNews = async (newsData) => {
  const { data, error } = await supabase
    .from('news')
    .insert([
      {
        title_ml: newsData.title_ml,
        description_ml: newsData.description_ml,
        category: newsData.category || 'Latest',
        created_at: new Date().toISOString(),
      }
    ]);

  if (error) {
    console.error("Supabase Insert Error:", error);
    throw error;
  }
  return data;
};
