import { supabase } from '@/lib/supabase';

const BASE_URL = 'https://keralaemployees.in';

const staticRoutes = [
  { url: '/', changeFrequency: 'daily', priority: 1.0 },
  { url: '/news', changeFrequency: 'daily', priority: 0.9 },
  { url: '/prc', changeFrequency: 'monthly', priority: 0.8 },
  { url: '/nps', changeFrequency: 'monthly', priority: 0.8 },
  { url: '/gpf', changeFrequency: 'monthly', priority: 0.8 },
  { url: '/departmental-tests', changeFrequency: 'weekly', priority: 0.7 },
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
