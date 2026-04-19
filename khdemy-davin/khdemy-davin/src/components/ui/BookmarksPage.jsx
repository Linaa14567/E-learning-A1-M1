import { useNavigate } from "react-router-dom"
import { Bookmark, BookOpen, Search, X } from "lucide-react"
import { useState, useEffect } from "react"
import {
  useGetMyBookmarksQuery,
  useGetBookByIdQuery,
  useRemoveBookmarkMutation,
} from "../../features/books/booksAPI"

const BADGE_COLORS = [
  { bg: "bg-purple-100", text: "text-purple-600" },
  { bg: "bg-sky-100",    text: "text-sky-600"    },
  { bg: "bg-pink-100",   text: "text-pink-600"   },
  { bg: "bg-amber-100",  text: "text-amber-600"  },
  { bg: "bg-emerald-100",text: "text-emerald-600"},
  { bg: "bg-indigo-100", text: "text-indigo-600" },
]

const SkeletonCard = () => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700
    overflow-hidden flex animate-pulse min-h-[160px]">
    <div className="w-[140px] flex-shrink-0 bg-gray-100 dark:bg-gray-700" />
    <div className="flex-1 p-4 space-y-3">
      <div className="h-5 w-16 bg-gray-100 dark:bg-gray-700 rounded-full" />
      <div className="h-4 w-3/4 bg-gray-100 dark:bg-gray-700 rounded-full" />
      <div className="h-3 w-1/3 bg-gray-100 dark:bg-gray-700 rounded-full" />
      <div className="space-y-1.5 pt-1">
        <div className="h-3 w-full bg-gray-100 dark:bg-gray-700 rounded-full" />
        <div className="h-3 w-5/6 bg-gray-100 dark:bg-gray-700 rounded-full" />
      </div>
    </div>
  </div>
)

const BookCard = ({ book, colorIdx = 0, onRemove, isPending }) => {
  const navigate = useNavigate()
  const { bg, text } = BADGE_COLORS[colorIdx % BADGE_COLORS.length]
  const category = book.categories?.[0]?.name ?? book.category?.name ?? "General"
  const author   = book.author ?? (book.author_id ? `Author #${book.author_id}` : null)
  const thumb    = book.thumbnail ?? null

  return (
    <div
      onClick={() => navigate(`/books/${book.id}`)}
      className="group relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-100
        dark:border-gray-700 overflow-hidden flex cursor-pointer
        hover:shadow-xl dark:hover:shadow-gray-900/50
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
          {author && <p className="text-[11px] text-gray-400 dark:text-gray-500 mb-2">by {author}</p>}
          <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed line-clamp-3">
            {book.description ?? "No description available."}
          </p>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); navigate(`/books/${book.id}`) }}
          className="mt-3 self-start flex items-center gap-1.5 px-3 py-1.5 rounded-lg
            bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400
            text-xs font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-all"
        >
          <BookOpen size={12} /> Read now
        </button>
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onRemove(book.id) }}
        disabled={isPending}
        className={`absolute top-3 right-3 w-7 h-7 rounded-lg border flex items-center justify-center transition-all
          ${isPending
            ? "opacity-50 cursor-wait border-gray-200 dark:border-gray-600"
            : "border-indigo-300 dark:border-indigo-600 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-500 hover:bg-red-50 hover:border-red-300 hover:text-red-400 dark:hover:bg-red-900/30 dark:hover:border-red-500 dark:hover:text-red-400"
          }`}
        title="Remove bookmark"
      >
        {isPending
          ? <div className="w-3 h-3 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin" />
          : <Bookmark size={12} className="fill-indigo-500" />
        }
      </button>
    </div>
  )
}

// Fetches one book, reports match status to parent via onMatch callback
const BookCardFetcher = ({ bookId, colorIdx, onRemove, isPending, search, onMatch }) => {
  const { data: book, isLoading, isError } = useGetBookByIdQuery(bookId)

  const matches = (() => {
    if (!book || isLoading || isError) return false
    if (!search) return true
    const q = search.toLowerCase()
    return (
      book.title?.toLowerCase().includes(q) ||
      book.description?.toLowerCase().includes(q) ||
      book.categories?.[0]?.name?.toLowerCase().includes(q) ||
      (book.author ?? "").toLowerCase().includes(q)
    )
  })()

  // Report match status up to parent
  useEffect(() => {
    if (!isLoading && !isError && book) {
      onMatch(bookId, matches)
    }
  }, [bookId, matches, isLoading, isError, book])

  if (isLoading) return <SkeletonCard />
  if (isError || !book || !matches) return null

  return <BookCard book={book} colorIdx={colorIdx} onRemove={onRemove} isPending={isPending} />
}

