import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'DA Arrear Calculator — Kerala Government Employees',
  description: 'Calculate Dearness Allowance (DA) arrears for Kerala government employees. Compute arrear amounts based on DA revision orders.',
  path: '/da-arrear',
  keywords: ['DA arrear calculator Kerala', 'dearness allowance arrear', 'DA revision Kerala', 'DA കണക്കുകൂട്ടൽ'],
});

export default function DaArrearLayout({ children }) {
  return children;
}
