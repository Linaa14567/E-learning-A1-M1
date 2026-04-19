import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetBlogsQuery, useDeleteBlogMutation } from "../../features/blog/blogApi";
import { toast } from "react-toastify";
import { Trash2, ArrowLeft, Pencil, ExternalLink } from "lucide-react";

const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────
const DeleteConfirmModal = ({ isOpen, title, onConfirm, onCancel }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={onCancel}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="h-1 w-full bg-gradient-to-r from-red-400 via-red-500 to-rose-500" />
        <div className="px-8 py-8 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full border-2 border-red-400 dark:border-red-500/60 flex items-center justify-center mb-5">
            <Trash2 size={28} className="text-red-500" strokeWidth={1.75} />
          </div>
          <h2 className="text-2xl font-black text-gray-800 dark:text-gray-100 mb-3 tracking-tight">Are You Sure?</h2>
          <p className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-2">{title}</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 leading-relaxed mb-8 max-w-xs">
            This action cannot be undone. The blog post will be permanently deleted.
          </p>
          <button
            onClick={onConfirm}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-red-500 hover:bg-red-600 active:scale-[0.98] text-white font-bold text-sm transition-all duration-150 shadow-md shadow-red-200 dark:shadow-red-900/30 mb-3"
          >
            <Trash2 size={15} /> Yes, Delete This Blog
          </button>
          <button
            onClick={onCancel}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border-2 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 font-semibold text-sm transition-all duration-150 active:scale-[0.98]"
          >
            <ArrowLeft size={15} /> No, Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Edit Confirm Modal ───────────────────────────────────────────────────────
const EditConfirmModal = ({ isOpen, blog, onConfirm, onCancel }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={onCancel}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="h-1 w-full bg-gradient-to-r from-indigo-400 via-indigo-500 to-violet-500" />
        <div className="px-8 py-8 flex flex-col items-center text-center">
          {blog?.thumbnail_url ? (
            <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-indigo-100 dark:border-indigo-700 shadow-md mb-5">
              <img src={blog.thumbnail_url} alt={blog.title} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full border-2 border-indigo-300 dark:border-indigo-600 flex items-center justify-center mb-5">
              <Pencil size={26} className="text-indigo-500" strokeWidth={1.75} />
            </div>
          )}
          <h2 className="text-2xl font-black text-gray-800 dark:text-gray-100 mb-2 tracking-tight">Edit Blog?</h2>
          <p className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-1 line-clamp-2 max-w-xs">{blog?.title}</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 leading-relaxed mb-8 max-w-xs">
            You are about to edit this blog post. Any unsaved changes will be lost.
          </p>
          <button
            onClick={onConfirm}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-bold text-sm transition-all duration-150 shadow-md shadow-indigo-200 dark:shadow-indigo-900/30 mb-3"
          >
            <ExternalLink size={15} /> Yes, Edit This Blog
          </button>
          <button
            onClick={onCancel}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border-2 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 font-semibold text-sm transition-all duration-150 active:scale-[0.98]"
          >
            <ArrowLeft size={15} /> No, Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Skeleton card ────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm rounded-2xl overflow-hidden animate-pulse">
    <div className="h-44 bg-gray-100 dark:bg-gray-700" />
    <div className="p-5 space-y-3">
      <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full w-1/3" />
      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-3/4" />
      <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full w-full" />
      <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full w-2/3" />
      <div className="flex gap-2 pt-2">
        <div className="h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex-1" />
        <div className="h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex-1" />
      </div>
    </div>
  </div>
);

// ─── Blog card ────────────────────────────────────────────────────────────────
const BlogCard = ({ blog, onDeleteClick, onEditClick }) => {
  const tags = blog.tags ?? [];
  return (
    <div className="group relative isolate bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm rounded-2xl overflow-hidden transition-all duration-300 hover:border-indigo-200 dark:hover:border-indigo-700 hover:shadow-md hover:shadow-indigo-100/50 dark:hover:shadow-indigo-900/20 hover:-translate-y-0.5 flex flex-col">
      <div className="relative h-44 overflow-hidden bg-gray-50 dark:bg-gray-700/50 shrink-0">
        {blog.thumbnail_url ? (
          <img
            src={blog.thumbnail_url}
            alt={blog.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-5xl opacity-20">📝</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>
      <div className="p-5 flex flex-col flex-1 gap-3">
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-700 text-indigo-600 dark:text-indigo-400 uppercase tracking-wider font-medium">
                {tag}
              </span>
            ))}
          </div>
        )}
        <h3 className="text-gray-800 dark:text-gray-100 font-semibold text-base leading-snug line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {blog.title}
        </h3>
        <p className="text-gray-400 dark:text-gray-500 text-xs leading-relaxed line-clamp-2 flex-1">
          {blog.content?.replace(/<[^>]+>/g, "").slice(0, 120) || "No content provided."}
        </p>
        <div className="flex gap-2 pt-1">
          <button
            onClick={() => onEditClick(blog)}
            className="flex-1 py-2 rounded-xl border border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-600 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs font-medium transition-all duration-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
          >
            Edit
          </button>
          <button
            onClick={() => onDeleteClick(blog)}
            className="flex-1 py-2 rounded-xl border border-gray-200 dark:border-gray-600 hover:border-red-200 dark:hover:border-red-700 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 text-xs font-medium transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Empty state ──────────────────────────────────────────────────────────────
const EmptyState = ({ query }) => (
  <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
    <span className="text-6xl mb-4 opacity-30">{query ? "🔍" : "📭"}</span>
    <h3 className="text-gray-800 dark:text-gray-200 font-semibold text-lg mb-2">
      {query ? "No blogs match your search" : "No blogs yet"}
    </h3>
    <p className="text-gray-400 dark:text-gray-500 text-sm mb-6 max-w-xs">
      {query ? "Try a different keyword or clear your search." : "Write your first blog post and share your knowledge."}
    </p>
    {!query && (
      <Link
        to="/blogs/create"
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-200 dark:hover:shadow-indigo-900/50"
      >
        + Write your first blog
      </Link>
    )}
  </div>
);

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function MyAllBlogs() {
  const [search, setSearch]             = useState("");
  const navigate                        = useNavigate();
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [blogToEdit,   setBlogToEdit]   = useState(null);

  const { user } = useSelector((state) => state.auth);

  const { data, isLoading, isError } = useGetBlogsQuery(
    { author_id: user?.id },
    { skip: !user?.id }
  );
  const [deleteBlog] = useDeleteBlogMutation();

  const allBlogs = data?.blogs ?? [];

  const filtered = allBlogs.filter((b) => {
    const q = search.toLowerCase();
    return (
      b.title?.toLowerCase().includes(q) ||
      b.content?.toLowerCase().includes(q) ||
      b.tags?.some((t) => t?.toLowerCase().includes(q))
    );
  });

  const handleConfirmDelete = async () => {
    if (!blogToDelete) return;
    try {
      await deleteBlog(blogToDelete.id).unwrap();
      toast.success("Blog deleted.");
    } catch (err) {
      toast.error(err?.data?.detail || "Failed to delete blog.");
    } finally {
      setBlogToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-200 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-medium uppercase tracking-widest mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              My Blog Dashboard
            </span>
            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 leading-tight">
              All <span className="italic text-indigo-500 dark:text-indigo-400">Blogs</span>
            </h1>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1.5">
              {isLoading ? "Loading…" : `${plural(filtered.length, "blog")} found`}
            </p>
          </div>
          <Link
            to="/blogs/create"
            className="inline-flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-200 dark:hover:shadow-indigo-900/50 whitespace-nowrap self-start sm:self-auto"
          >
            <span className="text-lg leading-none">+</span> New Blog
          </Link>
        </div>

        {/* ── Search ── */}
        <div className="relative mb-8 max-w-md">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Search blogs…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 outline-none transition-all duration-200 focus:border-indigo-400 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/40"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-lg leading-none"
            >
              ×
            </button>
          )}
        </div>

        {/* ── Error ── */}
        {isError && (
          <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 text-red-500 dark:text-red-400 text-sm rounded-xl px-4 py-3 mb-6">
            <span>⚠️</span> Failed to load blogs. Check your connection and try again.
          </div>
        )}

        {/* ── Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          ) : filtered.length === 0 ? (
            <EmptyState query={search} />
          ) : (
            filtered.map((blog) => (
              <BlogCard
                key={blog.id}
                blog={blog}
                onDeleteClick={setBlogToDelete}
                onEditClick={setBlogToEdit}
              />
            ))
          )}
        </div>
      </div>

      {/* ── Edit modal ── */}
      <EditConfirmModal
        isOpen={!!blogToEdit}
        blog={blogToEdit}
        onConfirm={() => { navigate(`/dashboard/blogs/${blogToEdit.id}/edit`); setBlogToEdit(null); }}
        onCancel={() => setBlogToEdit(null)}
      />

      {/* ── Delete modal ── */}
      <DeleteConfirmModal
        isOpen={!!blogToDelete}
        title={blogToDelete?.title}
        onConfirm={handleConfirmDelete}
        onCancel={() => setBlogToDelete(null)}
      />
    </div>
  );
}