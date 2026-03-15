export default function SearchBar({
  value,
  onChange,
  placeholder = "Search books, articles, databases...",
}) {
  return (
    <div className="relative flex">
      <span
        className="pointer-events-none absolute left-4 inset-y-0 flex items-center justify-center"
        style={{ width: 24, height: "100%" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#22d3ee"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ display: "block", flexShrink: 0 }}
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      </span>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/10 bg-white/10 py-3.5 pl-12 pr-4 text-white placeholder-slate-500 transition focus:border-[#6366f1]/50 focus:outline-none focus:ring-2 focus:ring-[#6366f1]/30"
        aria-label="Search resources"
      />
    </div>
  );
}
