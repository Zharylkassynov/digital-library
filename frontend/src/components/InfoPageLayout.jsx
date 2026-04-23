export default function InfoPageLayout({ title, children }) {
  return (
    <div className="min-h-screen bg-slate-50 px-4 pb-16 pt-24 dark:bg-[#0a0a0f]">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 bg-gradient-to-r from-[#6366f1] to-[#22d3ee] bg-clip-text text-4xl font-bold text-transparent">
          {title}
        </h1>
        <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-8 leading-relaxed text-slate-600 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
          {children}
        </div>
      </div>
    </div>
  )
}
