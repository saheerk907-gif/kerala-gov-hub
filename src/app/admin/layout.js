'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const NAV_ITEMS = [
  { href: '/admin', label: 'ഡാഷ്‌ബോർഡ്', labelEn: 'Dashboard', icon: '📊' },
  { href: '/admin/orders', label: 'ഉത്തരവുകൾ', labelEn: 'Govt Orders', icon: '📄' },
  { href: '/admin/schemes', label: 'പദ്ധതികൾ', labelEn: 'Schemes', icon: '📋' },
  { href: '/admin/links', label: 'ലിങ്കുകൾ', labelEn: 'Quick Links', icon: '🔗' },
];

export default function AdminLayout({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session && pathname !== '/admin/login') {
        router.push('/admin/login');
      } else {
        setUser(session?.user || null);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (!session && pathname !== '/admin/login') router.push('/admin/login');
    });

    return () => subscription.unsubscribe();
  }, [pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-[#86868b] text-sm font-sans">Loading...</div>
      </div>
    );
  }

  if (pathname === '/admin/login') return children;

  if (!user) return null;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#050505] flex">
      {/* Sidebar */}
      <aside className="w-64 min-h-screen border-r border-white/[0.08] p-6 flex flex-col admin-sidebar fixed left-0 top-0 bottom-0">
        <a href="/" className="flex items-center gap-3 no-underline mb-10">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Coat_of_arms_of_Kerala.svg/180px-Coat_of_arms_of_Kerala.svg.png"
            alt="Kerala" className="w-8 h-8 rounded-full bg-white p-0.5 object-contain"
          />
          <div>
            <div className="text-xs font-bold text-white">Admin Panel</div>
            <div className="text-[9px] text-[#6e6e73] font-sans">Kerala Gov Hub</div>
          </div>
        </a>

        <nav className="flex flex-col gap-1 flex-1">
          {NAV_ITEMS.map(item => (
            <a
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm no-underline transition-all ${
                pathname === item.href
                  ? 'active bg-[rgba(41,151,255,0.15)] text-[#2997ff]'
                  : 'text-[#86868b] hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{item.icon}</span>
              <div>
                <div className="font-semibold text-[13px]">{item.label}</div>
                <div className="text-[9px] font-sans text-[#6e6e73]">{item.labelEn}</div>
              </div>
            </a>
          ))}
        </nav>

        <div className="pt-4 border-t border-white/[0.08]">
          <div className="text-[10px] text-[#6e6e73] mb-2 font-sans truncate">{user.email}</div>
          <button onClick={handleLogout}
            className="w-full text-left px-3 py-2 rounded-xl text-xs text-[#ff453a] hover:bg-[rgba(255,69,58,0.1)] transition-all cursor-pointer bg-transparent border-none font-malayalam">
            ലോഗ് ഔട്ട്
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
}
