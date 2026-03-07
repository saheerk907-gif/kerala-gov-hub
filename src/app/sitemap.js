import { supabase } from '@/lib/supabase';

const BASE_URL = 'https://keralaemployees.in';

const staticRoutes = [
  // Core
  { url: '/', changeFrequency: 'daily', priority: 1.0 },
  { url: '/news', changeFrequency: 'daily', priority: 0.9 },
  { url: '/articles', changeFrequency: 'daily', priority: 0.9 },
  // MEDISEP
  { url: '/medisep', changeFrequency: 'weekly', priority: 0.9 },
  { url: '/medisep/faq', changeFrequency: 'monthly', priority: 0.85 },
  { url: '/medisep-claim-process', changeFrequency: 'monthly', priority: 0.85 },
  { url: '/medisep-complaint', changeFrequency: 'monthly', priority: 0.85 },
  // Pension
  { url: '/pension-calculation', changeFrequency: 'monthly', priority: 0.85 },
  // Calculators
  { url: '/prc', changeFrequency: 'monthly', priority: 0.8 },
  { url: '/pension', changeFrequency: 'monthly', priority: 0.8 },
  { url: '/da-arrear', changeFrequency: 'monthly', priority: 0.8 },
  { url: '/dcrg', changeFrequency: 'monthly', priority: 0.75 },
  { url: '/nps-aps', changeFrequency: 'monthly', priority: 0.75 },
  // Schemes / Info
  { url: '/nps', changeFrequency: 'monthly', priority: 0.75 },
  { url: '/gpf', changeFrequency: 'monthly', priority: 0.75 },
  { url: '/ksr', changeFrequency: 'monthly', priority: 0.75 },
  { url: '/kerala-service-rules', changeFrequency: 'monthly', priority: 0.7 },
  { url: '/departmental-tests', changeFrequency: 'weekly', priority: 0.8 },
];

export default async function sitemap() {
  // Fetch all news article IDs + dates for dynamic routes
  let newsRoutes = [];
  try {
    const { data } = await supabase
      .from('news')
      .select('id, created_at')
      .order('created_at', { ascending: false });

    if (data) {
      newsRoutes = data.map((item) => ({
        url: `${BASE_URL}/news/${item.id}`,
        lastModified: new Date(item.created_at),
        changeFrequency: 'never',
        priority: 0.6,
      }));
    }
  } catch {
    // if fetch fails, sitemap still works with static routes
  }

  const statics = staticRoutes.map((route) => ({
    url: `${BASE_URL}${route.url}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  return [...statics, ...newsRoutes];
}
