export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/forum/'],
      },
    ],
    sitemap: 'https://keralaemployees.in/sitemap.xml',
  };
}
