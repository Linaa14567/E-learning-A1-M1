import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import {
  useGetCoursesQuery,
  useEnrollCourseMutation,
  useGetEnrolledCoursesQuery,
} from "../../features/courses/coursesApi"
import {
  Monitor, Award, Clock, Headphones, Play, Check,
  Lock, User, ArrowLeft, BookOpen, Users, Star, ChevronRight,
} from "lucide-react"
import { toast } from "react-toastify"

// ── Skeleton ──────────────────────────────────────────────────────────────────
const Skeleton = () => (
  <div className="max-w-6xl mx-auto px-6 py-10 animate-pulse">
    <div className="h-8 w-48 bg-gray-100 dark:bg-gray-700 rounded-xl mb-8" />
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-4">
        <div className="h-10 w-3/4 bg-gray-100 dark:bg-gray-700 rounded-xl" />
        <div className="h-4 w-full bg-gray-100 dark:bg-gray-700 rounded" />
        <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded-2xl mt-6" />
      </div>
      <div className="h-[500px] bg-gray-100 dark:bg-gray-700 rounded-2xl" />
    </div>
  </div>
)

// ── Tab ───────────────────────────────────────────────────────────────────────
const Tab = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
      active
        ? "bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-indigo-900/50"
        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
    }`}
  >
    {label}
  </button>
)

// ── Lesson row ────────────────────────────────────────────────────────────────
const LessonListItem = ({ lesson, index, isEnrolled, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left transition-all border mb-2 ${
      isActive
        ? "border-amber-400 bg-amber-50 dark:bg-amber-900/20 shadow-sm"
        : "border-gray-100 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-700 hover:bg-indigo-50/40 dark:hover:bg-indigo-900/10"
    }`}
  >
    <span className={`text-sm font-bold min-w-[1.5rem] ${isActive ? "text-amber-600" : "text-gray-400 dark:text-gray-500"}`}>
      {index + 1}.
    </span>
    <span className={`flex-1 text-sm font-medium truncate ${isActive ? "text-gray-900 dark:text-gray-100" : "text-gray-700 dark:text-gray-300"}`}>
      {lesson.title}
    </span>
    {!isEnrolled && <Lock size={13} className="text-gray-300 dark:text-gray-600 flex-shrink-0" />}
    {isEnrolled && <ChevronRight size={13} className={isActive ? "text-amber-500" : "text-gray-300 dark:text-gray-600"} />}
  </button>
)

