import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  BookMarked, ImagePlus, FileText, Loader2,
  Save, AlertCircle, ChevronRight,
} from "lucide-react";

import { useGetCategoriesQuery } from "../../features/categories/categoriesApi";
import {
  useGetOwnerBooksQuery,
  useUpdateBookMutation,
} from "../../features/books/booksAPI";

// ─── Upload image to Cloudinary ────────────────────────────────────────────────
const CLOUD_NAME    = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

async function uploadImageToCloudinary(file) {
  const fd = new FormData();
  fd.append("file",          file);
  fd.append("upload_preset", UPLOAD_PRESET);
  const res  = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body: fd }
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message ?? "Image upload failed");
  return data.secure_url;
}

// ─── Upload PDF to backend ─────────────────────────────────────────────────────
async function uploadPdfToBackend(file, token) {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch(`${BASE_URL}/files/upload`, {
    method:  "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body:    fd,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.detail || data?.message || "PDF upload failed");
  return data.url ?? data.file_url ?? data.secure_url ?? data;
}

const formatBytes = (bytes) => {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

// ─── Style tokens ──────────────────────────────────────────────────────────────
const inputCls =
  "w-full rounded-xl px-4 py-3 text-sm outline-none transition-all " +
  "bg-slate-50 dark:bg-gray-800/80 " +
  "border border-gray-200 dark:border-gray-700 " +
  "text-gray-800 dark:text-gray-100 " +
  "placeholder-gray-400 dark:placeholder-gray-500 " +
  "focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/60 " +
  "focus:border-indigo-400 dark:focus:border-indigo-500";

const labelCls =
  "block text-xs font-black uppercase tracking-widest mb-2 " +
  "text-gray-400 dark:text-gray-500";

// ─── Main Component ────────────────────────────────────────────────────────────
export default function EditBook() {
  const navigate = useNavigate();
  const { id }   = useParams();
  const token    = useSelector((state) => state.auth?.token);
  const ownerId  = useSelector((state) => state.auth?.user?.id);

  const [updateBook, { isLoading: isUpdating }] = useUpdateBookMutation();
  const { data: categoriesData = [] }           = useGetCategoriesQuery();
  const categories = categoriesData.map((c) => ({ value: c.id, label: c.name }));

  const { data: ownerData, isLoading: isFetching } = useGetOwnerBooksQuery(
    { owner_id: ownerId, page: 1, limit: 100 },
    { skip: !ownerId }
  );
  const bookToEdit = (ownerData?.items ?? []).find((b) => b.id === Number(id));

  // ── Form state ──────────────────────────────────────────────────────────────
  const [form, setForm] = useState({
    title: "", description: "", category_id: "",
    thumbnail: "", file_url: "", metadata: "",
  });

  // thumbPreview holds a temporary blob URL only while uploading.
  // Once upload finishes, it is cleared and form.thumbnail holds the real URL.
  // displaySrc derives from both so the preview is always correct.
  const [thumbPreview,   setThumbPreview]   = useState(null);
  const [imgError,       setImgError]       = useState(false);
  const [pdfName,        setPdfName]        = useState("");
  const [uploadingThumb, setUploadingThumb] = useState(false);
  const [uploadingPdf,   setUploadingPdf]   = useState(false);
  const [error,          setError]          = useState("");

  const thumbRef       = useRef(null);
  const pdfRef         = useRef(null);
  const hasInitialised = useRef(false);

  // What the <img> actually renders — blob while uploading, else committed URL
  const displaySrc = thumbPreview ?? form.thumbnail;

  // Pre-fill form once when book data loads
  useEffect(() => {
    if (!bookToEdit || hasInitialised.current) return;
    const catId = bookToEdit.category_ids?.[0] ?? "";
    setForm({
      title:       bookToEdit.title       ?? "",
      description: bookToEdit.description ?? "",
      category_id: catId ? String(catId)  : "",
      thumbnail:   bookToEdit.thumbnail   ?? "",
      file_url:    bookToEdit.file_url    ?? "",
      metadata:    bookToEdit.metadata    ?? "",
    });
    setImgError(false);
    if (bookToEdit.file_url) setPdfName(bookToEdit.file_url.split("/").pop());
    hasInitialised.current = true;
  }, [bookToEdit]);

  // Reset broken-image flag whenever the committed thumbnail URL changes
  useEffect(() => {
    setImgError(false);
  }, [form.thumbnail]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setError("");
  };

  // ── Thumbnail upload → Cloudinary ───────────────────────────────────────────
  const handleThumbFile = async (file) => {
    if (!file?.type.startsWith("image/")) {
      toast.error("Only image files are allowed!");
      return;
    }

    const blobUrl = URL.createObjectURL(file);
    setThumbPreview(blobUrl);   // show local preview immediately
    setImgError(false);
    setUploadingThumb(true);

    try {
      const url = await uploadImageToCloudinary(file);
      // Commit real Cloudinary URL into form, clear blob preview
      setForm((p) => ({ ...p, thumbnail: url }));
      setThumbPreview(null);
      toast.success("Cover image uploaded!");
    } catch {
      toast.error("Image upload failed.");
      setThumbPreview(null);    // revert; displaySrc falls back to previous form.thumbnail
    } finally {
      setUploadingThumb(false);
      URL.revokeObjectURL(blobUrl);
    }
  };

  // ── PDF upload → backend /files/upload ─────────────────────────────────────
  const handlePdfFile = async (file) => {
    if (file.type !== "application/pdf") { toast.error("Only PDF files are allowed!"); return; }
    if (file.size > 10 * 1024 * 1024) {
      toast.error(`PDF too large (${formatBytes(file.size)}). Max 10 MB.`);
      return;
    }
    setPdfName(file.name);
    setUploadingPdf(true);
    try {
      const url = await uploadPdfToBackend(file, token);
      setForm((p) => ({ ...p, file_url: url }));
      toast.success("PDF uploaded!");
    } catch (err) {
      toast.error(err?.message || "PDF upload failed.");
      setPdfName(form.file_url?.split("/").pop() ?? "");
    } finally {
      setUploadingPdf(false);
    }
  };

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.title.trim())       return setError("Book title is required.");
    if (!form.description.trim()) return setError("Description is required.");
    if (!form.category_id)        return setError("Please select a category.");
    if (!form.file_url)           return setError("Please upload a PDF file.");
    if (!form.thumbnail)          return setError("Please upload a cover image.");
    try {
      await updateBook({
        id:           Number(id),
        title:        form.title,
        description:  form.description,
        category_ids: [Number(form.category_id)],
        thumbnail:    form.thumbnail,
        file_url:     form.file_url,
        metadata:     form.metadata,
      }).unwrap();
      toast.success("Book updated successfully!");
      navigate("/profile/all-books");
    } catch (err) {
      const s = err?.status ?? err?.originalStatus;
      const isSuccess = s === "PARSING_ERROR" || (typeof s === "number" && s >= 200 && s < 300);
      if (isSuccess) {
        toast.success("Book updated successfully!");
        navigate("/profile/all-books");
        return;
      }
      setError(err?.data?.detail || err?.data?.message || "Failed to update book.");
    }
  };

  const busy = isUpdating || uploadingThumb || uploadingPdf;

  // ── Skeleton ────────────────────────────────────────────────────────────────
  if (isFetching) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-6">
      <div className="max-w-3xl w-full space-y-5 animate-pulse">
        <div className="h-8 w-48 rounded-xl bg-gray-200 dark:bg-gray-700" />
        {[1, 2].map((i) => (
          <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl p-7 shadow-sm border border-gray-100 dark:border-gray-800 space-y-4">
            <div className="h-4 w-32 rounded bg-gray-100 dark:bg-gray-700" />
            <div className="h-10 rounded-xl bg-gray-100 dark:bg-gray-700" />
            <div className="h-24 rounded-xl bg-gray-100 dark:bg-gray-700" />
            <div className="h-10 rounded-xl bg-gray-100 dark:bg-gray-700" />
          </div>
        ))}
      </div>
    </div>
  );

  if (!bookToEdit && !isFetching) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-500 dark:text-gray-400 font-medium">Book not found.</p>
        <button
          onClick={() => navigate("/profile/all-books")}
          className="mt-3 text-indigo-600 dark:text-indigo-400 text-sm underline hover:text-indigo-800 dark:hover:text-indigo-300"
        >
          Back to My Books
        </button>
      </div>
    </div>
  );

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-10 px-4 transition-colors">
      <div className="max-w-3xl mx-auto">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs mb-6 text-gray-400 dark:text-gray-500">
          <button onClick={() => navigate("/profile")} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium">
            Dashboard
          </button>
          <ChevronRight size={13} className="text-gray-300 dark:text-gray-600" />
          <button onClick={() => navigate("/profile/all-books")} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium">
            My Books
          </button>
          <ChevronRight size={13} className="text-gray-300 dark:text-gray-600" />
          <span className="font-semibold text-gray-700 dark:text-gray-300">Edit Book</span>
        </nav>

        {/* Page heading */}
        <div className="mb-8">
          <h1 className="text-2xl font-black text-gray-900 dark:text-gray-50">
            Edit <span className="text-indigo-600 dark:text-indigo-400">Book</span>
          </h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            Update the book details, cover image, and PDF file below.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">

          {/* ── Section 1: Book Details ── */}
          <section className="bg-white dark:bg-gray-900 rounded-2xl p-7 shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800/50 flex items-center justify-center">
                <BookMarked size={18} className="text-indigo-500 dark:text-indigo-400" />
              </div>
              <h2 className="text-base font-bold text-gray-800 dark:text-gray-100">Book Details</h2>
            </div>

            <div className="space-y-5">
              <div>
                <label className={labelCls}>Title <span className="text-red-400">*</span></label>
                <input name="title" value={form.title} onChange={handleChange} placeholder="Enter book title" className={inputCls} />
              </div>

              <div>
                <label className={labelCls}>Description <span className="text-red-400">*</span></label>
                <textarea name="description" value={form.description} onChange={handleChange} placeholder="What is this book about?" rows={4} className={`${inputCls} resize-none`} />
              </div>

              <div>
                <label className={labelCls}>Category <span className="text-red-400">*</span></label>
                <select name="category_id" value={form.category_id} onChange={handleChange} className={`${inputCls} cursor-pointer`}>
                  <option value="">Select a category…</option>
                  {categories.map((c) => (
                    <option key={c.value} value={String(c.value)}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelCls}>Metadata</label>
                <input name="metadata" value={form.metadata} onChange={handleChange} placeholder="Optional metadata (tags, JSON, etc.)" className={inputCls} />
              </div>
            </div>
          </section>

          {/* ── Section 2: Files ── */}
          <section className="bg-white dark:bg-gray-900 rounded-2xl p-7 shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-900/30 border border-purple-100 dark:border-purple-800/50 flex items-center justify-center">
                <FileText size={18} className="text-purple-500 dark:text-purple-400" />
              </div>
              <h2 className="text-base font-bold text-gray-800 dark:text-gray-100">Files</h2>
            </div>

            <div className="space-y-6">

              {/* ── Cover Thumbnail ── */}
              <div>
                <label className={labelCls}>
                  Cover Thumbnail <span className="text-red-400">*</span>
                </label>
                <div className="flex gap-4 items-start">

                  {/* Preview box */}
                  <div className="w-36 h-24 rounded-xl overflow-hidden bg-indigo-50 dark:bg-indigo-900/20 border border-gray-200 dark:border-gray-700 flex items-center justify-center flex-shrink-0">
                    {uploadingThumb ? (
                      <Loader2 size={20} className="text-indigo-400 animate-spin" />
                    ) : displaySrc && !imgError ? (
                      <img
                        key={displaySrc}
                        src={displaySrc}
                        alt="cover"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          setImgError(true);
                        }}
                      />
                    ) : (
                      <ImagePlus size={22} className="text-indigo-300 dark:text-indigo-600" />
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <button
                      type="button"
                      onClick={() => thumbRef.current?.click()}
                      disabled={uploadingThumb}
                      className="w-full border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl py-2.5 text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <ImagePlus size={13} />
                      {uploadingThumb ? "Uploading…" : "Upload New Image"}
                    </button>
                    <input
                      ref={thumbRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleThumbFile(f);
                        e.target.value = "";
                      }}
                    />
                    <input
                      name="thumbnail"
                      value={form.thumbnail}
                      onChange={handleChange}
                      placeholder="Or paste image URL…"
                      className={inputCls}
                    />
                  </div>
                </div>
              </div>

              {/* ── PDF Upload ── */}
              <div>
                <label className={labelCls}>
                  Book PDF <span className="text-red-400">*</span>
                  <span className="ml-1 text-gray-300 dark:text-gray-600 normal-case font-normal tracking-normal">(max 10 MB)</span>
                </label>

                <div
                  onClick={() => !uploadingPdf && pdfRef.current?.click()}
                  className={[
                    "h-[100px] rounded-xl flex flex-col items-center justify-center cursor-pointer border-2 border-dashed transition-all duration-300",
                    uploadingPdf
                      ? "opacity-60 cursor-not-allowed border-gray-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800/40"
                      : form.file_url
                        ? "border-emerald-300 dark:border-emerald-700/60 bg-emerald-50/40 dark:bg-emerald-900/10 hover:border-emerald-400 dark:hover:border-emerald-600"
                        : "border-gray-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800/40 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10",
                  ].join(" ")}
                >
                  {uploadingPdf ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 size={22} className="text-indigo-400 animate-spin" />
                      <p className="text-xs text-indigo-500 dark:text-indigo-400 font-medium">Uploading PDF…</p>
                    </div>
                  ) : form.file_url ? (
                    <div className="text-center space-y-1">
                      <FileText size={24} className="text-emerald-500 dark:text-emerald-400 mx-auto" />
                      <p className="text-emerald-600 dark:text-emerald-400 text-xs font-bold">PDF Ready</p>
                      <p className="text-[11px] text-gray-400 dark:text-gray-500 truncate max-w-[220px] mx-auto">
                        {pdfName || form.file_url.split("/").pop()}
                      </p>
                      <p className="text-[10px] text-indigo-500 dark:text-indigo-400 underline">Click to replace</p>
                    </div>
                  ) : (
                    <div className="text-center space-y-1.5 flex flex-col items-center">
                      <FileText size={24} className="text-gray-300 dark:text-gray-600" />
                      <p className="text-xs text-gray-400 dark:text-gray-500">Click to upload PDF</p>
                      <p className="text-[10px] uppercase tracking-wider text-gray-300 dark:text-gray-600">PDF only · max 10 MB</p>
                    </div>
                  )}
                </div>

                <input
                  ref={pdfRef}
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handlePdfFile(f);
                    e.target.value = "";
                  }}
                />

                {form.file_url && (
                  <input
                    name="file_url"
                    value={form.file_url}
                    onChange={handleChange}
                    placeholder="Or paste PDF URL…"
                    className={`${inputCls} mt-2`}
                  />
                )}
              </div>
            </div>
          </section>

          {/* ── Error ── */}
          {error && (
            <div className="flex items-center gap-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/60 text-red-600 dark:text-red-400 text-sm rounded-xl px-4 py-3">
              <AlertCircle size={16} className="flex-shrink-0" />
              {error}
            </div>
          )}

          {/* ── Actions ── */}
          <div className="flex items-center gap-3 pb-6">
            <button
              type="button"
              onClick={() => navigate("/profile/all-books")}
              className="px-6 py-3.5 rounded-xl text-sm font-medium bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy}
              className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl py-3.5 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-200/50 dark:hover:shadow-indigo-900/60"
            >
              {isUpdating
                ? <><Loader2 size={16} className="animate-spin" /> Saving…</>
                : uploadingThumb || uploadingPdf
                  ? <><Loader2 size={16} className="animate-spin" /> Uploading…</>
                  : <><Save size={16} /> Save Changes</>
              }
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

