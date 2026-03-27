export default function SectionHeader({ title, subtitle }) {
  return (
    <div className="mb-4">
      <h3 className="text-sm font-bold text-[#ff9f0a] uppercase tracking-wider">{title}</h3>
      {subtitle && <p className="text-xs text-white/60 mt-0.5">{subtitle}</p>}
    </div>
  );
}
