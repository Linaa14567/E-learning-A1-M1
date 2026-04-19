import ProgressBar from "../ui/ProgressBar"

export default function DashBookCard({ b, isSaved, onToggleSave }) {
  return (
    <div className="bg-white border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.08)] flex flex-row gap-3 rounded-2xl p-3 cursor-pointer w-full transition-transform duration-[280ms] ease-[cubic-bezier(.34,1.2,.64,1)] hover:-translate-y-[7px] hover:shadow-[0_12px_32px_rgba(0,0,0,0.13)]">
      <div className="flex-shrink-0 w-28 sm:w-36 h-[160px] sm:h-[200px] rounded-xl overflow-hidden shadow-md bg-gray-100">
        {b.img
          ? <img src={b.img} alt={b.title} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center text-3xl bg-indigo-50">📚</div>}
      </div>
      <div className="flex flex-col flex-1 gap-1.5 relative overflow-hidden py-1">
        <span className="inline-block w-fit text-xs font-bold rounded-full px-3 py-1 bg-purple-100 text-purple-700">{b.genre || b.cat || "Book"}</span>
        <h2 className="font-extrabold text-sm sm:text-[15px] leading-snug m-0 line-clamp-2 text-gray-900">{b.title}</h2>
        {b.author && <p className="text-[11px] m-0 text-gray-400">by {b.author}</p>}
        <p className="text-base sm:text-[17px] leading-relaxed m-0 line-clamp-2 sm:line-clamp-3 text-gray-500">{b.desc || b.description || b.genre}</p>
        {b.pct != null && (
          <div className="mt-auto pt-1">
            <ProgressBar pct={b.pct} colorKey={b.color || "indigo"} h="h-1" />
            <span className="text-[10px] text-gray-400">{b.status} · {b.pct}%</span>
          </div>
        )}
        {onToggleSave && (
          <button onClick={e => { e.preventDefault(); e.stopPropagation(); onToggleSave(b.id) }}
            className="absolute bottom-0 right-0 bg-transparent border-none cursor-pointer p-1">
            <svg className={"w-[18px] h-[18px] transition-all duration-200 " + (isSaved ? "fill-[#1e1b4b] stroke-[#1e1b4b]" : "fill-none stroke-gray-400")}
              strokeWidth="1.8" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 3h14a1 1 0 0 1 1 1v17l-8-4-8 4V4a1 1 0 0 1 1-1z" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