// import { useState, useEffect, useRef } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { toast } from "react-toastify";
// import {
//   BookMarked, ImagePlus, FileText, Loader2,
//   Save, AlertCircle, ChevronRight,
// } from "lucide-react";

// import { useGetCategoriesQuery } from "../../features/categories/categoriesApi";
// import {
//   useGetOwnerBooksQuery,
//   useUpdateBookMutation,
// } from "../../features/books/booksAPI";

// // ─── Upload image to Cloudinary ────────────────────────────────────────────────
// const CLOUD_NAME    = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
// const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

// async function uploadImageToCloudinary(file) {
//   const fd = new FormData();
//   fd.append("file",          file);
//   fd.append("upload_preset", UPLOAD_PRESET);

//   const res  = await fetch(
//     `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
//     { method: "POST", body: fd }
//   );
//   const data = await res.json();
//   if (!res.ok) throw new Error(data?.error?.message ?? "Image upload failed");
//   return data.secure_url;
// }

// // ─── Upload PDF to backend ─────────────────────────────────────────────────────
// async function uploadPdfToBackend(file, token) {
//   const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

//   const fd = new FormData();
//   fd.append("file", file);

//   const res = await fetch(`${BASE_URL}/files/upload`, {
//     method:  "POST",
//     headers: token ? { Authorization: `Bearer ${token}` } : {},
//     body:    fd,
//   });

