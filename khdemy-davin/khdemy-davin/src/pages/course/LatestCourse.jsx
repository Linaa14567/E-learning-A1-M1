import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Star, Bookmark } from "lucide-react"
import { useGetCoursesQuery } from "../../features/courses/coursesApi"

const LATEST_LIMIT = 4

const TAG_COLORS = [
  { bg: "bg-indigo-600/90",  text: "text-white" },
  { bg: "bg-pink-500/90",    text: "text-white" },
  { bg: "bg-emerald-500/90", text: "text-white" },
  { bg: "bg-amber-500/90",   text: "text-white" },
  { bg: "bg-sky-500/90",     text: "text-white" },
  { bg: "bg-purple-600/90",  text: "text-white" },
]

// ── Skeleton ──────────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-white dark:bg-[#1e1e30] rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-[#2e2e45] animate-pulse">
    <div className="w-full h-48 bg-gray-100 dark:bg-[#2e2e45]" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-100 dark:bg-[#2e2e45] rounded-full w-3/4" />
      <div className="h-3 bg-gray-100 dark:bg-[#25253a] rounded-full w-full" />
      <div className="h-3 bg-gray-100 dark:bg-[#25253a] rounded-full w-2/3" />
      <div className="flex justify-between items-center pt-1">
        <div className="h-4 w-10 bg-gray-100 dark:bg-[#2e2e45] rounded-full" />
        <div className="h-3 w-16 bg-gray-100 dark:bg-[#2e2e45] rounded-full" />
      </div>
    </div>
  </div>
)

// ── Course Card ───────────────────────────────────────────────────────────────
const CourseCard = ({ course }) => {
  const navigate          = useNavigate()
  const [saved, setSaved] = useState(false)

  const categoryName =
    course.category?.name ??
    (typeof course.category === "string" ? course.category : null)

  const tags = (course.tags ?? [])
    .map((t) => (typeof t === "string" ? t : t.name ?? ""))
    .filter(Boolean)

  const badgeLabel = categoryName ?? tags[0] ?? null
  const badgeColor = TAG_COLORS[Math.abs((course.id ?? 0) % TAG_COLORS.length)]
  const rating     = course.rating ?? 4.6
  const thumb      = course.thumbnail_url ?? course.thumbnail ?? null
  const price      = course.is_paid === false ? "Free" : `$${course.price ?? 29}`
  const isFree     = course.is_paid === false

  return (
    <div
      onClick={() => navigate(`/courses/${course.id}`)}
      className="bg-white dark:bg-[#1e1e30] rounded-2xl overflow-hidden shadow-sm
        border border-gray-100 dark:border-[#2e2e45]
        hover:shadow-xl dark:hover:shadow-black/40
        hover:-translate-y-1.5 transition-all duration-300 cursor-pointer group"
    >
      {/* Thumbnail */}
      <div className="relative w-full h-48 bg-gray-100 dark:bg-[#2e2e45] overflow-hidden">
        {thumb ? (
          <img
            src={thumb}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 flex items-center justify-center">
            <span className="text-4xl">📚</span>
          </div>
        )}
        {badgeLabel && (
          <div className="absolute top-3 left-3">
            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold
              backdrop-blur-sm shadow-lg ${badgeColor.bg} ${badgeColor.text}`}>
              {badgeLabel}
            </span>
          </div>
        )}
        {tags.length > 1 && (
          <div className="absolute bottom-3 left-3 flex gap-1 flex-wrap">
            {tags.slice(categoryName ? 0 : 1, 3).map((tag, i) => (
              <span key={i} className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/40 text-white backdrop-blur-sm">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-gray-900 dark:text-[#f1f1f1] mb-1 line-clamp-1
          group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors text-[18px]">
          {course.title}
        </h3>
        <p className="text-sm text-gray-400 dark:text-[#9b9baa] line-clamp-2 leading-relaxed mb-4">
          {course.description ?? "No description available."}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <span className="font-black text-[18px] text-green-500 dark:text-green-400">
            {price}
          </span>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full border
              border-[#2F327D] text-[#2F327D]
              dark:border-indigo-400 dark:text-indigo-400"
              style={{ fontSize: "11px" }}>
              {isFree ? "Free" : "Paid"}
            </span>
            <div className="flex items-center gap-1">
              <Star size={13} style={{ color: "#FE9A20", fill: "#FE9A20" }} />
              <span className="text-xs font-bold" style={{ color: "#FE9A20" }}>{rating}</span>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); setSaved(!saved) }}
              className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all
                ${saved
                  ? "border-indigo-300 bg-indigo-50 dark:bg-indigo-900/40 dark:border-indigo-500 text-indigo-500"
                  : "border-gray-200 dark:border-[#2e2e45] text-gray-400 dark:text-[#9b9baa] hover:border-indigo-200 hover:text-indigo-400"
                }`}
            >
              <Bookmark size={13} className={saved ? "fill-indigo-500" : ""} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function LatestCourses() {
  const navigate = useNavigate()

  const { data: raw, isLoading } = useGetCoursesQuery({ limit: LATEST_LIMIT, skip: 0 })
  const courses = (Array.isArray(raw) ? raw : raw?.courses ?? raw?.data ?? []).slice(0, LATEST_LIMIT)

  return (
    <div className="max-w-6xl mx-auto px-8 py-12">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-black text-indigo-900 dark:text-indigo-700">
          Popular Courses
        </h2>
        <button
          onClick={() => navigate("/courses")}
          className="px-5 py-2.5 rounded-full bg-indigo-700 hover:bg-indigo-800
            dark:bg-indigo-600 dark:hover:bg-indigo-700
            text-white text-sm font-bold transition-all
            shadow-md shadow-indigo-200 dark:shadow-indigo-900"
        >
          See more
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading
          ? Array.from({ length: LATEST_LIMIT }).map((_, i) => <SkeletonCard key={i} />)
          : courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))
        }
      </div>
    </div>
  )
}