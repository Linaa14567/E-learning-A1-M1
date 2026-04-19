import { useState } from "react"
import { ENROLLED, COMPLETED, SAVED, BOOKS } from "../constants"
import CourseCard from "../components/cards/CourseCard"
import DashBookCard from "../components/cards/DashBookCard"
import DashBlogCard from "../components/cards/DashBlogCard"
import EmptySaved from "../components/ui/EmptySaved"

const TOPIC_TABS = ["All Topics", "Current Course", "Course Complete", "Saved"]

export default function HomePage({ go, openCourse, savedCourses, savedBooks, savedBlogs, toggleSaveCourse, toggleSaveBook, toggleSaveBlog }) {
  const [cat, setCat]           = useState("All Topics")
  const [savedTab, setSavedTab] = useState("courses")

  const allCourses       = [...ENROLLED, ...COMPLETED, ...SAVED]
  const savedCourseItems = allCourses.filter(c => savedCourses.includes(c.id))
  const savedBookItems   = BOOKS.filter(b => savedBooks.includes(b.id))

  return (
    <div className="flex flex-col gap-6">
      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {TOPIC_TABS.map(t => (
          <button key={t} onClick={() => setCat(t)}
            className={"px-4 py-1.5 rounded-full text-xs font-bold border cursor-pointer transition-all " + (cat === t ? "bg-indigo-600 text-white border-indigo-600 shadow-sm" : "bg-white text-slate-500 border-slate-200 hover:border-indigo-300 hover:text-indigo-600")}>
            {t}
          </button>
        ))}
      </div>

      {/* Current Courses */}
      {(cat === "All Topics" || cat === "Current Course") && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-black text-slate-900" style={{ fontFamily: "'Outfit',sans-serif" }}>Current Courses</h2>
            <button onClick={() => go("courses")} className="text-xs font-bold text-indigo-600 hover:underline border-none bg-transparent cursor-pointer">View All</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ENROLLED.map(c => (
              <CourseCard key={c.id} c={c} type="enrolled" onClick={() => openCourse(c)}
                isSaved={savedCourses.includes(c.id)} onToggleSave={toggleSaveCourse} />
            ))}
          </div>
        </section>
      )}

      {/* Complete Courses */}
      {(cat === "All Topics" || cat === "Course Complete") && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-black text-slate-900" style={{ fontFamily: "'Outfit',sans-serif" }}>Complete Courses</h2>
            <button onClick={() => go("courses")} className="text-xs font-bold text-indigo-600 hover:underline border-none bg-transparent cursor-pointer">View All</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {COMPLETED.map(c => (
              <CourseCard key={c.id} c={c} type="completed"
                isSaved={savedCourses.includes(c.id)} onToggleSave={toggleSaveCourse} />
            ))}
          </div>
        </section>
      )}

      {/* Saved */}
      {(cat === "All Topics" || cat === "Saved") && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-black text-slate-900" style={{ fontFamily: "'Outfit',sans-serif" }}>Saved</h2>
          </div>
          <div className="flex gap-1 bg-slate-100 p-1 rounded-2xl w-fit mb-5 border border-slate-200">
            {[["courses", `📖 Courses (${savedCourseItems.length})`], ["books", `📚 Books (${savedBookItems.length})`], ["blogs", `✍️ Blogs (${savedBlogs.length})`]].map(([k, l]) => (
              <button key={k} onClick={() => setSavedTab(k)}
                className={"px-4 py-2 rounded-xl text-xs font-bold border-none cursor-pointer transition-all " + (savedTab === k ? "bg-indigo-600 text-white shadow-sm" : "bg-transparent text-slate-500 hover:text-slate-700")}>
                {l}
              </button>
            ))}
          </div>

          {savedTab === "courses" && (
            savedCourseItems.length === 0
              ? <EmptySaved label="No saved courses yet" sub="Tap 🔖 on any course to save it" />
              : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {savedCourseItems.map(c => (
                    <CourseCard key={c.id} c={c} type={c.progress != null ? "enrolled" : "saved"}
                      onClick={c.progress != null ? () => openCourse(c) : undefined}
                      isSaved={true} onToggleSave={toggleSaveCourse} />
                  ))}
                </div>
          )}
          {savedTab === "books" && (
            savedBookItems.length === 0
              ? <EmptySaved label="No saved books yet" sub="Tap 🔖 on any book to save it" />
              : <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {savedBookItems.map(b => <DashBookCard key={b.id} b={b} isSaved={true} onToggleSave={toggleSaveBook} />)}
                </div>
          )}
          {savedTab === "blogs" && (
            savedBlogs.length === 0
              ? <EmptySaved label="No saved blogs yet" sub="Tap 🔖 on any blog post to save it" />
              : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {savedBlogs.map(b => <DashBlogCard key={b.id} b={b} isSaved={true} onToggleSave={toggleSaveBlog} />)}
                </div>
          )}
        </section>
      )}
    </div>
  )
}
