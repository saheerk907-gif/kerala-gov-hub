// src/app/forum/page.js
import { Suspense } from 'react';
import ForumPage from '@/components/forum/ForumPage';
import Footer from '@/components/Footer';
import { buildMetadata } from '@/lib/seo';

export const metadata = {
  ...buildMetadata({
    title: 'ചർച്ചാ വേദി — Kerala Govt Employees Discussion Forum',
    description: 'Kerala government employee discussion forum — NPS, Pension, Leave, Service Matters. Ask questions and share experiences with fellow employees.',
    path: '/forum',
    keywords: ['Kerala government employees forum', 'NPS discussion Kerala', 'pension discussion', 'leave rules discussion', 'service matters Kerala'],
  }),
  robots: { index: false },
};

export default function Page() {
  return (
    <>
      <Suspense fallback={null}>
        <ForumPage />
      </Suspense>
      <Footer />
    </>
  );
}
