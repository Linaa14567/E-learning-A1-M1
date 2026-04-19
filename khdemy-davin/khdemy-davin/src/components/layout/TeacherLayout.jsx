import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../ui/Sidebar'

export default function TeacherLayout() {
  const [sidebarOpen, setSB] = useState(false)

  return (
    <div
      className="flex h-screen overflow-hidden bg-gray-50 dark:bg-[#0f0f1a] transition-colors duration-300"
      style={{ fontFamily: "'Nunito', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@700;800;900&display=swap');
        * { box-sizing: border-box }
        ::-webkit-scrollbar { width: 4px }
        ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 99px }
        button, input, select, textarea { font-family: inherit }
        @keyframes slideIn { from { transform: translateX(-100%) } to { transform: translateX(0) } }
      `}</style>

      {/* ── Desktop sidebar (fixed height, never scrolls) ── */}
      <aside className="hidden lg:flex flex-col flex-shrink-0 h-screen w-72 bg-white dark:bg-[#1e1e30] border-r border-gray-100 dark:border-[#2e2e45] shadow-sm z-30 transition-colors duration-300">
        <Sidebar onClose={() => {}} />
      </aside>

      {/* ── Mobile sidebar overlay ── */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40 lg:hidden"
            onClick={() => setSB(false)}
          />
          <aside
            className="fixed top-0 left-0 h-screen w-72 bg-white dark:bg-[#1e1e30] border-r border-gray-100 dark:border-[#2e2e45] shadow-xl z-50 lg:hidden flex flex-col transition-colors duration-300"
            style={{ animation: 'slideIn .2s ease' }}
          >
            <Sidebar onClose={() => setSB(false)} />
          </aside>
        </>
      )}

      {/* ── Main: only this scrolls ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white dark:bg-[#1e1e30] border-b border-gray-100 dark:border-[#2e2e45] shadow-sm flex-shrink-0 z-30 transition-colors duration-300">
          <button
            onClick={() => setSB(true)}
            className="p-2 rounded-xl text-gray-500 dark:text-[#9b9baa] hover:bg-gray-100 dark:hover:bg-[#25253a] border-none bg-transparent cursor-pointer transition-colors"
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
              className="font-black text-gray-900 dark:text-white text-base"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Khdemy
            </span>
          </div>
        </div>

        {/* Scrollable content — Outlet renders here */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 lg:p-8 max-w-screen-2xl mx-auto">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  )
}