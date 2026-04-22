import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authRegister } from '../api/api'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { setSession } = useAuth()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const data = await authRegister({ username, email, password })
      setSession(data.token, data.user)
      navigate('/')
    } catch (err) {
      setError(err.message || 'Registration failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="mb-2 text-2xl font-bold text-white">Create account</h1>
      <p className="mb-8 text-sm text-slate-400">Password must be at least 6 characters.</p>
      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6">
        {error && (
          <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
            {error}
          </div>
        )}
        <div>
          <label htmlFor="reg-user" className="mb-1 block text-xs font-medium text-slate-400">
            Username
          </label>
          <input
            id="reg-user"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full rounded-lg border border-white/10 bg-[#0a0a0f] px-3 py-2 text-white outline-none focus:ring-2 focus:ring-[#6366f1]"
          />
        </div>
        <div>
          <label htmlFor="reg-email" className="mb-1 block text-xs font-medium text-slate-400">
            Email
          </label>
          <input
            id="reg-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg border border-white/10 bg-[#0a0a0f] px-3 py-2 text-white outline-none focus:ring-2 focus:ring-[#6366f1]"
          />
        </div>
        <div>
          <label htmlFor="reg-pass" className="mb-1 block text-xs font-medium text-slate-400">
            Password
          </label>
          <input
            id="reg-pass"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full rounded-lg border border-white/10 bg-[#0a0a0f] px-3 py-2 text-white outline-none focus:ring-2 focus:ring-[#6366f1]"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] py-3 text-sm font-medium text-white transition hover:opacity-95 disabled:opacity-50"
        >
          {submitting ? 'Creating…' : 'Register'}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-400">
        Already have an account?{' '}
        <Link to="/login" className="text-[#22d3ee] hover:underline">
          Log in
        </Link>
      </p>
    </div>
  )
}
