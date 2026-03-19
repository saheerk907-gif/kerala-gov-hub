// src/app/forum/page.js
import { Suspense } from 'react';
import ForumPage from '@/components/forum/ForumPage';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'ചർച്ചാ വേദി | Kerala Employees',
  description: 'കേരള സർക്കാർ ജീവനക്കാരുടെ ചർച്ചാ വേദി — NPS, Pension, Leave, Service Matters',
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
