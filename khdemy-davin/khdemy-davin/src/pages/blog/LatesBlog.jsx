import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Star, Bookmark, PenLine, User } from "lucide-react"
import { useGetBlogsQuery } from "../../features/blog/blogApi"
import { useGetProfileQuery } from "../../features/teacher/teacherApi"

const LATEST_LIMIT = 6

const BADGE_COLORS = [
  "bg-rose-500", "bg-violet-500", "bg-sky-500",
  "bg-amber-500", "bg-emerald-500", "bg-fuchsia-500",
]

// ── Skeleton ──────────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="rounded-2xl overflow-hidden border border-gray-100 dark:border-[#2e2e45] animate-pulse bg-white dark:bg-[#1e1e30] shadow-sm">
    <div className="w-full h-44 bg-gray-100 dark:bg-[#2e2e45]" />
    <div className="p-5 space-y-3">
      <div className="h-4 bg-gray-100 dark:bg-[#2e2e45] rounded-full w-3/4" />
      <div className="h-3 bg-gray-100 dark:bg-[#25253a] rounded-full w-full" />
      <div className="h-3 bg-gray-100 dark:bg-[#25253a] rounded-full w-2/3" />
      <div className="flex justify-between items-center pt-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-[#2e2e45]" />
          <div className="h-3 w-16 bg-gray-100 dark:bg-[#2e2e45] rounded-full" />
        </div>
        <div className="h-3 w-10 bg-gray-100 dark:bg-[#2e2e45] rounded-full" />
      </div>
    </div>
  </div>
)

// ── Blog Card ─────────────────────────────────────────────────────────────────
const BlogCard = ({ blog, profile }) => {
  const navigate = useNavigate()
  const [saved, setSaved] = useState(false)

  const tags = (blog.tags ?? [])
    .map((t) => (typeof t === "string" ? t : t.name ?? ""))
    .filter(Boolean)

  const badgeLabel   = tags[0] ?? null
  const badgeColor   = BADGE_COLORS[Math.abs((blog.id ?? 0) % BADGE_COLORS.length)]
  const thumb        = blog.thumbnail_url ?? blog.thumbnail ?? null
  const rating       = blog.rating ?? 4.8
  const authorName   = blog.author_name ?? blog.author?.name ?? profile?.name ?? "Author"
  const authorAvatar = blog.author?.avatar_url ?? profile?.avatar_url ?? null

  return (
    <div
      onClick={() => navigate(`/blogs/${blog.id}`)}
      className="group bg-white dark:bg-[#1e1e30] rounded-2xl overflow-hidden shadow-sm
        border border-gray-100 dark:border-[#2e2e45]
        hover:shadow-xl dark:hover:shadow-black/40
        hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col"
    >
      {/* Thumbnail */}
      <div className="relative w-full h-44 bg-gray-100 dark:bg-[#2e2e45] overflow-hidden flex-shrink-0">
        {thumb ? (
          <img
            src={thumb}
            alt={blog.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-violet-100 via-pink-50 to-sky-100
            dark:from-violet-900/30 dark:via-pink-900/20 dark:to-sky-900/30
            flex items-center justify-center">
            <PenLine size={32} className="text-violet-300 dark:text-violet-500" />
          </div>
        )}
        {badgeLabel && (
          <span className={`absolute top-3 left-3 inline-flex items-center px-2.5 py-1 rounded-full
            text-[10px] font-bold text-white shadow-sm ${badgeColor}`}>
            {badgeLabel}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-gray-900 dark:text-[#f1f1f1] mb-1.5 line-clamp-1
          group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors text-[15px]">
          {blog.title}
        </h3>
        <p className="text-xs text-gray-400 dark:text-[#9b9baa] line-clamp-2 leading-relaxed mb-auto">
          {blog.description ?? blog.excerpt ?? blog.content ?? "No description available."}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50 dark:border-[#2e2e45]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900/40
              border border-indigo-200 dark:border-indigo-700
              overflow-hidden flex items-center justify-center flex-shrink-0">
              {authorAvatar ? (
                <img src={authorAvatar} alt={authorName} className="w-full h-full object-cover" />
              ) : (
                <User size={12} className="text-indigo-500 dark:text-indigo-400" />
              )}
            </div>
            <span className="text-xs font-semibold text-gray-600 dark:text-[#9b9baa] truncate max-w-[80px]">
              {authorName}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              <Star size={11} style={{ color: "#FE9A20", fill: "#FE9A20" }} />
              <span className="text-xs font-bold" style={{ color: "#FE9A20" }}>
                {typeof rating === "number" ? rating.toFixed(1) : rating}
              </span>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); setSaved(!saved) }}
              className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all
                ${saved
                  ? "border-indigo-300 bg-indigo-50 dark:bg-indigo-900/40 dark:border-indigo-500 text-indigo-500"
                  : "border-gray-200 dark:border-[#2e2e45] text-gray-400 dark:text-[#9b9baa] hover:border-indigo-200 hover:text-indigo-400"
                }`}
            >
              <Bookmark size={11} className={saved ? "fill-indigo-500" : ""} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function LatestBlog() {
  const navigate = useNavigate()

  const { data: profile } = useGetProfileQuery()
  const { data: raw, isLoading } = useGetBlogsQuery({ page: 1, limit: LATEST_LIMIT })
  const blogs = raw?.items ?? raw?.blogs ?? raw?.data ?? []

  return (
    <div className="max-w-6xl mx-auto px-8 py-12">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-black text-gray-900 dark:text-[#f1f1f1]">
          Latest Blog Posts
        </h2>
        <button
          onClick={() => navigate("/blogs")}
          className="px-5 py-2.5 rounded-full bg-indigo-700 hover:bg-indigo-800
            dark:bg-indigo-600 dark:hover:bg-indigo-700
            text-white text-sm font-bold transition-all
            shadow-md shadow-indigo-200 dark:shadow-indigo-900"
        >
          See more
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
        {isLoading
          ? Array.from({ length: LATEST_LIMIT }).map((_, i) => <SkeletonCard key={i} />)
          : blogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} profile={profile} />
            ))
        }
      </div>
    </div>
  )
}