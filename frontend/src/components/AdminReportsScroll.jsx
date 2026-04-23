import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useAppSettings } from '../context/AppSettingsContext'

function measure(el, set) {
  if (!el) return
  const { scrollTop, scrollHeight, clientHeight } = el
  const hasOverflow = scrollHeight > clientHeight + 1
  const atTop = scrollTop <= 2
  const atBottom = scrollTop + clientHeight >= scrollHeight - 2
  set({ hasOverflow, atTop, atBottom })
}

/**
 * Scrollable list: themed scrollbar, edge fades, right rail with up/down chevrons.
 */
export default function AdminReportsScroll({ children, className = '' }) {
  const { t } = useAppSettings()
  const ref = useRef(null)
  const [state, setState] = useState({
    hasOverflow: false,
    atTop: true,
    atBottom: true,
  })

  const refresh = useCallback(() => {
    measure(ref.current, setState)
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    refresh()
    const ro = new ResizeObserver(() => refresh())
    ro.observe(el)
    return () => ro.disconnect()
  }, [refresh, children])

  const scrollByDir = (dir) => {
    const el = ref.current
    if (!el) return
    const amount = Math.min(200, el.clientHeight * 0.65)
    el.scrollBy({ top: dir * amount, behavior: 'smooth' })
  }

  const { hasOverflow, atTop, atBottom } = state

  return (
    <div
      className={`flex h-full min-h-0 w-full min-w-0 flex-1 gap-1.5 sm:gap-2 ${className}`}
    >
      <div className="relative flex min-h-0 min-w-0 flex-1 flex-col">
        {!atTop && hasOverflow && (
          <div
            className="pointer-events-none absolute left-0 right-0 top-0 z-[1] h-8 bg-gradient-to-b from-white to-transparent dark:from-[#0a0a0f]"
            aria-hidden
          />
        )}
        {!atBottom && hasOverflow && (
          <div
            className="pointer-events-none absolute bottom-0 left-0 right-0 z-[1] h-8 bg-gradient-to-t from-white to-transparent dark:from-[#0a0a0f]"
            aria-hidden
          />
        )}

        <div
          ref={ref}
          onScroll={refresh}
          className="admin-reports-scroll min-h-0 flex-1 overflow-y-auto rounded-lg"
        >
          {children}
        </div>
      </div>

      {hasOverflow && (
        <div
          className="flex w-[2.125rem] shrink-0 flex-col items-stretch justify-between self-stretch rounded-xl border border-slate-200 bg-gradient-to-b from-slate-100 to-slate-50 py-2 shadow-inner dark:border-white/10 dark:from-[#15151e] dark:to-[#0a0a0c] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.07)]"
        >
          <button
            type="button"
            onClick={() => scrollByDir(-1)}
            disabled={atTop}
            className="mx-auto rounded-lg p-1.5 text-cyan-300/95 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
            title={t('scroll.scrollUp')}
            aria-label={t('scroll.scrollUp')}
          >
            <ChevronUp
              className={`h-[18px] w-[18px] transition ${atTop ? 'text-slate-500' : 'text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.55)]'}`}
            />
          </button>
          <div
            className="mx-auto min-h-8 w-px max-w-full flex-1 bg-gradient-to-b from-cyan-400/25 via-violet-400/20 to-fuchsia-500/30"
            aria-hidden
          />
          <button
            type="button"
            onClick={() => scrollByDir(1)}
            disabled={atBottom}
            className="mx-auto rounded-lg p-1.5 text-violet-300/95 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
            title={t('scroll.scrollDown')}
            aria-label={t('scroll.scrollDown')}
          >
            <ChevronDown
              className={`h-[18px] w-[18px] transition ${atBottom ? 'text-slate-500' : 'text-violet-300 drop-shadow-[0_0_8px_rgba(167,139,250,0.5)]'}`}
            />
          </button>
        </div>
      )}
    </div>
  )
}