//   const data = await res.json().catch(() => ({}));
//   if (!res.ok) throw new Error(data?.detail || data?.message || "PDF upload failed");
//   return data.url ?? data.file_url ?? data.secure_url ?? data;
// }

// const formatBytes = (bytes) => {
//   if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
//   return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
// };

// // ─── Style tokens ──────────────────────────────────────────────────────────────
// const inputCls =
//   "w-full rounded-xl px-4 py-3 text-sm outline-none transition-all bg-slate-50 border border-gray-200 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400";
// const labelCls =
//   "block text-xs font-black uppercase tracking-widest mb-2 text-gray-400";

// // ─── Main Component ────────────────────────────────────────────────────────────
// export default function EditBook() {
//   const navigate  = useNavigate();
//   const { id }    = useParams();
//   const token     = useSelector((state) => state.auth?.token);
//   const ownerId   = useSelector((state) => state.auth?.user?.id);

//   const [updateBook, { isLoading: isUpdating }] = useUpdateBookMutation();
//   const { data: categoriesData = [] }           = useGetCategoriesQuery();
//   const categories = categoriesData.map((c) => ({ value: c.id, label: c.name }));

//   const { data: ownerData, isLoading: isFetching } = useGetOwnerBooksQuery(
//     { owner_id: ownerId, page: 1, limit: 100 },
//     { skip: !ownerId }
//   );
//   const bookToEdit = (ownerData?.items ?? []).find((b) => b.id === Number(id));

