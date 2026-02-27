import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const revalidate = 60;

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const CATEGORY_LABELS = {
  pay: { label: 'ശമ്പളം', color: '#2997ff' },
  da: { label: 'ക്ഷാമബത്ത', color: '#ff9f0a' },
  medisep: { label: 'മെഡിസെപ്', color: '#ff453a' },
  gpf: { label: 'GPF', color: '#30d158' },
  nps: { label: 'NPS', color: '#bf5af2' },
  pension: { label: 'പെൻഷൻ', color: '#ff9f0a' },
  general: { label: 'പൊതുവായത്', color: '#6e6e73' },
};

async function getAllNews() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/news?is_published=eq.true&select=*&order=published_at.desc`,
    { headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }, next: { revalidate: 60 } }
  );
  return res.json();
}

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 3600) return `${Math.floor(diff / 60)} മിനിറ്റ് മുൻപ്`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} മണിക്കൂർ മുൻപ്`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} ദിവസം മുൻപ്`;
  return new Date(dateStr).toLocaleDateString('ml-IN');
}

export default async function NewsListPage() {
  const news = await getAllNews();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black text-white">
        {/* Header */}
        <div className="relative pt-32 pb-12 px-6 border-b border-white/[0.06]">
          <div className="absolute inset-0 opacity-10"
            style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 0%, #ff453a30, transparent)' }} />
          <div className="relative max-w-6xl mx-auto">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-[#ff453a] animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ff453a]">Live Updates</span>
            </div>
            <h1 className="text-4xl font-black mb-2">ഏറ്റവും പുതിയ വാർത്തകൾ</h1>
            <p className="text-sm text-[#6e6e73]">Kerala Government Employee News & Updates</p>
          </div>
        </div>

        {/* News Grid */}
        <div className="max-w-6xl mx-auto px-6 py-12">
          {!news?.length ? (
            <div className="text-center text-[#6e6e73] py-20">
              <div className="text-5xl mb-4">📰</div>
              <p>വാർത്തകൾ ഒന്നും ഇല്ല</p>
            </div>
          ) : (
            <div className="space-y-3">
              {news.map(n => {
                const cat = CATEGORY_LABELS[n.category] || CATEGORY_LABELS.general;
                return (
                  <Link key={n.id} href={`/news/${n.id}`}
                    className="no-underline group flex items-start gap-5 p-5 rounded-2xl transition-all"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = `${cat.color}25`; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}>

                    {/* Color dot */}
                    <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ background: cat.color }} />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1.5">
                        <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
                          style={{ color: cat.color, background: `${cat.color}15` }}>
                          {cat.label}
                        </span>
                        {n.is_featured && (
                          <span className="text-[9px] text-[#30d158] font-bold">★ Featured</span>
                        )}
                        <span className="text-[10px] text-[#6e6e73] ml-auto">{timeAgo(n.published_at)}</span>
                      </div>
                      <h2 className="text-base font-bold text-white group-hover:text-[#e5e5e7] transition-colors leading-snug mb-1"
                        style={{ fontFamily: "'Noto Sans Malayalam', serif" }}>
                        {n.title_ml}
                      </h2>
                      {n.summary_ml && (
                        <p className="text-xs text-[#6e6e73] line-clamp-1"
                          style={{ fontFamily: "'Noto Sans Malayalam', sans-serif" }}>
                          {n.summary_ml}
                        </p>
                      )}
                    </div>

                    <div className="text-[#6e6e73] group-hover:text-white group-hover:translate-x-1 transition-all text-lg flex-shrink-0">→</div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
