'use client';
import Link from 'next/link';
import { isNew, whatsappUrl } from '@/lib/experiences';

const GREEN = '#30d158';
const GOLD = '#c8960c';

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

function getAvatarColor(name) {
  if (!name) return 'var(--surface-md)';
  const code = name.charCodeAt(0);
  const hue = (code * 47) % 360;
  return `hsl(${hue}, 60%, 45%)`;
}

function Avatar({ name, isAnonymous, size = 40 }) {
  if (isAnonymous || !name) {
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: 'var(--surface-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: size * 0.4,
          fontWeight: 700,
          color: 'var(--text-secondary)',
          flexShrink: 0,
        }}
      >
        ?
      </div>
    );
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: getAvatarColor(name),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.4,
        fontWeight: 700,
        color: '#fff',
        flexShrink: 0,
      }}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

export default function ExperienceCard({ experience, featured = false }) {
  const {
    id,
    title,
    body,
    author_name,
    department,
    is_anonymous,
    is_pinned,
    published_at,
    created_at,
    helpful_count = 0,
    relatable_count = 0,
    comment_count = 0,
    recentReactions = 0,
    readTime: readTimeMins = 1,
  } = experience;

  const displayDate = published_at || created_at;
  const excerpt = body ? (body.length > 120 ? body.slice(0, 120) + '...' : body) : '';
  const displayAuthor = is_anonymous ? 'Anonymous' : (author_name || 'Anonymous');

  // Border/bg logic: pinned takes priority over featured
  let cardBg = 'var(--bg-card)';
  let cardBorder = '1px solid var(--border-xs)';

  if (is_pinned) {
    cardBg = `rgba(200,150,12,0.06)`;
    cardBorder = `1px solid rgba(200,150,12,0.25)`;
  } else if (featured) {
    cardBg = `rgba(48,209,88,0.08)`;
    cardBorder = `1px solid rgba(48,209,88,0.25)`;
  }

  return (
    <Link href={`/experiences/${id}`} className="no-underline group block h-full">
      <div
        className="glass-card relative rounded-[20px] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)] h-full flex flex-col"
        style={{ background: cardBg, border: cardBorder, padding: featured ? '28px' : '20px' }}
      >
        {/* Decorative quote mark */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 16,
            fontFamily: 'Georgia, serif',
            fontSize: '5rem',
            lineHeight: 1,
            opacity: 0.08,
            color: 'var(--text-primary)',
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        >
          &ldquo;
        </div>

        {/* Badges */}
        {(is_pinned || featured) && (
          <div className="flex gap-2 mb-3 flex-wrap">
            {is_pinned && (
              <span
                className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full"
                style={{ background: `${GOLD}25`, color: GOLD, border: `1px solid ${GOLD}40` }}
              >
                📌 Pinned
              </span>
            )}
            {featured && !is_pinned && (
              <span
                className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full"
                style={{
                  background: `${GREEN}25`,
                  color: GREEN,
                  border: `1px solid ${GREEN}40`,
                }}
              >
                ✨ Most Helpful
              </span>
            )}
          </div>
        )}

        {/* Status badges */}
        <div className="flex items-center gap-1.5 flex-wrap mb-2">
          {recentReactions >= 5 && (
            <span
              className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(255,149,0,0.15)', color: '#ff9f0a', border: '1px solid rgba(255,149,0,0.3)' }}
            >
              🔥 Trending
            </span>
          )}
          {isNew(published_at || created_at) && (
            <span
              className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(48,209,88,0.2)', color: '#30d158', border: '1px solid rgba(48,209,88,0.4)' }}
            >
              NEW
            </span>
          )}
        </div>

        {/* Title */}
        <h3
          className={`font-bold text-white leading-snug mb-2 group-hover:text-white/90 ${featured ? 'text-[18px] md:text-[22px]' : 'text-[15px]'}`}
          style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}
        >
          {title}
        </h3>

        {/* Excerpt */}
        <p className="text-[13px] text-white/60 leading-relaxed mb-4 flex-1"
          style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
          {excerpt}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-3"
          style={{ borderTop: '1px solid var(--border-xs)' }}>
          {/* Author */}
          <div className="flex items-center gap-2 min-w-0">
            <Avatar name={author_name} isAnonymous={is_anonymous} size={28} />
            <div className="min-w-0">
              <div className="text-[12px] font-semibold text-white/80 truncate">{displayAuthor}</div>
              {department && (
                <div className="text-[10px] text-white/40 truncate">{department}</div>
              )}
            </div>
          </div>

          {/* Right: time + reactions */}
          <div className="flex flex-col items-end gap-1 flex-shrink-0 ml-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-white/40">~{readTimeMins} min read</span>
              <span className="text-[10px] text-white/40">{displayDate ? timeAgo(displayDate) : ''}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-white/50 flex items-center gap-0.5">👍 {helpful_count}</span>
              <span className="text-[11px] text-white/50 flex items-center gap-0.5">❤️ {relatable_count}</span>
              <span className="text-[11px] text-white/50 flex items-center gap-0.5">💬 {comment_count}</span>
            </div>
          </div>
        </div>

        {/* Bottom row: reviewed badge + WhatsApp share */}
        <div className="flex items-center justify-between mt-2 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <span className="text-[10px] text-white/25">✔ Reviewed by admin</span>
          <a
            href={whatsappUrl(title, id)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-white/40 hover:text-green-400 flex items-center gap-1"
            aria-label="Share on WhatsApp"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Share
          </a>
        </div>
      </div>
    </Link>
  );
}