//   // ── Form state ──────────────────────────────────────────────────────────────
//   const [form, setForm] = useState({
//     title:       "",
//     description: "",
//     category_id: "",
//     thumbnail:   "",
//     file_url:    "",
//     metadata:    "",
//   });

//   const [thumbPreview,   setThumbPreview]   = useState("");
//   const [pdfName,        setPdfName]        = useState("");
//   const [uploadingThumb, setUploadingThumb] = useState(false);
//   const [uploadingPdf,   setUploadingPdf]   = useState(false);
//   const [error,          setError]          = useState("");

//   const thumbRef       = useRef(null);
//   const pdfRef         = useRef(null);
//   const hasInitialised = useRef(false);

//   // Pre-fill form ONCE when book data first loads
//   useEffect(() => {
//     if (!bookToEdit || hasInitialised.current) return;

//     const catId = bookToEdit.category_ids?.[0] ?? "";
//     setForm({
//       title:       bookToEdit.title       ?? "",
//       description: bookToEdit.description ?? "",
//       category_id: catId ? String(catId)  : "",
//       thumbnail:   bookToEdit.thumbnail   ?? "",
//       file_url:    bookToEdit.file_url    ?? "",
//       metadata:    bookToEdit.metadata    ?? "",
//     });
//     setThumbPreview(bookToEdit.thumbnail ?? "");
//     if (bookToEdit.file_url) {
//       setPdfName(bookToEdit.file_url.split("/").pop());
//     }
//     hasInitialised.current = true;
//   }, [bookToEdit]);

