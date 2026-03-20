'use client';
import Link from 'next/link';

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
  if (!name) return 'rgba(255,255,255,0.15)';
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
          background: 'rgba(255,255,255,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: size * 0.4,
          fontWeight: 700,
          color: 'rgba(255,255,255,0.6)',
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
  } = experience;

  const displayDate = published_at || created_at;
  const excerpt = body ? (body.length > 120 ? body.slice(0, 120) + '...' : body) : '';
  const displayAuthor = is_anonymous ? 'Anonymous' : (author_name || 'Anonymous');

  // Border/bg logic: pinned takes priority over featured
  let cardBg = 'transparent';
  let cardBorder = '1px solid rgba(255,255,255,0.08)';

  if (is_pinned) {
    cardBg = `rgba(200,150,12,0.06)`;
    cardBorder = `1px solid rgba(200,150,12,0.2)`;
  } else if (featured) {
    cardBg = `rgba(48,209,88,0.08)`;
    cardBorder = `1px solid rgba(48,209,88,0.2)`;
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
            opacity: 0.06,
            color: '#fff',
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
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
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
            <span className="text-[10px] text-white/40">{displayDate ? timeAgo(displayDate) : ''}</span>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-white/50 flex items-center gap-0.5">
                👍 {helpful_count}
              </span>
              <span className="text-[11px] text-white/50 flex items-center gap-0.5">
                ❤️ {relatable_count}
              </span>
              <span className="text-[11px] text-white/50 flex items-center gap-0.5">
                💬 {comment_count}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
