import { useNavigate } from "react-router-dom"
import { Bookmark } from "lucide-react"
import {
  useGetAllBooksQuery,
  useGetMyBookmarksQuery,
  useAddBookmarkMutation,
  useRemoveBookmarkMutation,
} from "../../features/books/booksAPI"

const TRENDING_LIMIT = 6

const BADGE_COLORS = [
  { bg: "bg-purple-100", text: "text-purple-600" },
  { bg: "bg-sky-100",    text: "text-sky-600"    },
  { bg: "bg-pink-100",   text: "text-pink-600"   },
  { bg: "bg-amber-100",  text: "text-amber-600"  },
  { bg: "bg-emerald-100",text: "text-emerald-600"},
  { bg: "bg-indigo-100", text: "text-indigo-600" },
]

const SkeletonCard = () => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden flex animate-pulse min-h-[160px]">
    <div className="w-[140px] flex-shrink-0 bg-gray-100 dark:bg-gray-700" />
    <div className="flex-1 p-4 space-y-3">
      <div className="h-5 w-16 bg-gray-100 dark:bg-gray-700 rounded-full" />
      <div className="h-4 w-3/4 bg-gray-100 dark:bg-gray-700 rounded-full" />
      <div className="h-3 w-1/3 bg-gray-100 dark:bg-gray-700 rounded-full" />
      <div className="space-y-1.5 pt-1">
        <div className="h-3 w-full bg-gray-100 dark:bg-gray-700 rounded-full" />
        <div className="h-3 w-5/6 bg-gray-100 dark:bg-gray-700 rounded-full" />
        <div className="h-3 w-4/6 bg-gray-100 dark:bg-gray-700 rounded-full" />
      </div>
    </div>
  </div>
)

const BookCard = ({ book, colorIdx = 0, bookmarkedIds, onToggleBookmark }) => {
  const navigate = useNavigate()
  const { bg, text } = BADGE_COLORS[colorIdx % BADGE_COLORS.length]

  const isSaved  = bookmarkedIds?.includes(book.id) ?? false
  const category = book.categories?.[0]?.name ?? book.category?.name ?? book.category ?? "General"
  const author   = book.author ?? (book.author_id ? `Author #${book.author_id}` : null)
  const desc     = book.description ?? "No description available."
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
          <img
            src={thumb}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
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
        onClick={(e) => { e.stopPropagation(); onToggleBookmark(book.id, isSaved) }}
        className={`absolute bottom-3 right-3 w-7 h-7 rounded-lg border flex items-center justify-center transition-all
          ${isSaved
            ? "border-indigo-300 dark:border-indigo-600 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-500"
            : "border-gray-200 dark:border-gray-600 text-gray-300 dark:text-gray-600 hover:border-indigo-200 hover:text-indigo-400"
          }`}
        title={isSaved ? "Remove bookmark" : "Bookmark"}
      >
        <Bookmark size={12} className={isSaved ? "fill-indigo-500" : ""} />
      </button>
    </div>
  )
}

export default function TrendingBooks() {
  const { data: trendingBooks = [], isLoading: trendLoad } = useGetAllBooksQuery({
    page: 1,
    limit: TRENDING_LIMIT,
  })

  const { data: bookmarkedIds = [] } = useGetMyBookmarksQuery()
  const [addBookmark]                = useAddBookmarkMutation()
  const [removeBookmark]             = useRemoveBookmarkMutation()

  const handleToggleBookmark = async (bookId, isSaved) => {
    try {
      if (isSaved) {
        await removeBookmark(bookId).unwrap()
      } else {
        await addBookmark(bookId).unwrap()
      }
    } catch {}
  }

  return (
    <div className="max-w-6xl mx-auto px-8 py-12">
      <h2 className="text-2xl font-black mb-7">
        <span style={{ color: "#E91E8C" }}>Top Trending</span>{" "}
        <span className="text-indigo-700 dark:text-indigo-400">Books</span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {trendLoad
          ? Array.from({ length: TRENDING_LIMIT }).map((_, i) => <SkeletonCard key={i} />)
          : trendingBooks.map((book, i) => (
              <BookCard
                key={book.id}
                book={book}
                colorIdx={i}
                bookmarkedIds={bookmarkedIds}
                onToggleBookmark={handleToggleBookmark}
              />
            ))
        }
      </div>
    </div>
  )
}