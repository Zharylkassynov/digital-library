import { ExternalLink, Bookmark } from 'lucide-react'
import { getImageUrl } from '../api/api'
import { useAppSettings } from '../context/AppSettingsContext'

export default function ResourceCard({
  resource,
  onOpen,
  onBookmark,
  isBookmarked,
  bookmarkEnabled = true,
}) {
  const { t } = useAppSettings()
  const imageUrl = getImageUrl(resource.image || resource.imageUrl)
  const title = resource.title || resource.name || t('resource.untitled')
  const description = resource.description || resource.summary || ''
  const category = resource.category || ''
  const author = resource.author || resource.authors?.[0] || ''
  const year = resource.year || resource.publishedYear || ''
  const loginTitle = t('resource.logInToSave')

  return (
    <article className="card-hover-animation flex h-full min-w-0 w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg backdrop-blur dark:border-white/10 dark:bg-white/5">
      <button
        type="button"
        onClick={() => onOpen(resource)}
        className="group relative block aspect-[3/4] w-full shrink-0 overflow-hidden bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:ring-offset-2 focus:ring-offset-white dark:bg-slate-800/50 dark:focus:ring-offset-[#0a0a0f]"
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt=""
            className="card-image-zoom h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-400 dark:text-slate-500">
            <span className="text-4xl">📚</span>
          </div>
        )}
      </button>
      <div className="flex min-h-0 flex-1 flex-col p-4">
        <button
          type="button"
          onClick={() => onOpen(resource)}
          className="group h-12 shrink-0 text-left focus:outline-none"
        >
          <h3 className="line-clamp-2 font-semibold leading-tight text-slate-900 transition group-hover:text-[#0891b2] dark:text-white dark:group-hover:text-[#22d3ee]">
            {title}
          </h3>
        </button>
        <div className="mb-2 min-h-10 shrink-0">
          {description ? (
            <p className="line-clamp-2 text-sm leading-snug text-slate-600 dark:text-slate-400">
              {description}
            </p>
          ) : (
            <span className="inline-block text-sm text-slate-400/80 dark:text-slate-500/50">—</span>
          )}
        </div>
        <div className="mt-auto flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-500">
          {category && (
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[#0891b2] dark:bg-white/10 dark:text-[#22d3ee]">
              {category}
            </span>
          )}
          {author && <span>{author}</span>}
          {year && <span>{year}</span>}
        </div>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => onOpen(resource)}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-3 py-2 text-sm font-medium text-white transition hover:opacity-90"
          >
            <ExternalLink className="h-4 w-4" />
            {t('resource.open')}
          </button>
          <button
            type="button"
            disabled={!bookmarkEnabled}
            title={!bookmarkEnabled ? loginTitle : undefined}
            onClick={() => onBookmark(resource.id)}
            className={`rounded-lg border px-3 py-2 transition ${
              isBookmarked
                ? 'border-[#0891b2] bg-[#0891b2]/15 text-[#0891b2] dark:border-[#22d3ee] dark:bg-[#22d3ee]/20 dark:text-[#22d3ee]'
                : 'border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300 hover:text-slate-800 dark:border-white/10 dark:bg-white/5 dark:text-slate-400 dark:hover:border-white/20 dark:hover:text-white'
            } disabled:cursor-not-allowed disabled:opacity-40`}
            aria-label={isBookmarked ? t('resource.removeBookmark') : t('resource.addBookmark')}
          >
            <Bookmark
              className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`}
            />
          </button>
        </div>
      </div>
    </article>
  )
}
