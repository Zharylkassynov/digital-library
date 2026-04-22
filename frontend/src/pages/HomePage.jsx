import { useState, useEffect, useMemo } from 'react'
import SearchBar from '../components/SearchBar'
import FiltersSidebar from '../components/FiltersSidebar'
import ResourceGrid from '../components/ResourceGrid'
import ResourceModal from '../components/ResourceModal'
import SiteReportSection from '../components/SiteReportSection'
import { useBookmarks } from '../hooks/useBookmarks'
import { fetchResources } from '../api/api'

const PAGE_SIZE = 9
const SEARCH_DEBOUNCE_MS = 300

export default function HomePage() {
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [searchQuery, setSearchQuery] = useState('') // debounced value sent to API
  const [category, setCategory] = useState('')
  const [type, setType] = useState('')
  const [selectedResource, setSelectedResource] = useState(null)
  const [page, setPage] = useState(1)
  const { isBookmarked, toggleBookmark, bookmarkEnabled } = useBookmarks()

  // Debounce search input so we don't hit the API on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => setSearchQuery(search), SEARCH_DEBOUNCE_MS)
    return () => clearTimeout(timer)
  }, [search])

  const queryParams = useMemo(
    () => ({
      ...(searchQuery.trim() && { search: searchQuery.trim() }),
      ...(category && { category }),
      ...(type && { type }),
    }),
    [searchQuery, category, type]
  )

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetchResources(queryParams)
      .then((data) => {
        if (!cancelled) {
          setResources(Array.isArray(data) ? data : [])
          setPage(1)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setResources([])
          setError(err?.message || 'Could not connect to the library. Make sure the backend is running at http://localhost:5000.')
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [queryParams])

  // Refetch when user returns to the tab (e.g. after running seed) so changes appear without full reload
  useEffect(() => {
    const handler = () => {
      if (document.visibilityState !== 'visible') return
      setLoading(true)
      fetchResources(queryParams)
        .then((data) => {
          setResources(Array.isArray(data) ? data : [])
        })
        .catch(() => {})
        .finally(() => setLoading(false))
    }
    document.addEventListener('visibilitychange', handler)
    return () => document.removeEventListener('visibilitychange', handler)
  }, [queryParams])

  const totalPages = Math.ceil(resources.length / PAGE_SIZE) || 1
  const paginatedResources = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return resources.slice(start, start + PAGE_SIZE)
  }, [resources, page])

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="w-full flex-shrink-0 lg:w-64">
          <FiltersSidebar
            category={category}
            type={type}
            onCategoryChange={setCategory}
            onTypeChange={setType}
          />
        </aside>
        <div className="min-w-0 flex-1">
          <div className="mb-6">
            <SearchBar value={search} onChange={setSearch} />
          </div>
          {error && (
            <div className="mb-6 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
              {error}
            </div>
          )}
          <ResourceGrid
            resources={paginatedResources}
            loading={loading}
            onOpenModal={setSelectedResource}
            onBookmark={toggleBookmark}
            isBookmarked={isBookmarked}
            bookmarkEnabled={bookmarkEnabled}
          />
          {!loading && resources.length > PAGE_SIZE && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition disabled:opacity-50 hover:enabled:bg-white/10"
              >
                Previous
              </button>
              <span className="px-4 text-sm text-slate-400">
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition disabled:opacity-50 hover:enabled:bg-white/10"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
      {selectedResource && (
        <ResourceModal
          resource={selectedResource}
          onClose={() => setSelectedResource(null)}
          onBookmark={toggleBookmark}
          isBookmarked={isBookmarked}
          bookmarkEnabled={bookmarkEnabled}
        />
      )}
      <SiteReportSection />
    </div>
  )
}
