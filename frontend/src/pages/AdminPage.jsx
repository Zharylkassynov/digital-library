import { useEffect, useState, useRef, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useAppSettings } from '../context/AppSettingsContext'
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

const inputClass =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 dark:border-white/10 dark:bg-[#0a0a0f] dark:text-white'

export default function AdminPage() {
  const { t } = useAppSettings()
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
    const ty = new Set(filterOptions.types)
    if (form.type) ty.add(form.type)
    return [...ty].sort()
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
      setMessage(t('admin.uploadOk'))
    } catch (err) {
      setError(err.message || t('admin.uploadFailed'))
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
        setMessage(t('admin.resourceUpdated'))
      } else {
        await createResource(payload)
        setMessage(t('admin.resourceCreated'))
      }
      resetForm()
      load()
      loadReports()
    } catch (err) {
      setError(err.message || t('admin.saveFailed'))
    } finally {
      setBusy(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm(t('admin.confirmDelete'))) return
    setBusy(true)
    setError('')
    try {
      await deleteResource(id)
      if (editingId === id) resetForm()
      setMessage(t('admin.deleted'))
      load()
      loadReports()
    } catch (err) {
      setError(err.message || t('admin.deleteFailed'))
    } finally {
      setBusy(false)
    }
  }

  const coverPreview = form.image ? getImageUrl(form.image) : null

  if (authLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center text-slate-500 dark:text-slate-400">
        {t('admin.loading')}
      </div>
    )
  }

  if (user?.role !== 'admin') {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-slate-700 dark:text-slate-300">{t('admin.accessOnly')}</p>
        <Link to="/" className="mt-4 inline-block text-[#0891b2] hover:underline dark:text-[#22d3ee]">
          {t('admin.backHome')}
        </Link>
      </div>
    )
  }

  const panelClass =
    'flex h-full min-h-0 flex-col rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm dark:border-white/10 dark:bg-white/5'

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('admin.title')}</h1>
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 shadow-sm hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('admin.library')}
        </Link>
      </div>

      <div className="mb-8">
        <AdminVisitsChart resources={resources} />
      </div>

      <div className="mb-8 grid items-stretch gap-8 lg:grid-cols-2">
        <div className={panelClass}>
          <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
            {editingId ? t('admin.edit', { id: editingId }) : t('admin.createResource')}
          </h2>
          {message && (
            <p className="mb-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200">
              {message}
            </p>
          )}
          {error && (
            <p className="mb-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200">
              {error}
            </p>
          )}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="mb-0.5 block text-xs text-slate-600 dark:text-slate-400">{t('admin.labelTitle')}</label>
              <input required value={form.title} onChange={onField('title')} className={inputClass} />
            </div>
            <div>
              <label className="mb-0.5 block text-xs text-slate-600 dark:text-slate-400">
                {t('admin.labelDescription')}
              </label>
              <textarea
                required
                value={form.description}
                onChange={onField('description')}
                rows={3}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-0.5 block text-xs text-slate-600 dark:text-slate-400">{t('admin.labelCategory')}</label>
              <select required value={form.category} onChange={onField('category')} className={inputClass}>
                <option value="" disabled>
                  {t('admin.selectCategory')}
                </option>
                {categorySelectOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-0.5 block text-xs text-slate-600 dark:text-slate-400">{t('admin.labelType')}</label>
              <select required value={form.type} onChange={onField('type')} className={inputClass}>
                <option value="" disabled>
                  {t('admin.selectType')}
                </option>
                {typeSelectOptions.map((ty) => (
                  <option key={ty} value={ty}>
                    {ty}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-0.5 block text-xs text-slate-600 dark:text-slate-400">{t('admin.labelAuthor')}</label>
              <input value={form.author} onChange={onField('author')} className={inputClass} />
            </div>
            <div>
              <label className="mb-0.5 block text-xs text-slate-600 dark:text-slate-400">{t('admin.labelYear')}</label>
              <input value={form.year} onChange={onField('year')} className={inputClass} />
            </div>
            <div>
              <label className="mb-0.5 block text-xs text-slate-600 dark:text-slate-400">{t('admin.labelCover')}</label>
              <p className="mb-2 text-xs text-slate-500">{t('admin.coverHint')}</p>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={onPickImage}
                  className="text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-violet-600 file:px-3 file:py-1.5 file:text-sm file:text-white dark:text-slate-300"
                />
                {uploading && <span className="text-xs text-cyan-600 dark:text-cyan-400">{t('admin.uploading')}</span>}
              </div>
              {form.image && (
                <p className="mt-2 break-all text-xs text-slate-500">
                  {t('admin.file')} <span className="text-slate-700 dark:text-slate-300">{form.image}</span>
                </p>
              )}
              {coverPreview && (
                <div className="mt-3 flex items-start gap-3">
                  <div className="h-20 w-14 overflow-hidden rounded border border-slate-200 bg-slate-100 dark:border-white/10 dark:bg-black/30">
                    <img src={coverPreview} alt="" className="h-full w-full object-cover" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, image: '' }))}
                    className="text-xs text-rose-600 hover:underline dark:text-rose-400"
                  >
                    {t('admin.removeImage')}
                  </button>
                </div>
              )}
            </div>
            <div>
              <label className="mb-0.5 block text-xs text-slate-600 dark:text-slate-400">{t('admin.labelLink')}</label>
              <input value={form.link} onChange={onField('link')} className={inputClass} />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={busy}
                className="rounded-xl bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
              >
                {busy ? t('admin.saving') : editingId ? t('admin.update') : t('admin.create')}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:border-white/15 dark:text-slate-300 dark:hover:bg-white/5"
                >
                  {t('admin.cancelEdit')}
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="flex h-full min-h-0 min-w-0 flex-col justify-between gap-6">
          <div className={`flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden ${panelClass}`}>
            <h2 className="mb-3 shrink-0 text-lg font-semibold text-slate-900 dark:text-white">{t('admin.popularViews')}</h2>
            <ul className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-0.5 text-sm text-slate-600 [scrollbar-width:thin] dark:text-slate-300 [scrollbar-color:rgba(99,102,241,0.4)_rgba(255,255,255,0.04)]">
              {popular.length === 0 && <li className="text-slate-500">{t('admin.noViewData')}</li>}
              {popular.map((row) => (
                <li
                  key={row.resource_id}
                  className="flex items-baseline justify-between gap-3 border-b border-slate-100 py-1.5 last:border-0 dark:border-white/5"
                >
                  <span className="min-w-0 truncate" title={row.title}>
                    {row.title}
                  </span>
                  <span className="shrink-0 tabular-nums text-[#0891b2] dark:text-[#22d3ee]">{row.count}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className={`flex min-h-0 min-w-0 flex-[1.3] flex-col overflow-hidden ${panelClass}`}>
            <h2 className="mb-1 shrink-0 text-lg font-semibold text-slate-900 dark:text-white">{t('admin.userReports')}</h2>
            <p className="mb-4 shrink-0 text-xs text-slate-500">{t('admin.reportsHint')}</p>
            <AdminReportsScroll className="min-h-0">
              <ul className="space-y-3 text-left text-sm text-slate-600 dark:text-slate-300">
                {reports.length === 0 && <li className="text-slate-500">{t('admin.noReports')}</li>}
                {reports.map((r) => (
                  <li
                    key={r.id}
                    className="border-b border-slate-100 pb-3 last:border-0 last:pb-0 dark:border-white/5"
                  >
                    <div className="text-xs text-slate-500">{r.resource_title}</div>
                    <div className="text-slate-800 dark:text-slate-200">{r.message}</div>
                  </li>
                ))}
              </ul>
            </AdminReportsScroll>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/10">
        <table className="w-full min-w-[640px] text-left text-sm text-slate-700 dark:text-slate-300">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500 dark:border-white/10 dark:bg-white/5">
            <tr>
              <th className="px-4 py-3">{t('admin.tableId')}</th>
              <th className="px-4 py-3">{t('admin.tableTitle')}</th>
              <th className="px-4 py-3">{t('admin.tableCategory')}</th>
              <th className="px-4 py-3 text-right">{t('admin.tableActions')}</th>
            </tr>
          </thead>
          <tbody>
            {resources.map((r) => (
              <tr
                key={r.id}
                className="border-b border-slate-100 hover:bg-slate-50 dark:border-white/5 dark:hover:bg-white/[0.03]"
              >
                <td className="px-4 py-2 font-mono text-xs">{r.id}</td>
                <td className="max-w-xs truncate px-4 py-2 text-slate-900 dark:text-white">{r.title}</td>
                <td className="px-4 py-2">{r.category}</td>
                <td className="px-4 py-2 text-right">
                  <button
                    type="button"
                    onClick={() => startEdit(r)}
                    className="mr-2 text-[#0891b2] hover:underline dark:text-[#22d3ee]"
                  >
                    {t('admin.editBtn')}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(r.id)}
                    className="text-rose-600 hover:underline dark:text-rose-400"
                  >
                    {t('admin.deleteBtn')}
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
