import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import ResourceGrid from '../components/ResourceGrid'
import ResourceModal from '../components/ResourceModal'
import { useBookmarks } from '../hooks/useBookmarks'

export default function SavedPage() {
  const [loading, setLoading] = useState(true)
  const [selectedResource, setSelectedResource] = useState(null)
  const {
    savedResources,
    isBookmarked,
    toggleBookmark,
    bookmarkEnabled,
    bookmarksLoading,
  } = useBookmarks()

  useEffect(() => {
    if (!bookmarkEnabled) {
      setLoading(false)
      return
    }
    setLoading(bookmarksLoading)
  }, [bookmarkEnabled, bookmarksLoading])

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
      {!bookmarkEnabled ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-12 text-center text-slate-400">
          <p className="mb-4">Log in to save and view your favorites in the cloud.</p>
          <Link
            to="/login"
            className="inline-block rounded-xl bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-5 py-2.5 text-sm font-medium text-white"
          >
            Log in
          </Link>
        </div>
      ) : (
        <ResourceGrid
          resources={savedResources}
          loading={loading}
          onOpenModal={setSelectedResource}
          onBookmark={toggleBookmark}
          isBookmarked={isBookmarked}
          bookmarkEnabled={bookmarkEnabled}
          emptyMessage="You haven't saved any resources yet. Browse the library and bookmark items you like."
        />
      )}
      {selectedResource && (
        <ResourceModal
          resource={selectedResource}
          onClose={() => setSelectedResource(null)}
          onBookmark={toggleBookmark}
          isBookmarked={isBookmarked}
          bookmarkEnabled={bookmarkEnabled}
        />
      )}
    </div>
  )
}
