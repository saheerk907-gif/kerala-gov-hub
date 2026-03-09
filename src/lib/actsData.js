export const CATEGORIES = [
  { id: 'all',       label: 'എല്ലാം',               en: 'All Laws',           icon: '📚', color: '#2997ff' },
  { id: 'revenue',   label: 'റവന്യൂ / ഭൂമി',        en: 'Revenue / Land',     icon: '🏛️', color: '#ff9f0a' },
  { id: 'service',   label: 'സർവ്വീസ് ചട്ടങ്ങൾ',    en: 'Service Rules',      icon: '📋', color: '#2997ff' },
  { id: 'labour',    label: 'തൊഴിൽ നിയമം',          en: 'Labour Laws',        icon: '⚒️', color: '#30d158' },
  { id: 'local_govt',label: 'തദ്ദേശ സ്വയംഭരണം',     en: 'Local Government',   icon: '🏘️', color: '#bf5af2' },
  { id: 'forest',    label: 'വനം നിയമം',             en: 'Forest Laws',        icon: '🌿', color: '#34c759' },
  { id: 'education', label: 'വിദ്യാഭ്യാസം',          en: 'Education',          icon: '🎓', color: '#64d2ff' },
  { id: 'finance',   label: 'ഫിനാൻസ് / നികുതി',     en: 'Finance / Tax',      icon: '💰', color: '#ff9f0a' },
  { id: 'police',    label: 'പോലീസ് / ജുഡീഷ്യറി',   en: 'Police / Judiciary', icon: '⚖️', color: '#ffd60a' },
  { id: 'general',   label: 'പൊതു നിയമങ്ങൾ',        en: 'General Laws',       icon: '📜', color: '#86868b' },
];

export function getCatInfo(id) {
  return CATEGORIES.find(c => c.id === id) || CATEGORIES[CATEGORIES.length - 1];
}