// ── No Results card — matches the screenshot exactly ─────────────────────────
const NoResultsCard = ({ isFiltered, onClear, onBrowse }) => (
  <div className="col-span-full flex items-center justify-center py-16">
    <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl border border-gray-100
      dark:border-gray-700 shadow-lg px-12 py-10 flex flex-col items-center text-center max-w-sm w-full">
      {/* Icon circle */}
      <div className="w-20 h-20 rounded-full bg-indigo-100 dark:bg-indigo-900/40
        flex items-center justify-center mb-6">
        <Search size={34} className="text-indigo-500 dark:text-indigo-400" strokeWidth={2} />
      </div>
      <h3 className="text-xl font-black text-gray-900 dark:text-white mb-3">
        No Results Found
      </h3>
      <p className="text-sm text-gray-400 dark:text-gray-500 leading-relaxed mb-7">
        {isFiltered
          ? "Sorry, we couldn't find any bookmarks matching your search. Please try a different query."
          : "You haven't saved any books yet. Browse the library to find books to bookmark."}
      </p>
      <button
        onClick={isFiltered ? onClear : onBrowse}
        className="px-8 py-3 rounded-full bg-indigo-600 hover:bg-indigo-700
          text-white text-sm font-bold transition-all shadow-md shadow-indigo-200
          dark:shadow-indigo-900/50"
      >
        {isFiltered ? "Clear Search" : "Browse Books"}
      </button>
    </div>
  </div>
)

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function BookmarksPage() {
  const navigate = useNavigate()
  const [search,      setSearch]      = useState("")
  const [pendingIds,  setPendingIds]  = useState(new Set())
  const [matchMap,    setMatchMap]    = useState({}) // bookId → true/false

  const { data: bookmarkedIds = [], isLoading: idsLoading } = useGetMyBookmarksQuery()
  const [removeBookmark] = useRemoveBookmarkMutation()

  // Reset matchMap when bookmarks or search changes
  useEffect(() => { setMatchMap({}) }, [bookmarkedIds, search])

  const handleRemove = async (bookId) => {
    setPendingIds((prev) => new Set(prev).add(bookId))
    try { await removeBookmark(bookId).unwrap() }
    finally {
      setPendingIds((prev) => { const n = new Set(prev); n.delete(bookId); return n })
    }
  }

  const handleMatch = (bookId, matched) => {
    setMatchMap((prev) => prev[bookId] === matched ? prev : { ...prev, [bookId]: matched })
  }

  const allLoaded     = bookmarkedIds.length > 0 && Object.keys(matchMap).length >= bookmarkedIds.length
  const anyMatch      = Object.values(matchMap).some(Boolean)
  const showNoResults = !idsLoading && allLoaded && !anyMatch
  const showEmpty     = !idsLoading && bookmarkedIds.length === 0

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-6xl mx-auto px-8 py-12">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center
                shadow-lg shadow-indigo-200 dark:shadow-indigo-900/50">
                <Bookmark size={18} className="text-white fill-white" />
              </span>
              My Bookmarks
            </h1>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1 ml-[52px]">
              {idsLoading ? "Loading…" : `${bookmarkedIds.length} saved book${bookmarkedIds.length !== 1 ? "s" : ""}`}
            </p>
          </div>

          {bookmarkedIds.length > 0 && (
            <div className="relative w-full sm:w-72">
              <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text" value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search bookmarks…"
                className="w-full pl-10 pr-10 py-3 rounded-full border-2 border-gray-200 dark:border-gray-700
                  bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-100
                  placeholder-gray-400 outline-none focus:border-indigo-400 transition-all"
              />
              {search && (
                <button onClick={() => setSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X size={14} />
                </button>
              )}
            </div>
          )}
        </div>

        {/* No bookmarks at all */}
        {showEmpty && (
          <NoResultsCard
            isFiltered={false}
            onBrowse={() => navigate("/library")}
            onClear={() => setSearch("")}
          />
        )}

        {/* Grid */}
        {!showEmpty && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {idsLoading
              ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
              : bookmarkedIds.map((id, i) => (
                  <BookCardFetcher
                    key={id}
                    bookId={id}
                    colorIdx={i}
                    onRemove={handleRemove}
                    isPending={pendingIds.has(id)}
                    search={search}
                    onMatch={handleMatch}
                  />
                ))
            }

            {/* No search results card — shown inside grid so col-span-full works */}
            {showNoResults && (
              <NoResultsCard
                isFiltered={!!search}
                onClear={() => setSearch("")}
                onBrowse={() => navigate("/library")}
              />
            )}
          </div>
        )}

      </div>
    </div>
  )
}