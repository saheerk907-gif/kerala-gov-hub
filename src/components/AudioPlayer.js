'use client';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function formatTime(secs) {
  if (!secs || isNaN(secs)) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
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
    const onEnded  = () => { setPlaying(false); setProgress(0); setCurrentTime(0); };
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onLoaded);
    audio.addEventListener('ended', onEnded);
    return () => { audio.removeEventListener('timeupdate', onTime); audio.removeEventListener('loadedmetadata', onLoaded); audio.removeEventListener('ended', onEnded); };
  }, [current]);

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
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4 items-start">

      {/* Episode list */}
      <div className="flex flex-col gap-2">
        {loading
          ? [1, 2, 3, 4].map(i => <div key={i} className="glass-card h-[68px] rounded-[20px] animate-pulse" />)
          : visible.map(ep => {
              const isActive = current?.id === ep.id;
              return (
                <button
                  key={ep.id}
                  onClick={() => playEpisode(ep)}
                  className={`glass-card glow-top w-full text-left flex items-center gap-4 p-4 rounded-[20px] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] group ${isActive ? 'audio-ep-active' : ''}`}
                  style={isActive ? { borderColor: 'rgba(255,255,255,0.22)' } : {}}
                >
                  {/* Play/pause icon */}
                  <div
                    className="audio-icon-box flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all"
                    style={isActive
                      ? { background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.95)' }
                      : { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.55)' }}
                  >
                    {isActive && playing
                      ? <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
                      : <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>}
                  </div>

                  <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span
                        className="audio-ep-label text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.65)' }}
                      >
                        EP {ep.episode_number}
                      </span>
                      {ep.duration_label && (
                        <span className="text-[10px] text-white/65">{ep.duration_label}</span>
                      )}
                    </div>
                    <h3
                      className="text-[14px] font-bold text-white/90 group-hover:text-white transition-colors leading-snug truncate"
                      style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}
                    >
                      {ep.title_ml}
                    </h3>
                    {ep.title_en && (
                      <p className="text-[11px] text-white/65 mt-0.5 truncate">{ep.title_en}</p>
                    )}
                  </div>

                  <svg className="w-4 h-4 text-white/40 group-hover:text-white/65 flex-shrink-0 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/>
                  </svg>
                </button>
              );
            })}

        {/* View all — neutral style matching other sections */}
        {hasMore && (
          <Link
            href="/audio-classes"
            className="audio-more-btn w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-[13px] font-bold no-underline transition-all hover:bg-white/[0.08] mt-1"
            style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.75)', border: '1px solid rgba(255,255,255,0.09)' }}
          >
            എല്ലാ ക്ലാസ്സുകളും കാണുക ({episodes.length} Episodes)
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
              <path d="M9 5l7 7-7 7"/>
            </svg>
          </Link>
        )}
      </div>

      {/* Player panel — plain glass, no color tint */}
      <div className="lg:sticky lg:top-24">
        {current ? (
          <div className="glass-card rounded-[24px] p-5">
            <div
              className="audio-now-text text-[9px] font-black uppercase tracking-[0.2em] text-white/65 mb-4"
            >
              Now Playing
            </div>

            {/* Track info */}
            <div className="flex items-center gap-3 mb-4">
              <div
                className="audio-icon-box w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(255,255,255,0.08)' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="audio-mic-icon">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                  <line x1="12" y1="19" x2="12" y2="23"/>
                  <line x1="8" y1="23" x2="16" y2="23"/>
                </svg>
              </div>
              <div className="min-w-0">
                <h3
                  className="text-[14px] font-bold text-white leading-snug line-clamp-2"
                  style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}
                >
                  {current.title_ml}
                </h3>
                {current.title_en && (
                  <p className="text-[11px] text-white/65 mt-0.5 truncate">{current.title_en}</p>
                )}
              </div>
            </div>

            {/* Progress bar */}
            <div className="mb-4">
              <div
                className="audio-progress-track h-1.5 rounded-full cursor-pointer overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.10)' }}
                onClick={seekTo}
              >
                <div
                  className="audio-progress-fill h-full rounded-full transition-all"
                  style={{ width: `${progress}%`, background: 'rgba(255,255,255,0.75)' }}
                />
              </div>
              <div className="flex justify-between mt-1.5">
                <span className="text-[10px] text-white/65">{formatTime(currentTime)}</span>
                <span className="text-[10px] text-white/65">{formatTime(duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-2.5">
              <button
                onClick={() => skip(-10)}
                className="audio-skip-btn w-9 h-9 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-colors text-[11px] font-bold"
                style={{ background: 'rgba(255,255,255,0.07)' }}
              >
                -10
              </button>
              <button
                onClick={() => playEpisode(current)}
                className="audio-main-btn w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.18)' }}
              >
                {playing
                  ? <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
                  : <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>}
              </button>
              <button
                onClick={() => skip(10)}
                className="audio-skip-btn w-9 h-9 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-colors text-[11px] font-bold"
                style={{ background: 'rgba(255,255,255,0.07)' }}
              >
                +10
              </button>
              <button
                onClick={cycleSpeed}
                className="audio-speed-btn h-9 px-3 rounded-full flex items-center justify-center font-black text-[11px] transition-all hover:bg-white/10"
                style={{
                  background: speed !== 1 ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)',
                  color: speed !== 1 ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.55)',
                  border: '1px solid rgba(255,255,255,0.10)',
                }}
                title="Change playback speed"
              >
                {speed}×
              </button>
            </div>
            <audio ref={audioRef} src={current.audio_url} preload="metadata" />
          </div>
        ) : (
          <div className="glass-card rounded-[24px] p-8 text-center">
            <div className="audio-icon-box w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ background: 'rgba(255,255,255,0.07)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="audio-mic-icon">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <line x1="12" y1="19" x2="12" y2="23"/>
                <line x1="8" y1="23" x2="16" y2="23"/>
              </svg>
            </div>
            <p className="text-white/75 text-[13px]" style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
              ഒരു episode തിരഞ്ഞെടുക്കൂ
            </p>
            <p className="text-white/55 text-[11px] mt-1">Select an episode to start listening</p>
          </div>
        )}
      </div>
    </div>
  );
}
