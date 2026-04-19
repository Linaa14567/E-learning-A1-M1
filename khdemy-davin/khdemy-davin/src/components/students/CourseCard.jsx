// import ProgressBar from './ProgressBar'
// import StarIcon from './StarIcon'

import ProgressBar from "./ProgressBar";
import StarIcon from "./StarIcon";

export default function CourseCard({ c, onClick, type = "enrolled", isSaved, onToggleSave }) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-[20px] overflow-hidden border border-[#f0f0f0] shadow-[0_2px_16px_rgba(0,0,0,0.07)] flex flex-col cursor-pointer transition-transform duration-[280ms] ease-[cubic-bezier(.34,1.2,.64,1)] hover:-translate-y-[7px] hover:shadow-[0_12px_32px_rgba(0,0,0,0.13)]"
    >
      <div className="relative w-full h-[160px] sm:h-[190px] overflow-hidden flex-shrink-0 bg-gray-200">
        <img
          src={c.img}
          alt={c.title}
          className="w-full h-full object-cover block"
          onError={e => { e.target.style.display = "none" }}
        />
        <span className="absolute top-3 left-3 bg-[#2F327D] text-white text-xs font-bold rounded-full px-3 py-1 tracking-wide">
          {c.cat}
        </span>
        {type === "completed" && (
          <span className="absolute top-3 right-3 bg-emerald-500 text-white text-xs font-bold rounded-full px-3 py-1">
            Grade {c.grade}
          </span>
        )}
        {onToggleSave && (
          <button
            onClick={e => { e.stopPropagation(); onToggleSave(c.id) }}
            className="absolute bottom-2.5 right-2.5 bg-transparent border-none cursor-pointer p-0 leading-none transition-all duration-200"
          >
            <svg
              width="15" height="19" viewBox="0 0 16 20"
              className={"block transition-all duration-200 " + (isSaved ? "fill-[#2F327D] stroke-[#2F327D]" : "fill-none stroke-white")}
              strokeWidth="1.5" strokeLinejoin="round"
            >
              <path d="M1 1h14v18l-7-4-7 4V1z" />
            </svg>
          </button>
        )}
      </div>

      <div className="p-3 sm:p-[18px] flex flex-col flex-1">
        <h3 className="font-bold text-sm sm:text-base text-center mb-1.5 sm:mb-2 leading-snug text-gray-900 line-clamp-2">
          {c.title}
        </h3>
        <p className="text-base sm:text-[17px] text-center leading-relaxed mb-3 sm:mb-4 flex-1 line-clamp-2 text-gray-400">
          {c.description || c.desc || c.instructor}
        </p>

        {type === "enrolled" && (
          <>
            <ProgressBar pct={c.progress} colorKey={c.color} h="h-1.5" />
            <div className="flex items-center justify-between mt-2 mb-1">
              <span className="text-[11px] text-gray-400">{c.done}/{c.total} lessons</span>
              <span className="font-black text-sm text-green-500">{c.progress}%</span>
            </div>
            <button
              onClick={e => { e.stopPropagation(); onClick && onClick() }}
              className="mt-2 w-full py-2 rounded-xl text-xs font-bold text-white bg-[#2F327D] border-none cursor-pointer hover:opacity-90 transition-opacity"
            >
              ▶ Resume
            </button>
          </>
        )}

        {type === "completed" && (
          <div className="flex items-center justify-between">
            <span className="font-black text-emerald-500 text-sm sm:text-base">✓ Done</span>
            <div className="flex items-center gap-1.5">
              <StarIcon />
              <span className="font-bold text-xs sm:text-[13px] text-gray-400">5.0</span>
              {onToggleSave && (
                <button
                  onClick={e => { e.stopPropagation(); onToggleSave(c.id) }}
                  className="bg-transparent border-none cursor-pointer p-0 leading-none ml-1 transition-all duration-200"
                >
                  <svg
                    width="15" height="19" viewBox="0 0 16 20"
                    className={"block transition-all duration-200 " + (isSaved ? "fill-[#2F327D] stroke-[#2F327D]" : "fill-none stroke-gray-400")}
                    strokeWidth="1.5" strokeLinejoin="round"
                  >
                    <path d="M1 1h14v18l-7-4-7 4V1z" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        )}

        {type === "saved" && (
          <div className="flex items-center justify-between">
            <span className="font-black text-green-500 text-sm sm:text-base">{c.price || "Free"}</span>
            <div className="flex items-center gap-1.5">
              <StarIcon />
              <span className="font-bold text-xs sm:text-[13px] text-gray-400">{c.rating || "4.8"}</span>
              {onToggleSave && (
                <button
                  onClick={e => { e.stopPropagation(); onToggleSave(c.id) }}
                  className="bg-transparent border-none cursor-pointer p-0 leading-none ml-1 transition-all duration-200"
                >
                  <svg
                    width="15" height="19" viewBox="0 0 16 20"
                    className={"block transition-all duration-200 " + (isSaved ? "fill-[#2F327D] stroke-[#2F327D]" : "fill-none stroke-gray-400")}
                    strokeWidth="1.5" strokeLinejoin="round"
                  >
                    <path d="M1 1h14v18l-7-4-7 4V1z" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}