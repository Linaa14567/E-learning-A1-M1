import { useState, useEffect } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { ChevronRight, ArrowLeft, Loader2 } from "lucide-react"
import { useGetBookByIdQuery, useGetBooksQuery } from "../../features/books/booksAPI"
import { useGetTeacherInfoQuery } from "../../features/users/userSlice"
import BookDetailsPdf from "./BookDetailsPdf"

// ── Related Book Card — matches BookCard style ────────────────────────────────
const RelatedCard = ({ book }) => {
  const navigate                    = useNavigate()
  const [bookmarked, setBookmarked] = useState(false)

  const thumb    = book.thumbnail ?? book.thumbnail_url ?? null
  const author   = book.author ?? book.author_name ?? null
  const category = book.categories?.[0]?.name ?? book.category ?? null

  return (
    <div
      onClick={() => navigate(`/books/${book.id}`)}
      className="flex flex-row gap-3 rounded-xl p-3 shadow-md border border-gray-100
        dark:border-gray-700 hover:shadow-lg transition-shadow cursor-pointer
        w-full h-[180px] mb-4 bg-white dark:bg-gray-800"
    >
      {/* Book Cover */}
      <div className="shrink-0 w-[120px] h-full rounded-lg overflow-hidden shadow-sm bg-gray-100 dark:bg-gray-700">
        {thumb ? (
          <img
            src={thumb}
            alt={book.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100
            dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center">
            <span className="text-4xl">📚</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 gap-1.5 relative overflow-hidden py-1 min-w-0">
        {/* Category Badge */}
        {category && (
          <span className="w-fit bg-purple-100 text-purple-500 text-xs font-semibold px-2 py-0.5 rounded-full">
            {category}
          </span>
        )}

        {/* Title */}
        <h4 className="text-gray-900 dark:text-white font-bold text-sm leading-tight line-clamp-2">
          {book.title}
        </h4>

        {/* Author */}
        {author && (
          <p className="text-xs text-gray-500 dark:text-gray-400">by {author}</p>
        )}

        {/* Description */}
        {book.description && (
          <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed line-clamp-3">
            {book.description}
          </p>
        )}

        {/* Bookmark Icon */}
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setBookmarked((b) => !b)
          }}
          className="absolute bottom-0 right-0 p-1 transition-transform duration-150 hover:scale-110"
          title={bookmarked ? "Remove bookmark" : "Bookmark"}
        >
          <svg
            className={`w-5 h-5 transition-colors duration-200 ${
              bookmarked ? "fill-[#1e2a6e] stroke-[#1e2a6e]" : "fill-none stroke-gray-400"
            }`}
            strokeWidth="1.8"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 3h14a1 1 0 0 1 1 1v17l-8-4-8 4V4a1 1 0 0 1 1-1z"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function BookDetail() {
  const { id }   = useParams()
  const navigate = useNavigate()

  // ── Fetch the book ─────────────────────────────────────────────────────────
  const {
    data: book,
    isLoading: bookLoading,
    isError,
  } = useGetBookByIdQuery(id)

  // ── Fetch author info ──────────────────────────────────────────────────────
  const {
    data: authorData,
    isLoading: authorLoading,
  } = useGetTeacherInfoQuery(book?.author_id, {
    skip: !book?.author_id,
  })

  const authorName   = authorData?.full_name   ?? "Unknown Author"
  const authorAvatar = authorData?.profile_url ?? null

  // ── Related books ──────────────────────────────────────────────────────────
  const { data: relatedRaw } = useGetBooksQuery(
    { page: 1, limit: 20 },
    { skip: !book }
  )

  const [relatedBooks, setRelatedBooks] = useState([])

  useEffect(() => {
    if (!book || !relatedRaw) { setRelatedBooks([]); return }

    const allBooks = Array.isArray(relatedRaw)
      ? relatedRaw
      : relatedRaw?.items ?? relatedRaw?.data ?? relatedRaw?.books ?? []

    const currentCatIds = new Set(
      (book.category_ids ?? []).map((id) => String(id))
    )

    if (currentCatIds.size === 0) {
      setRelatedBooks(allBooks.filter((b) => String(b.id) !== String(book.id)).slice(0, 5))
      return
    }

    const filtered = allBooks.filter((b) => {
      if (String(b.id) === String(book.id)) return false
      return (b.category_ids ?? []).some((id) => currentCatIds.has(String(id)))
    })

    setRelatedBooks(filtered.slice(0, 5))
  }, [book, relatedRaw])

  // ── Loading ────────────────────────────────────────────────────────────────
  if (bookLoading || authorLoading) return (
    <div className="fixed inset-0 flex justify-center items-center bg-white dark:bg-gray-900 z-50">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="animate-spin text-blue-500" size={48} />
        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Loading…</p>
      </div>
    </div>
  )

  if (isError) return (
    <p className="text-center mt-10 text-red-500 font-medium">
      Failed to load book. Please try again.
    </p>
  )

  if (!book) return (
    <p className="text-center mt-10 text-gray-500">Book not found.</p>
  )

  const thumb        = book.thumbnail ?? book.thumbnail_url ?? null
  const categoryName = book.categories?.[0]?.name ?? null

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen py-8 px-6 md:px-10">
      <div className="max-w-6xl mx-auto">

        {/* ── Breadcrumb ── */}
        <div className="mb-8 flex items-center gap-2 text-sm flex-wrap">
          <Link to="/library"
            className="text-blue-700 dark:text-blue-400 hover:underline font-medium">
            Library
          </Link>
          <ChevronRight size={14} className="text-gray-400" />
          {categoryName && (
            <>
              <span className="text-blue-700 dark:text-blue-400 font-medium">{categoryName}</span>
              <ChevronRight size={14} className="text-gray-400" />
            </>
          )}
          <span className="text-amber-500 font-medium truncate max-w-[240px]">{book.title}</span>
        </div>

        {/* ── Back button ── */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full
            bg-blue-900 text-white text-sm font-semibold
            hover:bg-blue-800 transition mb-10 shadow-sm"
        >
          <ArrowLeft size={14} /> Back
        </button>

        {/* ── Two-column grid ── */}
        <div className="grid grid-cols-12 gap-12">

          {/* ════ LEFT — 7 cols ════ */}
          <div className="col-span-12 lg:col-span-7">

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white leading-tight mb-6">
              {book.title}
            </h1>

            {/* Cover image */}
            <div className="mb-6 w-[240px]">
              {thumb ? (
                <img
                  src={thumb}
                  alt={book.title}
                  className="w-full rounded-lg object-cover shadow-md border border-gray-100 dark:border-gray-700"
                />
              ) : (
                <div className="w-full aspect-[3/4] rounded-lg bg-gradient-to-br
                  from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30
                  flex items-center justify-center shadow-md">
                  <span className="text-6xl">📚</span>
                </div>
              )}
            </div>

            {/* Author */}
            <div className="flex items-center gap-2 mb-1">
              {authorAvatar ? (
                <img src={authorAvatar} alt={authorName}
                  className="w-7 h-7 rounded-full object-cover border border-gray-200" />
              ) : null}
              <p className="text-sm text-gray-500 dark:text-gray-400">
                by <span className="font-semibold text-gray-700 dark:text-gray-300">{authorName}</span>
              </p>
            </div>

            {/* Upload date */}
            {book.uploaded_at && (
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-8">
                {new Date(book.uploaded_at).toLocaleDateString("en-US", {
                  year: "numeric", month: "long", day: "numeric",
                })}
              </p>
            )}

            {/* Description */}
            <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed mb-10">
              {book.description || "No description available."}
            </p>

            {/* PDF Viewer */}
            <BookDetailsPdf fileUrl={book.file_url} />
          </div>

          {/* ════ RIGHT — 5 cols ════ */}
          <aside className="col-span-12 lg:col-span-5 pt-1">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-4">
              Related Books
            </h2>

            {relatedBooks.length === 0 ? (
              <p className="text-gray-400 dark:text-gray-500 text-sm pt-4">
                No related books found.
              </p>
            ) : (
              <div className="flex flex-col">
                {relatedBooks.slice(0, 2).map((b) => (
                  <RelatedCard key={b.id} book={b} />
                ))}
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  )
}

// import { useState, useEffect } from "react"
// import { Link, useParams, useNavigate } from "react-router-dom"
// import { ChevronRight, ArrowLeft, Loader2 } from "lucide-react"
// import { useGetBookByIdQuery, useGetBooksQuery } from "../../features/books/booksAPI"
// import { useGetTeacherInfoQuery } from "../../features/users/userSlice"
// import BookDetailsPdf from "./BookDetailsPdf"

// // ── Related Book Card — matches screenshot style ───────────────────────────────
// const RelatedCard = ({ book }) => {
//   const navigate = useNavigate()
//   const thumb    = book.thumbnail ?? book.thumbnail_url ?? null
//   const author   = book.author ?? book.author_name ?? null

//   return (
//     <div
//       onClick={() => navigate(`/books/${book.id}`)}
//       className="flex gap-4 cursor-pointer group py-5 border-b border-gray-100
//         dark:border-gray-700/50 last:border-0"
//     >
//       {/* Portrait thumbnail */}
//       <div className="flex-shrink-0 w-[70px] h-[95px] rounded overflow-hidden
//         bg-gray-100 dark:bg-gray-700 shadow-sm">
//         {thumb ? (
//           <img
//             src={thumb}
//             alt={book.title}
//             className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
//           />
//         ) : (
//           <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100
//             dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center">
//             <span className="text-2xl">📚</span>
//           </div>
//         )}
//       </div>

//       {/* Info */}
//       <div className="flex-1 min-w-0">
//         <h4 className="text-sm font-bold text-gray-900 dark:text-white leading-snug mb-1
//           group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
//           {book.title}
//         </h4>
//         {author && (
//           <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
//             By {author}
//           </p>
//         )}
//         {book.description && (
//           <p className="text-xs text-gray-400 dark:text-gray-500 line-clamp-3 leading-relaxed">
//             {book.description}
//           </p>
//         )}
//       </div>
//     </div>
//   )
// }

// // ── Main ──────────────────────────────────────────────────────────────────────
// export default function BookDetail() {
//   const { id }   = useParams()
//   const navigate = useNavigate()

//   // ── Fetch the book ─────────────────────────────────────────────────────────
//   const {
//     data: book,
//     isLoading: bookLoading,
//     isError,
//   } = useGetBookByIdQuery(id)

//   // ── Fetch author info ──────────────────────────────────────────────────────
//   const {
//     data: authorData,
//     isLoading: authorLoading,
//   } = useGetTeacherInfoQuery(book?.author_id, {
//     skip: !book?.author_id,
//   })

//   const authorName   = authorData?.full_name   ?? "Unknown Author"
//   const authorAvatar = authorData?.profile_url ?? null

//   // ── Related books ──────────────────────────────────────────────────────────
//   const { data: relatedRaw } = useGetBooksQuery(
//     { page: 1, limit: 20 },
//     { skip: !book }
//   )

//   const [relatedBooks, setRelatedBooks] = useState([])

//   useEffect(() => {
//     if (!book || !relatedRaw) { setRelatedBooks([]); return }

//     const allBooks = Array.isArray(relatedRaw)
//       ? relatedRaw
//       : relatedRaw?.items ?? relatedRaw?.data ?? relatedRaw?.books ?? []

//     const currentCatIds = new Set(
//       (book.category_ids ?? []).map((id) => String(id))
//     )

//     if (currentCatIds.size === 0) {
//       setRelatedBooks(allBooks.filter((b) => String(b.id) !== String(book.id)).slice(0, 5))
//       return
//     }

//     const filtered = allBooks.filter((b) => {
//       if (String(b.id) === String(book.id)) return false
//       return (b.category_ids ?? []).some((id) => currentCatIds.has(String(id)))
//     })

//     setRelatedBooks(filtered.slice(0, 5))
//   }, [book, relatedRaw])

//   // ── Loading ────────────────────────────────────────────────────────────────
//   if (bookLoading || authorLoading) return (
//     <div className="fixed inset-0 flex justify-center items-center bg-white dark:bg-gray-900 z-50">
//       <div className="flex flex-col items-center gap-3">
//         <Loader2 className="animate-spin text-blue-500" size={48} />
//         <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Loading…</p>
//       </div>
//     </div>
//   )

//   if (isError) return (
//     <p className="text-center mt-10 text-red-500 font-medium">
//       Failed to load book. Please try again.
//     </p>
//   )

//   if (!book) return (
//     <p className="text-center mt-10 text-gray-500">Book not found.</p>
//   )

//   const thumb        = book.thumbnail ?? book.thumbnail_url ?? null
//   const categoryName = book.categories?.[0]?.name ?? null

//   return (
//     <div className="bg-white dark:bg-gray-900 min-h-screen py-8 px-6 md:px-10">
//       <div className="max-w-6xl mx-auto">

//         {/* ── Breadcrumb ── */}
//         <div className="mb-8 flex items-center gap-2 text-sm flex-wrap">
//           <Link to="/library"
//             className="text-blue-700 dark:text-blue-400 hover:underline font-medium">
//             Library
//           </Link>
//           <ChevronRight size={14} className="text-gray-400" />
//           {categoryName && (
//             <>
//               <span className="text-blue-700 dark:text-blue-400 font-medium">{categoryName}</span>
//               <ChevronRight size={14} className="text-gray-400" />
//             </>
//           )}
//           <span className="text-amber-500 font-medium truncate max-w-[240px]">{book.title}</span>
//         </div>

//         {/* ── Back button ── */}
//         <button
//           onClick={() => navigate(-1)}
//           className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full
//             bg-blue-900 text-white text-sm font-semibold
//             hover:bg-blue-800 transition mb-10 shadow-sm"
//         >
//           <ArrowLeft size={14} /> Back
//         </button>

//         {/* ── Two-column grid ── */}
//         <div className="grid grid-cols-12 gap-12">

//           {/* ════ LEFT — 7 cols ════ */}
//           <div className="col-span-12 lg:col-span-7">

//             {/* Title */}
//             <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white leading-tight mb-6">
//               {book.title}
//             </h1>

//             {/* Cover image */}
//             <div className="mb-6 w-[240px]">
//               {thumb ? (
//                 <img
//                   src={thumb}
//                   alt={book.title}
//                   className="w-full rounded-lg object-cover shadow-md border border-gray-100 dark:border-gray-700"
//                 />
//               ) : (
//                 <div className="w-full aspect-[3/4] rounded-lg bg-gradient-to-br
//                   from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30
//                   flex items-center justify-center shadow-md">
//                   <span className="text-6xl">📚</span>
//                 </div>
//               )}
//             </div>

//             {/* Author */}
//             <div className="flex items-center gap-2 mb-1">
//               {authorAvatar ? (
//                 <img src={authorAvatar} alt={authorName}
//                   className="w-7 h-7 rounded-full object-cover border border-gray-200" />
//               ) : null}
//               <p className="text-sm text-gray-500 dark:text-gray-400">
//                 by <span className="font-semibold text-gray-700 dark:text-gray-300">{authorName}</span>
//               </p>
//             </div>

//             {/* Upload date */}
//             {book.uploaded_at && (
//               <p className="text-xs text-gray-400 dark:text-gray-500 mb-8">
//                 {new Date(book.uploaded_at).toLocaleDateString("en-US", {
//                   year: "numeric", month: "long", day: "numeric",
//                 })}
//               </p>
//             )}

//             {/* Description */}
//             <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed mb-10">
//               {book.description || "No description available."}
//             </p>

//             {/* PDF Viewer */}
//             <BookDetailsPdf fileUrl={book.file_url} />
//           </div>

//           {/* ════ RIGHT — 5 cols ════ */}
//           <aside className="col-span-12 lg:col-span-5 pt-1">
//             <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
//               Related Books
//             </h2>

//             {relatedBooks.length === 0 ? (
//               <p className="text-gray-400 dark:text-gray-500 text-sm pt-4">
//                 No related books found.
//               </p>
//             ) : (
//               <div className="flex flex-col">
//                 {relatedBooks.slice(0, 3).map((b) => (
//                   <RelatedCard key={b.id} book={b} />
//                 ))}
//               </div>
//             )}
//           </aside>
//         </div>
//       </div>
//     </div>
//   )
// }