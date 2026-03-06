import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// വാർത്തകൾ വെബ്‌സൈറ്റിൽ കാണിക്കാൻ (Fetch News)
export async function getNews() {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function getSchemes() {
  const { data, error } = await supabase.from('schemes').select('*')
  if (error) throw error
  return data
}

export async function getGovernmentOrders() {
  const { data, error } = await supabase.from('government_orders').select('*')
  if (error) throw error
  return data
}

export async function getQuickLinks() {
  const { data, error } = await supabase.from('quick_links').select('*')
  if (error) throw error
  return data
}

export async function getSiteStats() {
  const { data, error } = await supabase.from('site_stats').select('*')
  if (error) throw error
  return data
}

export async function getHighlights() {
  const { data, error } = await supabase.from('highlights').select('*')
  if (error) throw error
  return data
}

// വാർത്തകൾ അഡ്മിൻ പേജിൽ നിന്ന് ചേർക്കാൻ (Add News)
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
