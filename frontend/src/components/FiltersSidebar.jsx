import { useState, useRef, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { FolderOpen, FileText, ChevronDown } from 'lucide-react'
import { useAppSettings } from '../context/AppSettingsContext'

const CATEGORY_VALUES = [
  '',
  'Business',
  'Classic',
  'Computer Science',
  'Engineering',
  'Fantasy',
  'Research',
  'Science Fiction',
]

const TYPE_VALUES = ['', 'Book', 'Article', 'Database', 'Website']

function FilterDropdown({ label, options, value, onChange, id }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const buttonRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const selected = options.find((o) => o.value === value) || options[0]

  const dropdownContent =
    open &&
    buttonRef.current &&
    (() => {
      const rect = buttonRef.current.getBoundingClientRect()
      const spaceBelow = window.innerHeight - rect.bottom
      const spaceAbove = rect.top
      const openUp = spaceBelow < 200 && spaceAbove > spaceBelow
      const maxHeight = openUp
        ? Math.min(224, spaceAbove - 8)
        : Math.min(224, spaceBelow - 8)
      const style = openUp
        ? {
            position: 'fixed',
            left: rect.left,
            bottom: window.innerHeight - rect.top + 4,
            width: rect.width,
            maxHeight: `${maxHeight}px`,
          }
        : {
            position: 'fixed',
            left: rect.left,
            top: rect.bottom + 4,
            width: rect.width,
            maxHeight: `${maxHeight}px`,
          }

      return createPortal(
        <ul
          className="z-[9999] overflow-auto rounded-lg border border-slate-200 bg-white py-1 shadow-xl dark:border-white/10 dark:bg-[#1a1a24]"
          role="listbox"
          aria-labelledby={id}
          style={style}
        >
          {options.map((opt) => (
            <li key={opt.value || 'all'} role="option" aria-selected={opt.value === value}>
              <button
                type="button"
                onClick={() => {
                  onChange(opt.value)
                  setOpen(false)
                }}
                className={`w-full px-3 py-2 text-left text-sm transition ${
                  opt.value === value
                    ? 'bg-[#6366f1]/20 text-[#4f46e5] dark:bg-[#6366f1]/30 dark:text-white'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-white/10 dark:hover:text-white'
                }`}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>,
        document.body
      )
    })()

  return (
    <div ref={ref} className="relative">
      {label ? (
        <label className="mb-2 block text-sm font-medium text-slate-800 dark:text-white">{label}</label>
      ) : null}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-left text-sm text-slate-900 shadow-sm focus:border-[#6366f1]/50 focus:outline-none focus:ring-1 focus:ring-[#6366f1]/30 dark:border-white/10 dark:bg-[#1a1a24] dark:text-white dark:shadow-lg"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-labelledby={id}
      >
        <span id={id}>{selected.label}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-slate-500 transition dark:text-slate-400 ${open ? 'rotate-180' : ''}`} />
      </button>
      {dropdownContent}
    </div>
  )
}

export default function FiltersSidebar({ category, type, onCategoryChange, onTypeChange }) {
  const { t } = useAppSettings()

  const categoryOptions = useMemo(
    () =>
      CATEGORY_VALUES.map((value) => ({
        value,
        label: value === '' ? t('filters.allCategories') : t(`filters.cat.${value}`),
      })),
    [t]
  )

  const typeOptions = useMemo(
    () =>
      TYPE_VALUES.map((value) => ({
        value,
        label: value === '' ? t('filters.allTypes') : t(`filters.typeOpt.${value}`),
      })),
    [t]
  )

  return (
    <aside className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {t('filters.title')}
      </h3>
      <div className="space-y-6">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-800 dark:text-white">
            <FolderOpen className="h-4 w-4 text-[#0891b2] dark:text-[#22d3ee]" />
            {t('filters.category')}
          </div>
          <FilterDropdown
            id="filter-category"
            label=""
            options={categoryOptions}
            value={category}
            onChange={onCategoryChange}
          />
        </div>
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-800 dark:text-white">
            <FileText className="h-4 w-4 text-[#0891b2] dark:text-[#22d3ee]" />
            {t('filters.type')}
          </div>
          <FilterDropdown
            id="filter-type"
            label=""
            options={typeOptions}
            value={type}
            onChange={onTypeChange}
          />
        </div>
      </div>
    </aside>
  )
}
