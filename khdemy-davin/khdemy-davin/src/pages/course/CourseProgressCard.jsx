import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { useGetEnrolledCoursesQuery } from "../../features/courses/coursesApi"
import { Play, CheckCircle2, ChevronRight, BookOpen, Trophy, Loader2 } from "lucide-react"

// ── Single progress card ──────────────────────────────────────────────────────
function CourseProgressCard({ course }) {
  const navigate  = useNavigate()
  const completed = course.completed_lessons ?? 0
  const total     = course.total_lessons ?? course.lessons?.length ?? 0
  const percent   = total > 0 ? Math.round((completed / total) * 100) : 0
  const isDone    = percent >= 100
  const thumb     = course.thumbnail_url ?? course.thumbnail ?? null
  const category  = course.category?.name ?? course.category ?? "Course"

  // ✅ Click card → go to full player page
  const handleClick = () => navigate(`/courses/${course.id}/play`)

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer"
    >
      {/* Thumbnail */}
      <div className="relative w-full aspect-video overflow-hidden bg-gray-900">
        {thumb ? (
          <img
            src={thumb}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-900 to-indigo-600" />
        )}

        {/* Category badge */}
        <span
          className="absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-bold text-white"
          style={{ background: isDone ? "#1e3a8a" : "#dc2626" }}
        >
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
          <span className={`text-xs font-black ${isDone ? "text-indigo-700" : "text-red-500"}`}>
            {percent}%
          </span>
        </div>
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-2">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${percent}%`,
              background: "linear-gradient(90deg, #1e3a8a, #3b82f6)",
            }}
          />
        </div>
        <p className="text-[10px] text-gray-400 mb-4">
          {completed} of {total} lessons completed
        </p>

        {/* Action button */}
        {isDone ? (
          <button
            onClick={(e) => { e.stopPropagation(); handleClick() }}
            className="w-full py-2 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-bold tracking-wide transition-all"
          >
            Complete
          </button>
        ) : (
          <button
            onClick={(e) => { e.stopPropagation(); handleClick() }}
            className="w-full py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-bold tracking-wide flex items-center justify-center gap-1.5 transition-all"
          >
            <Play size={11} className="fill-white" /> Resume
          </button>
        )}
      </div>
    </div>
  )
}

// ── Section ───────────────────────────────────────────────────────────────────
function Section({ title, icon, courses }) {
  if (courses.length === 0) return null
  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
          {icon}
          {title}
          <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full ml-1">
            {courses.length}
          </span>
        </h2>
        <button className="text-xs text-indigo-600 font-semibold hover:underline flex items-center gap-0.5">
          View All <ChevronRight size={13} />
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {courses.map((course) => (
          <CourseProgressCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function MyProgress() {
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  const { data: enrolledList = [], isLoading } = useGetEnrolledCoursesQuery(undefined, {
    skip: !user,
  })

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

  const current  = enrolledList.filter((c) => getPercent(c) < 100)
  const complete = enrolledList.filter((c) => getPercent(c) >= 100)

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
      />
      <Section
        title="Complete Courses"
        icon={<Trophy size={16} className="text-indigo-600" />}
        courses={complete}
      />
    </div>
  )
}