//   // ── Field handler ───────────────────────────────────────────────────────────
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((p) => ({ ...p, [name]: value }));
//     if (name === "thumbnail") setThumbPreview(value);
//     setError("");
//   };

//   // ── Thumbnail upload → Cloudinary ───────────────────────────────────────────
//   const handleThumbFile = async (file) => {
//     if (!file?.type.startsWith("image/")) {
//       toast.error("Only image files are allowed!");
//       return;
//     }

//     const localPreview = URL.createObjectURL(file);
//     setThumbPreview(localPreview);
//     setUploadingThumb(true);

//     try {
//       const url = await uploadImageToCloudinary(file);
//       setThumbPreview(url);
//       setForm((p) => ({ ...p, thumbnail: url }));
//       toast.success("Cover image uploaded!");
//     } catch {
//       toast.error("Image upload failed.");
//       setThumbPreview(form.thumbnail);
//     } finally {
//       setUploadingThumb(false);
//       URL.revokeObjectURL(localPreview);
//     }
//   };

//   // ── PDF upload → backend /files/upload ─────────────────────────────────────
//   const handlePdfFile = async (file) => {
//     if (file.type !== "application/pdf") {
//       toast.error("Only PDF files are allowed!");
//       return;
//     }
//     if (file.size > 10 * 1024 * 1024) {
//       toast.error(`PDF too large (${formatBytes(file.size)}). Max 10 MB.`);
//       return;
//     }

