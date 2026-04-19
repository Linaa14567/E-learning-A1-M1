import { useParams, useNavigate } from "react-router-dom"
import { useGetBlogByIdQuery } from "../../features/blog/blogApi"
import { useGetProfileQuery } from "../../features/teacher/teacherApi"
import { useState } from "react"
import { ChevronLeft, Heart, MessageCircle, User } from "lucide-react"

const BADGE_COLORS = [
  "bg-indigo-600", "bg-pink-500", "bg-sky-500",
  "bg-amber-500",  "bg-emerald-500", "bg-purple-600",
]

// ── Skeleton ──────────────────────────────────────────────────────────────────
const Skeleton = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
    <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-3xl p-10 shadow-sm animate-pulse space-y-6">
      <div className="h-8 w-2/3 bg-gray-100 dark:bg-gray-700 rounded-xl" />
      <div className="h-4 w-1/3 bg-gray-100 dark:bg-gray-700 rounded-full" />
      <div className="h-72 bg-gray-100 dark:bg-gray-700 rounded-2xl" />
      <div className="space-y-3">
        <div className="h-3 w-full bg-gray-100 dark:bg-gray-700 rounded-full" />
        <div className="h-3 w-5/6 bg-gray-100 dark:bg-gray-700 rounded-full" />
        <div className="h-3 w-4/6 bg-gray-100 dark:bg-gray-700 rounded-full" />
      </div>
    </div>
  </div>
)

