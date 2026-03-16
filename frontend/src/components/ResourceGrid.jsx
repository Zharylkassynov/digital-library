import { useEffect, useRef } from 'react'
import ResourceCard from './ResourceCard'

const OBSERVER_OPTIONS = { root: null, rootMargin: '0px', threshold: 0.1 }

export default function ResourceGrid({
  resources,
  loading,
  onOpenModal,
  onBookmark,
  isBookmarked,
  emptyMessage = 'No resources found.',
}) {
  const cardRefs = useRef(new Map())

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        const el = entry.target
        const delay = el.dataset.delay ?? '1'
        el.classList.remove('opacity-0')
        el.classList.add('scroll-reveal', `scroll-reveal-delay-${delay}`)
      })
    }, OBSERVER_OPTIONS)

    cardRefs.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [resources])

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex min-w-0 w-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4"
          >
            <div className="aspect-[3/4] w-full animate-pulse rounded-lg bg-white/10" />
            <div className="mt-4 h-4 w-3/4 animate-pulse rounded bg-white/10" />
            <div className="mt-2 h-3 w-full animate-pulse rounded bg-white/10" />
            <div className="mt-4 flex gap-2">
              <div className="h-10 flex-1 animate-pulse rounded-lg bg-white/10" />
              <div className="h-10 w-10 animate-pulse rounded-lg bg-white/10" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!resources?.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 py-16 text-center backdrop-blur">
        <p className="text-slate-400">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {resources.map((resource, index) => (
        <div
          key={resource.id}
          ref={(el) => {
            if (el) cardRefs.current.set(resource.id, el)
          }}
          data-delay={Math.min(index + 1, 20)}
          className="flex min-w-0 w-full opacity-0"
        >
          <ResourceCard
            resource={resource}
            onOpen={onOpenModal}
            onBookmark={onBookmark}
            isBookmarked={isBookmarked(resource.id)}
          />
        </div>
      ))}
    </div>
  )
}
