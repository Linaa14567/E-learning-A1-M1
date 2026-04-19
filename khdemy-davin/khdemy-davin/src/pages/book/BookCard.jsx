import { useState } from "react";

export default function BookCard({ image, category, title, description, author }) {
  const [bookmarked, setBookmarked] = useState(false);

  return (
    <div className="book-card flex flex-row gap-3 rounded-xl p-3 shadow-md border border-gray-100 hover:shadow-lg transition-shadow cursor-pointer w-full max-w-[600px] h-[300px]">
      {/* Book Cover */}
      <div className="shrink-0 w-[180px] h-full rounded-lg overflow-hidden shadow-sm">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 gap-2 relative overflow-hidden py-1">
        {/* Category Badge */}
        <span className="w-fit bg-purple-100 text-purple-500 text-xs font-semibold px-2 py-0.5 rounded-full">
          {category}
        </span>

        {/* Title */}
        <h2 className="text-gray-900 font-bold text-lg leading-tight line-clamp-2">
          {title}
        </h2>

        {/* Author */}
        {author && <p className="text-xs text-gray-500">by {author}</p>}

        {/* Description */}
        <p className="text-gray-500 text-sm leading-relaxed line-clamp-4">
          {description}
        </p>

        {/* Bookmark Icon */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setBookmarked((b) => !b);
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
  );
}