// ── Main ──────────────────────────────────────────────────────────────────────
export default function BlogDetail() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const [liked,  setLiked] = useState(false)
  const [likes,  setLikes] = useState(6)

  const { data: blog, isLoading, isError } = useGetBlogByIdQuery(id, { skip: !id })
  const { data: profile } = useGetProfileQuery()

  if (isLoading) return <Skeleton />

  if (isError || !blog) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center gap-4">
      <p className="text-5xl">😕</p>
      <p className="text-sm font-semibold text-gray-400 dark:text-gray-500">Blog not found.</p>
      <button
        onClick={() => navigate(-1)}
        className="mt-2 flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-bold text-sm hover:underline"
      >
        <ChevronLeft size={16} /> Go Back
      </button>
    </div>
  )

  const title     = blog.title         ?? ""
  const content   = blog.content       ?? ""
  const thumb     = blog.thumbnail_url ?? blog.thumbnail ?? null
  const tags      = (blog.tags ?? []).map((t) => typeof t === "string" ? t : t.name ?? "").filter(Boolean)
  const comments  = blog.comments      ?? 12

  const authorName   = blog.author_name ?? blog.author?.name ?? profile?.name ?? "Author"
  const authorAvatar = blog.author?.avatar_url ?? profile?.avatar_url ?? null

  const handleLike = () => {
    setLiked((prev) => !prev)
    setLikes((prev) => liked ? prev - 1 : prev + 1)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">

      {/* ── Back button ── */}
      <div className="max-w-4xl mx-auto px-6 pt-6 pb-2">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-bold text-sm hover:underline transition-all"
        >
          <ChevronLeft size={16} /> Back
        </button>
      </div>

      {/* ── Card ── */}
      <div className="max-w-4xl mx-auto px-6 pb-16">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm dark:shadow-gray-900/30 px-10 py-10">

          {/* ── Title ── */}
          <h1 className="text-3xl font-black text-gray-900 dark:text-gray-100 leading-tight mb-8 max-w-2xl">
            {title}
          </h1>

          {/* ── Author row ── */}
          <div className="flex items-center justify-between mb-7">

            {/* Author */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 overflow-hidden flex items-center justify-center flex-shrink-0">
                {authorAvatar ? (
                  <img src={authorAvatar} alt={authorName} className="w-full h-full object-cover" />
                ) : (
                  <User size={16} className="text-gray-400 dark:text-gray-500" />
                )}
              </div>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{authorName}</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">

              {/* Like */}
              <button onClick={handleLike} className="flex items-center gap-1.5 transition-all">
                <Heart
                  size={18}
                  className="transition-all"
                  style={{
                    color:  liked ? "#ef4444" : "#9ca3af",
                    fill:   liked ? "#ef4444" : "none",
                    stroke: liked ? "#ef4444" : "#9ca3af",
                  }}
                />
                <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">{likes}</span>
              </button>

              {/* Comments */}
              <div className="flex items-center gap-1.5">
                <MessageCircle size={18} className="text-amber-400" />
                <span className="text-sm font-semibold" style={{ color: "#FFC107" }}>
                  {comments}
                </span>
              </div>

              {/* Tags */}
              {tags.map((tag, i) => (
                <span
                  key={i}
                  className={`px-3 py-1 rounded-full text-xs font-bold text-white ${BADGE_COLORS[i % BADGE_COLORS.length]}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* ── Thumbnail ── */}
          {thumb && (
            <div className="w-full rounded-2xl overflow-hidden mb-8 max-w-2xl">
              <img
                src={thumb}
                alt={title}
                className="w-full object-cover max-h-80"
                onError={(e) => { e.currentTarget.style.display = "none" }}
              />
            </div>
          )}

          {/* ── Content ── */}
          <div className="max-w-2xl">
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed text-justify whitespace-pre-wrap">
              {content}
            </p>
          </div>

          {/* ── Divider ── */}
          <div className="border-t border-gray-100 dark:border-gray-700 mt-10" />

        </div>
      </div>
    </div>
  )
}

// import { useEffect } from "react"
// import { useGetBlogByIdQuery } from "../../features/blog/blogApi"
// import { useSelector } from "react-redux"

// function formatDate(iso) {
//   if (!iso) return ""
//   return new Date(iso).toLocaleDateString("en-US", {
//     year: "numeric", month: "short", day: "numeric",
//   })
// }

// const TAG_COLORS = [
//   "bg-indigo-700 text-white",
//   "bg-pink-500 text-white",
//   "bg-sky-500 text-white",
//   "bg-amber-500 text-white",
//   "bg-emerald-500 text-white",
//   "bg-purple-600 text-white",
// ]

// const LEARNINGS = [
//   { left: "Core fundamentals & real-world applications", right: "Advanced patterns & best practices" },
//   { left: "Building production-ready projects",         right: "Debugging & problem solving strategies" },
//   { left: "Integrating with modern APIs & services",    right: "Testing & code quality" },
//   { left: "Deployment strategies",                      right: "Career tips & next steps" },
// ]

// function getTagColor(i) {
//   return TAG_COLORS[i % TAG_COLORS.length]
// }

// // Strip HTML tags to plain text (for sidebar preview)
// function stripHtml(html = "") {
//   return html.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").trim()
// }

// // ─── Sidebar Blog Card ────────────────────────────────────────────────────────
// function BlogSideCard({ thumbnail, title, content, author, onBack }) {
//   return (
//     <div
//       className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition-shadow"
//       onClick={onBack}
//     >
//       {thumbnail ? (
//         <img src={thumbnail} alt={title} className="w-full h-36 object-cover" />
//       ) : (
//         <div className="w-full h-36 bg-gradient-to-br from-indigo-800 to-indigo-600 flex items-center justify-center">
//           <span className="text-white font-black text-lg tracking-wide">📝</span>
//         </div>
//       )}
//       <div className="p-4">
//         <h3 className="font-bold text-gray-900 text-sm leading-snug mb-1.5 line-clamp-2">{title}</h3>
//         {/* ✅ strip HTML for plain-text preview */}
//         <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 mb-3">
//           {stripHtml(content).slice(0, 90)}
//         </p>
//         <div className="flex items-center gap-2">
//           <div className="w-6 h-6 rounded-full bg-indigo-100 overflow-hidden flex-shrink-0 border border-indigo-200 flex items-center justify-center">
//             <span className="text-indigo-700 font-black text-xs">{(author ?? "A")[0].toUpperCase()}</span>
//           </div>
//           <div>
//             <p className="text-[10px] text-gray-400 leading-none mb-0.5">Written by</p>
//             <p className="text-xs font-bold text-gray-700 leading-none">{author ?? "Author"}</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// function SkeletonDetail({ onBack }) {
//   return (
//     <div className="min-h-screen bg-white">
//       <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 py-3.5 px-6 md:px-20">
//         <button
//           onClick={onBack}
//           className="inline-flex items-center gap-2 bg-indigo-900 text-white text-sm font-bold px-5 py-2 rounded-full shadow-lg shadow-indigo-200"
//         >
//           ← Back
//         </button>
//       </nav>
//       <div className="max-w-6xl mx-auto px-6 md:px-16 py-10 space-y-5">
//         <div className="h-72 bg-gray-100 rounded-2xl animate-pulse" />
//         <div className="h-6 bg-gray-100 rounded-full w-2/3 animate-pulse" />
//         <div className="h-4 bg-gray-100 rounded-full w-full animate-pulse" />
//         <div className="h-4 bg-gray-100 rounded-full w-5/6 animate-pulse" />
//       </div>
//     </div>
//   )
// }

// export default function BlogDetail({ blog, onBack }) {
//   const { user } = useSelector((state) => state.auth)

//   const { data: detail, isLoading, isError } = useGetBlogByIdQuery(blog?.id, {
//     skip: !blog?.id,
//   })

//   const d = detail ?? blog ?? {}

//   const title     = d.title        ?? ""
//   const content   = d.content      ?? ""
//   const thumbnail = d.thumbnail_url ?? ""
//   const tags      = d.tags         ?? []
//   const createdAt = d.created_at   ?? ""
//   const updatedAt = d.updated_at   ?? ""
//   const author    = d.author       ?? user?.name ?? user?.username ?? "Author"

//   useEffect(() => {
//     window.scrollTo({ top: 0, behavior: "smooth" })
//   }, [blog?.id])

//   if (isLoading) return <SkeletonDetail onBack={onBack} />

//   if (isError) return (
//     <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4 text-gray-400">
//       <p className="text-5xl">⚠️</p>
//       <p className="text-base font-semibold">Failed to load article.</p>
//       <button
//         onClick={onBack}
//         className="mt-2 bg-indigo-900 text-white text-sm font-bold px-5 py-2 rounded-full shadow-lg hover:-translate-y-0.5 transition-all"
//       >
//         ← Go Back
//       </button>
//     </div>
//   )

//   return (
//     <div className="min-h-screen bg-white overflow-x-hidden">

//       {/* ── Prose styles for rendered HTML content ── */}
//       <style>{`
//         .blog-content h1 { font-size: 1.6rem; font-weight: 800; margin: 1rem 0 0.5rem; color: #111827; }
//         .blog-content h2 { font-size: 1.3rem; font-weight: 700; margin: 0.9rem 0 0.45rem; color: #111827; }
//         .blog-content h3 { font-size: 1.1rem; font-weight: 600; margin: 0.7rem 0 0.4rem; color: #1f2937; }
//         .blog-content p  { margin: 0.6rem 0; line-height: 1.85; color: #374151; }
//         .blog-content ul, .blog-content ol { padding-left: 1.5rem; margin: 0.5rem 0; }
//         .blog-content li { margin: 0.25rem 0; color: #374151; line-height: 1.7; }
//         .blog-content a  { color: #4f46e5; text-decoration: underline; }
//         .blog-content a:hover { color: #3730a3; }
//         .blog-content blockquote {
//           border-left: 3px solid #6366f1;
//           padding-left: 1rem;
//           margin: 0.75rem 0;
//           color: #6b7280;
//           font-style: italic;
//         }
//         .blog-content code {
//           background: #f3f4f6;
//           padding: 0.15rem 0.4rem;
//           border-radius: 4px;
//           font-size: 0.82rem;
//           color: #6366f1;
//         }
//         .blog-content pre {
//           background: #1e1e2e;
//           color: #f1f1f1;
//           padding: 1rem 1.25rem;
//           border-radius: 10px;
//           overflow-x: auto;
//           font-size: 0.82rem;
//           margin: 0.75rem 0;
//         }
//         .blog-content hr { border: none; border-top: 1px solid #e5e7eb; margin: 1rem 0; }
//         .blog-content strong { font-weight: 700; color: #111827; }
//         .blog-content em { font-style: italic; }
//       `}</style>

//       {/* ── NAV ── */}
//       <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 py-3.5">
//         <div className="max-w-6xl mx-auto px-6 md:px-16 flex items-center gap-4">
//           <button
//             onClick={onBack}
//             className="inline-flex items-center gap-2 bg-indigo-900 text-white text-sm font-bold px-5 py-2 rounded-full shadow-lg shadow-indigo-200 hover:-translate-y-0.5 hover:shadow-xl transition-all"
//           >
//             ← Back
//           </button>
//           <span className="text-sm text-gray-400 truncate">
//             Blog / <span className="text-indigo-900 font-bold">{title}</span>
//           </span>
//         </div>
//       </nav>

//       {/* ── HERO IMAGE ── */}
//       <div className="max-w-6xl mx-auto px-6 md:px-16 pt-8">
//         <div className="relative w-full rounded-2xl overflow-hidden shadow-xl">
//           {thumbnail ? (
//             <img src={thumbnail} alt={title} className="w-full h-72 md:h-[420px] object-cover" />
//           ) : (
//             <div className="w-full h-72 md:h-[420px] bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center text-7xl">
//               📝
//             </div>
//           )}
//           <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

//           {tags.length > 0 && (
//             <div className="absolute top-4 left-4 flex flex-wrap gap-2">
//               {tags.map((tag, i) => (
//                 <span
//                   key={tag.id}
//                   className={`text-[10.5px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-md ${getTagColor(i)}`}
//                 >
//                   {tag.name}
//                 </span>
//               ))}
//             </div>
//           )}

//           <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
//             <h2 className="text-white text-2xl md:text-4xl font-extrabold drop-shadow-lg leading-tight">
//               {title}
//             </h2>
//             <span className="bg-black/50 text-white text-xs px-4 py-1 rounded-full font-medium self-start md:self-auto flex-shrink-0">
//               {formatDate(createdAt)}
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* ── BODY ── */}
//       <div className="max-w-6xl mx-auto px-6 md:px-16 py-16 grid grid-cols-1 md:grid-cols-[1fr_300px] gap-14 items-start">

//         {/* ── ARTICLE ── */}
//         <article>

//           {/* Title */}
//           <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight tracking-tight mb-6">
//             {title}
//           </h1>

//           {/* ✅ Render HTML content properly */}
//           <div
//             className="blog-content text-sm md:text-base leading-relaxed mb-6"
//             dangerouslySetInnerHTML={{ __html: content }}
//           />

//           {/* Tags */}
//           {tags.length > 0 && (
//             <div className="flex flex-wrap gap-3 my-8">
//               {tags.map((tag, i) => (
//                 <span key={tag.id} className={`text-sm font-bold px-6 py-2 rounded-full ${getTagColor(i)}`}>
//                   {tag.name}
//                 </span>
//               ))}
//             </div>
//           )}

//           {/* Author */}
//           <div className="flex items-center gap-4 bg-gradient-to-br from-gray-50 to-gray-100 px-5 py-4 rounded-2xl shadow-inner w-fit mb-8">
//             <div className="w-12 h-12 rounded-xl overflow-hidden shadow-md flex-shrink-0 bg-indigo-100 flex items-center justify-center">
//               <span className="text-indigo-700 font-black text-lg">{author[0]?.toUpperCase()}</span>
//             </div>
//             <div>
//               <p className="text-xs text-gray-400 font-medium mb-0.5">Written by</p>
//               <h3 className="text-base font-extrabold text-gray-900">{author}</h3>
//             </div>
//           </div>

//           <hr className="border-gray-100 mb-8" />

//           {/* ── LEARNINGS ── */}
//           <div>
//             <h2 className="text-2xl font-bold text-gray-900 mb-2">What You'll Walk Away With</h2>
//             <p className="text-sm text-gray-400 mb-2">Skills and insights from this article</p>
//             {LEARNINGS.map((row, i) => (
//               <div key={i} className="grid md:grid-cols-2 gap-8 border-t border-gray-100 py-5">
//                 {[row.left, row.right].map((item, j) => (
//                   <div key={j} className="flex items-start gap-3">
//                     <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
//                       <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
//                         <path d="M2 6l3 3 5-5" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//                       </svg>
//                     </div>
//                     <span className="text-sm text-gray-600 leading-relaxed">{item}</span>
//                   </div>
//                 ))}
//               </div>
//             ))}
//           </div>

//         </article>

//         {/* ── SIDEBAR ── */}
//         <aside className="space-y-6 md:sticky md:top-[80px]">

//           <BlogSideCard
//             thumbnail={thumbnail}
//             title={title}
//             content={content}
//             author={author}
//             onBack={onBack}
//           />

//           {/* CTA */}
//           <div className="bg-gradient-to-br from-indigo-700 to-indigo-500 text-white rounded-3xl p-8 text-center shadow-xl shadow-indigo-200">
//             <div className="text-4xl mb-4">🚀</div>
//             <h3 className="font-extrabold text-lg mb-2">Start Learning Today</h3>
//             <p className="text-sm opacity-80 leading-relaxed mb-6">
//               Join 120K+ learners building real-world skills with expert guidance.
//             </p>
//             <button className="bg-white text-indigo-700 font-bold px-6 py-3 rounded-full w-full hover:-translate-y-1 transition-all shadow-lg">
//               Enroll Now — Free
//             </button>
//           </div>

//           {/* Tags */}
//           {tags.length > 0 && (
//             <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
//               <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Topics</p>
//               <div className="flex flex-wrap gap-2">
//                 {tags.map((tag, i) => (
//                   <span key={tag.id} className={`text-[11px] font-bold px-3 py-1.5 rounded-full ${getTagColor(i)}`}>
//                     {tag.name}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Article info */}
//           {createdAt && (
//             <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-2.5">
//               <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Article Info</p>
//               <div className="flex items-center gap-2 text-sm text-gray-600">
//                 <span>📅</span>
//                 <span>Published <strong>{formatDate(createdAt)}</strong></span>
//               </div>
//               {updatedAt && updatedAt !== createdAt && (
//                 <div className="flex items-center gap-2 text-sm text-gray-600">
//                   <span>✏️</span>
//                   <span>Updated <strong>{formatDate(updatedAt)}</strong></span>
//                 </div>
//               )}
//             </div>
//           )}

//         </aside>
//       </div>
//     </div>
//   )
// }