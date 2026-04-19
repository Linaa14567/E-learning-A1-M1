import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { useGetCoursesQuery } from "../../features/courses/coursesApi"
import { useGetCategoriesQuery } from "../../features/categories/categoriesApi"
import { Star, Bookmark, ChevronLeft, ChevronRight, Search, X } from "lucide-react"

const LIMIT = 8

const TAG_COLORS = [
  "bg-pink-500", "bg-emerald-500", "bg-amber-500",
  "bg-sky-500",  "bg-purple-600",  "bg-indigo-600",
]

// ── Skeleton card ─────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-white dark:bg-[#1e1e30] rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-[#2e2e45] animate-pulse">
    <div className="w-full h-52 bg-gray-200 dark:bg-[#2e2e45]" />
    <div className="p-3 space-y-2">
      <div className="h-4 bg-gray-200 dark:bg-[#2e2e45] rounded-full w-2/3" />
      <div className="h-3 bg-gray-100 dark:bg-[#25253a] rounded-full w-full" />
      <div className="flex justify-between items-center pt-1">
        <div className="h-4 w-10 bg-gray-200 dark:bg-[#2e2e45] rounded-full" />
        <div className="h-3 w-20 bg-gray-100 dark:bg-[#25253a] rounded-full" />
      </div>
    </div>
  </div>
)

