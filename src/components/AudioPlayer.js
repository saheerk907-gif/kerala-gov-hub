'use client';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const ACCENT = '#ff9f0a';

function formatTime(secs) {
  if (!secs || isNaN(secs)) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function WaveformBars({ playing }) {
  return (
    <div className="flex items-end gap-[2px] h-4">
      {[1, 2, 3, 4].map(i => (
        <div
          key={i}
          className="w-[3px] rounded-full"
          style={{
            background: ACCENT,
            height: playing ? undefined : '4px',
            animation: playing ? `wave${i} 0.8s ease-in-out infinite` : 'none',
          }}
        />
      ))}
      <style>{`
        @keyframes wave1 { 0%,100%{height:4px} 50%{height:14px} }
        @keyframes wave2 { 0%,100%{height:10px} 50%{height:5px} }
        @keyframes wave3 { 0%,100%{height:6px} 50%{height:14px} }
        @keyframes wave4 { 0%,100%{height:12px} 50%{height:4px} }
      `}</style>
    </div>
  );
}

export default function AudioPlayer({ limit }) {
  const [episodes,    setEpisodes]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [current,     setCurrent]     = useState(null);
  const [playing,     setPlaying]     = useState(false);
  const [progress,    setProgress]    = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration,    setDuration]    = useState(0);
  const [speed,       setSpeed]       = useState(1);
  const audioRef = useRef(null);
  const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

  function cycleSpeed() {
    const next = SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length];
    setSpeed(next);
    if (audioRef.current) audioRef.current.playbackRate = next;
  }

  useEffect(() => {
    async function fetch_() {
      try {
        const res = await fetch(
          `${SUPABASE_URL}/rest/v1/audio_classes?select=*&order=episode_number.asc`,
          { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
        );
        const data = await res.json();
        if (res.ok) setEpisodes(data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    fetch_();
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime   = () => { setCurrentTime(audio.currentTime); setProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0); };
    const onLoaded = () => setDuration(audio.duration);
    const onEnded  = () => {
      setPlaying(false); setProgress(0); setCurrentTime(0);
      // auto-advance
      const idx = episodes.findIndex(e => e.id === current?.id);
      if (idx !== -1 && idx < episodes.length - 1) playEpisode(episodes[idx + 1]);
    };
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onLoaded);
    audio.addEventListener('ended', onEnded);
    return () => { audio.removeEventListener('timeupdate', onTime); audio.removeEventListener('loadedmetadata', onLoaded); audio.removeEventListener('ended', onEnded); };
  }, [current, episodes]);

  function playEpisode(ep) {
    if (current?.id === ep.id) {
      if (playing) { audioRef.current.pause(); setPlaying(false); }
      else         { audioRef.current.play();  setPlaying(true);  }
      return;
    }
    setCurrent(ep); setProgress(0); setCurrentTime(0); setDuration(0); setPlaying(true);
    setTimeout(() => {
      if (audioRef.current) { audioRef.current.load(); audioRef.current.playbackRate = speed; audioRef.current.play().catch(() => {}); }
    }, 50);
  }

  function seekTo(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct  = (e.clientX - rect.left) / rect.width;
    if (audioRef.current) audioRef.current.currentTime = pct * (audioRef.current.duration || 0);
  }

  function skip(secs) {
    if (audioRef.current) audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime + secs);
  }

  if (!loading && episodes.length === 0) return null;

  const visible = limit ? episodes.slice(0, limit) : episodes;
  const hasMore = limit && episodes.length > limit;

  return (
    <div className="flex flex-col gap-3">

      {/* Now Playing bar — shown when audio is selected */}
      {current && (
        <div className="rounded-[18px] p-4 flex flex-col gap-3"
          style={{ background: 'rgba(255,159,10,0.07)', border: '1px solid rgba(255,159,10,0.2)' }}>

          {/* Track + controls row */}
          <div className="flex items-center gap-3">
            {/* Animated icon */}
            <div className="flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(255,159,10,0.15)', border: '1px solid rgba(255,159,10,0.3)' }}>
              {playing
                ? <WaveformBars playing={playing} />
                : <svg width="16" height="16" viewBox="0 0 24 24" fill={ACCENT}><path d="M8 5v14l11-7z"/></svg>
              }
            </div>

            {/* Title */}
            <div className="flex-grow min-w-0">
              <div className="text-[9px] font-black uppercase tracking-[0.15em] mb-0.5" style={{ color: ACCENT }}>Now Playing · EP {current.episode_number}</div>
              <div className="text-[13px] font-bold text-white leading-snug truncate" style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
                {current.title_ml}
              </div>
            </div>

            {/* Play/pause + skip */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={() => skip(-10)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-black text-white/60 hover:text-white transition-colors"
                style={{ background: 'rgba(255,255,255,0.06)' }}>-10</button>
              <button onClick={() => playEpisode(current)}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                style={{ background: ACCENT }}>
                {playing
                  ? <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
                  : <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
                }
              </button>
              <button onClick={() => skip(10)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-black text-white/60 hover:text-white transition-colors"
                style={{ background: 'rgba(255,255,255,0.06)' }}>+10</button>
              <button onClick={cycleSpeed}
                className="h-7 px-2.5 rounded-full text-[10px] font-black transition-all"
                style={{
                  background: speed !== 1 ? 'rgba(255,159,10,0.2)' : 'rgba(255,255,255,0.06)',
                  color: speed !== 1 ? ACCENT : 'rgba(255,255,255,0.5)',
                  border: speed !== 1 ? '1px solid rgba(255,159,10,0.3)' : '1px solid transparent',
                }}>
                {speed}×
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div>
            <div className="h-1 rounded-full cursor-pointer overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.1)' }}
              onClick={seekTo}>
              <div className="h-full rounded-full transition-all"
                style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${ACCENT}, #ffcc02)` }} />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-white/40">{formatTime(currentTime)}</span>
              <span className="text-[10px] text-white/40">{formatTime(duration)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Episode list */}
      <div className="flex flex-col gap-1.5">
        {loading
          ? [1, 2].map(i => <div key={i} className="h-[64px] rounded-[14px] skeleton-shimmer" />)
          : visible.map((ep, idx) => {
              const isActive = current?.id === ep.id;
              return (
                <button
                  key={ep.id}
                  onClick={() => playEpisode(ep)}
                  className="group relative w-full text-left flex items-center gap-3 px-4 py-3 rounded-[14px] transition-all duration-200 hover:bg-white/[0.06] overflow-hidden"
                  style={isActive ? { background: 'rgba(255,159,10,0.06)', border: '1px solid rgba(255,159,10,0.15)' } : { background: 'transparent', border: '1px solid transparent' }}
                >
                  {/* Glow blob */}
                  <div className="absolute -top-4 -left-4 w-16 h-16 rounded-full blur-[30px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                    style={{ background: isActive ? 'rgba(255,159,10,0.35)' : 'rgba(255,159,10,0.2)' }} />

                  {/* Episode number / play icon */}
                  <div className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-105"
                    style={isActive
                      ? { background: 'rgba(255,159,10,0.2)', border: '1px solid rgba(255,159,10,0.35)' }
                      : { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    {isActive && playing
                      ? <WaveformBars playing={playing} />
                      : isActive
                        ? <svg width="14" height="14" viewBox="0 0 24 24" fill={ACCENT}><path d="M8 5v14l11-7z"/></svg>
                        : <span className="text-[10px] font-black text-white/50">{ep.episode_number}</span>
                    }
                  </div>

                  {/* Title + meta */}
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full"
                        style={isActive
                          ? { background: 'rgba(255,159,10,0.2)', color: ACCENT }
                          : { background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.5)' }}>
                        EP {ep.episode_number}
                      </span>
                      {ep.duration_label && <span className="text-[10px] text-white/35">{ep.duration_label}</span>}
                    </div>
                    <div className="text-[13px] font-bold leading-snug truncate transition-colors"
                      style={{ fontFamily: "var(--font-noto-malayalam), sans-serif", color: isActive ? 'white' : 'rgba(255,255,255,0.85)' }}>
                      {ep.title_ml}
                    </div>
                    {ep.title_en && <div className="text-[11px] text-white/40 mt-0.5 truncate">{ep.title_en}</div>}
                  </div>

                  {/* Arrow */}
                  <svg className="w-3.5 h-3.5 flex-shrink-0 transition-all group-hover:translate-x-0.5"
                    style={{ color: isActive ? ACCENT : 'rgba(255,255,255,0.25)' }}
                    fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
                  </svg>

                  {/* Bottom accent */}
                  <div className="absolute bottom-0 left-0 right-0 h-[1.5px] opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    style={{ background: 'linear-gradient(90deg, transparent, rgba(255,159,10,0.6), transparent)' }} />
                </button>
              );
            })}
      </div>

      {/* View all */}
      {hasMore && (
        <Link href="/audio-classes"
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-[12px] font-bold no-underline transition-all hover:bg-white/[0.06]"
          style={{ background: 'rgba(255,159,10,0.07)', color: ACCENT, border: '1px solid rgba(255,159,10,0.2)' }}>
          എല്ലാ ക്ലാസ്സുകളും കാണുക ({episodes.length} Episodes)
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
            <path d="M9 5l7 7-7 7"/>
          </svg>
        </Link>
      )}

      <audio ref={audioRef} src={current?.audio_url} preload="metadata" />
    </div>
  );
}
