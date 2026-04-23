import { Link } from 'react-router-dom'
import { BookOpen, Bookmark, Moon, Sun, Languages } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useAppSettings } from '../context/AppSettingsContext'

export default function Header() {
  const { user, loading, logout } = useAuth()
  const { theme, toggleTheme, locale, setLocale, t } = useAppSettings()

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-[#0a0a0f]/80">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-semibold tracking-tight text-slate-900 transition hover:opacity-90 dark:text-white"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] text-white">
            <BookOpen className="h-5 w-5" />
          </span>
          {t('brand')}
        </Link>
        <nav className="flex flex-wrap items-center gap-2">
          <div
            className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50/90 p-1 dark:border-white/10 dark:bg-white/5"
            role="group"
            aria-label={t('header.language')}
          >
            <Languages className="ml-1 hidden h-4 w-4 text-slate-500 sm:block dark:text-slate-400" />
            <button
              type="button"
              onClick={() => setLocale('en')}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition sm:text-sm ${
                locale === 'en'
                  ? 'bg-white text-slate-900 shadow-sm dark:bg-white/15 dark:text-white'
                  : 'text-slate-600 hover:bg-white/60 dark:text-slate-400 dark:hover:bg-white/10'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLocale('ru')}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition sm:text-sm ${
                locale === 'ru'
                  ? 'bg-white text-slate-900 shadow-sm dark:bg-white/15 dark:text-white'
                  : 'text-slate-600 hover:bg-white/60 dark:text-slate-400 dark:hover:bg-white/10'
              }`}
            >
              RU
            </button>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 transition hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
            title={theme === 'dark' ? t('header.themeLight') : t('header.themeDark')}
            aria-label={theme === 'dark' ? t('header.themeLight') : t('header.themeDark')}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          {user?.role === 'admin' && (
            <Link
              to="/admin"
              className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm font-medium text-amber-900 transition hover:bg-amber-500/20 dark:border-amber-500/30 dark:text-amber-200 dark:hover:bg-amber-500/20"
            >
              {t('header.admin')}
            </Link>
          )}
          <Link
            to="/saved"
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 shadow-sm transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:backdrop-blur dark:hover:bg-white/10 dark:hover:border-white/20 sm:px-4 sm:py-2.5"
          >
            <Bookmark className="h-4 w-4" />
            {t('header.savedList')}
          </Link>
          {!loading && !user && (
            <>
              <Link
                to="/login"
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-100 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
              >
                {t('header.logIn')}
              </Link>
              <Link
                to="/register"
                className="rounded-xl bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-3 py-2 text-sm font-medium text-white"
              >
                {t('header.register')}
              </Link>
            </>
          )}
          {!loading && user && (
            <div className="flex items-center gap-2">
              <span className="hidden text-sm text-slate-500 dark:text-slate-400 sm:inline">
                {user.username}
              </span>
              <button
                type="button"
                onClick={logout}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-100 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
              >
                {t('header.logOut')}
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