// ── Main ──────────────────────────────────────────────────────────────────────
export default function CourseDetail() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const [activeTab,    setActiveTab]    = useState("overview")
  const [activeLesson, setActiveLesson] = useState(null)

  const { data: raw, isLoading } = useGetCoursesQuery({ limit: 999, skip: 0 })
  const allCourses = Array.isArray(raw) ? raw : raw?.courses ?? raw?.data ?? []
  const course     = allCourses.find((c) => String(c.id) === String(id))

  const { data: enrolledList = [] } = useGetEnrolledCoursesQuery(undefined, { skip: !user })
  const isEnrolled = enrolledList.some(
    (c) => String(c.id) === String(id) || String(c.course_id) === String(id)
  )

  const [enrollCourse, { isLoading: isEnrolling }] = useEnrollCourseMutation()

  const handleEnroll = async () => {
    if (!user) { navigate("/login"); return }
    try {
      await enrollCourse(Number(id)).unwrap()
      toast.success("Enrolled! Redirecting to your progress…")
      setTimeout(() => navigate("/student/progress"), 1200)
    } catch (err) {
      const msg = err?.data?.detail || err?.data?.message || ""
      if (msg.toLowerCase().includes("already")) {
        navigate("/student/progress")
      } else {
        toast.error(msg || "Failed to enroll. Please try again.")
      }
    }
  }

  if (isLoading) return <Skeleton />
  if (!course) return (
    <div className="flex flex-col items-center justify-center py-32 text-gray-400 dark:text-gray-500">
      <p className="text-5xl mb-4">📭</p>
      <p className="text-sm font-semibold">Course not found.</p>
    </div>
  )

  const lessons  = course.lessons  ?? []
  const tags     = course.tags     ?? []
  const thumb    = course.thumbnail_url ?? course.thumbnail ?? null
  const price    = course.is_paid === false ? "Free" : `$${course.price ?? 49}`
  const teacher  = course.teacher  ?? course.instructor ?? null
  const category = course.category?.name ?? course.category ?? "General"
  const displayLesson = activeLesson ?? lessons[0] ?? null

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── LEFT ── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Course header */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/60 shadow-sm dark:shadow-gray-900/20 p-6">
              <h1 className="text-2xl font-black text-indigo-900 dark:text-indigo-300 leading-tight mb-3">
                {course.title}
              </h1>

              {teacher && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center flex-shrink-0">
                    {teacher.avatar_url
                      ? <img src={teacher.avatar_url} alt={teacher.name} className="w-full h-full object-cover" />
                      : <User size={14} className="text-indigo-400" />
                    }
                  </div>
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{teacher.name ?? teacher.full_name}</span>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2 mb-5">
                <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">Category :</span>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold border border-indigo-100 dark:border-indigo-800/50">
                  {category}
                </span>
                {tags.length > 0 && (
                  <>
                    <span className="text-xs text-gray-400 dark:text-gray-500 font-medium ml-2">Tags :</span>
                    {tags.map((t, i) => (
                      <span key={i} className="px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 text-xs font-bold border border-amber-100 dark:border-amber-800/40">
                        {typeof t === "string" ? t : t.name}
                      </span>
                    ))}
                  </>
                )}
              </div>

              {isEnrolled ? (
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/40 text-green-700 dark:text-green-400 text-sm font-bold">
                    <Check size={14} /> Enrolled
                  </span>
                  <button
                    onClick={() => navigate("/student/progress")}
                    className="px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-400 text-sm font-bold transition-all border border-indigo-100 dark:border-indigo-800/50"
                  >
                    View My Progress →
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleEnroll}
                  disabled={isEnrolling}
                  className="px-6 py-2.5 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white text-sm font-bold transition-all hover:shadow-lg hover:shadow-indigo-200 dark:hover:shadow-indigo-900/50 disabled:opacity-60"
                >
                  {isEnrolling ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                      </svg>
                      Enrolling…
                    </span>
                  ) : "Enroll Now"}
                </button>
              )}
            </div>

            {/* Tabs + content */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/60 shadow-sm dark:shadow-gray-900/20 p-6">
              <div className="flex gap-2 mb-6">
                <Tab label="Overview" active={activeTab === "overview"} onClick={() => setActiveTab("overview")} />
                <Tab label="Lessons"  active={activeTab === "lessons"}  onClick={() => setActiveTab("lessons")}  />
              </div>

              {/* ── Overview ── */}
              {activeTab === "overview" && (
                <div className="space-y-5">
                  {displayLesson && (
                    <div>
                      <p className="text-xs font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest mb-1">
                        {isEnrolled ? "Selected Lesson" : "Lesson Preview"}
                      </p>
                      <h2 className="text-lg font-black text-gray-900 dark:text-gray-100 mb-2">
                        Lessons {lessons.indexOf(displayLesson) + 1}: {displayLesson.title}
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                        {displayLesson.description || course.description}
                      </p>
                      {!isEnrolled && (
                        <div className="mt-4 flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 rounded-xl px-4 py-3">
                          <Lock size={13} className="flex-shrink-0" />
                          Enroll to watch this lesson video.
                        </div>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-50 dark:border-gray-700/50">
                    {[
                      { icon: <Monitor size={14} className="text-indigo-500" />,    label: "Online Course" },
                      { icon: <Clock size={14} className="text-indigo-500" />,      label: course.duration ?? "Self-paced" },
                      { icon: <Award size={14} className="text-indigo-500" />,      label: "Certificate" },
                      { icon: <Headphones size={14} className="text-indigo-500" />, label: "Mentor Support" },
                      { icon: <BookOpen size={14} className="text-indigo-500" />,   label: `${lessons.length} Lessons` },
                      { icon: <Users size={14} className="text-indigo-500" />,      label: "Community Access" },
                    ].map(({ icon, label }, i) => (
                      <div key={i} className="flex items-center gap-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-xl px-4 py-3">
                        {icon}
                        <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Lessons tab ── */}
              {activeTab === "lessons" && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-black text-gray-900 dark:text-gray-100">
                      All Lessons
                      <span className="ml-2 text-xs font-bold text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                        {lessons.length}
                      </span>
                    </h3>
                    {!isEnrolled && (
                      <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                        <Lock size={10} /> Enroll to watch
                      </span>
                    )}
                  </div>
                  {lessons.length === 0
                    ? <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-8">No lessons added yet.</p>
                    : lessons.map((lesson, i) => (
                        <LessonListItem
                          key={lesson.id ?? i}
                          lesson={lesson}
                          index={i}
                          isEnrolled={isEnrolled}
                          isActive={displayLesson?.id === lesson.id}
                          onClick={() => {
                            setActiveLesson(lesson)
                            setActiveTab("overview")
                          }}
                        />
                      ))
                  }
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT sidebar ── */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">

              {/* Thumbnail + enroll card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/60 shadow-sm dark:shadow-gray-900/20 overflow-hidden">
                <div className="relative w-full aspect-video bg-gray-900 dark:bg-gray-950">
                  {thumb
                    ? <img src={thumb} alt={course.title} className="w-full h-full object-cover opacity-90" />
                    : <div className="w-full h-full bg-gradient-to-br from-indigo-800 to-indigo-600" />
                  }
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/90 shadow-xl flex items-center justify-center">
                      <Play size={18} className="text-indigo-600 fill-indigo-600 ml-0.5" />
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-black text-green-500">{price}</span>
                    {isEnrolled ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/40 text-green-700 dark:text-green-400 text-xs font-bold">
                        <Check size={12} /> Enrolled
                      </span>
                    ) : (
                      <button
                        onClick={handleEnroll}
                        disabled={isEnrolling}
                        className="px-5 py-2 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-bold transition-all disabled:opacity-60"
                      >
                        {isEnrolling ? "Enrolling…" : "Enroll Now"}
                      </button>
                    )}
                  </div>

                  <div className="space-y-2.5 border-t border-gray-50 dark:border-gray-700/50 pt-4">
                    {[
                      `${lessons.length} lesson${lessons.length !== 1 ? "s" : ""}`,
                      "Certificate of completion",
                      "Lifetime access",
                      `Category: ${category}`,
                    ].map((text, i) => (
                      <div key={i} className="flex items-center gap-2.5">
                        <div className="w-4 h-4 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center flex-shrink-0">
                          <Check size={9} className="text-indigo-600 dark:text-indigo-400" strokeWidth={3} />
                        </div>
                        <span className="text-xs text-gray-600 dark:text-gray-400">{text}</span>
                      </div>
                    ))}
                  </div>

                  {isEnrolled && (
                    <button
                      onClick={() => navigate("/student/progress")}
                      className="mt-4 w-full py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-400 text-xs font-bold border border-indigo-100 dark:border-indigo-800/50 transition-all"
                    >
                      View My Progress →
                    </button>
                  )}
                </div>
              </div>

              {/* All lessons sidebar list */}
              {lessons.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/60 shadow-sm dark:shadow-gray-900/20 p-5">
                  <h3 className="text-sm font-black text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                    <BookOpen size={14} className="text-indigo-500" />
                    All Lessons
                    <span className="ml-auto text-xs font-bold text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                      {lessons.length}
                    </span>
                  </h3>
                  <div className="space-y-1 max-h-80 overflow-y-auto">
                    {lessons.map((lesson, i) => (
                      <button
                        key={lesson.id ?? i}
                        onClick={() => { setActiveLesson(lesson); setActiveTab("overview") }}
                        className={`w-full text-left px-3 py-2.5 rounded-xl text-[13px] transition-all border flex items-center gap-2 ${
                          displayLesson?.id === lesson.id
                            ? "border-amber-400 bg-amber-50 dark:bg-amber-900/20 text-gray-900 dark:text-gray-100 font-semibold"
                            : "border-gray-100 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-700 hover:bg-indigo-50/40 dark:hover:bg-indigo-900/10 text-gray-600 dark:text-gray-400"
                        }`}
                      >
                        <span className="text-xs text-gray-400 dark:text-gray-500 min-w-[1.2rem]">{i + 1}.</span>
                        <span className="flex-1 truncate">{lesson.title}</span>
                        {!isEnrolled && <Lock size={11} className="text-gray-300 dark:text-gray-600 flex-shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}