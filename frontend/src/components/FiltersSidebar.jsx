import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { FolderOpen, FileText, ChevronDown } from 'lucide-react'

const CATEGORIES = [
  { value: '', label: 'All Categories' },
  { value: 'Computer Science', label: 'Computer Science' },
  { value: 'Engineering', label: 'Engineering' },
  { value: 'Business', label: 'Business' },
  { value: 'Research', label: 'Research' },
]

const TYPES = [
  { value: '', label: 'All Types' },
  { value: 'Book', label: 'Book' },
  { value: 'Article', label: 'Article' },
  { value: 'Database', label: 'Database' },
  { value: 'Website', label: 'Website' },
]

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

  const dropdownContent = open && buttonRef.current && (() => {
    const rect = buttonRef.current.getBoundingClientRect()
    const spaceBelow = window.innerHeight - rect.bottom
    const spaceAbove = rect.top
    const openUp = spaceBelow < 200 && spaceAbove > spaceBelow
    const maxHeight = openUp
      ? Math.min(224, spaceAbove - 8)
      : Math.min(224, spaceBelow - 8)
    const style = openUp
      ? { position: 'fixed', left: rect.left, bottom: window.innerHeight - rect.top + 4, width: rect.width, maxHeight: `${maxHeight}px` }
      : { position: 'fixed', left: rect.left, top: rect.bottom + 4, width: rect.width, maxHeight: `${maxHeight}px` }

    return createPortal(
      <ul
        className="z-[9999] overflow-auto rounded-lg border border-white/10 bg-[#1a1a24] py-1 shadow-xl"
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
                  ? 'bg-[#6366f1]/30 text-white'
                  : 'text-slate-200 hover:bg-white/10 hover:text-white'
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
      {label ? <label className="mb-2 block text-sm font-medium text-white">{label}</label> : null}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-lg border border-white/10 bg-[#1a1a24] px-3 py-2.5 text-left text-sm text-white shadow-lg focus:border-[#6366f1]/50 focus:outline-none focus:ring-1 focus:ring-[#6366f1]/30"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-labelledby={id}
      >
        <span id={id}>{selected.label}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-slate-400 transition ${open ? 'rotate-180' : ''}`} />
      </button>
      {dropdownContent}
    </div>
  )
}

export default function FiltersSidebar({ category, type, onCategoryChange, onTypeChange }) {
  return (
    <aside className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">Filters</h3>
      <div className="space-y-6">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-white">
            <FolderOpen className="h-4 w-4 text-[#22d3ee]" />
            Category
          </div>
          <FilterDropdown
            id="filter-category"
            label=""
            options={CATEGORIES}
            value={category}
            onChange={onCategoryChange}
          />
        </div>
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-white">
            <FileText className="h-4 w-4 text-[#22d3ee]" />
            Type
          </div>
          <FilterDropdown
            id="filter-type"
            label=""
            options={TYPES}
            value={type}
            onChange={onTypeChange}
          />
        </div>
      </div>
    </aside>
  )
}
