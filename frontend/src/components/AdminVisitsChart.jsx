import { useEffect, useState, useMemo } from 'react'
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { BarChart2 } from 'lucide-react'
import { fetchStatsTimeline } from '../api/api'
import { useAppSettings } from '../context/AppSettingsContext'

export default function AdminVisitsChart({ resources }) {
  const { t, theme } = useAppSettings()
  const [range, setRange] = useState(30)
  const [resourceId, setResourceId] = useState('')
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')

  const rangeOptions = useMemo(
    () => [
      { value: 7, label: t('chart.days7') },
      { value: 14, label: t('chart.days14') },
      { value: 30, label: t('chart.days30') },
      { value: 90, label: t('chart.days90') },
    ],
    [t]
  )

  const tooltipStyle = useMemo(
    () =>
      theme === 'dark'
        ? {
            background: 'linear-gradient(160deg, rgba(22,22,32,0.98) 0%, rgba(12,12,18,0.99) 100%)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 12,
            padding: '10px 14px',
            fontSize: 12,
            color: '#e2e8f0',
            boxShadow: '0 12px 40px rgba(0,0,0,0.45)',
          }
        : {
            background: '#ffffff',
            border: '1px solid #e2e8f8',
            borderRadius: 12,
            padding: '10px 14px',
            fontSize: 12,
            color: '#0f172a',
            boxShadow: '0 12px 40px rgba(15,23,42,0.12)',
          },
    [theme]
  )

  const axisMuted = theme === 'dark' ? '#64748b' : '#64748b'
  const axisLine = theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.12)'

  useEffect(() => {
    let c = false
    setLoading(true)
    setErr('')
    const rid = resourceId === '' ? undefined : resourceId
    fetchStatsTimeline(range, rid)
      .then((d) => {
        if (!c) setData(d.series || [])
      })
      .catch((e) => {
        if (!c) {
          setData([])
          setErr(e.message || t('chart.loadError'))
        }
      })
      .finally(() => {
        if (!c) setLoading(false)
      })
    return () => {
      c = true
    }
  }, [range, resourceId, t])

  const total = data.reduce((s, p) => s + p.count, 0)
  const maxVal = Math.max(1, ...data.map((p) => p.count))

  const selectClass =
    'rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-800 dark:border-white/10 dark:bg-[#0a0a0f] dark:text-slate-200'

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm dark:border-white/10 dark:from-[#12121c]/90 dark:to-[#0a0a0f] dark:shadow-[0_0_60px_-20px_rgba(99,102,241,0.35)]">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/30 to-cyan-500/20 ring-1 ring-slate-200 dark:from-violet-500/40 dark:to-cyan-500/25 dark:ring-white/10">
            <BarChart2 className="h-5 w-5 text-cyan-700 dark:text-cyan-200" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{t('chart.title')}</h2>
            <p className="text-xs text-slate-500">{t('chart.subtitle')}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-xs text-slate-500">{t('chart.range')}</label>
          <select value={range} onChange={(e) => setRange(Number(e.target.value))} className={selectClass}>
            {rangeOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <label className="ml-1 text-xs text-slate-500">{t('chart.book')}</label>
          <select
            value={resourceId}
            onChange={(e) => setResourceId(e.target.value)}
            className={`min-w-[140px] max-w-[220px] ${selectClass}`}
          >
            <option value="">{t('chart.allBooks')}</option>
            {resources.map((r) => (
              <option key={r.id} value={r.id}>
                #{r.id} {r.title?.slice(0, 40) || t('chart.untitled')}
              </option>
            ))}
          </select>
        </div>
      </div>

      {err && (
        <p className="mb-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200">
          {err}
        </p>
      )}

      <div className="mb-2 flex items-baseline justify-between text-sm">
        <span className="text-slate-500">{t('chart.totalOpens')}</span>
        <span className="text-2xl font-semibold tabular-nums text-slate-900 dark:text-white">{total}</span>
      </div>

      <div className="h-[280px] w-full min-h-[220px]">
        {loading ? (
          <div className="flex h-full items-center justify-center text-slate-500">{t('chart.loading')}</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="visitsFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.55} />
                  <stop offset="45%" stopColor="#6366f1" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="visitsLine" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#a78bfa" />
                  <stop offset="100%" stopColor="#22d3ee" />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="label"
                tick={{ fill: axisMuted, fontSize: 10 }}
                tickLine={false}
                axisLine={{ stroke: axisLine }}
                interval="preserveStartEnd"
              />
              <YAxis
                allowDecimals={false}
                width={32}
                tick={{ fill: axisMuted, fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                domain={[0, Math.max(5, maxVal)]}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                labelStyle={{ color: theme === 'dark' ? '#94a3b8' : '#64748b', marginBottom: 4 }}
                formatter={(value) => [value, t('chart.opens')]}
                labelFormatter={(_, p) => (p?.[0]?.payload?.date ? p[0].payload.date : '')}
              />
              <Area
                type="monotone"
                dataKey="count"
                name={t('chart.visits')}
                stroke="url(#visitsLine)"
                strokeWidth={2}
                fill="url(#visitsFill)"
                dot={{ r: 2, fill: '#a5b4fc', strokeWidth: 0 }}
                activeDot={{
                  r: 4,
                  fill: '#22d3ee',
                  stroke: theme === 'dark' ? '#0a0a0f' : '#ffffff',
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
