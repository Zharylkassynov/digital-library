import { useEffect, useState } from 'react'
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

const RANGE_OPTIONS = [
  { value: 7, label: '7 days' },
  { value: 14, label: '14 days' },
  { value: 30, label: '30 days' },
  { value: 90, label: '90 days' },
]

const tooltipStyle = {
  background: 'linear-gradient(160deg, rgba(22,22,32,0.98) 0%, rgba(12,12,18,0.99) 100%)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 12,
  padding: '10px 14px',
  fontSize: 12,
  color: '#e2e8f0',
  boxShadow: '0 12px 40px rgba(0,0,0,0.45)',
}

export default function AdminVisitsChart({ resources }) {
  const [range, setRange] = useState(30)
  const [resourceId, setResourceId] = useState('')
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')

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
          setErr(e.message || 'Could not load chart')
        }
      })
      .finally(() => {
        if (!c) setLoading(false)
      })
    return () => {
      c = true
    }
  }, [range, resourceId])

  const total = data.reduce((s, p) => s + p.count, 0)
  const maxVal = Math.max(1, ...data.map((p) => p.count))

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#12121c]/90 to-[#0a0a0f] p-6 shadow-[0_0_60px_-20px_rgba(99,102,241,0.35)]">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/40 to-cyan-500/25 ring-1 ring-white/10">
            <BarChart2 className="h-5 w-5 text-cyan-200" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Book visits</h2>
            <p className="text-xs text-slate-500">Opens in the resource modal — per day (new data from today).</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-xs text-slate-500">Range</label>
          <select
            value={range}
            onChange={(e) => setRange(Number(e.target.value))}
            className="rounded-lg border border-white/10 bg-[#0a0a0f] px-2 py-1.5 text-xs text-slate-200"
          >
            {RANGE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <label className="ml-1 text-xs text-slate-500">Book</label>
          <select
            value={resourceId}
            onChange={(e) => setResourceId(e.target.value)}
            className="min-w-[140px] max-w-[220px] rounded-lg border border-white/10 bg-[#0a0a0f] px-2 py-1.5 text-xs text-slate-200"
          >
            <option value="">All books (total)</option>
            {resources.map((r) => (
              <option key={r.id} value={r.id}>
                #{r.id} {r.title?.slice(0, 40) || 'Untitled'}
              </option>
            ))}
          </select>
        </div>
      </div>

      {err && (
        <p className="mb-3 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
          {err}
        </p>
      )}

      <div className="mb-2 flex items-baseline justify-between text-sm">
        <span className="text-slate-500">Total opens in range</span>
        <span className="text-2xl font-semibold tabular-nums text-white">{total}</span>
      </div>

      <div className="h-[280px] w-full min-h-[220px]">
        {loading ? (
          <div className="flex h-full items-center justify-center text-slate-500">Loading…</div>
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
                tick={{ fill: '#64748b', fontSize: 10 }}
                tickLine={false}
                axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
                interval="preserveStartEnd"
              />
              <YAxis
                allowDecimals={false}
                width={32}
                tick={{ fill: '#64748b', fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                domain={[0, Math.max(5, maxVal)]}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                labelStyle={{ color: '#94a3b8', marginBottom: 4 }}
                formatter={(value) => [value, 'opens']}
                labelFormatter={(_, p) => (p?.[0]?.payload?.date ? p[0].payload.date : '')}
              />
              <Area
                type="monotone"
                dataKey="count"
                name="Visits"
                stroke="url(#visitsLine)"
                strokeWidth={2}
                fill="url(#visitsFill)"
                dot={{ r: 2, fill: '#a5b4fc', strokeWidth: 0 }}
                activeDot={{ r: 4, fill: '#22d3ee', stroke: '#0a0a0f', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
