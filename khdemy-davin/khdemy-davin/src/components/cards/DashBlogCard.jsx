import StarIcon from "../ui/StarIcon"

export default function DashBlogCard({ b, isSaved, onToggleSave, onClick }) {
  const tag       = b.tags?.[0]?.name || b.tag || b.title
  const cardTitle = b.cardTitle || b.title
  const desc      = b.content || b.body || b.desc || ""
  const date      = b.created_at
    ? new Date(b.created_at).toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" })
    : b.date || ""
  const thumb  = b.thumbnail_url || b.img || ""
  const author = b.authorName || date

  return (
    <div onClick={onClick}
      className="bg-white border border-[#f0f0f0] shadow-[0_2px_16px_rgba(0,0,0,0.07)] rounded-[20px] overflow-hidden cursor-pointer flex flex-col transition-transform duration-[280ms] ease-[cubic-bezier(.34,1.2,.64,1)] hover:-translate-y-[7px] hover:shadow-[0_12px_32px_rgba(0,0,0,0.13)]">
      <div className="relative w-full h-[160px] sm:h-[190px] overflow-hidden flex-shrink-0 bg-gray-200">
        {thumb
          ? <img src={thumb} alt={cardTitle} className="w-full h-full object-cover block" onError={e => { e.target.style.display = "none" }} />
          : <div className="w-full h-full flex items-center justify-center text-4xl opacity-20">✍️</div>}
        <span className="absolute top-3 left-3 bg-[#2F327D] text-white text-xs font-bold rounded-full px-3 py-1 tracking-wide">{tag}</span>
      </div>
      <div className="p-3 sm:p-[18px] flex flex-col flex-1">
        <h3 className="font-bold text-sm sm:text-base text-center mb-1.5 sm:mb-2 leading-snug text-gray-900 line-clamp-2">{cardTitle}</h3>
        <p className="text-base sm:text-[17px] text-center leading-relaxed mb-3 sm:mb-4 flex-1 line-clamp-2 text-gray-400">{desc}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="w-[24px] h-[24px] sm:w-[26px] sm:h-[26px] rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-indigo-500 to-purple-500">
              <img src={b.authorImg || "/profilenew.PNG"} alt={author} className="w-full h-full object-cover object-top block" onError={e => { e.target.style.display = "none" }} />
            </div>
            <span className="font-bold text-xs sm:text-[13px] text-gray-400">{author}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <StarIcon />
            <span className="font-bold text-xs sm:text-[13px] text-gray-400">4.8</span>
            {onToggleSave && (
              <button onClick={e => { e.preventDefault(); e.stopPropagation(); onToggleSave(b) }}
                className="bg-transparent border-none cursor-pointer p-0 leading-none ml-1 transition-all duration-200">
                <svg width="15" height="19" viewBox="0 0 16 20"
                  className={"block transition-all duration-200 " + (isSaved ? "fill-[#2F327D] stroke-[#2F327D]" : "fill-none stroke-gray-400")}
                  strokeWidth="1.5" strokeLinejoin="round"><path d="M1 1h14v18l-7-4-7 4V1z" /></svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
