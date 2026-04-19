import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { useGetEnrolledCoursesQuery, useGetCoursesQuery } from "../../features/courses/coursesApi"
import {
  Play, CheckCircle2, ChevronRight, BookOpen, Trophy,
  Loader2, Check, ArrowLeft, Menu, X,
} from "lucide-react"

// ─────────────────────────────────────────────────────────────────────────────
// VIDEO PLAYER
// ─────────────────────────────────────────────────────────────────────────────
function VideoPlayer({ lesson }) {
  if (!lesson?.video_url) return (
    <div className="w-full aspect-video bg-gray-900 rounded-xl flex items-center justify-center">
      <p className="text-white/40 text-sm">No video for this lesson.</p>
    </div>
  )
  const isYT = lesson.video_url.includes("youtu")
  const src  = lesson.video_url
    .replace("youtu.be/", "www.youtube.com/embed/")
    .replace("watch?v=", "embed/")
  return (
    <div className="w-full aspect-video rounded-xl overflow-hidden bg-black shadow-2xl">
      {isYT
        ? <iframe src={src} className="w-full h-full" allowFullScreen title={lesson.title} />
        : <video src={lesson.video_url} controls className="w-full h-full" />
      }
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// COURSE PLAYER (inline, shown when a card is clicked)
// ─────────────────────────────────────────────────────────────────────────────
function CoursePlayer({ course, onBack }) {
  const lessons      = course?.lessons ?? []
  const [active, setActive]       = useState(lessons[0] ?? null)
  const [sidebar, setSidebar]     = useState(true)

  const completed  = course.completed_lessons ?? 0
  const total      = lessons.length
  const percent    = total > 0 ? Math.round((completed / total) * 100) : 0
  const currentIdx = active ? lessons.findIndex((l) => l.id === active.id) : 0

  return (
    <div className="flex h-[calc(100vh-80px)] overflow-hidden bg-white rounded-2xl border border-gray-100 shadow-sm">

      {/* ── SIDEBAR ── */}
      <aside className={`${sidebar ? "w-72" : "w-0"} flex-shrink-0 transition-all duration-300 overflow-hidden border-r border-gray-100 bg-gray-50 flex flex-col`}>

        {/* Sidebar header */}
        <div className="p-5 border-b border-gray-100 flex-shrink-0">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Course Content</p>
          <h2 className="text-sm font-black text-gray-900 line-clamp-2 leading-snug mb-3">
            {course.title}
          </h2>
          {/* Progress */}
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-gray-500">{completed}/{total} lessons</span>
            <span className="font-black text-indigo-600">{percent}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-indigo-600 transition-all duration-700" style={{ width: `${percent}%` }} />
          </div>
        </div>

        {/* Lesson list */}
        <div className="flex-1 overflow-y-auto p-3">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-2">All Lessons</p>
          {lessons.length === 0 && (
            <p className="text-xs text-gray-400 text-center py-6">No lessons yet.</p>
          )}
          {lessons.map((lesson, i) => {
            const isActive = active?.id === lesson.id
            const isDone   = i < completed
            return (
              <button
                key={lesson.id ?? i}
                onClick={() => setActive(lesson)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left mb-1 transition-all ${
                  isActive
                    ? "bg-indigo-600 shadow-md shadow-indigo-200"
                    : "hover:bg-white hover:shadow-sm"
                }`}
              >
                {/* Icon */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  isActive ? "bg-white/20" : isDone ? "bg-green-100" : "bg-gray-200"
                }`}>
                  {isDone && !isActive
                    ? <Check size={13} className="text-green-600" strokeWidth={2.5} />
                    : <Play size={12} className={isActive ? "fill-white text-white ml-0.5" : "fill-gray-400 text-gray-400 ml-0.5"} />
                  }
                </div>
                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p className={`text-[12px] font-semibold truncate ${isActive ? "text-white" : "text-gray-800"}`}>
                    {i + 1}. {lesson.title}
                  </p>
                  {lesson.duration && (
                    <p className={`text-[10px] mt-0.5 ${isActive ? "text-indigo-200" : "text-gray-400"}`}>
                      🕐 {lesson.duration}
                    </p>
                  )}
                </div>
                {isActive && <div className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />}
              </button>
            )
          })}
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top bar */}
        <header className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-white flex-shrink-0">
          <div className="flex items-center gap-3">
            {/* Toggle sidebar */}
            <button
              onClick={() => setSidebar(!sidebar)}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
            >
              {sidebar ? <X size={17} /> : <Menu size={17} />}
            </button>

            {/* Back button */}
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-sm text-indigo-600 font-semibold hover:underline"
            >
              <ArrowLeft size={14} /> My Courses
            </button>

            {/* Breadcrumb */}
            <div className="hidden sm:flex items-center gap-1.5 text-sm text-gray-400">
              <ChevronRight size={13} />
              <span className="font-semibold text-gray-700 truncate max-w-[180px]">{course.title}</span>
              {active && (
                <>
                  <ChevronRight size={13} />
                  <span className="truncate max-w-[160px]">{active.title}</span>
                </>
              )}
            </div>
          </div>

          {/* Right: progress pill + next */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-1.5">
              <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${percent}%` }} />
              </div>
              <span className="text-xs font-black text-indigo-600">{percent}%</span>
            </div>
            <button
              onClick={() => currentIdx < lessons.length - 1 && setActive(lessons[currentIdx + 1])}
              disabled={currentIdx >= lessons.length - 1}
              className="flex items-center gap-1 px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next <ChevronRight size={12} />
            </button>
          </div>
        </header>

        {/* Video + content */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {active ? (
            <div className="max-w-4xl mx-auto">
              <h1 className="text-2xl font-black text-gray-900 mb-1">
                {currentIdx + 1}. {active.title}
              </h1>
              {active.description && (
                <p className="text-sm text-gray-400 mb-5">{active.description}</p>
              )}
              <VideoPlayer lesson={active} />

              {/* Prev / Next nav */}
              <div className="flex items-center justify-between mt-6">
                <button
                  onClick={() => currentIdx > 0 && setActive(lessons[currentIdx - 1])}
                  disabled={currentIdx === 0}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  ← Previous
                </button>
                <span className="text-xs text-gray-400 font-medium">{currentIdx + 1} / {lessons.length}</span>
                <button
                  onClick={() => currentIdx < lessons.length - 1 && setActive(lessons[currentIdx + 1])}
                  disabled={currentIdx >= lessons.length - 1}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next →
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3">
              <BookOpen size={48} className="text-gray-200" />
              <p className="text-sm font-semibold">Select a lesson to start watching.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// PROGRESS CARD
// ─────────────────────────────────────────────────────────────────────────────
function CourseProgressCard({ course, onClick }) {
  const completed = course.completed_lessons ?? 0
  const total     = course.total_lessons ?? course.lessons?.length ?? 0
  const percent   = total > 0 ? Math.round((completed / total) * 100) : 0
  const isDone    = percent >= 100
  const thumb     = course.thumbnail_url ?? course.thumbnail ?? null
  const category  = course.category?.name ?? course.category ?? "Course"

  return (
    <div
      onClick={() => onClick(course)}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer"
    >
      {/* Thumbnail */}
      <div className="relative w-full aspect-video overflow-hidden bg-gray-900">
        {thumb
          ? <img src={thumb} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          : <div className="w-full h-full bg-gradient-to-br from-indigo-900 to-indigo-600" />
        }

        {/* Category badge */}
        <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-bold text-white"
          style={{ background: isDone ? "#1e3a8a" : "#dc2626" }}>
          {category}
        </span>

        {/* Done overlay */}
        {isDone && (
          <div className="absolute inset-0 bg-indigo-900/30 flex items-center justify-center">
            <CheckCircle2 size={40} className="text-white drop-shadow-lg" />
          </div>
        )}

        {/* Play overlay on hover */}
        {!isDone && (
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-xl">
              <Play size={18} className="fill-indigo-600 text-indigo-600 ml-0.5" />
            </div>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        <h3 className="font-black text-gray-900 text-[15px] leading-tight mb-1 line-clamp-1">
          {course.title}
        </h3>
        <p className="text-xs text-gray-400 line-clamp-2 mb-3 leading-relaxed min-h-[2rem]">
          {course.description}
        </p>

        {/* Progress bar */}
        <div className="mb-1 flex items-center justify-between">
          <span className="text-[10px] text-gray-400 font-medium">Progress</span>
          <span className={`text-xs font-black ${isDone ? "text-indigo-700" : "text-red-500"}`}>{percent}%</span>
        </div>
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-2">
          <div className="h-full rounded-full transition-all duration-700"
            style={{ width: `${percent}%`, background: "linear-gradient(90deg,#1e3a8a,#3b82f6)" }} />
        </div>
        <p className="text-[10px] text-gray-400 mb-4">{completed} of {total} lessons completed</p>

        {/* Button */}
        {isDone ? (
          <button
            onClick={(e) => { e.stopPropagation(); onClick(course) }}
            className="w-full py-2 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-bold tracking-wide transition-all"
          >
            Complete
          </button>
        ) : (
          <button
            onClick={(e) => { e.stopPropagation(); onClick(course) }}
            className="w-full py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-bold tracking-wide flex items-center justify-center gap-1.5 transition-all"
          >
            <Play size={11} className="fill-white" /> Resume
          </button>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION
// ─────────────────────────────────────────────────────────────────────────────
function Section({ title, icon, courses, onCardClick }) {
  if (courses.length === 0) return null
  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
          {icon} {title}
          <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full ml-1">
            {courses.length}
          </span>
        </h2>
        <button className="text-xs text-indigo-600 font-semibold hover:underline flex items-center gap-0.5">
          View All <ChevronRight size={13} />
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {courses.map((c) => (
          <CourseProgressCard key={c.id} course={c} onClick={onCardClick} />
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function MyProgress() {
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  // The course currently open in the player (null = show grid)
  const [activeCourse, setActiveCourse] = useState(null)

  // Need full course data (with lessons) — enrolled list may not have lessons
  const { data: raw } = useGetCoursesQuery({ limit: 999, skip: 0 })
  const allCourses = Array.isArray(raw) ? raw : raw?.courses ?? raw?.data ?? []

  const { data: enrolledList = [], isLoading } = useGetEnrolledCoursesQuery(undefined, {
    skip: !user,
  })

  // Merge enrolled list with full course data to get lessons
  const enriched = enrolledList.map((enrolled) => {
    const full = allCourses.find((c) => String(c.id) === String(enrolled.id ?? enrolled.course_id))
    return full ? { ...full, ...enrolled } : enrolled
  })

  // When a card is clicked, open the full course (with lessons)
  const handleCardClick = (course) => {
    const full = allCourses.find((c) => String(c.id) === String(course.id ?? course.course_id))
    setActiveCourse(full ?? course)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  if (!user) return (
    <div className="flex flex-col items-center justify-center py-32 text-gray-400 gap-4">
      <BookOpen size={48} className="text-gray-200" />
      <p className="text-sm font-semibold">Please log in to view your progress.</p>
      <button onClick={() => navigate("/login")}
        className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition">
        Log In
      </button>
    </div>
  )

  if (isLoading) return (
    <div className="flex items-center justify-center py-32 text-gray-400 gap-3">
      <Loader2 size={24} className="animate-spin" />
      <span className="text-sm font-semibold">Loading your courses…</span>
    </div>
  )

  const getPercent = (c) => {
    const total = c.total_lessons ?? c.lessons?.length ?? 0
    const done  = c.completed_lessons ?? 0
    return total > 0 ? Math.round((done / total) * 100) : 0
  }

  const current  = enriched.filter((c) => getPercent(c) < 100)
  const complete = enriched.filter((c) => getPercent(c) >= 100)

  if (enrolledList.length === 0) return (
    <div className="flex flex-col items-center justify-center py-32 text-gray-400 gap-4">
      <BookOpen size={48} className="text-gray-200" />
      <p className="text-sm font-semibold">You haven't enrolled in any courses yet.</p>
      <button onClick={() => navigate("/courses")}
        className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition">
        Browse Courses
      </button>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">

      {/* ── PLAYER VIEW ── */}
      {activeCourse ? (
        <div>
          {/* Back to progress */}
          <button
            onClick={() => setActiveCourse(null)}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 font-semibold mb-5 transition-colors"
          >
            <ArrowLeft size={15} /> Back to My Progress
          </button>
          <CoursePlayer course={activeCourse} onBack={() => setActiveCourse(null)} />
        </div>
      ) : (

        /* ── GRID VIEW ── */
        <>
          <div className="mb-8">
            <h1 className="text-2xl font-black text-gray-900">My Progress</h1>
            <p className="text-sm text-gray-400 mt-1">
              {enrolledList.length} enrolled · {complete.length} completed
            </p>
          </div>

          <Section
            title="Current Courses"
            icon={<Play size={16} className="text-red-500" />}
            courses={current}
            onCardClick={handleCardClick}
          />
          <Section
            title="Complete Courses"
            icon={<Trophy size={16} className="text-indigo-600" />}
            courses={complete}
            onCardClick={handleCardClick}
          />
        </>
      )}
    </div>
  )
}