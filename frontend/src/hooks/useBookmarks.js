import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { addFavorite, fetchFavorites, removeFavorite } from '../api/api'

export function useBookmarks() {
  const { token } = useAuth()
  const [bookmarkIds, setBookmarkIds] = useState([])
  const [favoriteRowByResourceId, setFavoriteRowByResourceId] = useState({})
  const [savedResources, setSavedResources] = useState([])
  const [loading, setLoading] = useState(false)

  const refresh = useCallback(async () => {
    if (!token) {
      setBookmarkIds([])
      setFavoriteRowByResourceId({})
      setSavedResources([])
      return
    }
    setLoading(true)
    try {
      const { favorites } = await fetchFavorites()
      const ids = favorites.map((f) => String(f.resource.id))
      const map = {}
      favorites.forEach((f) => {
        map[String(f.resource.id)] = f.id
      })
      setBookmarkIds(ids)
      setFavoriteRowByResourceId(map)
      setSavedResources(favorites.map((f) => f.resource))
    } catch {
      setBookmarkIds([])
      setFavoriteRowByResourceId({})
      setSavedResources([])
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    refresh()
  }, [refresh])

  const isBookmarked = useCallback(
    (id) => bookmarkIds.includes(String(id)),
    [bookmarkIds]
  )

  const toggleBookmark = useCallback(
    async (id) => {
      if (!token) {
        window.alert('Please log in to save favorites.')
        return
      }
      const sid = String(id)
      try {
        if (isBookmarked(sid)) {
          const favId = favoriteRowByResourceId[sid]
          if (favId) await removeFavorite(favId)
        } else {
          await addFavorite(Number(id))
        }
        await refresh()
      } catch (e) {
        window.alert(e.message || 'Could not update favorites')
      }
    },
    [token, isBookmarked, favoriteRowByResourceId, refresh]
  )

  const addBookmark = useCallback(
    async (id) => {
      if (!token) return
      try {
        await addFavorite(Number(id))
        await refresh()
      } catch {
        /* ignore */
      }
    },
    [token, refresh]
  )

  const removeBookmark = useCallback(
    async (id) => {
      if (!token) return
      const favId = favoriteRowByResourceId[String(id)]
      if (!favId) return
      try {
        await removeFavorite(favId)
        await refresh()
      } catch {
        /* ignore */
      }
    },
    [token, favoriteRowByResourceId, refresh]
  )

  return {
    bookmarkIds,
    savedResources,
    isBookmarked,
    toggleBookmark,
    addBookmark,
    removeBookmark,
    bookmarksLoading: loading,
    bookmarkEnabled: !!token,
    refreshBookmarks: refresh,
  }
}
