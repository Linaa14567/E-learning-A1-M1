import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useGetBlogsQuery } from "../../features/blog/blogApi";
import { useGetCategoriesQuery } from "../../features/categories/categoriesApi";
import { useGetProfileQuery } from "../../features/teacher/teacherApi";
import {
  Star, Bookmark, ChevronLeft, ChevronRight,
  Search, X, Plus, User, PenLine,
} from "lucide-react";

const LIMIT = 9;

const BADGE_COLORS = [
  "bg-rose-500", "bg-violet-500", "bg-sky-500",
  "bg-amber-500", "bg-emerald-500", "bg-fuchsia-500",
];

// ── Skeleton ──────────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="rounded-2xl overflow-hidden border border-gray-100 dark:border-[#2e2e45] animate-pulse bg-white dark:bg-[#1e1e30] shadow-sm">
    <div className="w-full h-44 bg-gray-100 dark:bg-[#2e2e45]" />
    <div className="p-5 space-y-3">
      <div className="h-4 bg-gray-100 dark:bg-[#2e2e45] rounded-full w-3/4 mx-auto" />
      <div className="h-3 bg-gray-100 dark:bg-[#25253a] rounded-full w-full" />
      <div className="h-3 bg-gray-100 dark:bg-[#25253a] rounded-full w-2/3 mx-auto" />
      <div className="flex justify-between items-center pt-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-[#2e2e45]" />
          <div className="h-3 w-16 bg-gray-100 dark:bg-[#2e2e45] rounded-full" />
        </div>
        <div className="h-3 w-10 bg-gray-100 dark:bg-[#2e2e45] rounded-full" />
      </div>
    </div>
  </div>
);

