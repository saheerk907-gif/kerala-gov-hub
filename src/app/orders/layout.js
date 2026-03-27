import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Government Orders – Kerala Employees | DA, Bonus, Pension, GPF, MEDISEP GOs',
  description: 'All Kerala government orders (G.O.s) for state employees — DA orders, bonus orders, pension circulars, MEDISEP updates, pay revision, GPF and NPS notifications. Search and download latest GOs.',
  path: '/orders',
  keywords: [
    'Kerala government orders',
    'Kerala GO download',
    'DA order Kerala 2026',
    'bonus order Kerala employees',
    'pension circular Kerala',
    'MEDISEP GO Kerala',
    'GPF order Kerala',
    'pay revision order Kerala',
    'NPS order Kerala',
    'Kerala finance department orders',
    'G.O. Kerala employees',
    'കേരള സർക്കാർ ഉത്തരവ്',
  ],
});

export default function OrdersLayout({ children }) {
  return children;
}
