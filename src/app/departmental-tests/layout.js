import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Kerala Departmental Tests — Study Materials & Mock Tests',
  description: 'Prepare for Kerala government departmental tests — Revenue, Account, Excise, Forest, and more. Mock tests, previous questions, and study materials.',
  path: '/departmental-tests',
  keywords: ['Kerala departmental tests', 'Kerala revenue test', 'Kerala account test', 'departmental test questions', 'ഡിപ്പാർട്ട്‌മെന്റൽ ടെസ്റ്റ്'],
});

export default function DepartmentalTestsLayout({ children }) {
  return children;
}
