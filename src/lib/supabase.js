import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
