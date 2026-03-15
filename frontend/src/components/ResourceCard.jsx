import { ExternalLink, Bookmark } from 'lucide-react'
import { getImageUrl } from '../api/api'

export default function ResourceCard({ resource, onOpen, onBookmark, isBookmarked }) {
  const imageUrl = getImageUrl(resource.image || resource.imageUrl)
  const title = resource.title || resource.name || 'Untitled'
  const description = resource.description || resource.summary || ''
  const category = resource.category || ''
  const author = resource.author || resource.authors?.[0] || ''
  const year = resource.year || resource.publishedYear || ''

  return (
    <article className="card-hover-animation flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-lg backdrop-blur transition">
      <button
        type="button"
        onClick={() => onOpen(resource)}
        className="group relative block aspect-[3/4] w-full shrink-0 overflow-hidden bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:ring-offset-2 focus:ring-offset-[#0a0a0f]"
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt=""
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-500">
            <span className="text-4xl">📚</span>
          </div>
        )}
      </button>
      <div className="flex min-h-0 flex-1 flex-col p-4">
        <button
          type="button"
          onClick={() => onOpen(resource)}
          className="h-12 shrink-0 text-left focus:outline-none"
        >
          <h3 className="line-clamp-2 font-semibold leading-tight text-white transition hover:text-[#22d3ee]">
            {title}
          </h3>
        </button>
        <div className="mb-2 min-h-10 shrink-0">
          {description ? (
            <p className="line-clamp-2 text-sm leading-snug text-slate-400">{description}</p>
          ) : (
            <span className="inline-block text-sm text-slate-500/50">—</span>
          )}
        </div>
        <div className="mt-auto flex flex-wrap items-center gap-2 text-xs text-slate-500">
          {category && (
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[#22d3ee]">
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
            Open
          </button>
          <button
            type="button"
            onClick={() => onBookmark(resource.id)}
            className={`rounded-lg border px-3 py-2 transition ${
              isBookmarked
                ? 'border-[#22d3ee] bg-[#22d3ee]/20 text-[#22d3ee]'
                : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:text-white'
            }`}
            aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
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
