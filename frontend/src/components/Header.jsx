import { Link } from 'react-router-dom'
import { BookOpen, Bookmark } from 'lucide-react'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-semibold tracking-tight text-white transition hover:opacity-90"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] text-white">
            <BookOpen className="h-5 w-5" />
          </span>
          Digital Library
        </Link>
        <nav>
          <Link
            to="/saved"
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white backdrop-blur transition hover:bg-white/10 hover:border-white/20"
          >
            <Bookmark className="h-4 w-4" />
            Saved List
          </Link>
        </nav>
      </div>
    </header>
  )
}
