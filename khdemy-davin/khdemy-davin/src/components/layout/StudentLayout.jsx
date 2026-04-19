import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import SidebarNav from '../students/SidebarNav'
import { Sun, Moon } from 'lucide-react'

// ─── Dark mode hook ───────────────────────────────────────────────────────────
// Reads/writes the `dark` class on <html> (`:root`) to match your CSS:
//   :root.dark { --bg: #0f0f1a; ... }
function useDarkMode() {
  const [dark, setDark] = useState(() => {
    // Persist preference across reloads
    if (typeof window === 'undefined') return false
    const saved = localStorage.getItem('theme')
    if (saved) return saved === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    const root = document.documentElement          // <html> = :root
    if (dark) {
      root.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [dark])

  return [dark, setDark]
}

// ─── Toggle button ────────────────────────────────────────────────────────────
function DarkToggle({ dark, onToggle }) {
  return (
    <button
      onClick={onToggle}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="relative flex items-center justify-center w-9 h-9 rounded-xl border-none cursor-pointer transition-all duration-200"
      style={{
        background:   dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)',
        color:        'var(--text-muted)',
      }}
      onMouseEnter={e => e.currentTarget.style.background = dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.09)'}
      onMouseLeave={e => e.currentTarget.style.background = dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)'}
    >
      <span
        className="absolute inset-0 flex items-center justify-center transition-all duration-300"
        style={{ opacity: dark ? 1 : 0, transform: dark ? 'rotate(0deg) scale(1)' : 'rotate(-90deg) scale(0.5)' }}
      >
        <Sun size={16} />
      </span>
      <span
        className="absolute inset-0 flex items-center justify-center transition-all duration-300"
        style={{ opacity: dark ? 0 : 1, transform: dark ? 'rotate(90deg) scale(0.5)' : 'rotate(0deg) scale(1)' }}
      >
        <Moon size={16} />
      </span>
    </button>
  )
}

// ─── Layout ───────────────────────────────────────────────────────────────────
export default function StudentLayout() {
  const [sidebarOpen, setSB]    = useState(false)
  const [dark, setDark]         = useDarkMode()
  const toggleDark              = () => setDark(d => !d)

  return (
    <div
      className="flex h-screen overflow-hidden transition-colors duration-300"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: 'var(--bg)' }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Outfit:wght@700;800;900&display=swap');
        * { box-sizing: border-box }
        ::-webkit-scrollbar { width: 4px }
        ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 99px }
        button, input, select, textarea { font-family: inherit }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden }
        @keyframes slideIn { from { transform: translateX(-100%) } to { transform: translateX(0) } }
        @keyframes spin    { to   { transform: rotate(360deg) } }
        .animate-spin { animation: spin .7s linear infinite }
      `}</style>

      {/* ── Desktop sidebar ── */}
      <aside
        className="hidden lg:flex flex-col flex-shrink-0 h-screen z-30 transition-colors duration-300"
        style={{
          width:        248,
          background:   'var(--bg-card)',
          borderRight:  '1px solid var(--border)',
          boxShadow:    dark ? '0 0 0 0 transparent' : '0 1px 3px rgba(0,0,0,0.06)',
        }}
      >
        {/* Sidebar top: logo area gets the toggle */}
        <SidebarNav onClose={() => {}} darkToggle={<DarkToggle dark={dark} onToggle={toggleDark} />} />
      </aside>

      {/* ── Mobile sidebar overlay ── */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-40 lg:hidden transition-opacity duration-200"
            style={{ background: 'rgba(0,0,0,0.45)' }}
            onClick={() => setSB(false)}
          />
          <aside
            className="fixed top-0 left-0 h-screen z-50 lg:hidden flex flex-col transition-colors duration-300"
            style={{
              width:       260,
              animation:   'slideIn .2s ease',
              background:  'var(--bg-card)',
              borderRight: '1px solid var(--border)',
              boxShadow:   '4px 0 24px rgba(0,0,0,0.18)',
            }}
          >
            <SidebarNav onClose={() => setSB(false)} darkToggle={<DarkToggle dark={dark} onToggle={toggleDark} />} />
          </aside>
        </>
      )}

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Mobile top bar */}
        <div
          className="lg:hidden flex items-center justify-between gap-3 px-4 py-3 flex-shrink-0 z-30 transition-colors duration-300"
          style={{
            background:   'var(--bg-card)',
            borderBottom: '1px solid var(--border)',
            boxShadow:    dark ? 'none' : '0 1px 3px rgba(0,0,0,0.06)',
          }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSB(true)}
              className="p-2 rounded-xl border-none bg-transparent cursor-pointer transition-colors duration-150"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-soft)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex items-center gap-2">
              <img
                src="/logokhdemy.png"
                className="w-7 h-7 rounded-lg object-cover shadow-sm"
                alt="Khdemy"
                onError={e => (e.target.style.display = 'none')}
              />
              <span
                className="font-black text-base"
                style={{ fontFamily: "'Outfit', sans-serif", color: 'var(--text)' }}
              >
                Khdemy
              </span>
            </div>
          </div>

          {/* Dark toggle visible on mobile top bar */}
          <DarkToggle dark={dark} onToggle={toggleDark} />
        </div>

        {/* Scrollable page area */}
        <main
          className="flex-1 overflow-y-auto transition-colors duration-300"
          style={{ background: 'var(--bg)' }}
        >
          <div className="p-4 lg:p-7 max-w-screen-xl">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  )
}