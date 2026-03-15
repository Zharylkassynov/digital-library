import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import ResourceGrid from '../components/ResourceGrid'
import ResourceModal from '../components/ResourceModal'
import { useBookmarks } from '../hooks/useBookmarks'
import { fetchResourceById } from '../api/api'

export default function SavedPage() {
  const [savedResources, setSavedResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedResource, setSelectedResource] = useState(null)
  const { bookmarkIds, isBookmarked, toggleBookmark } = useBookmarks()

  useEffect(() => {
    if (!bookmarkIds.length) {
      setSavedResources([])
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    Promise.allSettled(bookmarkIds.map((id) => fetchResourceById(id)))
      .then((results) => {
        if (!cancelled) {
          setSavedResources(
            results
              .filter((r) => r.status === 'fulfilled' && r.value)
              .map((r) => r.value)
          )
        }
      })
      .catch(() => {
        if (!cancelled) setSavedResources([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [bookmarkIds.join(',')])

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold text-white">My Bookmarks</h1>
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white backdrop-blur transition hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Library
        </Link>
      </div>
      <ResourceGrid
        resources={savedResources}
        loading={loading}
        onOpenModal={setSelectedResource}
        onBookmark={toggleBookmark}
        isBookmarked={isBookmarked}
        emptyMessage="You haven't saved any resources yet. Browse the library and bookmark items you like."
      />
      {selectedResource && (
        <ResourceModal
          resource={selectedResource}
          onClose={() => setSelectedResource(null)}
          onBookmark={toggleBookmark}
          isBookmarked={isBookmarked}
        />
      )}
    </div>
  )
}
