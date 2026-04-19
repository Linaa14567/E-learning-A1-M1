import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { useGetCategoriesQuery } from "../../features/categories/categoriesApi"
import { Bookmark, ChevronLeft, ChevronRight, Search, X } from "lucide-react"
import {
  useGetAllBooksQuery,
  useGetBooksQuery,
  useGetMyBookmarksQuery,
  useAddBookmarkMutation,
  useRemoveBookmarkMutation,
} from "../../features/books/booksAPI"

const TRENDING_LIMIT = 6
const EXPLORE_LIMIT  = 20

const BADGE_COLORS = [
  { bg: "bg-purple-100", text: "text-purple-600" },
  { bg: "bg-sky-100",    text: "text-sky-600"    },
  { bg: "bg-pink-100",   text: "text-pink-600"   },
  { bg: "bg-amber-100",  text: "text-amber-600"  },
  { bg: "bg-emerald-100",text: "text-emerald-600"},
  { bg: "bg-indigo-100", text: "text-indigo-600" },
]

// ── Skeleton ──────────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden flex animate-pulse min-h-[160px]">
    <div className="w-[140px] flex-shrink-0 bg-gray-100 dark:bg-gray-700" />
    <div className="flex-1 p-4 space-y-3">
      <div className="h-5 w-16 bg-gray-100 dark:bg-gray-700 rounded-full" />
      <div className="h-4 w-3/4 bg-gray-100 dark:bg-gray-700 rounded-full" />
      <div className="h-3 w-1/3 bg-gray-100 dark:bg-gray-700 rounded-full" />
      <div className="space-y-1.5 pt-1">
        <div className="h-3 w-full  bg-gray-100 dark:bg-gray-700 rounded-full" />
        <div className="h-3 w-5/6  bg-gray-100 dark:bg-gray-700 rounded-full" />
        <div className="h-3 w-4/6  bg-gray-100 dark:bg-gray-700 rounded-full" />
      </div>
    </div>
  </div>
)

// ── No Results Card ───────────────────────────────────────────────────────────
const NoResultsCard = ({ searchInput, categoryId, onClear }) => (
  <div className="col-span-full flex items-center justify-center py-10">
    <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl border border-gray-100 dark:border-gray-700
      shadow-lg px-12 py-10 flex flex-col items-center text-center max-w-sm w-full">
      {/* Icon */}
      <div className="w-20 h-20 rounded-full bg-indigo-100 dark:bg-indigo-900/40
        flex items-center justify-center mb-6">
        <Search size={34} className="text-indigo-500 dark:text-indigo-400" strokeWidth={2} />
      </div>
      <h3 className="text-xl font-black text-gray-900 dark:text-white mb-3">
        No Results Found
      </h3>
      <p className="text-sm text-gray-400 dark:text-gray-500 leading-relaxed mb-7">
        {searchInput
          ? `Sorry, we couldn't find any books matching your search. Please try a different query.`
          : "There are no books in this category yet."}
      </p>
      {(searchInput || categoryId) && (
        <button
          onClick={onClear}
          className="px-8 py-3 rounded-full bg-indigo-600 hover:bg-indigo-700
            text-white text-sm font-bold transition-all shadow-md shadow-indigo-200 dark:shadow-indigo-900/50"
        >
          Clear Search
        </button>
      )}
    </div>
  </div>
)

