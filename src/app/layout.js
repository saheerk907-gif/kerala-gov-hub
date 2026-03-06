import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'കേരള സർക്കാർ ജീവനക്കാരുടെ വിവര ശേഖരം | Kerala Gov Employee Hub',
  description: 'സേവന ചട്ടങ്ങൾ, മെഡിസെപ്, GPF, NPS, SLI, GIS, ശമ്പള കണക്കുകൂട്ടൽ, സർക്കാർ ഉത്തരവുകൾ — കേരള സർക്കാർ ജീവനക്കാർക്കായി',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ml">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Noto+Sans+Malayalam:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-malayalam bg-[#121416] text-white antialiased overflow-x-hidden min-h-screen">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