//     setPdfName(file.name);
//     setUploadingPdf(true);

//     try {
//       const url = await uploadPdfToBackend(file, token);
//       setForm((p) => ({ ...p, file_url: url }));
//       toast.success("PDF uploaded!");
//     } catch (err) {
//       toast.error(err?.message || "PDF upload failed.");
//       setPdfName(form.file_url?.split("/").pop() ?? "");
//     } finally {
//       setUploadingPdf(false);
//     }
//   };

//   // ── Submit ──────────────────────────────────────────────────────────────────
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (!form.title.trim())       return setError("Book title is required.");
//     if (!form.description.trim()) return setError("Description is required.");
//     if (!form.category_id)        return setError("Please select a category.");
//     if (!form.file_url)           return setError("Please upload a PDF file.");
//     if (!form.thumbnail)          return setError("Please upload a cover image.");

//     try {
//       await updateBook({
//         id:           Number(id),
//         title:        form.title,
//         description:  form.description,
//         category_ids: [Number(form.category_id)],
//         thumbnail:    form.thumbnail,
//         file_url:     form.file_url,
//         metadata:     form.metadata,
//       }).unwrap();
//       toast.success("Book updated successfully!");
//       navigate("/profile/all-books");
//     } catch (err) {
//       const s = err?.status ?? err?.originalStatus;
//       const isSuccess =
//         s === "PARSING_ERROR" || (typeof s === "number" && s >= 200 && s < 300);
//       if (isSuccess) {
//         toast.success("Book updated successfully!");
//         navigate("/profile/all-books");
//         return;
//       }
//       setError(err?.data?.detail || err?.data?.message || "Failed to update book.");
//     }
//   };

//   const busy = isUpdating || uploadingThumb || uploadingPdf;

//   // ── Skeleton ────────────────────────────────────────────────────────────────
//   if (isFetching) return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
//       <div className="max-w-3xl w-full space-y-5 animate-pulse">
//         <div className="h-8 w-48 rounded-xl bg-gray-200" />
//         {[1, 2].map((i) => (
//           <div key={i} className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100 space-y-4">
//             <div className="h-4 w-32 rounded bg-gray-100" />
//             <div className="h-10 rounded-xl bg-gray-100" />
//             <div className="h-24 rounded-xl bg-gray-100" />
//             <div className="h-10 rounded-xl bg-gray-100" />
//           </div>
//         ))}
//       </div>
//     </div>
//   );

//   if (!bookToEdit && !isFetching) return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//       <div className="text-center">
//         <p className="text-gray-500 font-medium">Book not found.</p>
//         <button
//           onClick={() => navigate("/profile/all-books")}
//           className="mt-3 text-indigo-600 text-sm underline hover:text-indigo-800"
//         >
//           Back to My Books
//         </button>
//       </div>
//     </div>
//   );

//   // ── Render ──────────────────────────────────────────────────────────────────
//   return (
//     <div className="min-h-screen bg-gray-50 py-10 px-4">
//       <div className="max-w-3xl mx-auto">

