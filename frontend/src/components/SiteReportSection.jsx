import { useState } from 'react'
import { MessageSquareWarning, Send } from 'lucide-react'
import { submitReport } from '../api/api'
import { useAppSettings } from '../context/AppSettingsContext'

export default function SiteReportSection() {
  const { t } = useAppSettings()
  const [text, setText] = useState('')
  const [status, setStatus] = useState('')
  const [sending, setSending] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    const msg = text.trim()
    if (!msg) {
      setStatus(t('report.empty'))
      return
    }
    setStatus('')
    setSending(true)
    try {
      await submitReport(msg)
      setText('')
      setStatus(t('report.thanks'))
    } catch (err) {
      setStatus(err.message || t('report.sendError'))
    } finally {
      setSending(false)
    }
  }

  const statusOk = status === t('report.thanks')

  return (
    <section className="mt-20 border-t border-slate-200 bg-gradient-to-b from-transparent to-slate-100 py-16 dark:border-white/10 dark:to-[#05050a]">
      <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
        <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/25 to-cyan-500/15 text-cyan-700 ring-1 ring-slate-200 dark:from-violet-500/30 dark:to-cyan-500/20 dark:text-cyan-300 dark:ring-white/10">
          <MessageSquareWarning className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl dark:text-white">{t('report.title')}</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{t('report.blurb')}</p>
        <form
          onSubmit={onSubmit}
          className="mt-8 rounded-2xl border border-slate-200 bg-white/90 p-6 text-left shadow-lg shadow-slate-200/50 backdrop-blur dark:border-white/10 dark:bg-white/[0.04] dark:shadow-[0_0_40px_-10px_rgba(99,102,241,0.35)]"
        >
          <label
            htmlFor="site-report"
            className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-500"
          >
            {t('report.label')}
          </label>
          <textarea
            id="site-report"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            placeholder={t('report.placeholder')}
            className="mb-4 w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/30 dark:border-white/10 dark:bg-[#0a0a0f] dark:text-slate-100 dark:placeholder:text-slate-600"
          />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {status && (
              <p
                className={`text-sm ${
                  statusOk ? 'text-emerald-700 dark:text-emerald-400/90' : 'text-amber-800 dark:text-amber-200/90'
                }`}
              >
                {status}
              </p>
            )}
            <div className="sm:ml-auto">
              <button
                type="submit"
                disabled={sending}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-violet-900/20 transition hover:opacity-95 disabled:opacity-50 dark:shadow-violet-900/30 sm:w-auto"
              >
                <Send className="h-4 w-4" />
                {sending ? t('report.sending') : t('report.send')}
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  )
}
