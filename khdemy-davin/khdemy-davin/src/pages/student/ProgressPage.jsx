import { ENROLLED, BOOKS, COLOR } from "../constants"
import ProgressBar from "../components/ui/ProgressBar"
import DashBookCard from "../components/cards/DashBookCard"

const STATS = [
  { label:"Study Hours", value:"47h",    icon:"⏱", bg:"bg-indigo-50",  text:"text-indigo-600"  },
  { label:"Quiz Score",  value:"88%",    icon:"📝", bg:"bg-emerald-50", text:"text-emerald-600" },
  { label:"Streak",      value:"7 days", icon:"🔥", bg:"bg-amber-50",   text:"text-amber-600"   },
  { label:"Points",      value:"1,240",  icon:"⭐", bg:"bg-violet-50",  text:"text-violet-600"  },
]

export default function ProgressPage({ savedBooks, toggleSaveBook }) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-black text-slate-900 mb-0.5" style={{ fontFamily:"'Outfit',sans-serif" }}>My Progress</h1>
        <p className="text-sm text-slate-400">Learning analytics and performance overview</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {STATS.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 border border-slate-200 flex items-center gap-3 shadow-sm">
            <div className={"w-11 h-11 rounded-2xl flex items-center justify-center text-lg flex-shrink-0 " + s.bg}>{s.icon}</div>
            <div>
              <p className={"text-2xl font-black leading-none " + s.text} style={{ fontFamily:"'Outfit',sans-serif" }}>{s.value}</p>
              <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
        <h2 className="text-base font-black text-slate-900 mb-5" style={{ fontFamily:"'Outfit',sans-serif" }}>Course Progress</h2>
        <div className="flex flex-col gap-4">
          {ENROLLED.map(c => {
            const col = COLOR[c.color] || COLOR.indigo
            return (
              <div key={c.id} className="flex items-center gap-4">
                <img src={c.img} className="w-11 h-11 rounded-xl object-cover flex-shrink-0" alt={c.title} />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between mb-1.5">
                    <p className="font-bold text-sm text-slate-900 truncate max-w-xs">{c.title}</p>
                    <span className={"text-sm font-black " + col.text}>{c.progress}%</span>
                  </div>
                  <ProgressBar pct={c.progress} colorKey={c.color} h="h-2" />
                  <p className="text-xs text-slate-400 mt-1">{c.done} of {c.total} lessons</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
        <h2 className="text-base font-black text-slate-900 mb-5" style={{ fontFamily:"'Outfit',sans-serif" }}>My Books</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {BOOKS.map(b => <DashBookCard key={b.id} b={b} isSaved={savedBooks.includes(b.id)} onToggleSave={toggleSaveBook} />)}
        </div>
      </div>
    </div>
  )
}