// ── Course card ───────────────────────────────────────────────────────────────
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

  const rating = course.rating ?? 4.6
  const thumb  = course.thumbnail_url ?? course.thumbnail ?? null
  const price  = course.is_paid === false ? "Free" : `$${course.price ?? 29}`
  const isFree = course.is_paid === false

  return (
    <div
      onClick={() => navigate(`/courses/${course.id}`)}
      className="bg-white dark:bg-[#1e1e30] rounded-2xl overflow-hidden shadow-sm
        border border-gray-100 dark:border-[#2e2e45]
        hover:shadow-xl dark:hover:shadow-black/40
        hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col"
    >
      {/* Thumbnail — tall like screenshot */}
      <div className="relative w-full flex-shrink-0 overflow-hidden h-52">
        {thumb ? (
          <img
            src={thumb}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100
            dark:from-indigo-900/40 dark:to-purple-900/40 flex items-center justify-center">
            <span className="text-3xl">📚</span>
          </div>
        )}
        {badgeLabel && (
          <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold text-white ${badgeColor}`}>
            {badgeLabel}
          </span>
        )}
      </div>

      {/* Card body */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-black text-gray-900 dark:text-[#f1f1f1] text-base line-clamp-1 mb-1
          group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
          {course.title}
        </h3>
        <p className="text-sm text-gray-400 dark:text-[#9b9baa] line-clamp-1 mb-4 flex-1">
          {course.description ?? "No description available."}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <span className="text-lg font-black text-green-500 dark:text-green-400">
            {price}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full border
              border-[#2F327D] text-[#2F327D]
              dark:border-indigo-400 dark:text-indigo-400">
              {isFree ? "Free" : "Paid"}
            </span>
            <div className="flex items-center gap-0.5">
              <Star size={12} style={{ color: "#FE9A20", fill: "#FE9A20" }} />
              <span className="text-xs font-bold" style={{ color: "#FE9A20" }}>
                {typeof rating === "number" ? rating.toFixed(1) : rating}
              </span>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); setSaved(!saved) }}
              className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all
                ${saved
                  ? "border-indigo-300 bg-indigo-50 dark:bg-indigo-900/40 dark:border-indigo-500 text-indigo-500"
                  : "border-gray-200 dark:border-[#2e2e45] text-gray-400 dark:text-[#9b9baa] hover:border-indigo-300 hover:text-indigo-400"
                }`}
            >
              <Bookmark size={12} className={saved ? "fill-indigo-500" : ""} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Pagination ────────────────────────────────────────────────────────────────
const Pagination = ({ page, total, limit, onChange }) => {
  const totalPages = Math.ceil(total / limit)
  if (totalPages <= 1) return null
  const pages = Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1)

  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      <button onClick={() => onChange(page - 1)} disabled={page === 1}
        className="flex items-center gap-1 px-4 py-2 rounded-xl
          border border-gray-200 dark:border-[#2e2e45]
          text-sm font-semibold text-gray-500 dark:text-[#9b9baa]
          hover:border-indigo-300 hover:text-indigo-600
          dark:hover:border-indigo-500 dark:hover:text-indigo-400
          disabled:opacity-40 disabled:cursor-not-allowed transition-all">
        <ChevronLeft size={15} /> Back
      </button>
      {pages.map((p) => (
        <button key={p} onClick={() => onChange(p)}
          className={`w-10 h-10 rounded-xl text-sm font-bold transition-all
            ${page === p
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900"
              : "border border-gray-200 dark:border-[#2e2e45] text-gray-500 dark:text-[#9b9baa] hover:border-indigo-300 hover:text-indigo-600 dark:hover:border-indigo-500 dark:hover:text-indigo-400"
            }`}>
          {p}
        </button>
      ))}
      <button onClick={() => onChange(page + 1)} disabled={page >= Math.ceil(total / limit)}
        className="flex items-center gap-1 px-4 py-2 rounded-xl
          border border-gray-200 dark:border-[#2e2e45]
          text-sm font-semibold text-gray-500 dark:text-[#9b9baa]
          hover:border-indigo-300 hover:text-indigo-600
          dark:hover:border-indigo-500 dark:hover:text-indigo-400
          disabled:opacity-40 disabled:cursor-not-allowed transition-all">
        Next <ChevronRight size={15} />
      </button>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function PopularCourses() {
  const [page,        setPage]        = useState(1)
  const [categoryId,  setCategoryId]  = useState(null)
  const [searchInput, setSearchInput] = useState("")

  const { data: categoriesRaw = [], isLoading: catLoading } = useGetCategoriesQuery()
  const categories = Array.isArray(categoriesRaw)
    ? categoriesRaw
    : categoriesRaw?.categories ?? categoriesRaw?.data ?? []

  const { data: raw, isLoading, isError } = useGetCoursesQuery({
    limit: 999, skip: 0,
    ...(categoryId ? { category_id: categoryId } : {}),
  })

  const allCourses = Array.isArray(raw) ? raw : raw?.courses ?? raw?.data ?? []

  const filtered = useMemo(() => {
    const q = searchInput.trim().toLowerCase()
    if (!q) return allCourses
    return allCourses.filter((c) => {
      const catName  = c.category?.name ?? (typeof c.category === "string" ? c.category : "")
      const tagNames = (c.tags ?? []).map((t) => typeof t === "string" ? t : t.name ?? "").join(" ").toLowerCase()
      return (
        c.title?.toLowerCase().includes(q)       ||
        c.description?.toLowerCase().includes(q) ||
        catName.toLowerCase().includes(q)         ||
        tagNames.includes(q)
      )
    })
  }, [allCourses, searchInput])

  const total     = filtered.length
  const paginated = filtered.slice((page - 1) * LIMIT, page * LIMIT)

  const handleCategory     = (id) => { setCategoryId(id); setPage(1); setSearchInput("") }
  const handleSearchChange = (e)  => { setSearchInput(e.target.value); setPage(1) }
  const clearSearch        = ()   => { setSearchInput(""); setPage(1) }

  return (
    <section className="py-12 px-24 max-w-screen-xl mx-auto">

      {/* Header + search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h2 className="text-3xl font-black text-indigo-900 dark:text-[#f1f1f1]">
          Popular Courses
        </h2>
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#9b9baa] pointer-events-none" />
          <input
            type="text"
            value={searchInput}
            onChange={handleSearchChange}
            placeholder="Search by title, category or tag…"
            className="w-full pl-9 pr-9 py-2.5 rounded-xl
              border border-gray-200 dark:border-[#2e2e45]
              bg-white dark:bg-[#1e1e30]
              text-sm text-gray-800 dark:text-[#f1f1f1]
              placeholder:text-gray-400 dark:placeholder:text-[#9b9baa]
              outline-none focus:border-indigo-400 dark:focus:border-indigo-500
              focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/40
              transition-all"
          />
          {searchInput && (
            <button onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#9b9baa] hover:text-gray-600 dark:hover:text-white">
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {searchInput && (
        <p className="text-sm text-gray-400 dark:text-[#9b9baa] mb-4">
          Found <span className="font-bold text-indigo-600 dark:text-indigo-400">{filtered.length}</span> result{filtered.length !== 1 ? "s" : ""} for{" "}
          <span className="font-bold text-gray-700 dark:text-[#f1f1f1]">"{searchInput}"</span>
        </p>
      )}

      {/* Category pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => handleCategory(null)}
          className={`px-4 py-2 rounded-full text-sm font-bold transition-all
            ${categoryId === null
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-indigo-900"
              : "bg-gray-100 dark:bg-[#1e1e30] border border-transparent dark:border-[#2e2e45] text-gray-500 dark:text-[#9b9baa] hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400"
            }`}>
          All
        </button>
        {catLoading && Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-9 w-24 rounded-full bg-gray-100 dark:bg-[#1e1e30] animate-pulse" />
        ))}
        {!catLoading && categories.map((cat) => (
          <button key={cat.id} onClick={() => handleCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all
              ${categoryId === cat.id
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-indigo-900"
                : "bg-gray-100 dark:bg-[#1e1e30] border border-transparent dark:border-[#2e2e45] text-gray-500 dark:text-[#9b9baa] hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400"
              }`}>
            {cat.name}
          </button>
        ))}
      </div>

      {isError && (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">😕</p>
          <p className="text-sm font-semibold text-gray-400 dark:text-[#9b9baa]">Failed to load courses.</p>
        </div>
      )}

      {/* Grid — always grid, no fixed w-72, cards fill columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {isLoading
          ? Array.from({ length: LIMIT }).map((_, i) => <SkeletonCard key={i} />)
          : paginated.length === 0
            ? (
              <div className="col-span-full flex justify-center py-10">
                <div className="bg-white dark:bg-[#1e1e30] rounded-2xl shadow-sm
                  border border-gray-100 dark:border-[#2e2e45]
                  px-16 py-12 flex flex-col items-center text-center max-w-sm w-full">
                  <div className="w-20 h-20 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center mb-6">
                    <Search size={36} className="text-indigo-700 dark:text-indigo-400" strokeWidth={1.8} />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-[#f1f1f1] mb-3">
                    No Results Found
                  </h3>
                  <p className="text-sm text-gray-400 dark:text-[#9b9baa] leading-relaxed mb-7">
                    {searchInput
                      ? "Sorry, we couldn't find any courses matching your search. Please try a different query."
                      : categoryId
                      ? "Sorry, there are no courses in this category yet."
                      : "No courses available at the moment."}
                  </p>
                  {(searchInput || categoryId) && (
                    <button
                      onClick={() => { clearSearch(); handleCategory(null) }}
                      className="px-8 py-3 rounded-full bg-indigo-700 hover:bg-indigo-800
                        dark:bg-indigo-600 dark:hover:bg-indigo-700
                        text-white text-sm font-bold transition-all"
                    >
                      Clear Search
                    </button>
                  )}
                </div>
              </div>
            )
            : paginated.map((course) => <CourseCard key={course.id} course={course} />)
        }
      </div>

      {!isLoading && paginated.length > 0 && (
        <Pagination page={page} total={total} limit={LIMIT}
          onChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }) }} />
      )}
    </section>
  )
}