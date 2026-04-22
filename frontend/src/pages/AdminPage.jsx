import { useEffect, useState, useRef, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import AdminVisitsChart from '../components/AdminVisitsChart'
import AdminReportsScroll from '../components/AdminReportsScroll'
import {
  createResource,
  deleteResource,
  fetchReports,
  fetchResourceFilters,
  fetchResources,
  fetchStats,
  getImageUrl,
  updateResource,
  uploadCoverImage,
} from '../api/api'

const emptyForm = {
  title: '',
  description: '',
  category: '',
  type: '',
  author: '',
  year: '',
  image: '',
  link: '',
}

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth()
  const [resources, setResources] = useState([])
  const [popular, setPopular] = useState([])
  const [reports, setReports] = useState([])
  const [filterOptions, setFilterOptions] = useState({ categories: [], types: [] })
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)

  const categorySelectOptions = useMemo(() => {
    const c = new Set(filterOptions.categories)
    if (form.category) c.add(form.category)
    return [...c].sort()
  }, [filterOptions.categories, form.category])

  const typeSelectOptions = useMemo(() => {
    const t = new Set(filterOptions.types)
    if (form.type) t.add(form.type)
    return [...t].sort()
  }, [filterOptions.types, form.type])

  const load = () => {
    fetchResources()
      .then(setResources)
      .catch(() => setResources([]))
    fetchStats(5)
      .then((d) => setPopular(d.popular || []))
      .catch(() => setPopular([]))
    fetchResourceFilters()
      .then((d) =>
        setFilterOptions({
          categories: d.categories || [],
          types: d.types || [],
        })
      )
      .catch(() => setFilterOptions({ categories: [], types: [] }))
  }

  const loadReports = () => {
    fetchReports()
      .then((d) => setReports(d.reports || []))
      .catch(() => setReports([]))
  }

  useEffect(() => {
    if (user?.role === 'admin') {
      load()
      loadReports()
    }
  }, [user?.role])

  const onField = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const startEdit = (r) => {
    setEditingId(r.id)
    setForm({
      title: r.title || '',
      description: r.description || '',
      category: r.category || '',
      type: r.type || '',
      author: r.author || '',
      year: r.year != null ? String(r.year) : '',
      image: r.image || '',
      link: r.link || '',
    })
    setMessage('')
    setError('')
  }

  const resetForm = () => {
    setEditingId(null)
    setForm(emptyForm)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const onPickImage = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError('')
    setUploading(true)
    try {
      const filename = await uploadCoverImage(file)
      setForm((f) => ({ ...f, image: filename }))
      setMessage('Image uploaded — file saved to the server.')
    } catch (err) {
      setError(err.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setBusy(true)
    const payload = {
      ...form,
      year: form.year === '' ? null : Number(form.year),
    }
    try {
      if (editingId) {
        await updateResource(editingId, payload)
        setMessage('Resource updated.')
      } else {
        await createResource(payload)
        setMessage('Resource created.')
      }
      resetForm()
      load()
      loadReports()
    } catch (err) {
      setError(err.message || 'Save failed')
    } finally {
      setBusy(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this resource?')) return
    setBusy(true)
    setError('')
    try {
      await deleteResource(id)
      if (editingId === id) resetForm()
      setMessage('Deleted.')
      load()
      loadReports()
    } catch (err) {
      setError(err.message || 'Delete failed')
    } finally {
      setBusy(false)
    }
  }

  const coverPreview = form.image ? getImageUrl(form.image) : null

  if (authLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center text-slate-400">Loading…</div>
    )
  }

  if (user?.role !== 'admin') {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-slate-300">Admin access only.</p>
        <Link to="/" className="mt-4 inline-block text-[#22d3ee] hover:underline">
          Back home
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">Admin — Resources</h1>
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4" />
          Library
        </Link>
      </div>

      <div className="mb-8">
        <AdminVisitsChart resources={resources} />
      </div>

      <div className="mb-8 grid items-stretch gap-8 lg:grid-cols-2">
        <div className="flex h-full min-h-0 flex-col rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-4 text-lg font-semibold text-white">
            {editingId ? `Edit #${editingId}` : 'Create resource'}
          </h2>
          {message && (
            <p className="mb-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
              {message}
            </p>
          )}
          {error && (
            <p className="mb-3 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
              {error}
            </p>
          )}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="mb-0.5 block text-xs text-slate-400">title *</label>
              <input
                required
                value={form.title}
                onChange={onField('title')}
                className="w-full rounded-lg border border-white/10 bg-[#0a0a0f] px-3 py-2 text-sm text-white"
              />
            </div>
            <div>
              <label className="mb-0.5 block text-xs text-slate-400">description *</label>
              <textarea
                required
                value={form.description}
                onChange={onField('description')}
                rows={3}
                className="w-full rounded-lg border border-white/10 bg-[#0a0a0f] px-3 py-2 text-sm text-white"
              />
            </div>
            <div>
              <label className="mb-0.5 block text-xs text-slate-400">category *</label>
              <select
                required
                value={form.category}
                onChange={onField('category')}
                className="w-full rounded-lg border border-white/10 bg-[#0a0a0f] px-3 py-2 text-sm text-white"
              >
                <option value="" disabled>
                  Select category
                </option>
                {categorySelectOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-0.5 block text-xs text-slate-400">type *</label>
              <select
                required
                value={form.type}
                onChange={onField('type')}
                className="w-full rounded-lg border border-white/10 bg-[#0a0a0f] px-3 py-2 text-sm text-white"
              >
                <option value="" disabled>
                  Select type
                </option>
                {typeSelectOptions.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-0.5 block text-xs text-slate-400">author</label>
              <input
                value={form.author}
                onChange={onField('author')}
                className="w-full rounded-lg border border-white/10 bg-[#0a0a0f] px-3 py-2 text-sm text-white"
              />
            </div>
            <div>
              <label className="mb-0.5 block text-xs text-slate-400">year</label>
              <input
                value={form.year}
                onChange={onField('year')}
                className="w-full rounded-lg border border-white/10 bg-[#0a0a0f] px-3 py-2 text-sm text-white"
              />
            </div>
            <div>
              <label className="mb-0.5 block text-xs text-slate-400">cover image</label>
              <p className="mb-2 text-xs text-slate-500">Upload a file — it is stored under server «images/books» and the filename is saved in the database.</p>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={onPickImage}
                  className="text-sm text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:bg-violet-600 file:px-3 file:py-1.5 file:text-sm file:text-white"
                />
                {uploading && <span className="text-xs text-cyan-400">Uploading…</span>}
              </div>
              {form.image && (
                <p className="mt-2 break-all text-xs text-slate-500">
                  File: <span className="text-slate-300">{form.image}</span>
                </p>
              )}
              {coverPreview && (
                <div className="mt-3 flex items-start gap-3">
                  <div className="h-20 w-14 overflow-hidden rounded border border-white/10 bg-black/30">
                    <img src={coverPreview} alt="" className="h-full w-full object-cover" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, image: '' }))}
                    className="text-xs text-rose-400 hover:underline"
                  >
                    Remove image
                  </button>
                </div>
              )}
            </div>
            <div>
              <label className="mb-0.5 block text-xs text-slate-400">link</label>
              <input
                value={form.link}
                onChange={onField('link')}
                className="w-full rounded-lg border border-white/10 bg-[#0a0a0f] px-3 py-2 text-sm text-white"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={busy}
                className="rounded-xl bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
              >
                {busy ? 'Saving…' : editingId ? 'Update' : 'Create'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border border-white/15 px-4 py-2 text-sm text-slate-300 hover:bg-white/5"
                >
                  Cancel edit
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="flex h-full min-h-0 min-w-0 flex-col justify-between gap-6">
          <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="mb-3 shrink-0 text-lg font-semibold text-white">Popular (views)</h2>
            <ul className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-0.5 text-sm text-slate-300 [scrollbar-width:thin] [scrollbar-color:rgba(99,102,241,0.4)_rgba(255,255,255,0.04)]">
              {popular.length === 0 && <li className="text-slate-500">No view data yet.</li>}
              {popular.map((row) => (
                <li
                  key={row.resource_id}
                  className="flex items-baseline justify-between gap-3 border-b border-white/5 py-1.5 last:border-0"
                >
                  <span className="min-w-0 truncate" title={row.title}>
                    {row.title}
                  </span>
                  <span className="shrink-0 tabular-nums text-[#22d3ee]">{row.count}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex min-h-0 min-w-0 flex-[1.3] flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="mb-1 shrink-0 text-lg font-semibold text-white">User reports</h2>
            <p className="mb-4 shrink-0 text-xs text-slate-500">
              Messages are stored in SQLite (<code className="text-slate-400">reports</code>). Scroll the
              list when there are many entries — use the rail on the right to jump up or down.
            </p>
            <AdminReportsScroll className="min-h-0">
              <ul className="space-y-3 text-left text-sm text-slate-300">
                {reports.length === 0 && <li className="text-slate-500">No reports yet.</li>}
                {reports.map((r) => (
                  <li key={r.id} className="border-b border-white/5 pb-3 last:border-0 last:pb-0">
                    <div className="text-xs text-slate-500">{r.resource_title}</div>
                    <div className="text-slate-200">{r.message}</div>
                  </li>
                ))}
              </ul>
            </AdminReportsScroll>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full min-w-[640px] text-left text-sm text-slate-300">
          <thead className="border-b border-white/10 bg-white/5 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {resources.map((r) => (
              <tr key={r.id} className="border-b border-white/5 hover:bg-white/[0.03]">
                <td className="px-4 py-2 font-mono text-xs">{r.id}</td>
                <td className="max-w-xs truncate px-4 py-2 text-white">{r.title}</td>
                <td className="px-4 py-2">{r.category}</td>
                <td className="px-4 py-2 text-right">
                  <button
                    type="button"
                    onClick={() => startEdit(r)}
                    className="mr-2 text-[#22d3ee] hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(r.id)}
                    className="text-rose-400 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
