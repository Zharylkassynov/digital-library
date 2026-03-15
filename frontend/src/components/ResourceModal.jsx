import { useEffect, useRef } from 'react'
import { X, ExternalLink, Bookmark } from 'lucide-react'
import { getImageUrl } from '../api/api'

export default function ResourceModal({ resource, onClose, onBookmark, isBookmarked }) {
  const overlayRef = useRef(null)

  if (!resource) return null

  const imageUrl = getImageUrl(resource.image || resource.imageUrl)
  const title = resource.title || resource.name || 'Untitled'
  const description = resource.description || resource.summary || ''
  const category = resource.category || ''
  const author = resource.author || resource.authors?.[0] || ''
  const year = resource.year || resource.publishedYear || ''
  const linkUrl = resource.url || resource.link || '#'
  const bookmarked = typeof isBookmarked === 'function' ? isBookmarked(resource.id) : !!isBookmarked

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') onClose()
  }

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose()
  }

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="modal-backdrop-animation fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'radial-gradient(ellipse at center, rgba(15,15,25,0.97) 0%, rgba(0,0,0,0.92) 100%)' }}
      onClick={handleOverlayClick}
    >
      <div
        className="modal-content-animation relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl shadow-2xl"
        style={{
          background: 'linear-gradient(145deg, rgba(18,18,28,0.98) 0%, rgba(10,10,15,0.99) 100%)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 0 0 1px rgba(99,102,241,0.15), 0 25px 50px -12px rgba(0,0,0,0.6), 0 0 80px -20px rgba(99,102,241,0.2)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 rounded-full bg-white/10 p-2.5 text-white backdrop-blur-sm transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-[#22d3ee]"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="flex max-h-[90vh] flex-col overflow-y-auto sm:flex-row">
          {/* Book cover — full image visible, constrained size */}
          <div className="flex-shrink-0 bg-gradient-to-b from-slate-900/80 to-[#0a0a0f] sm:w-72">
            <div className="flex min-h-[200px] items-center justify-center p-6 sm:min-h-[280px] sm:p-8">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt=""
                  className="max-h-[260px] w-auto max-w-full rounded-lg object-contain shadow-xl sm:max-h-[320px]"
                  style={{ boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)' }}
                />
              ) : (
                <div className="flex h-48 w-36 items-center justify-center rounded-lg bg-white/5 text-5xl sm:h-56 sm:w-40">
                  📚
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-1 flex-col p-6 sm:p-8">
            <h2 id="modal-title" className="mb-3 text-2xl font-bold leading-tight text-white sm:text-3xl">
              {title}
            </h2>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {category && (
                <span
                  className="rounded-full px-3 py-1 text-xs font-medium"
                  style={{ background: 'rgba(34,211,238,0.15)', color: '#22d3ee' }}
                >
                  {category}
                </span>
              )}
              {author && (
                <span className="text-sm text-slate-400">
                  {author}
                  {year ? ` · ${year}` : ''}
                </span>
              )}
              {!author && year && <span className="text-sm text-slate-400">{year}</span>}
            </div>
            {description && (
              <p className="mb-6 flex-1 text-slate-300 leading-relaxed">{description}</p>
            )}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href={linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-5 py-3.5 font-medium text-white transition hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0a0a0f] focus:ring-[#6366f1]"
                style={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  boxShadow: '0 4px 14px -2px rgba(99,102,241,0.4)',
                }}
              >
                <ExternalLink className="h-4 w-4" />
                Open Resource
              </a>
              <button
                type="button"
                onClick={() => onBookmark(resource.id)}
                className={`inline-flex items-center justify-center gap-2 rounded-xl border px-5 py-3.5 font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0a0a0f] focus:ring-[#22d3ee] ${
                  bookmarked
                    ? 'border-[#22d3ee] bg-[#22d3ee]/20 text-[#22d3ee]'
                    : 'border-white/15 bg-white/5 text-slate-400 hover:border-white/25 hover:bg-white/10 hover:text-white'
                }`}
                aria-pressed={bookmarked}
                aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
              >
                <Bookmark
                  className={`h-4 w-4 shrink-0 ${bookmarked ? 'fill-current' : ''}`}
                />
                {bookmarked ? 'Saved' : 'Bookmark'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