//         {/* Breadcrumb */}
//         <nav className="flex items-center gap-1.5 text-xs mb-6 text-gray-400">
//           <button onClick={() => navigate("/profile")} className="hover:text-indigo-600 transition-colors font-medium">
//             Dashboard
//           </button>
//           <ChevronRight size={13} className="text-gray-300" />
//           <button onClick={() => navigate("/profile/all-books")} className="hover:text-indigo-600 transition-colors font-medium">
//             My Books
//           </button>
//           <ChevronRight size={13} className="text-gray-300" />
//           <span className="font-semibold text-gray-700">Edit Book</span>
//         </nav>

//         {/* Page heading */}
//         <div className="mb-8">
//           <h1 className="text-2xl font-black text-gray-900">
//             Edit <span className="text-indigo-600">Book</span>
//           </h1>
//           <p className="text-sm text-gray-400 mt-1">
//             Update the book details, cover image, and PDF file below.
//           </p>
//         </div>

//         <form onSubmit={handleSubmit} noValidate className="space-y-5">

//           {/* ── Section 1: Book Details ── */}
//           <section className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100">
//             <div className="flex items-center gap-3 mb-6">
//               <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
//                 <BookMarked size={18} className="text-indigo-500" />
//               </div>
//               <h2 className="text-base font-bold text-gray-800">Book Details</h2>
//             </div>

//             <div className="space-y-5">

//               <div>
//                 <label className={labelCls}>Title <span className="text-red-400">*</span></label>
//                 <input
//                   name="title"
//                   value={form.title}
//                   onChange={handleChange}
//                   placeholder="Enter book title"
//                   className={inputCls}
//                 />
//               </div>

//               <div>
//                 <label className={labelCls}>Description <span className="text-red-400">*</span></label>
//                 <textarea
//                   name="description"
//                   value={form.description}
//                   onChange={handleChange}
//                   placeholder="What is this book about?"
//                   rows={4}
//                   className={`${inputCls} resize-none`}
//                 />
//               </div>

//               <div>
//                 <label className={labelCls}>Category <span className="text-red-400">*</span></label>
//                 <select
//                   name="category_id"
//                   value={form.category_id}
//                   onChange={handleChange}
//                   className={`${inputCls} cursor-pointer`}
//                 >
//                   <option value="">Select a category…</option>
//                   {categories.map((c) => (
//                     <option key={c.value} value={String(c.value)}>{c.label}</option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className={labelCls}>Metadata</label>
//                 <input
//                   name="metadata"
//                   value={form.metadata}
//                   onChange={handleChange}
//                   placeholder="Optional metadata (tags, JSON, etc.)"
//                   className={inputCls}
//                 />
//               </div>

//             </div>
//           </section>

//           {/* ── Section 2: Files ── */}
//           <section className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100">
//             <div className="flex items-center gap-3 mb-6">
//               <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center">
//                 <FileText size={18} className="text-purple-500" />
//               </div>
//               <h2 className="text-base font-bold text-gray-800">Files</h2>
//             </div>

//             <div className="space-y-6">

//               {/* Cover Thumbnail */}
//               <div>
//                 <label className={labelCls}>
//                   Cover Thumbnail <span className="text-red-400">*</span>
//                 </label>
//                 <div className="flex gap-4 items-start">
//                   <div className="w-36 h-24 rounded-xl overflow-hidden bg-indigo-50 border border-gray-200 flex items-center justify-center flex-shrink-0">
//                     {uploadingThumb ? (
//                       <Loader2 size={20} className="text-indigo-400 animate-spin" />
//                     ) : thumbPreview ? (
//                       <img src={thumbPreview} alt="cover" className="w-full h-full object-cover" onError={() => setThumbPreview("")} />
//                     ) : (
//                       <ImagePlus size={22} className="text-indigo-300" />
//                     )}
//                   </div>

