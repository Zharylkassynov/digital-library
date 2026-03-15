import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'digital-library-bookmarks';

const loadBookmarks = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveBookmarks = (ids) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
};

export function useBookmarks() {
  const [bookmarkIds, setBookmarkIds] = useState(loadBookmarks);

  useEffect(() => {
    saveBookmarks(bookmarkIds);
  }, [bookmarkIds]);

  const isBookmarked = useCallback(
    (id) => bookmarkIds.includes(String(id)),
    [bookmarkIds]
  );

  const toggleBookmark = useCallback((id) => {
    const sid = String(id);
    setBookmarkIds((prev) =>
      prev.includes(sid) ? prev.filter((x) => x !== sid) : [...prev, sid]
    );
  }, []);

  const addBookmark = useCallback((id) => {
    const sid = String(id);
    setBookmarkIds((prev) => (prev.includes(sid) ? prev : [...prev, sid]));
  }, []);

  const removeBookmark = useCallback((id) => {
    const sid = String(id);
    setBookmarkIds((prev) => prev.filter((x) => x !== sid));
  }, []);

  return {
    bookmarkIds,
    isBookmarked,
    toggleBookmark,
    addBookmark,
    removeBookmark,
  };
}
