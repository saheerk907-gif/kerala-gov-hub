'use client';
import { useEffect, useState, useRef } from 'react';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function formatTime(secs) {
  if (!secs || isNaN(secs)) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function AudioClassesSection() {
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    async function fetchEpisodes() {
      try {
        const res = await fetch(
          `${SUPABASE_URL}/rest/v1/audio_classes?select=*&order=episode_number.asc`,
          { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
        );
        const data = await res.json();
        if (res.ok) setEpisodes(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchEpisodes();
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => {
      setCurrentTime(audio.currentTime);
      setProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0);
    };
    const onLoaded = () => setDuration(audio.duration);
    const onEnded = () => {
      setPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    };
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onLoaded);
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onLoaded);
      audio.removeEventListener('ended', onEnded);
    };
  }, [current]);

  function playEpisode(ep) {
    if (current?.id === ep.id) {
      if (playing) {
        audioRef.current.pause();
        setPlaying(false);
      } else {
        audioRef.current.play();
        setPlaying(true);
      }
      return;
    }
    setCurrent(ep);
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);
    setPlaying(true);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.load();
        audioRef.current.play().catch(() => {});
      }
    }, 50);
  }

  function seekTo(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    const newTime = pct * (audioRef.current?.duration || 0);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  }

  function skip(secs) {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime + secs);
    }
  }

  if (!loading && episodes.length === 0) return null;

  return (
    <section id="audio-classes" className="relative py-8 px-4 md:px-6">
      <div className="max-w-[1300px] mx-auto">

        {/* Header */}
        <div className="mb-7">
          <div className="section-label mb-2">KSR Awareness</div>
          <h2 className="text-[clamp(22px,3vw,32px)] font-[900] tracking-[-0.02em] text-white" style={{ fontFamily: "'Meera', sans-serif" }}>
            ഓഡിയോ ക്ലാസ്സുകൾ
          </h2>
          <div className="h-[2px] w-10 bg-gradient-to-r from-[#30d158] to-transparent mt-2 rounded-full" />
          <p className="text-white/40 text-[13px] mt-1">Kerala Service Rules — Awareness Classes for Govt Employees</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5 items-start">

          {/* Episode List */}
          <div className="flex flex-col gap-2.5">
            {loading
              ? [1, 2, 3].map(i => (
                  <div key={i} className="glass-card h-[72px] rounded-[20px] animate-pulse" />
                ))
              : episodes.map((ep, idx) => {
                  const isActive = current?.id === ep.id;
                  return (
                    <button
                      key={ep.id}
                      onClick={() => playEpisode(ep)}
                      className="glass-card glow-top w-full text-left flex items-center gap-4 p-4 rounded-[20px] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] group"
                      style={isActive ? { borderColor: 'rgba(48,209,88,0.35)', background: 'rgba(48,209,88,0.07)' } : {}}
                    >
                      {/* Play icon / episode number */}
                      <div
                        className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-base transition-all"
                        style={isActive
                          ? { background: 'rgba(48,209,88,0.25)', color: '#30d158' }
                          : { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)' }}
                      >
                        {isActive && playing ? (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>
                          </svg>
                        ) : (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-grow min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full"
                            style={isActive
                              ? { background: 'rgba(48,209,88,0.25)', color: '#30d158' }
                              : { background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.4)' }}>
                            EP {ep.episode_number}
                          </span>
                          {ep.duration_label && (
                            <span className="text-[10px] text-white/30">{ep.duration_label}</span>
                          )}
                        </div>
                        <h3 className="text-[14px] font-bold text-white/90 group-hover:text-white transition-colors leading-snug truncate" style={{ fontFamily: "'Meera', sans-serif" }}>
                          {ep.title_ml}
                        </h3>
                        {ep.title_en && (
                          <p className="text-[11px] text-white/35 mt-0.5 truncate">{ep.title_en}</p>
                        )}
                      </div>

                      {/* Arrow */}
                      <svg className="w-4 h-4 text-white/20 group-hover:text-white/60 flex-shrink-0 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/>
                      </svg>
                    </button>
                  );
                })}
          </div>

          {/* Player */}
          <div className="lg:sticky lg:top-24">
            {current ? (
              <div className="glass-card glow-top rounded-[24px] p-6" style={{ borderColor: 'rgba(48,209,88,0.2)', background: 'rgba(48,209,88,0.04)' }}>
                {/* Now playing */}
                <div className="text-[9px] font-black uppercase tracking-[0.2em] text-[#30d158] mb-4">Now Playing</div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: 'rgba(48,209,88,0.15)' }}>
                    🎙️
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[15px] font-bold text-white leading-snug" style={{ fontFamily: "'Meera', sans-serif" }}>
                      {current.title_ml}
                    </h3>
                    {current.title_en && (
                      <p className="text-[11px] text-white/40 mt-0.5 truncate">{current.title_en}</p>
                    )}
                  </div>
                </div>

                {/* Description */}
                {current.description_ml && (
                  <p className="text-[12px] text-white/40 mb-5 leading-relaxed" style={{ fontFamily: "'Meera', sans-serif" }}>
                    {current.description_ml}
                  </p>
                )}

                {/* Progress bar */}
                <div className="mb-3">
                  <div
                    className="h-1.5 rounded-full cursor-pointer overflow-hidden"
                    style={{ background: 'rgba(255,255,255,0.08)' }}
                    onClick={seekTo}
                  >
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #30d158, #34e35a)' }}
                    />
                  </div>
                  <div className="flex justify-between mt-1.5">
                    <span className="text-[10px] text-white/30">{formatTime(currentTime)}</span>
                    <span className="text-[10px] text-white/30">{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-4 mt-4">
                  <button onClick={() => skip(-10)} className="w-9 h-9 rounded-full flex items-center justify-center text-white/40 hover:text-white/80 transition-colors text-[11px] font-bold" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    -10
                  </button>
                  <button
                    onClick={() => playEpisode(current)}
                    className="w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                    style={{ background: 'linear-gradient(135deg, #30d158, #25a244)' }}
                  >
                    {playing ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                        <rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    )}
                  </button>
                  <button onClick={() => skip(10)} className="w-9 h-9 rounded-full flex items-center justify-center text-white/40 hover:text-white/80 transition-colors text-[11px] font-bold" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    +10
                  </button>
                </div>

                <audio ref={audioRef} src={current.audio_url} preload="metadata" />
              </div>
            ) : (
              <div className="glass-card rounded-[24px] p-8 text-center">
                <div className="text-4xl mb-3">🎙️</div>
                <p className="text-white/40 text-[13px]" style={{ fontFamily: "'Meera', sans-serif" }}>
                  ഒരു episode തിരഞ്ഞെടുക്കൂ
                </p>
                <p className="text-white/25 text-[11px] mt-1">Select an episode to start listening</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
