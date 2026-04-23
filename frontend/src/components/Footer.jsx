import { BookOpen, Github, Linkedin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAppSettings } from '../context/AppSettingsContext'

export default function Footer() {
  const { t } = useAppSettings()
  const footerLinks = [
    { label: t('footer.about'), href: '/about' },
    { label: t('footer.privacy'), href: '/privacy' },
    { label: t('footer.terms'), href: '/terms' },
  ]

  return (
    <footer className="mt-auto border-t border-slate-200/80 bg-white/90 backdrop-blur-xl dark:border-white/10 dark:bg-[#0a0a0f]/90">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-8 lg:px-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:gap-2">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] text-white shadow-lg shadow-[#6366f1]/20">
              <BookOpen className="h-5 w-5" />
            </span>
            <div className="text-center sm:text-left">
              <p className="text-base font-semibold tracking-tight text-slate-900 dark:text-white">
                {t('brand')}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-500">{t('tagline')}</p>
            </div>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 sm:justify-center">
            {footerLinks.map(({ label, href }) => (
              <Link
                key={href}
                to={href}
                className="rounded-lg px-2 py-2 text-sm text-slate-500 transition hover:bg-slate-100 hover:text-[#0891b2] focus:outline-none focus:ring-2 focus:ring-[#22d3ee]/50 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-[#22d3ee]"
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center justify-center gap-2">
            <span className="mr-2 hidden text-xs text-slate-500 sm:inline dark:text-slate-500">
              {t('footer.follow')}
            </span>
            <a
              href="https://github.com/Zharylkassynov"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-[#0891b2] dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-[#22d3ee]"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://www.linkedin.com/..."
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-[#0891b2] dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-[#22d3ee]"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
        <p className="mt-8 border-t border-slate-200 pt-6 text-center text-xs text-slate-500 dark:border-white/5 dark:text-slate-600">
          © {new Date().getFullYear()} {t('brand')}. {t('footer.rights')}
        </p>
      </div>
    </footer>
  )
}