// ── Book Card ─────────────────────────────────────────────────────────────────
const BookCard = ({ book, colorIdx = 0, bookmarkedIds, onToggleBookmark, pendingIds = new Set() }) => {
  const navigate = useNavigate()
  const { bg, text } = BADGE_COLORS[colorIdx % BADGE_COLORS.length]

  const isSaved   = bookmarkedIds?.includes(book.id) ?? false
  const isPending = pendingIds.has(book.id)
  const category  = book.categories?.[0]?.name ?? book.category?.name ?? book.category ?? "General"
  const author    = book.author ?? (book.author_id ? `Author #${book.author_id}` : null)
  const desc      = book.description ?? "No description available."
  const thumb     = book.thumbnail ?? null

  return (
    <div
      onClick={() => navigate(`/books/${book.id}`)}
      className="group relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700
        overflow-hidden flex cursor-pointer hover:shadow-xl dark:hover:shadow-gray-900/50
        hover:-translate-y-0.5 transition-all duration-300 min-h-[160px]"
    >
      <div className="w-[140px] flex-shrink-0 overflow-hidden bg-gray-100 dark:bg-gray-700">
        {thumb ? (
          <img src={thumb} alt={book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100
            dark:from-indigo-900/40 dark:to-purple-900/40 flex items-center justify-center">
            <span className="text-4xl select-none">📚</span>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0 p-4 flex flex-col justify-between">
        <div>
          <span className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full mb-2 ${bg} ${text}`}>
            {category}
          </span>
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-0.5 line-clamp-2 leading-snug
            group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {book.title}
          </h3>
          {author && (
            <p className="text-[11px] text-gray-400 dark:text-gray-500 mb-2">by {author}</p>
          )}
          <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed line-clamp-3">
            {desc}
          </p>
        </div>
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); if (!isPending) onToggleBookmark(book.id, isSaved) }}
        disabled={isPending}
        className={`absolute bottom-3 right-3 w-7 h-7 rounded-lg border flex items-center justify-center transition-all
          ${isPending
            ? "border-gray-200 dark:border-gray-600 opacity-50 cursor-wait"
            : isSaved
              ? "border-indigo-300 dark:border-indigo-600 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-500"
              : "border-gray-200 dark:border-gray-600 text-gray-300 dark:text-gray-600 hover:border-indigo-200 hover:text-indigo-400"
          }`}
        title={isSaved ? "Remove bookmark" : "Save bookmark"}
      >
        {isPending
          ? <div className="w-3 h-3 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin" />
          : <Bookmark size={12} className={isSaved ? "fill-indigo-500" : ""} />
        }
      </button>
    </div>
  )
}

// ── Pagination ────────────────────────────────────────────────────────────────
const Pagination = ({ page, totalPages, onChange }) => {
  if (!totalPages || totalPages <= 1) return null
  const start = Math.max(1, Math.min(page - 2, totalPages - 4))
  const end   = Math.min(start + 4, totalPages)
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i)

  return (
    <div className="flex items-center justify-center gap-2 mt-12 pb-10">
      <button
        onClick={() => onChange(page - 1)} disabled={page === 1}
        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700
          text-sm font-semibold text-gray-500 dark:text-gray-400
          hover:border-indigo-400 hover:text-indigo-600 dark:hover:border-indigo-500 dark:hover:text-indigo-400
          disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft size={15} /> Back
      </button>
      {pages.map((p) => (
        <button key={p} onClick={() => onChange(p)}
          className={`w-10 h-10 rounded-xl text-sm font-bold transition-all
            ${page === p
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/60"
              : "border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-indigo-400 hover:text-indigo-600 dark:hover:border-indigo-500 dark:hover:text-indigo-400"
            }`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onChange(page + 1)} disabled={page >= totalPages}
        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700
          text-sm font-semibold text-gray-500 dark:text-gray-400
          hover:border-indigo-400 hover:text-indigo-600 dark:hover:border-indigo-500 dark:hover:text-indigo-400
          disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        Next <ChevronRight size={15} />
      </button>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function LibraryPage() {
  const [page,        setPage]        = useState(1)
  const [categoryId,  setCategoryId]  = useState(null)
  const [searchInput, setSearchInput] = useState("")
  const [showAll,     setShowAll]     = useState(false)

  const { data: categoriesRaw = [] } = useGetCategoriesQuery()
  const categories = Array.isArray(categoriesRaw)
    ? categoriesRaw
    : categoriesRaw?.categories ?? categoriesRaw?.data ?? []

  const { data: trendingBooks = [], isLoading: trendLoad } = useGetAllBooksQuery({
    page: 1, limit: TRENDING_LIMIT,
  })

  const { data: exploreData, isLoading: exploreLoad } = useGetBooksQuery({
    page,
    limit: EXPLORE_LIMIT,
    ...(categoryId ? { category_id: categoryId } : {}),
  })

  const exploreBooks = exploreData?.items ?? exploreData?.data ?? []
  const total        = exploreData?.total ?? exploreData?.total_count ?? 0
  const totalPages   = exploreData?.total_pages
    ?? exploreData?.totalPages
    ?? exploreData?.last_page
    ?? (total > 0 ? Math.ceil(total / EXPLORE_LIMIT) : 0)

  const { data: bookmarkedIds = [] } = useGetMyBookmarksQuery()
  const [addBookmark]                = useAddBookmarkMutation()
  const [removeBookmark]             = useRemoveBookmarkMutation()

  const handleToggleBookmark = async (bookId, isSaved) => {
    try {
      if (isSaved) await removeBookmark(bookId).unwrap()
      else         await addBookmark(bookId).unwrap()
    } catch { /* silently ignore */ }
  }

  const filtered = useMemo(() => {
    const q = searchInput.trim().toLowerCase()
    if (!q) return exploreBooks
    return exploreBooks.filter((b) =>
      b.title?.toLowerCase().includes(q) ||
      b.description?.toLowerCase().includes(q)
    )
  }, [exploreBooks, searchInput])

  const handleCategory   = (id) => { setCategoryId(id); setPage(1); setSearchInput("") }
  const clearSearch      = ()   => { setSearchInput(""); setPage(1) }
  const handlePageChange = (p)  => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }) }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">

      {/* ════ TOP TRENDING ════ */}
      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="flex items-center justify-between mb-7">
          <h2 className="text-2xl font-black">
            <span style={{ color: "#E91E8C" }}>Top Trending</span>{" "}
            <span className="text-indigo-700 dark:text-indigo-400">Books</span>
          </h2>
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-5 py-2.5 rounded-full bg-indigo-700 dark:bg-indigo-600 text-white text-sm font-bold
              hover:bg-indigo-800 transition-all shadow-md shadow-indigo-200 dark:shadow-indigo-900/50"
          >
            {showAll ? "Show less" : "See more"}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {trendLoad
            ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
            : (showAll ? trendingBooks : trendingBooks.slice(0, 3)).map((book, i) => (
                <BookCard
                  key={book.id} book={book} colorIdx={i}
                  bookmarkedIds={bookmarkedIds}
                  onToggleBookmark={handleToggleBookmark}
                />
              ))
          }
        </div>
      </div>

      {/* ════ EXPLORE ALL ════ */}
      <div className="max-w-6xl mx-auto px-8 pb-6">
        <h2 className="text-3xl font-black text-gray-900 dark:text-white text-center mb-8">
          Explore All Books Here
        </h2>

        {/* Search */}
        <div className="flex justify-center mb-6">
          <div className="relative w-full max-w-md">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text" value={searchInput}
              onChange={(e) => { setSearchInput(e.target.value); setPage(1) }}
              placeholder="Search books…"
              className="w-full pl-10 pr-10 py-3 rounded-full border-2 border-gray-200 dark:border-gray-700
                bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-100
                placeholder-gray-400 outline-none focus:border-indigo-400 transition-all"
            />
            {searchInput && (
              <button onClick={clearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          <button onClick={() => handleCategory(null)}
            className={`px-5 py-2 rounded-full text-sm font-bold border-2 transition-all
              ${categoryId === null
                ? "bg-indigo-700 dark:bg-indigo-600 text-white border-indigo-700"
                : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-indigo-300 hover:text-indigo-600"
              }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button key={cat.id} onClick={() => handleCategory(cat.id)}
              className={`px-5 py-2 rounded-full text-sm font-bold border-2 transition-all
                ${categoryId === cat.id
                  ? "bg-indigo-700 dark:bg-indigo-600 text-white border-indigo-700"
                  : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-indigo-300 hover:text-indigo-600"
                }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Search result message */}
        {searchInput && (
          <p className="text-sm text-gray-400 dark:text-gray-500 text-center mb-6">
            {filtered.length > 0 ? (
              <>
                Found{" "}
                <span className="font-bold text-indigo-600 dark:text-indigo-400">{filtered.length}</span>{" "}
                result{filtered.length !== 1 ? "s" : ""} for{" "}
                <span className="font-bold text-gray-700 dark:text-gray-300">"{searchInput}"</span>
              </>
            ) : (
              <>
                No results found for{" "}
                <span className="font-bold text-gray-700 dark:text-gray-300">"{searchInput}"</span>
              </>
            )}
          </p>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {exploreLoad
            ? Array.from({ length: EXPLORE_LIMIT }).map((_, i) => <SkeletonCard key={i} />)
            : filtered.length === 0
              ? (
                <NoResultsCard
                  searchInput={searchInput}
                  categoryId={categoryId}
                  onClear={() => { clearSearch(); handleCategory(null) }}
                />
              )
              : filtered.map((book, i) => (
                  <BookCard
                    key={book.id} book={book} colorIdx={i}
                    bookmarkedIds={bookmarkedIds}
                    onToggleBookmark={handleToggleBookmark}
                  />
                ))
          }
        </div>

        {/* Pagination */}
        {!exploreLoad && !searchInput && (
          <Pagination
            page={page}
            totalPages={totalPages}
            onChange={handlePageChange}
          />
        )}
      </div>
    </div>
  )
}