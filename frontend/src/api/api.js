// In dev, use relative URLs so Vite proxy forwards to backend (localhost:5000)
const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api'
const IMAGES_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/images`
  : '/images'

export const TOKEN_KEY = 'digital-library-token'

export const getStoredToken = () => localStorage.getItem(TOKEN_KEY)
export const setStoredToken = (token) => {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

function authHeaders() {
  const t = getStoredToken()
  return t ? { Authorization: `Bearer ${t}` } : {}
}

async function parseJson(res) {
  const text = await res.text()
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

async function apiFetch(path, options = {}) {
  const headers = {
    ...(options.body && typeof options.body === 'string'
      ? { 'Content-Type': 'application/json' }
      : {}),
    ...authHeaders(),
    ...options.headers,
  }
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers })
  const data = await parseJson(res)
  if (!res.ok) {
    const msg = data?.error || data?.message || res.statusText || 'Request failed'
    const err = new Error(msg)
    err.status = res.status
    err.details = data?.details
    throw err
  }
  return data
}

export const getImageUrl = (filename) => {
  if (!filename) return null
  if (filename.startsWith('http') || filename.startsWith('/')) return filename
  return `${IMAGES_BASE}/books/${filename}`
}

export const fetchResources = async (params = {}) => {
  const searchParams = new URLSearchParams()
  if (params.search) searchParams.set('search', params.search)
  if (params.category) searchParams.set('category', params.category)
  if (params.type) searchParams.set('type', params.type)
  const query = searchParams.toString()
  const url = query ? `${API_BASE}/resources?${query}` : `${API_BASE}/resources`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch resources')
  return res.json()
}

export const fetchResourceById = async (id) => {
  const res = await fetch(`${API_BASE}/resources/${id}`)
  if (!res.ok) throw new Error('Failed to fetch resource')
  return res.json()
}

export const fetchRandomResources = async () => {
  const res = await fetch(`${API_BASE}/resources/random`)
  if (!res.ok) throw new Error('Failed to fetch random resources')
  return res.json()
}

export const recordResourceView = (id) =>
  apiFetch(`/resources/${id}/view`, { method: 'POST' }).catch(() => {})

export const authRegister = (body) =>
  apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(body) })

export const authLogin = (body) =>
  apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(body) })

export const authMe = () => apiFetch('/auth/me')

export const fetchFavorites = () => apiFetch('/favorites')

export const addFavorite = (resourceId) =>
  apiFetch('/favorites', {
    method: 'POST',
    body: JSON.stringify({ resource_id: resourceId }),
  })

export const removeFavorite = (favoriteId) =>
  apiFetch(`/favorites/${favoriteId}`, { method: 'DELETE' })

/** Site-wide or optional resource: pass only message, or { message, resource_id }. */
export const submitReport = (messageOrPayload) => {
  if (typeof messageOrPayload === 'string') {
    return apiFetch('/reports', {
      method: 'POST',
      body: JSON.stringify({ message: messageOrPayload.trim() }),
    })
  }
  const { message, resource_id: resourceId } = messageOrPayload
  const body = { message: String(message).trim() }
  if (resourceId != null) body.resource_id = resourceId
  return apiFetch('/reports', { method: 'POST', body: JSON.stringify(body) })
}

export const fetchResourceFilters = () => apiFetch('/resources/filters')

export const uploadCoverImage = async (file) => {
  const form = new FormData()
  form.append('file', file)
  const t = getStoredToken()
  const res = await fetch(`${API_BASE}/upload/image`, {
    method: 'POST',
    headers: t ? { Authorization: `Bearer ${t}` } : {},
    body: form,
  })
  const data = await parseJson(res)
  if (!res.ok) {
    const msg = data?.error || 'Upload failed'
    throw new Error(msg)
  }
  return data.filename
}

export const fetchReports = () => apiFetch('/reports')

export const fetchStats = (limit = 10) =>
  apiFetch(`/stats?limit=${encodeURIComponent(limit)}`)

export const fetchStatsTimeline = (days = 30, resourceId) => {
  const q = new URLSearchParams()
  q.set('days', String(days))
  if (resourceId != null && resourceId !== '') q.set('resourceId', String(resourceId))
  return apiFetch(`/stats/timeline?${q.toString()}`)
}

export const createResource = (body) =>
  apiFetch('/resources', { method: 'POST', body: JSON.stringify(body) })

export const updateResource = (id, body) =>
  apiFetch(`/resources/${id}`, { method: 'PUT', body: JSON.stringify(body) })

export const deleteResource = (id) =>
  apiFetch(`/resources/${id}`, { method: 'DELETE' })

const ORIGIN = import.meta.env.VITE_API_URL || ''

export const checkHealth = async () => {
  const res = await fetch(`${ORIGIN}/api/health`)
  return res.ok
}
