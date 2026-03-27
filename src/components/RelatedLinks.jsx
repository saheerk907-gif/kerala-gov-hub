import Link from 'next/link';

/**
 * RelatedLinks — renders 2–4 contextual internal links at the bottom of tool pages.
 * Required for internal linking (min 2 links per tool page per SEO spec).
 *
 * @param {{ href: string, label: string }[]} links - Array of internal link objects
 * @param {string} [heading] - Section heading, defaults to "Related Tools"
 */
export default function RelatedLinks({ links, heading = 'Related Tools' }) {
  if (!links || links.length === 0) return null;

  return (
    <section className="mt-10 border-t border-white/10 pt-6">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-white/50 mb-3">
        {heading}
      </h2>
      <ul className="flex flex-wrap gap-3">
        {links.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              className="inline-block px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm text-white/80 hover:text-white transition-colors"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