// ── Blog Card ─────────────────────────────────────────────────────────────────
const BlogCard = ({ blog, profile }) => {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);

  const tags = (blog.tags ?? [])
    .map((t) => (typeof t === "string" ? t : t.name ?? ""))
    .filter(Boolean);

  const badgeLabel = tags[0] ?? null;
  const badgeColor = BADGE_COLORS[Math.abs((blog.id ?? 0) % BADGE_COLORS.length)];

  const thumb = blog.thumbnail_url ?? blog.thumbnail ?? null;
  const rating = blog.rating ?? 4.8;

  const authorName =
    blog.author_name ?? blog.author?.name ?? profile?.name ?? "Author";
  const authorAvatar = blog.author?.avatar_url ?? profile?.avatar_url ?? null;

  return (
    <div
      onClick={() => navigate(`/blogs/${blog.id}`)}
      className="group bg-white dark:bg-[#1e1e30] rounded-2xl overflow-hidden shadow-sm
        border border-gray-100 dark:border-[#2e2e45]
        hover:shadow-xl dark:hover:shadow-black/40
        hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col w-80"
    >
      {/* Thumbnail */}
      <div className="relative w-full h-44 bg-gray-100 dark:bg-[#2e2e45] overflow-hidden flex-shrink-0">
        {thumb ? (
          <img
            src={thumb}
            alt={blog.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-violet-100 via-pink-50 to-sky-100
            dark:from-violet-900/30 dark:via-pink-900/20 dark:to-sky-900/30
            flex items-center justify-center">
            <PenLine size={32} className="text-violet-300 dark:text-violet-500" />
          </div>
        )}
        {badgeLabel && (
          <span className={`absolute top-3 left-3 inline-flex items-center px-2.5 py-1 rounded-full
            text-[10px] font-bold text-white shadow-sm ${badgeColor}`}>
            {badgeLabel}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-gray-900 dark:text-[#f1f1f1] mb-1.5 line-clamp-1
          group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors text-[15px]">
          {blog.title}
        </h3>
        <p className="text-xs text-gray-400 dark:text-[#9b9baa] line-clamp-2 leading-relaxed mb-auto">
          {blog.description ?? blog.excerpt ?? blog.content ?? "No description available."}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50 dark:border-[#2e2e45]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900/40
              border border-indigo-200 dark:border-indigo-700
              overflow-hidden flex items-center justify-center flex-shrink-0">
              {authorAvatar ? (
                <img src={authorAvatar} alt={authorName} className="w-full h-full object-cover" />
              ) : (
                <User size={12} className="text-indigo-500 dark:text-indigo-400" />
              )}
            </div>
            <span className="text-xs font-semibold text-gray-600 dark:text-[#9b9baa] truncate max-w-[80px]">
              {authorName}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              <Star size={11} style={{ color: "#FE9A20", fill: "#FE9A20" }} />
              <span className="text-xs font-bold" style={{ color: "#FE9A20" }}>
                {typeof rating === "number" ? rating.toFixed(1) : rating}
              </span>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); setSaved(!saved); }}
              className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all
                ${saved
                  ? "border-indigo-300 bg-indigo-50 dark:bg-indigo-900/40 dark:border-indigo-500 text-indigo-500"
                  : "border-gray-200 dark:border-[#2e2e45] text-gray-400 dark:text-[#9b9baa] hover:border-indigo-200 hover:text-indigo-400"
                }`}
            >
              <Bookmark size={11} className={saved ? "fill-indigo-500" : ""} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Pagination ────────────────────────────────────────────────────────────────
const Pagination = ({ page, totalPages, onChange }) => {
  if (totalPages <= 1) return null;

  let start = Math.max(1, page - 2);
  let end = Math.min(totalPages, start + 4);
  if (end - start < 4) start = Math.max(1, end - 4);
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  const btnBase = "flex items-center gap-1 px-5 py-2.5 rounded-full border text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
  const btnIdle = "border-gray-200 dark:border-[#2e2e45] text-gray-500 dark:text-[#9b9baa] hover:border-indigo-300 hover:text-indigo-600 dark:hover:border-indigo-500 dark:hover:text-indigo-400"

  return (
    <div className="flex items-center justify-center gap-2 mt-14 pb-12">
      <button onClick={() => onChange(page - 1)} disabled={page === 1}
        className={`${btnBase} ${btnIdle}`}>
        <ChevronLeft size={14} /> Back
      </button>

      {start > 1 && (
        <>
          <button onClick={() => onChange(1)}
            className={`w-10 h-10 rounded-full border text-sm font-bold transition-all ${btnIdle}`}>1</button>
          {start > 2 && <span className="text-gray-400 dark:text-[#9b9baa] text-sm">…</span>}
        </>
      )}

      {pages.map((p) => (
        <button key={p} onClick={() => onChange(p)}
          className={`w-10 h-10 rounded-full text-sm font-bold transition-all
            ${page === p
              ? "bg-indigo-700 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900"
              : `border ${btnIdle}`
            }`}>
          {p}
        </button>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="text-gray-400 dark:text-[#9b9baa] text-sm">…</span>}
          <button onClick={() => onChange(totalPages)}
            className={`w-10 h-10 rounded-full border text-sm font-bold transition-all ${btnIdle}`}>
            {totalPages}
          </button>
        </>
      )}

      <button onClick={() => onChange(page + 1)} disabled={page >= totalPages}
        className={`${btnBase} ${btnIdle}`}>
        Next <ChevronRight size={14} />
      </button>
    </div>
  );
};

// ── Main ──────────────────────────────────────────────────────────────────────
export default function BlogPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [categoryId, setCategoryId] = useState(null);
  const [searchInput, setSearchInput] = useState("");

  const { data: profile } = useGetProfileQuery();

  const { data: categoriesRaw = [], isLoading: catLoading } = useGetCategoriesQuery();
  const categories = Array.isArray(categoriesRaw)
    ? categoriesRaw
    : categoriesRaw?.categories ?? categoriesRaw?.data ?? [];

  const { data: raw, isLoading, isError } = useGetBlogsQuery({
    page,
    limit: LIMIT,
    ...(categoryId ? { category_id: categoryId } : {}),
  });

  const blogs = raw?.items ?? raw?.blogs ?? raw?.data ?? [];
  const totalPages =
    raw?.total_pages ??
    (raw?.total ? Math.ceil(raw.total / LIMIT) : 1);

  const filtered = useMemo(() => {
    const q = searchInput.trim().toLowerCase();
    if (!q) return blogs;
    return blogs.filter((b) => {
      const tagNames = (b.tags ?? [])
        .map((t) => (typeof t === "string" ? t : t.name ?? ""))
        .join(" ").toLowerCase();
      return (
        b.title?.toLowerCase().includes(q) ||
        b.content?.toLowerCase().includes(q) ||
        tagNames.includes(q)
      );
    });
  }, [blogs, searchInput]);

  const handleCategory = (id) => { setCategoryId(id); setPage(1); setSearchInput(""); };
  const clearSearch = () => { setSearchInput(""); setPage(1); };
  const handlePageChange = (p) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f0f1a] transition-colors duration-300">

      {/* ── HERO ── */}
      <div className="max-w-6xl mx-auto px-8 pt-16 pb-12">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-black leading-tight mb-5">
              <span style={{ color: "#E91E8C" }}>Empowering Cambodia's</span>
              <br />
              <span style={{ color: "#1565C0" }}>Future Through Smart</span>
              <br />
              <span style={{ color: "#FFC107" }}>Learning</span>
            </h1>
            <p className="text-gray-500 dark:text-[#9b9baa] text-sm leading-relaxed max-w-sm">
              KhDemy is transforming the way students learn, practice, and grow.
            </p>
          </div>
          <div className="flex-1 flex justify-end">
            <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1588702547919-26089e690ecc?w=600"
                alt="Learning"
                className="w-full h-64 object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── SEARCH + CREATE ── */}
      <div className="max-w-6xl mx-auto px-8 mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/blogs/create")}
            className="flex items-center gap-2 px-6 py-3 rounded-full border-2
              border-indigo-700 dark:border-indigo-500
              text-indigo-700 dark:text-indigo-400
              text-sm font-bold
              hover:bg-indigo-700 dark:hover:bg-indigo-600
              hover:text-white transition-all flex-shrink-0"
          >
            <Plus size={15} /> Create Your Blog
          </button>

          <div className="relative flex-1">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => { setSearchInput(e.target.value); setPage(1); }}
              placeholder="Search blogs…"
              className="w-full pl-6 pr-11 py-3 rounded-full border-2
                border-gray-200 dark:border-[#2e2e45]
                bg-white dark:bg-[#1e1e30]
                text-sm text-gray-800 dark:text-[#f1f1f1]
                placeholder:text-gray-400 dark:placeholder:text-[#9b9baa]
                outline-none focus:border-indigo-400 dark:focus:border-indigo-500
                transition-all shadow-sm"
            />
            {searchInput ? (
              <button onClick={clearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#9b9baa] hover:text-gray-600 dark:hover:text-white">
                <X size={16} />
              </button>
            ) : (
              <Search size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#9b9baa] pointer-events-none" />
            )}
          </div>
        </div>

        {searchInput && (
          <p className="text-sm text-gray-400 dark:text-[#9b9baa] mt-3">
            Found{" "}
            <span className="font-bold text-indigo-600 dark:text-indigo-400">{filtered.length}</span>{" "}
            result{filtered.length !== 1 ? "s" : ""} for{" "}
            <span className="font-bold text-gray-700 dark:text-[#f1f1f1]">"{searchInput}"</span>
          </p>
        )}
      </div>

      {/* ── CATEGORY PILLS ── */}
      <div className="max-w-6xl mx-auto px-8 mb-10">
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => handleCategory(null)}
            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all
              ${categoryId === null
                ? "bg-indigo-700 text-white shadow-md dark:shadow-indigo-900"
                : "text-gray-500 dark:text-[#9b9baa] hover:text-indigo-600 dark:hover:text-indigo-400"
              }`}
          >
            All
          </button>

          {catLoading && Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-10 w-24 rounded-full bg-gray-100 dark:bg-[#1e1e30] animate-pulse" />
          ))}

          {!catLoading && categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategory(cat.id)}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all
                ${categoryId === cat.id
                  ? "bg-indigo-700 text-white shadow-md dark:shadow-indigo-900"
                  : "text-gray-500 dark:text-[#9b9baa] hover:text-indigo-600 dark:hover:text-indigo-400"
                }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* ── BLOG GRID ── */}
      <div className="max-w-6xl mx-auto px-8 pb-4">
        {isError && (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">😕</p>
            <p className="text-sm font-semibold text-gray-400 dark:text-[#9b9baa]">Failed to load blogs.</p>
          </div>
        )}

        <div className={`gap-7 ${
          !isLoading && filtered.length > 0 && filtered.length < 3
            ? "flex flex-wrap justify-center"
            : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        }`}>
          {isLoading
            ? Array.from({ length: LIMIT }).map((_, i) => <SkeletonCard key={i} />)
            : filtered.length === 0
            ? (
              <div className="col-span-3 flex justify-center py-10">
                <div className="bg-white dark:bg-[#1e1e30] rounded-2xl shadow-sm
                  border border-gray-100 dark:border-[#2e2e45]
                  px-16 py-12 flex flex-col items-center text-center max-w-sm w-full">
                  <div className="w-20 h-20 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center mb-6">
                    <Search size={36} className="text-indigo-700 dark:text-indigo-400" strokeWidth={1.8} />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-[#f1f1f1] mb-3">
                    No Results Found
                  </h3>
                  <p className="text-sm text-gray-400 dark:text-[#9b9baa] leading-relaxed mb-7">
                    {searchInput
                      ? "Sorry, we couldn't find any blogs matching your search. Please try a different query."
                      : categoryId
                      ? "Sorry, there are no blogs in this category yet."
                      : "No blogs available at the moment."}
                  </p>
                  {(searchInput || categoryId) && (
                    <button
                      onClick={() => { clearSearch(); handleCategory(null); }}
                      className="px-8 py-3 rounded-full bg-indigo-700 hover:bg-indigo-800
                        dark:bg-indigo-600 dark:hover:bg-indigo-700
                        text-white text-sm font-bold transition-all"
                    >
                      Clear Search
                    </button>
                  )}
                </div>
              </div>
            )
            : filtered.map((blog) => (
              <BlogCard key={blog.id} blog={blog} profile={profile} />
            ))}
        </div>

        {!isLoading && (
          <Pagination page={page} totalPages={totalPages} onChange={handlePageChange} />
        )}
      </div>
    </div>
  );
}