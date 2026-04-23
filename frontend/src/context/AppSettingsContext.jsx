import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { translate } from '../i18n/translations'

const STORAGE_THEME = 'dl-theme'
const STORAGE_LOCALE = 'dl-locale'

const AppSettingsContext = createContext(null)

function readStoredTheme() {
  try {
    const v = localStorage.getItem(STORAGE_THEME)
    if (v === 'light' || v === 'dark') return v
  } catch {
    /* ignore */
  }
  return 'dark'
}

function readStoredLocale() {
  try {
    const v = localStorage.getItem(STORAGE_LOCALE)
    if (v === 'en' || v === 'ru') return v
  } catch {
    /* ignore */
  }
  return 'en'
}

export function AppSettingsProvider({ children }) {
  const [theme, setThemeState] = useState(readStoredTheme)
  const [locale, setLocaleState] = useState(readStoredLocale)

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    root.lang = locale === 'ru' ? 'ru' : 'en'
    try {
      localStorage.setItem(STORAGE_THEME, theme)
      localStorage.setItem(STORAGE_LOCALE, locale)
    } catch {
      /* ignore */
    }
  }, [theme, locale])

  const setTheme = useCallback((next) => {
    setThemeState(next === 'light' ? 'light' : 'dark')
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState((t) => (t === 'dark' ? 'light' : 'dark'))
  }, [])

  const setLocale = useCallback((next) => {
    setLocaleState(next === 'ru' ? 'ru' : 'en')
  }, [])

  const t = useCallback(
    (path, vars) => translate(locale, path, vars),
    [locale]
  )

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme,
      locale,
      setLocale,
      t,
    }),
    [theme, setTheme, toggleTheme, locale, setLocale, t]
  )

  return <AppSettingsContext.Provider value={value}>{children}</AppSettingsContext.Provider>
}

export function useAppSettings() {
  const ctx = useContext(AppSettingsContext)
  if (!ctx) throw new Error('useAppSettings must be used within AppSettingsProvider')
  return ctx
}
