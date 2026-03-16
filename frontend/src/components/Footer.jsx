import { BookOpen, Github, Linkedin } from "lucide-react";

const footerLinks = [
  { label: "About", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Terms", href: "#" },
];

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-[#0a0a0f]/90 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-8 lg:px-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:gap-2">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] text-white shadow-lg shadow-[#6366f1]/20">
              <BookOpen className="h-5 w-5" />
            </span>
            <div className="text-center sm:text-left">
              <p className="text-base font-semibold tracking-tight text-white">Digital Library</p>
              <p className="text-xs text-slate-500">Your resources, one place</p>
            </div>
          </div>
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 sm:justify-center">
            {footerLinks.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="rounded-lg px-2 py-2 text-sm text-slate-400 transition hover:bg-white/5 hover:text-[#22d3ee] focus:outline-none focus:ring-2 focus:ring-[#22d3ee]/50"
              >
                {label}
              </a>
            ))}
          </nav>
          <div className="flex items-center justify-center gap-2">
            <span className="mr-2 hidden text-xs text-slate-500 sm:inline">Follow</span>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition hover:bg-white/10 hover:text-[#22d3ee] focus:outline-none focus:ring-2 focus:ring-[#22d3ee]/50"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition hover:bg-white/10 hover:text-[#22d3ee] focus:outline-none focus:ring-2 focus:ring-[#22d3ee]/50"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
        <p className="mt-8 border-t border-white/5 pt-6 text-center text-xs text-slate-600">
          © {new Date().getFullYear()} Digital Library. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