//                   <div className="flex-1 space-y-2">
//                     <button
//                       type="button"
//                       onClick={() => thumbRef.current?.click()}
//                       disabled={uploadingThumb}
//                       className="w-full border-2 border-dashed border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 rounded-xl py-2.5 text-xs font-bold text-gray-500 hover:text-indigo-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
//                     >
//                       <ImagePlus size={13} />
//                       {uploadingThumb ? "Uploading…" : "Upload New Image"}
//                     </button>
//                     <input
//                       ref={thumbRef}
//                       type="file"
//                       accept="image/*"
//                       className="hidden"
//                       onChange={(e) => {
//                         const f = e.target.files?.[0];
//                         if (f) handleThumbFile(f);
//                         e.target.value = "";
//                       }}
//                     />
//                     <input
//                       name="thumbnail"
//                       value={form.thumbnail}
//                       onChange={handleChange}
//                       placeholder="Or paste image URL…"
//                       className={inputCls}
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* PDF Upload */}
//               <div>
//                 <label className={labelCls}>
//                   Book PDF <span className="text-red-400">*</span>
//                   <span className="ml-1 text-gray-300 normal-case font-normal tracking-normal">(max 10 MB)</span>
//                 </label>

//                 <div
//                   onClick={() => !uploadingPdf && pdfRef.current?.click()}
//                   className={`h-[100px] rounded-xl flex flex-col items-center justify-center cursor-pointer border-2 border-dashed transition-all duration-300 ${
//                     uploadingPdf ? "opacity-60 cursor-not-allowed" : "hover:border-indigo-300 hover:bg-indigo-50/30"
//                   } ${form.file_url ? "border-emerald-300 bg-emerald-50/40" : "border-gray-200 bg-slate-50"}`}
//                 >
//                   {uploadingPdf ? (
//                     <div className="flex flex-col items-center gap-2">
//                       <Loader2 size={22} className="text-indigo-400 animate-spin" />
//                       <p className="text-xs text-indigo-500 font-medium">Uploading PDF…</p>
//                     </div>
//                   ) : form.file_url ? (
//                     <div className="text-center space-y-1">
//                       <FileText size={24} className="text-emerald-500 mx-auto" />
//                       <p className="text-emerald-600 text-xs font-bold">PDF Ready</p>
//                       <p className="text-[11px] text-gray-400 truncate max-w-[220px] mx-auto">
//                         {pdfName || form.file_url.split("/").pop()}
//                       </p>
//                       <p className="text-[10px] text-indigo-500 underline">Click to replace</p>
//                     </div>
//                   ) : (
//                     <div className="text-center space-y-1.5 flex flex-col items-center">
//                       <FileText size={24} className="text-gray-300" />
//                       <p className="text-xs text-gray-400">Click to upload PDF</p>
//                       <p className="text-[10px] uppercase tracking-wider text-gray-300">PDF only · max 10 MB</p>
//                     </div>
//                   )}
//                 </div>

//                 <input
//                   ref={pdfRef}
//                   type="file"
//                   accept="application/pdf"
//                   className="hidden"
//                   onChange={(e) => {
//                     const f = e.target.files?.[0];
//                     if (f) handlePdfFile(f);
//                     e.target.value = "";
//                   }}
//                 />

//                 {form.file_url && (
//                   <input
//                     name="file_url"
//                     value={form.file_url}
//                     onChange={handleChange}
//                     placeholder="Or paste PDF URL…"
//                     className={`${inputCls} mt-2`}
//                   />
//                 )}
//               </div>

//             </div>
//           </section>

//           {/* ── Error ── */}
//           {error && (
//             <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
//               <AlertCircle size={16} className="flex-shrink-0" />
//               {error}
//             </div>
//           )}

//           {/* ── Actions ── */}
//           <div className="flex items-center gap-3 pb-6">
//             <button
//               type="button"
//               onClick={() => navigate("/profile/all-books")}
//               className="px-6 py-3.5 rounded-xl text-sm font-medium bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 transition-all"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={busy}
//               className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl py-3.5 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-200"
//             >
//               {isUpdating
//                 ? <><Loader2 size={16} className="animate-spin" /> Saving…</>
//                 : uploadingThumb || uploadingPdf
//                 ? <><Loader2 size={16} className="animate-spin" /> Uploading…</>
//                 : <><Save size={16} /> Save Changes</>
//               }
//             </button>
//           </div>

//         </form>
//       </div>
//     </div>
//   );
// }