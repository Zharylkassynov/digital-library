import { useEffect, useRef } from 'react'
import { X, ExternalLink, Bookmark } from 'lucide-react'
import { getImageUrl, recordResourceView } from '../api/api'
import { useAppSettings } from '../context/AppSettingsContext'

export default function ResourceModal({
  resource,
  onClose,
  onBookmark,
  isBookmarked,
  bookmarkEnabled = true,
}) {
  const { t } = useAppSettings()
  const overlayRef = useRef(null)
  const viewRecordedThisOpen = useRef(new Set())

  if (!resource) return null

  const imageUrl = getImageUrl(resource.image || resource.imageUrl)
  const title = resource.title || resource.name || t('resource.untitled')
  const description = resource.description || resource.summary || ''
  const category = resource.category || ''
  const author = resource.author || resource.authors?.[0] || ''
  const year = resource.year || resource.publishedYear || ''
  const linkUrl = resource.url || resource.link || '#'
  const bookmarked = typeof isBookmarked === 'function' ? isBookmarked(resource.id) : !!isBookmarked
  const loginTitle = t('resource.logInToSave')

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

  useEffect(() => {
    if (!resource?.id) {
      viewRecordedThisOpen.current.clear()
      return
    }
    const id = resource.id
    if (viewRecordedThisOpen.current.has(id)) return
    viewRecordedThisOpen.current.add(id)
    recordResourceView(id)
  }, [resource?.id])

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="modal-backdrop-animation fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4 backdrop-blur-[2px] dark:bg-[radial-gradient(ellipse_at_center,rgba(15,15,25,0.97)_0%,rgba(0,0,0,0.92)_100%)] dark:backdrop-blur-none"
      onClick={handleOverlayClick}
    >
      <div
        className="modal-content-animation relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-2xl dark:border-white/[0.08] dark:bg-gradient-to-br dark:from-[#12121c]/98 dark:to-[#0a0a0f]/99 dark:text-white dark:shadow-[0_0_0_1px_rgba(99,102,241,0.15),0_25px_50px_-12px_rgba(0,0,0,0.6),0_0_80px_-20px_rgba(99,102,241,0.2)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 rounded-full border border-slate-200 bg-slate-100 p-2.5 text-slate-700 transition hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-[#6366f1] dark:border-transparent dark:bg-white/10 dark:text-white dark:hover:bg-white/20 dark:focus:ring-[#22d3ee]"
          aria-label={t('resource.closeModal')}
        >
          <X className="h-5 w-5" />
        </button>
        <div className="flex max-h-[90vh] flex-col overflow-y-auto sm:flex-row">
          <div className="flex-shrink-0 bg-gradient-to-b from-slate-100 to-white dark:from-slate-900/80 dark:to-[#0a0a0f] sm:w-72">
            <div className="flex min-h-[200px] items-center justify-center p-6 sm:min-h-[280px] sm:p-8">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt=""
                  className="max-h-[260px] w-auto max-w-full rounded-lg object-contain shadow-xl sm:max-h-[320px]"
                  style={{ boxShadow: '0 20px 40px -10px rgba(0,0,0,0.15)' }}
                />
              ) : (
                <div className="flex h-48 w-36 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-5xl dark:border-white/10 dark:bg-white/5 sm:h-56 sm:w-40">
                  📚
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-1 flex-col p-6 sm:p-8">
            <h2
              id="modal-title"
              className="mb-3 text-2xl font-bold leading-tight text-slate-900 sm:text-3xl dark:text-white"
            >
              {title}
            </h2>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {category && (
                <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-medium text-cyan-800 dark:bg-[rgba(34,211,238,0.15)] dark:text-[#22d3ee]">
                  {category}
                </span>
              )}
              {author && (
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {author}
                  {year ? ` · ${year}` : ''}
                </span>
              )}
              {!author && year && (
                <span className="text-sm text-slate-600 dark:text-slate-400">{year}</span>
              )}
            </div>
            {description && (
              <p className="mb-6 flex-1 leading-relaxed text-slate-600 dark:text-slate-300">{description}</p>
            )}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href={linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-5 py-3.5 font-medium text-white transition hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-[#0a0a0f]"
                style={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  boxShadow: '0 4px 14px -2px rgba(99,102,241,0.4)',
                }}
              >
                <ExternalLink className="h-4 w-4" />
                {t('resource.openResource')}
              </a>
              <button
                type="button"
                disabled={!bookmarkEnabled}
                title={!bookmarkEnabled ? loginTitle : undefined}
                onClick={() => onBookmark(resource.id)}
                className={`inline-flex items-center justify-center gap-2 rounded-xl border px-5 py-3.5 font-medium transition focus:outline-none focus:ring-2 focus:ring-[#22d3ee] focus:ring-offset-2 focus:ring-offset-white disabled:cursor-not-allowed disabled:opacity-40 dark:focus:ring-offset-[#0a0a0f] ${
                  bookmarked
                    ? 'border-[#0891b2] bg-[#0891b2]/10 text-[#0891b2] dark:border-[#22d3ee] dark:bg-[#22d3ee]/20 dark:text-[#22d3ee]'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900 dark:border-white/15 dark:bg-white/5 dark:text-slate-400 dark:hover:border-white/25 dark:hover:bg-white/10 dark:hover:text-white'
                }`}
                aria-pressed={bookmarked}
                aria-label={bookmarked ? t('resource.removeBookmark') : t('resource.addBookmark')}
              >
                <Bookmark
                  className={`h-4 w-4 shrink-0 ${bookmarked ? 'fill-current' : ''}`}
                />
                {bookmarked ? t('resource.saved') : t('resource.bookmark')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
