import { useAppSettings } from '../context/AppSettingsContext'

export default function SearchBar({ value, onChange, placeholder }) {
  const { t } = useAppSettings()
  const ph = placeholder ?? t('search.placeholder')

  return (
    <div className="relative flex">
      <span
        className="pointer-events-none absolute inset-y-0 left-4 flex items-center justify-center"
        style={{ width: 24, height: '100%' }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-[#0891b2] dark:text-[#22d3ee]"
          style={{ display: 'block', flexShrink: 0 }}
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      </span>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={ph}
        className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-slate-900 shadow-sm placeholder:text-slate-400 transition focus:border-[#6366f1]/50 focus:outline-none focus:ring-2 focus:ring-[#6366f1]/30 dark:border-white/10 dark:bg-white/10 dark:text-white dark:placeholder-slate-500 dark:focus:border-[#6366f1]/50"
        aria-label={t('search.ariaLabel')}
      />
    </div>
  )
}
