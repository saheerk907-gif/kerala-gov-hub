const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://keralaemployees.in';

/**
 * Hybrid trending score with time decay.
 * score = (recentReactions * 2 + totalReactions) / (hoursAge + 2)
 */
export function trendingScore(recentReactions, totalReactions, publishedAt) {
  const hoursAge = (Date.now() - new Date(publishedAt).getTime()) / 3_600_000;
  return (recentReactions * 2 + totalReactions) / (hoursAge + 2);
}

/**
 * Estimated read time in minutes.
 * Uses word count / 200 wpm. Minimum 1.
 */
export function readTime(body) {
  if (!body) return 1;
  const words = body.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

/**
 * Extract a pull quote from Malayalam body text.
 * Splits on '।' (U+0964). Uses [...str] for grapheme-safe codepoint counting.
 * Falls back to first 120 codepoints if no suitable segment found.
 * Returns null if body codepoint count <= 300.
 */
export function extractPullQuote(body) {
  if (!body) return null;
  const bodyChars = [...body];
  if (bodyChars.length <= 300) return null;

  const segments = body.split('।');
  const found = segments.find(s => {
    const len = [...s.trim()].length;
    return len >= 60 && len <= 200;
  });
  if (found) return found.trim();

  // Fallback: first 120 codepoints
  return bodyChars.slice(0, 120).join('');
}

/**
 * Split body into [before, after] at the 150-codepoint mark for pull quote insertion.
 */
export function splitBodyForQuote(body) {
  const chars = [...body];
  return [chars.slice(0, 150).join(''), chars.slice(150).join('')];
}

/**
 * WhatsApp share URL with improved CTR copy.
 */
export function whatsappUrl(title, id) {
  const text = `കേരള സർക്കാർ ജീവനക്കാരന്റെ അനുഭവം:\n\n"${title}"\n\n👉 ${SITE_URL}/experiences/${id}`;
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

/**
 * Returns true if published within the last 24 hours.
 */
export function isNew(publishedAt) {
  if (!publishedAt) return false;
  return Date.now() - new Date(publishedAt).getTime() < 24 * 3_600_000;
}
