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
  { url: '/pension', changeFrequency: 'monthly', priority: 0.85 },
  { url: '/pension-calculation', changeFrequency: 'monthly', priority: 0.85 },
  { url: '/pension-forms', changeFrequency: 'monthly', priority: 0.85 },
  { url: '/dcrg', changeFrequency: 'monthly', priority: 0.8 },
  // Calculators
  { url: '/prc', changeFrequency: 'monthly', priority: 0.85 },
  { url: '/pay-scales', changeFrequency: 'yearly', priority: 0.85 },
  { url: '/da-arrear', changeFrequency: 'monthly', priority: 0.8 },
  { url: '/nps-aps', changeFrequency: 'monthly', priority: 0.8 },
  { url: '/gpf', changeFrequency: 'monthly', priority: 0.75 },
  // Forms
  { url: '/forms', changeFrequency: 'monthly', priority: 0.8 },
  { url: '/forms?cat=Pension', changeFrequency: 'monthly', priority: 0.7 },
  { url: '/forms?cat=GPF', changeFrequency: 'monthly', priority: 0.7 },
  { url: '/forms?cat=Leave', changeFrequency: 'monthly', priority: 0.7 },
  { url: '/forms?cat=NPS', changeFrequency: 'monthly', priority: 0.65 },
  { url: '/forms?cat=HBA', changeFrequency: 'monthly', priority: 0.65 },
  { url: '/forms?cat=Treasury', changeFrequency: 'monthly', priority: 0.65 },
  // Schemes / Info
  { url: '/nps', changeFrequency: 'monthly', priority: 0.75 },
  { url: '/ksr', changeFrequency: 'monthly', priority: 0.8 },
  { url: '/kerala-service-rules', changeFrequency: 'monthly', priority: 0.7 },
  // Departmental Tests
  { url: '/departmental-tests', changeFrequency: 'weekly', priority: 0.85 },
  { url: '/departmental-tests/quiz', changeFrequency: 'monthly', priority: 0.75 },
  { url: '/departmental-tests?dept=common', changeFrequency: 'monthly', priority: 0.7 },
  { url: '/departmental-tests?dept=revenue', changeFrequency: 'monthly', priority: 0.7 },
  { url: '/departmental-tests?dept=panchayat', changeFrequency: 'monthly', priority: 0.65 },
  { url: '/departmental-tests?dept=judiciary', changeFrequency: 'monthly', priority: 0.65 },
  { url: '/departmental-tests?dept=police', changeFrequency: 'monthly', priority: 0.65 },
  { url: '/departmental-tests?dept=education', changeFrequency: 'monthly', priority: 0.65 },
];

export default async function sitemap() {
  // Fetch all news IDs for dynamic routes
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

  // Fetch all article IDs for dynamic routes
  let articleRoutes = [];
  try {
    const { data } = await supabase
      .from('articles')
      .select('id, created_at')
      .order('created_at', { ascending: false });

    if (data) {
      articleRoutes = data.map((item) => ({
        url: `${BASE_URL}/articles/${item.id}`,
        lastModified: new Date(item.created_at),
        changeFrequency: 'never',
        priority: 0.65,
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

  return [...statics, ...newsRoutes, ...articleRoutes];
}
