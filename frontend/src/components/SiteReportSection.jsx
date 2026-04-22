import { useState } from 'react'
import { MessageSquareWarning, Send } from 'lucide-react'
import { submitReport } from '../api/api'

export default function SiteReportSection() {
  const [text, setText] = useState('')
  const [status, setStatus] = useState('')
  const [sending, setSending] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    const msg = text.trim()
    if (!msg) {
      setStatus('Please describe what went wrong.')
      return
    }
    setStatus('')
    setSending(true)
    try {
      await submitReport(msg)
      setText('')
      setStatus('Thanks — we received your message.')
    } catch (err) {
      setStatus(err.message || 'Could not send. Try again later.')
    } finally {
      setSending(false)
    }
  }

  return (
    <section className="mt-20 border-t border-white/10 bg-gradient-to-b from-transparent to-[#05050a] py-16">
      <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
        <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/30 to-cyan-500/20 text-cyan-300 ring-1 ring-white/10">
          <MessageSquareWarning className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-semibold text-white sm:text-2xl">Report an issue</h2>
        <p className="mt-2 text-sm text-slate-400">
          Something broken, confusing, or missing? Tell us and we will look into it. Reports are stored
          securely for the site administrators.
        </p>
        <form
          onSubmit={onSubmit}
          className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-left shadow-[0_0_40px_-10px_rgba(99,102,241,0.35)] backdrop-blur"
        >
          <label htmlFor="site-report" className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-500">
            What happened?
          </label>
          <textarea
            id="site-report"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            placeholder="Describe the problem, the page you were on, and what you expected…"
            className="mb-4 w-full resize-y rounded-xl border border-white/10 bg-[#0a0a0f] px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/30"
          />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {status && (
              <p className={`text-sm ${status.startsWith('Thanks') ? 'text-emerald-400/90' : 'text-amber-200/90'}`}>
                {status}
              </p>
            )}
            <div className="sm:ml-auto">
              <button
                type="submit"
                disabled={sending}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-violet-900/30 transition hover:opacity-95 disabled:opacity-50 sm:w-auto"
              >
                <Send className="h-4 w-4" />
                {sending ? 'Sending…' : 'Send report'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  )
}
