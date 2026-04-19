export const Avatar = ({ size = 16 }) => (
  <div
    className={`w-${size} h-${size} rounded-full bg-gradient-to-br from-slate-300
      to-slate-500 flex items-center justify-center overflow-hidden border-2 border-white shadow`}
  >
    <svg viewBox="0 0 80 80" className="w-full h-full" fill="none">
      <circle cx="40" cy="40" r="40" fill="#e2e8f0" />
      <ellipse cx="40" cy="32" rx="13" ry="14" fill="#94a3b8" />
      <ellipse cx="40" cy="68" rx="22" ry="18" fill="#94a3b8" />
      <rect x="28" y="20" width="24" height="8" rx="4" fill="#1e293b" />
      <rect x="26" y="26" width="28" height="4" rx="2" fill="#1e293b" />
    </svg>
  </div>
);

export const SmallAvatar = ({ initials = "YN" }) => (
  <div
    className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-300 to-pink-400
      flex items-center justify-center text-white text-xs font-bold shadow-sm border-2 border-white"
  >
    {initials}
  </div>
);

export const CourseThumb = ({ color }) => (
  <div
    className={`w-14 h-10 rounded-lg bg-gradient-to-br ${color}
      flex items-center justify-center shadow-sm flex-shrink-0`}
  >
    <svg className="w-6 h-6 text-white opacity-80" fill="currentColor" viewBox="0 0 20 20">
      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5 8.126V13a1 1 0 00.553.894l4 2a1 1 0 00.894 0l4-2A1 1 0 0015 13V8.126l2.394-1.026a1 1 0 000-1.84l-7-3z" />
    </svg>
  </div>
);

export const MediaThumb = ({ idx }) => (
  <div
    className={`w-24 h-16 rounded-lg flex-shrink-0 overflow-hidden shadow
      bg-gradient-to-br ${idx % 2 === 0 ? "from-slate-700 to-slate-900" : "from-gray-600 to-gray-800"}
      flex items-center justify-center`}
  >
    <svg className="w-8 h-8 text-green-400 opacity-70" fill="currentColor" viewBox="0 0 24 24">
      <rect x="3" y="3"  width="18" height="3" rx="1" />
      <rect x="3" y="8"  width="12" height="2" rx="1" />
      <rect x="3" y="12" width="10" height="2" rx="1" />
      <circle cx="18" cy="15" r="4" fill="#4ade80" />
    </svg>
  </div>
);

export const Badge = ({ type }) =>
  type === "Free" ? (
    <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-green-100 text-green-700">
      Free
    </span>
  ) : (
    <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-yellow-100 text-yellow-700">
      Paid
    </span>
  );

export const SectionHeader = ({ title, highlight, linkLabel, onLink }) => (
  <div className="flex items-center justify-between mb-5">
    <h2 className="text-xl font-extrabold">
      {highlight && (
        <span className="text-blue-700 dark:text-blue-400">{highlight} </span>
      )}
      <span className="text-gray-800 dark:text-[#f1f1f1]">{title}</span>
    </h2>
    <button
      onClick={onLink}
      className="text-blue-500 dark:text-blue-400 text-sm font-semibold hover:underline flex items-center gap-1"
    >
      {linkLabel}{" "}
      <span className="text-gray-400 dark:text-gray-500">›</span>
    </button>
  </div>
);