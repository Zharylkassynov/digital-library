import { Link } from 'react-router-dom'
import { BookOpen, Bookmark } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Header() {
  const { user, loading, logout } = useAuth()

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-semibold tracking-tight text-white transition hover:opacity-90"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] text-white">
            <BookOpen className="h-5 w-5" />
          </span>
          Digital Library
        </Link>
        <nav className="flex flex-wrap items-center gap-2">
          {user?.role === 'admin' && (
            <Link
              to="/admin"
              className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm font-medium text-amber-200 transition hover:bg-amber-500/20"
            >
              Admin
            </Link>
          )}
          <Link
            to="/saved"
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-white backdrop-blur transition hover:bg-white/10 hover:border-white/20 sm:px-4 sm:py-2.5"
          >
            <Bookmark className="h-4 w-4" />
            Saved List
          </Link>
          {!loading && !user && (
            <>
              <Link
                to="/login"
                className="rounded-xl border border-white/10 px-3 py-2 text-sm text-slate-300 transition hover:bg-white/5"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="rounded-xl bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-3 py-2 text-sm font-medium text-white"
              >
                Register
              </Link>
            </>
          )}
          {!loading && user && (
            <div className="flex items-center gap-2">
              <span className="hidden text-sm text-slate-400 sm:inline">{user.username}</span>
              <button
                type="button"
                onClick={logout}
                className="rounded-xl border border-white/10 px-3 py-2 text-sm text-slate-300 transition hover:bg-white/5"
              >
                Log out
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
