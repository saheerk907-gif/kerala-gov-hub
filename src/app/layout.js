import './globals.css';

export const metadata = {
  title: 'കേരള സർക്കാർ ജീവനക്കാരുടെ വിവര ശേഖരം | Kerala Gov Employee Hub',
  description: 'സേവന ചട്ടങ്ങൾ, മെഡിസെപ്, GPF, NPS, SLI, GIS, സർക്കാർ ഉത്തരവുകൾ — കേരള സർക്കാർ ജീവനക്കാർക്കായി',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ml">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Noto+Sans+Malayalam:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-malayalam bg-dark-600 text-dark-50 antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
