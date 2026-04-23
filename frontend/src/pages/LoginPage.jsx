import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useAppSettings } from '../context/AppSettingsContext'
import { authLogin } from '../api/api'

export default function LoginPage() {
  const navigate = useNavigate()
  const { setSession } = useAuth()
  const { t } = useAppSettings()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const data = await authLogin({ email, password })
      setSession(data.token, data.user)
      navigate('/')
    } catch (err) {
      setError(err.message || t('auth.loginFailed'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">{t('auth.loginTitle')}</h1>
      <p className="mb-8 text-sm text-slate-600 dark:text-slate-400">{t('auth.loginSubtitle')}</p>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5"
      >
        {error && (
          <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
            {error}
          </div>
        )}
        <div>
          <label htmlFor="login-email" className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
            {t('auth.email')}
          </label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none focus:ring-2 focus:ring-[#6366f1] dark:border-white/10 dark:bg-[#0a0a0f] dark:text-white"
          />
        </div>
        <div>
          <label htmlFor="login-password" className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
            {t('auth.password')}
          </label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none focus:ring-2 focus:ring-[#6366f1] dark:border-white/10 dark:bg-[#0a0a0f] dark:text-white"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] py-3 text-sm font-medium text-white transition hover:opacity-95 disabled:opacity-50"
        >
          {submitting ? t('auth.signingIn') : t('auth.signIn')}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
        {t('auth.noAccount')}{' '}
        <Link to="/register" className="text-[#0891b2] hover:underline dark:text-[#22d3ee]">
          {t('header.register')}
        </Link>
      </p>
    </div>
  )
}
