import { useState } from "react"
import { ENROLLED, COMPLETED, SAVED } from "../constants"
import CourseCard from "../components/cards/CourseCard"

const TABS = [["current", "Current"], ["complete", "Completed"], ["saved", "Saved"]]

export default function CoursesPage({ openCourse }) {
  const [tab, setTab] = useState("current")
  const data = tab === "current" ? ENROLLED : tab === "complete" ? COMPLETED : SAVED
  const type = tab === "current" ? "enrolled" : tab === "complete" ? "completed" : "saved"

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 mb-0.5" style={{ fontFamily: "'Outfit',sans-serif" }}>My Courses</h1>
          <p className="text-sm text-slate-400">Track and continue your learning</p>
        </div>
      </div>
      <div className="flex gap-1 bg-slate-100 p-1 rounded-2xl w-fit mb-6 border border-slate-200">
        {TABS.map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)}
            className={"px-4 py-2 rounded-xl text-xs font-bold border-none cursor-pointer transition-all " + (tab === k ? "bg-indigo-600 text-white shadow-md" : "bg-transparent text-slate-500 hover:text-slate-700")}>
            {l}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {data.map((c, i) => (
          <CourseCard key={i} c={c} type={type} onClick={type === "enrolled" ? () => openCourse(c) : undefined} />
        ))}
      </div>
    </div>
  )
}
