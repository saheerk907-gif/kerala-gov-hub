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
  // Acts & Rules
  { url: '/acts-rules', changeFrequency: 'weekly', priority: 0.90 },
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
  { url: '/ksr', changeFrequency: 'monthly', priority: 0.85 },
  { url: '/ksr/part-1', changeFrequency: 'monthly', priority: 0.80 },
  { url: '/ksr/part-2', changeFrequency: 'monthly', priority: 0.80 },
  { url: '/ksr/part-3', changeFrequency: 'monthly', priority: 0.80 },
  { url: '/ksr/orders', changeFrequency: 'weekly', priority: 0.85 },
  { url: '/ksr/rules/earned-leave', changeFrequency: 'monthly', priority: 0.80 },
  { url: '/ksr/rules/joining-time', changeFrequency: 'monthly', priority: 0.80 },
  { url: '/ksr/rules/maternity-leave', changeFrequency: 'monthly', priority: 0.80 },
  { url: '/ksr/rules/study-leave', changeFrequency: 'monthly', priority: 0.75 },
  { url: '/ksr/rules/transfer-ta', changeFrequency: 'monthly', priority: 0.75 },
  { url: '/ksr/rules/dcrg', changeFrequency: 'monthly', priority: 0.80 },
  { url: '/ksr/rules/family-pension', changeFrequency: 'monthly', priority: 0.80 },
  { url: '/ksr/rules/disciplinary', changeFrequency: 'monthly', priority: 0.75 },
  { url: '/kerala-service-rules', changeFrequency: 'monthly', priority: 0.70 },
  // Info pages
  { url: '/about', changeFrequency: 'yearly', priority: 0.5 },
  { url: '/contact', changeFrequency: 'yearly', priority: 0.5 },
  { url: '/privacy-policy', changeFrequency: 'monthly', priority: 0.4 },
  { url: '/disclaimer', changeFrequency: 'monthly', priority: 0.4 },
  // Departmental Tests
  { url: '/departmental-tests', changeFrequency: 'weekly', priority: 0.85 },
  { url: '/departmental-tests/quiz', changeFrequency: 'monthly', priority: 0.75 },
  { url: '/departmental-tests?dept=common', changeFrequency: 'monthly', priority: 0.7 },
  { url: '/departmental-tests?dept=revenue', changeFrequency: 'monthly', priority: 0.7 },
  { url: '/departmental-tests?dept=panchayat', changeFrequency: 'monthly', priority: 0.65 },
  { url: '/departmental-tests?dept=judiciary', changeFrequency: 'monthly', priority: 0.65 },
  { url: '/departmental-tests?dept=police', changeFrequency: 'monthly', priority: 0.65 },
  { url: '/departmental-tests?dept=education', changeFrequency: 'monthly', priority: 0.65 },
  // Experiences (UGC — high crawl frequency for new content)
  { url: '/experiences', changeFrequency: 'daily', priority: 0.85 },
  { url: '/experiences/submit', changeFrequency: 'yearly', priority: 0.5 },
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

  // Fetch all acts for dynamic routes
  let actsRoutes = [];
  try {
    const { data } = await supabase
      .from('acts_rules')
      .select('slug, updated_at')
      .eq('is_published', true);
    if (data) {
      actsRoutes = data.map(a => ({
        url: `${BASE_URL}/acts-rules/${a.slug}`,
        lastModified: new Date(a.updated_at || new Date()),
        changeFrequency: 'monthly',
        priority: 0.85,
      }));
    }
  } catch {}

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

  // Fetch published experiences for dynamic routes
  let experienceRoutes = [];
  try {
    const { data } = await supabase
      .from('experiences')
      .select('id, published_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (data) {
      experienceRoutes = data.map((item) => ({
        url: `${BASE_URL}/experiences/${item.id}`,
        lastModified: new Date(item.published_at || new Date()),
        changeFrequency: 'monthly',
        priority: 0.70,
      }));
    }
  } catch {}

  const statics = staticRoutes.map((route) => ({
    url: `${BASE_URL}${route.url}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  return [...statics, ...actsRoutes, ...newsRoutes, ...articleRoutes, ...experienceRoutes];
}
