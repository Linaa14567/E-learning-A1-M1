import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import SidebarNav from './SidebarNav'


export default function StudentLayout() {
  const [sidebarOpen, setSB] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Outfit:wght@700;800;900&display=swap');
        * { box-sizing: border-box }
        ::-webkit-scrollbar { width: 4px }
        ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 99px }
        button, input, select, textarea { font-family: inherit }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden }
        @keyframes slideIn { from { transform: translateX(-100%) } to { transform: translateX(0) } }
        @keyframes spin    { to   { transform: rotate(360deg) } }
        .animate-spin { animation: spin .7s linear infinite }
      `}</style>

      {/* ════════ DESKTOP: sticky sidebar + scrollable content ════════ */}
      <div className="hidden lg:flex items-start">

        {/* Sticky sidebar — in document flow, so footer naturally crops its bottom */}
        <aside
          className="sticky top-0 self-start h-screen flex-shrink-0 bg-white border-r border-slate-200 shadow-sm z-30"
          style={{ width: 248 }}
        >
          <SidebarNav onClose={() => {}} />
        </aside>

        {/* Page content rendered by child route */}
        <main className="flex-1 min-w-0 p-4 lg:p-7">
          <Outlet />
        </main>
      </div>

      {/* ════════ MOBILE: top bar + overlay sidebar ════════ */}
      <div className="lg:hidden">

        {/* Sticky top bar */}
        <div className="sticky top-0 z-30 flex items-center gap-3 px-4 py-3 bg-white border-b border-slate-100 shadow-sm">
          <button
            onClick={() => setSB(true)}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 border-none bg-transparent cursor-pointer"
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
            <span className="font-black text-slate-900 text-base" style={{ fontFamily: "'Outfit',sans-serif" }}>
              Khdemy
            </span>
          </div>
        </div>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <>
            <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setSB(false)} />
            <aside
              className="fixed top-0 left-0 h-screen bg-white border-r border-slate-200 shadow-xl z-50 flex flex-col"
              style={{ width: 260, animation: 'slideIn .2s ease' }}
            >
              <SidebarNav onClose={() => setSB(false)} />
            </aside>
          </>
        )}

        <main className="p-4">
          <Outlet />
        </main>
      </div>

      {/* Full-width footer — outside flex row, never cropped by sidebar */}

    </div>
  )
}