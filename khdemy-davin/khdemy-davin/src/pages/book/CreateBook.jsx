// import { useState, useRef, useEffect } from "react";
// import { Link, useParams, useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { toast } from "react-toastify";
// import {
//   BookMarked, Paperclip, FileText, ImageIcon, ChevronDown,
//   CheckCircle2, ChevronRight, Loader2, ArrowRight, Circle,
// } from "lucide-react";

// import { useGetCategoriesQuery } from "../../features/categories/categoriesApi";
// import { useCreateBookMutation, useGetOwnerBooksQuery, useUpdateBookMutation } from "../../features/books/booksAPI";
// // import { useCreateBookMutation, useGetOwnerBooksQuery, useUpdateBookMutation } from "../../features/books/booksAPI";

// // ─── Style tokens ──────────────────────────────────────────────────────────────
// const inputCls =
//   "w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100";

// const inputStyle = {
//   background: "var(--bg-card)",
//   border:     "1px solid var(--border)",
//   color:      "var(--text)",
// };

// const labelCls = "block text-xs font-bold uppercase tracking-widest mb-2";

// const sectionStyle = {
//   background: "var(--bg-card)",
//   border:     "1px solid var(--border)",
// };

// // ─── Helpers ───────────────────────────────────────────────────────────────────
// const toBase64 = (file) =>
//   new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.onload  = () => resolve(reader.result);
//     reader.onerror = reject;
//     reader.readAsDataURL(file);
//   });

// // ─── FormField wrapper ─────────────────────────────────────────────────────────
// const FormField = ({ label, children }) => (
//   <div className="mb-5">
//     <label className={labelCls} style={{ color: "var(--text-muted)" }}>{label}</label>
//     {children}
//   </div>
// );

// // ─── Custom Dropdown ───────────────────────────────────────────────────────────
// const CustomDropdown = ({ options, placeholder, value, onChange }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const dropdownRef         = useRef(null);
//   const selected            = options.find((o) => o.value === value) || null;

//   useEffect(() => {
//     const handler = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target))
//         setIsOpen(false);
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   return (
//     <div className="relative" ref={dropdownRef}>
//       <button
//         type="button"
//         onClick={() => setIsOpen(!isOpen)}
//         className={`${inputCls} flex items-center justify-between`}
//         style={inputStyle}
//       >
//         <span style={{ color: selected ? "var(--text)" : "var(--text-muted)" }}>
//           {selected ? selected.label : placeholder}
//         </span>
//         <ChevronDown
//           size={15}
//           style={{ color: "var(--text-muted)" }}
//           className={`transition-transform duration-200 ${isOpen ? "rotate-180" : "rotate-0"}`}
//         />
//       </button>

//       {isOpen && (
//         <div
//           className="absolute z-20 w-full mt-2 rounded-xl shadow-lg max-h-60 overflow-y-auto"
//           style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
//         >
//           {options.map((opt) => (
//             <div
//               key={opt.value}
//               onClick={() => { onChange(opt.value); setIsOpen(false); }}
//               className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${
//                 value === opt.value
//                   ? "bg-indigo-50 text-indigo-600 font-semibold"
//                   : "hover:bg-indigo-50/20"
//               }`}
//               style={value === opt.value ? {} : { color: "var(--text-muted)" }}
//             >
//               {opt.label}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// // ─── Drag & Drop Upload Area ───────────────────────────────────────────────────
// const DragAndDropArea = ({ label, file, onFileSelect, accept }) => {
//   const inputRef              = useRef(null);
//   const [dragging, setDragging] = useState(false);

//   const validate = (f) => {
//     if (accept === "pdf"   && f.type !== "application/pdf") { toast.error("Only PDF files are allowed!"); return false; }
//     if (accept === "image" && !f.type.startsWith("image/")) { toast.error("Only image files are allowed!"); return false; }
//     return true;
//   };

//   const handleFileChange = (e) => {
//     const f = e.target.files[0];
//     if (f && validate(f)) onFileSelect(f);
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     setDragging(false);
//     const f = e.dataTransfer.files[0];
//     if (f && validate(f)) onFileSelect(f);
//   };

//   // file can be a File object (newly picked) or { url: "..." } (existing)
//   const fileName = file instanceof File ? file.name : file?.url?.split("/").pop();

//   return (
//     <FormField label={label}>
//       <div
//         onClick={() => inputRef.current.click()}
//         onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
//         onDragLeave={() => setDragging(false)}
//         onDrop={handleDrop}
//         className={`h-[140px] rounded-xl flex flex-col items-center justify-center cursor-pointer border-2 border-dashed transition-all duration-300 ${
//           dragging ? "border-indigo-400 scale-[1.01]" : ""
//         }`}
//         style={
//           file
//             ? { borderColor: "#34d399", background: "rgba(16,185,129,0.08)" }
//             : dragging
//             ? { borderColor: "#6366f1", background: "rgba(99,102,241,0.06)" }
//             : { borderColor: "var(--border)", background: "var(--bg-soft)" }
//         }
//       >
//         {file ? (
//           <div className="text-center space-y-1.5">
//             <CheckCircle2 size={28} className="text-emerald-500 mx-auto" />
//             <p className="text-emerald-600 text-xs font-bold">Ready!</p>
//             <p className="text-[11px] truncate max-w-[200px] mx-auto" style={{ color: "var(--text-muted)" }}>
//               {fileName}
//             </p>
//           </div>
//         ) : (
//           <div className="text-center space-y-2 flex flex-col items-center">
//             {accept === "pdf"
//               ? <FileText size={28} style={{ color: "var(--border)" }} />
//               : <ImageIcon size={28} style={{ color: "var(--border)" }} />
//             }
//             <p className="text-xs" style={{ color: "var(--text-muted)" }}>
//               Drag & drop or{" "}
//               <span className="text-indigo-500 underline underline-offset-2 font-medium">browse</span>
//             </p>
//             <p className="text-[10px] uppercase tracking-wider" style={{ color: "var(--border)" }}>
//               {accept === "pdf" ? "PDF only" : "JPG, PNG, WEBP"}
//             </p>
//           </div>
//         )}
//         <input
//           type="file"
//           ref={inputRef}
//           accept={accept === "pdf" ? "application/pdf" : "image/*"}
//           onChange={handleFileChange}
//           className="hidden"
//         />
//       </div>
//     </FormField>
//   );
// };

// // ─── Main Component ────────────────────────────────────────────────────────────
// export default function CreateBook() {
//   const { id }   = useParams();          // present when editing: /dashboard/books/edit/:id
//   const navigate = useNavigate();

//   // Logged-in user id — adjust selector to match your Redux auth slice
//   const ownerId = useSelector((state) => state.auth?.user?.id);

//   const [createBook, { isLoading }]                     = useCreateBookMutation();
//   const [updateBook, { isLoading: isUpdating }]         = useUpdateBookMutation();
//   const { data: categoriesData, isLoading: catLoading } = useGetCategoriesQuery();

//   // Fetch the owner's full book list (page 1, high limit) so we can find the
//   // book being edited without a separate "get by id" endpoint.
//   const { data: ownerData } = useGetOwnerBooksQuery(
//     { owner_id: ownerId, page: 1, limit: 100 },
//     { skip: !ownerId || !id }             // only needed when editing
//   );

//   const categories = categoriesData?.map((c) => ({ value: c.id, label: c.name })) || [];

//   // Find the book to edit from the paginated items array
//   const bookToEdit = id
//     ? (ownerData?.items ?? []).find((b) => b.id === Number(id))
//     : null;

//   // ── Form state ──────────────────────────────────────────────────────────────
//   const [title,         setTitle]         = useState("");
//   const [description,   setDescription]   = useState("");
//   const [category,      setCategory]      = useState("");
//   const [metadata,      setMetadata]      = useState("");
//   const [fileBook,      setFileBook]      = useState(null);
//   const [thumbnailFile, setThumbnailFile] = useState(null);
//   const [isConverting,  setIsConverting]  = useState(false);

//   // Populate form when bookToEdit is available
//   useEffect(() => {
//     if (bookToEdit) {
//       setTitle(bookToEdit.title || "");
//       setDescription(bookToEdit.description || "");
//       // category_ids is already normalised to an array of IDs by booksApi
//       setCategory(bookToEdit.category_ids?.[0] ?? "");
//       setMetadata(bookToEdit.metadata || "");
//       // Wrap existing URLs so DragAndDropArea shows the "Ready" state
//       setFileBook(bookToEdit.file_url ? { url: bookToEdit.file_url } : null);
//       setThumbnailFile(bookToEdit.thumbnail ? { url: bookToEdit.thumbnail } : null);
//     } else {
//       setTitle(""); setDescription(""); setCategory("");
//       setMetadata(""); setFileBook(null); setThumbnailFile(null);
//     }
//   }, [bookToEdit]);

//   // ── Submit ──────────────────────────────────────────────────────────────────
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!title || !description || !category || !fileBook || !thumbnailFile) {
//       toast.error("Please fill all required fields!");
//       return;
//     }

//     try {
//       setIsConverting(true);

//       // Only convert to base64 if a new File was picked; otherwise reuse the URL
//       const file_url  = fileBook      instanceof File
//         ? await toBase64(fileBook)
//         : bookToEdit?.file_url  ?? "";

//       const thumbnail = thumbnailFile instanceof File
//         ? await toBase64(thumbnailFile)
//         : bookToEdit?.thumbnail ?? "";

//       setIsConverting(false);

//       // Payload matches POST /books/ body:
//       // { title, description, category_ids, thumbnail, file_url, metadata }
//       const payload = {
//         title,
//         description,
//         category_ids: [category],
//         file_url,
//         thumbnail,
//         metadata,
//       };

//       if (id) {
//         await updateBook({ id: Number(id), ...payload }).unwrap();
//         toast.success("Book updated successfully!");
//       } else {
//         await createBook(payload).unwrap();
//         toast.success("Book created successfully!");
//       }

//       navigate("/library");
//     } catch (err) {
//       setIsConverting(false);
//       if (err?.status === "FETCH_ERROR") {
//         toast.error("Cannot reach the server. Check your proxy config.");
//       } else {
//         toast.error(err?.data?.detail || "Failed to save book!");
//       }
//     }
//   };

//   const busy = isLoading || isUpdating || isConverting;

//   // ── Render ──────────────────────────────────────────────────────────────────
//   return (
//     <div
//       className="min-h-screen flex items-center justify-center px-4 py-10"
//       style={{ background: "var(--bg)" }}
//     >
//       <div className="w-full max-w-3xl">

//         {/* Breadcrumb */}
//         <nav className="flex items-center gap-1.5 text-xs mb-6" style={{ color: "var(--text-muted)" }}>
//           <Link to="/profile"       className="hover:text-indigo-600 transition-colors">Dashboard</Link>
//           <ChevronRight size={13} style={{ color: "var(--border)" }} />
//           <Link to="/profile/books" className="hover:text-indigo-600 transition-colors">My Books</Link>
//           <ChevronRight size={13} style={{ color: "var(--border)" }} />
//           <span className="font-semibold" style={{ color: "var(--text)" }}>{id ? "Edit Book" : "Add Book"}</span>
//         </nav>

//         {/* Page heading */}
//         <div className="mb-8">
//           <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-200 bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-widest mb-4">
//             <Circle size={6} className="fill-indigo-500 text-indigo-500" />
//             {id ? "Edit Book" : "New Book"}
//           </div>
//           <h1 className="text-2xl font-black" style={{ color: "var(--text)" }}>
//             {id ? "Update your " : "Publish a "}
//             <span className="text-indigo-600">Book</span>
//           </h1>
//           <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
//             {id
//               ? "Make changes to the book details below."
//               : "Fill in the details and upload your PDF and cover image."}
//           </p>
//         </div>

//         <form onSubmit={handleSubmit} noValidate className="space-y-5">

//           {/* Section 1 — Book Details */}
//           <section className="rounded-2xl p-7 shadow-sm" style={sectionStyle}>
//             <div className="flex items-center gap-3 mb-6">
//               <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
//                 <BookMarked size={18} className="text-indigo-500" />
//               </div>
//               <h2 className="text-base font-bold" style={{ color: "var(--text)" }}>Book Details</h2>
//             </div>

//             <div className="space-y-5">
//               <FormField label="Title *">
//                 <input
//                   type="text"
//                   value={title}
//                   onChange={(e) => setTitle(e.target.value)}
//                   placeholder="Enter book title"
//                   className={inputCls}
//                   style={inputStyle}
//                 />
//               </FormField>

//               <FormField label="Description *">
//                 <textarea
//                   value={description}
//                   onChange={(e) => setDescription(e.target.value)}
//                   placeholder="What is this book about?"
//                   rows={4}
//                   className={`${inputCls} resize-none`}
//                   style={inputStyle}
//                 />
//               </FormField>

//               <FormField label="Category *">
//                 <CustomDropdown
//                   options={categories}
//                   placeholder={catLoading ? "Loading categories…" : "Select a category"}
//                   value={category}
//                   onChange={setCategory}
//                 />
//               </FormField>

//               <FormField label="Metadata">
//                 <input
//                   type="text"
//                   value={metadata}
//                   onChange={(e) => setMetadata(e.target.value)}
//                   placeholder="Optional metadata (JSON string, tags, etc.)"
//                   className={inputCls}
//                   style={inputStyle}
//                 />
//               </FormField>
//             </div>
//           </section>

//           {/* Section 2 — Files */}
//           <section className="rounded-2xl p-7 shadow-sm" style={sectionStyle}>
//             <div className="flex items-center gap-3 mb-6">
//               <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center">
//                 <Paperclip size={18} className="text-purple-500" />
//               </div>
//               <h2 className="text-base font-bold" style={{ color: "var(--text)" }}>
//                 Files
//                 {isConverting && (
//                   <span className="ml-3 inline-flex items-center gap-1.5 text-xs text-indigo-500 font-normal">
//                     <Loader2 size={12} className="animate-spin" />
//                     Converting…
//                   </span>
//                 )}
//               </h2>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//               <DragAndDropArea
//                 label="Cover Thumbnail *"
//                 file={thumbnailFile}
//                 onFileSelect={setThumbnailFile}
//                 accept="image"
//               />
//               <DragAndDropArea
//                 label="Book PDF *"
//                 file={fileBook}
//                 onFileSelect={setFileBook}
//                 accept="pdf"
//               />
//             </div>
//           </section>

//           {/* Footer — Actions */}
//           <div className="flex items-center justify-end gap-3 pb-4">
//             <button
//               type="button"
//               onClick={() => navigate("/library")}
//               className="px-6 py-3.5 rounded-xl text-sm font-medium transition-all"
//               style={{
//                 background: "var(--bg-card)",
//                 border:     "1px solid var(--border)",
//                 color:      "var(--text-muted)",
//               }}
//             >
//               Cancel
//             </button>

//             <button
//               type="submit"
//               disabled={busy}
//               className="flex items-center gap-2 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-200 active:translate-y-0"
//             >
//               {busy ? (
//                 <>
//                   <Loader2 size={15} className="animate-spin" />
//                   {isConverting ? "Converting…" : id ? "Updating…" : "Publishing…"}
//                 </>
//               ) : (
//                 <>
//                   {id ? "Update Book" : "Publish Book"}
//                   <ArrowRight size={15} />
//                 </>
//               )}
//             </button>
//           </div>

//         </form>
//       </div>
//     </div>
//   );
// }


import { useState, useRef, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  BookMarked, Paperclip, FileText, ImageIcon, ChevronDown,
  CheckCircle2, ChevronRight, Loader2, ArrowRight, Circle,
} from "lucide-react";

import { useGetCategoriesQuery } from "../../features/categories/categoriesApi";
import { useCreateBookMutation, useGetOwnerBooksQuery, useUpdateBookMutation } from "../../features/books/booksAPI";

// ─── Config ────────────────────────────────────────────────────────────────────
const MAX_PDF_MB       = 10;
const MAX_THUMBNAIL_MB = 5;
const MAX_PDF_BYTES    = MAX_PDF_MB * 1024 * 1024;
const MAX_THUMB_BYTES  = MAX_THUMBNAIL_MB * 1024 * 1024;

// ─── Style tokens ──────────────────────────────────────────────────────────────
const inputCls =
  "w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100";

const inputStyle = {
  background: "var(--bg-card)",
  border:     "1px solid var(--border)",
  color:      "var(--text)",
};

const labelCls = "block text-xs font-bold uppercase tracking-widest mb-2";

const sectionStyle = {
  background: "var(--bg-card)",
  border:     "1px solid var(--border)",
};

// ─── Helpers ───────────────────────────────────────────────────────────────────
const compressImage = (file, quality = 0.7, maxDim = 800) =>
  new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let { width, height } = img;
      if (width > maxDim || height > maxDim) {
        const ratio = Math.min(maxDim / width, maxDim / height);
        width  = Math.round(width  * ratio);
        height = Math.round(height * ratio);
      }
      canvas.width  = width;
      canvas.height = height;
      canvas.getContext("2d").drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => resolve(new File([blob], file.name, { type: "image/jpeg" })),
        "image/jpeg",
        quality
      );
      URL.revokeObjectURL(img.src);
    };
    img.src = URL.createObjectURL(file);
  });

const compressToTarget = async (file, targetBytes) => {
  let quality = 0.7;
  let maxDim  = 800;
  let result  = await compressImage(file, quality, maxDim);

  while (result.size > targetBytes && quality > 0.2) {
    quality -= 0.1;
    result   = await compressImage(file, quality, maxDim);
  }
  while (result.size > targetBytes && maxDim > 300) {
    maxDim -= 100;
    result  = await compressImage(file, 0.5, maxDim);
  }

  return result;
};

const formatBytes = (bytes) => {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

// ─── Upload image to Cloudinary ────────────────────────────────────────────────
const uploadImageToCloudinary = async (file) => {
  const cloudName    = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const form = new FormData();
  form.append("file",          file);
  form.append("upload_preset", uploadPreset);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: form }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw { status: res.status, data: err?.error?.message || "Image upload failed." };
  }

  const data = await res.json();
  return data.secure_url;
};

// ─── Upload PDF to backend ─────────────────────────────────────────────────────
const uploadPdfToBackend = async (file, token) => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

  const form = new FormData();
  form.append("file", file);

  const res = await fetch(`${BASE_URL}/files/upload`, {
    method:  "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body:    form,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw { status: res.status, data: err?.detail || err?.message || "PDF upload failed." };
  }

  const data = await res.json();
  return data.url ?? data.file_url ?? data.secure_url ?? data;
};

// ─── FormField wrapper ─────────────────────────────────────────────────────────
const FormField = ({ label, children }) => (
  <div className="mb-5">
    <label className={labelCls} style={{ color: "var(--text-muted)" }}>{label}</label>
    {children}
  </div>
);

// ─── Custom Dropdown ───────────────────────────────────────────────────────────
const CustomDropdown = ({ options, placeholder, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef         = useRef(null);
  const selected            = options.find((o) => o.value === value) || null;

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setIsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`${inputCls} flex items-center justify-between`}
        style={inputStyle}
      >
        <span style={{ color: selected ? "var(--text)" : "var(--text-muted)" }}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          size={15}
          style={{ color: "var(--text-muted)" }}
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : "rotate-0"}`}
        />
      </button>

      {isOpen && (
        <div
          className="absolute z-20 w-full mt-2 rounded-xl shadow-lg max-h-60 overflow-y-auto"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
        >
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => { onChange(opt.value); setIsOpen(false); }}
              className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${
                value === opt.value
                  ? "bg-indigo-50 text-indigo-600 font-semibold"
                  : "hover:bg-indigo-50/20"
              }`}
              style={value === opt.value ? {} : { color: "var(--text-muted)" }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Drag & Drop Upload Area ───────────────────────────────────────────────────
const DragAndDropArea = ({ label, file, onFileSelect, accept, maxBytes }) => {
  const inputRef                = useRef(null);
  const [dragging, setDragging] = useState(false);

  const validate = (f) => {
    if (accept === "pdf"   && f.type !== "application/pdf") {
      toast.error("Only PDF files are allowed!");
      return false;
    }
    if (accept === "image" && !f.type.startsWith("image/")) {
      toast.error("Only image files are allowed!");
      return false;
    }
    if (maxBytes && f.size > maxBytes) {
      toast.error(`File too large! Max size is ${formatBytes(maxBytes)}. Your file is ${formatBytes(f.size)}.`);
      return false;
    }
    return true;
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f && validate(f)) onFileSelect(f);
    e.target.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f && validate(f)) onFileSelect(f);
  };

  const fileName = file instanceof File ? file.name : file?.url?.split("/").pop();
  const fileSize = file instanceof File ? ` · ${formatBytes(file.size)}` : "";

  return (
    <FormField label={label}>
      <div
        onClick={() => inputRef.current.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`h-[140px] rounded-xl flex flex-col items-center justify-center cursor-pointer border-2 border-dashed transition-all duration-300 ${
          dragging ? "border-indigo-400 scale-[1.01]" : ""
        }`}
        style={
          file
            ? { borderColor: "#34d399", background: "rgba(16,185,129,0.08)" }
            : dragging
            ? { borderColor: "#6366f1", background: "rgba(99,102,241,0.06)" }
            : { borderColor: "var(--border)", background: "var(--bg-soft)" }
        }
      >
        {file ? (
          <div className="text-center space-y-1.5">
            <CheckCircle2 size={28} className="text-emerald-500 mx-auto" />
            <p className="text-emerald-600 text-xs font-bold">Ready!</p>
            <p className="text-[11px] truncate max-w-[200px] mx-auto" style={{ color: "var(--text-muted)" }}>
              {fileName}{fileSize}
            </p>
          </div>
        ) : (
          <div className="text-center space-y-2 flex flex-col items-center">
            {accept === "pdf"
              ? <FileText size={28} style={{ color: "var(--border)" }} />
              : <ImageIcon size={28} style={{ color: "var(--border)" }} />
            }
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Drag & drop or{" "}
              <span className="text-indigo-500 underline underline-offset-2 font-medium">browse</span>
            </p>
            <p className="text-[10px] uppercase tracking-wider" style={{ color: "var(--border)" }}>
              {accept === "pdf" ? `PDF only · max ${MAX_PDF_MB} MB` : `JPG, PNG, WEBP · max ${MAX_THUMBNAIL_MB} MB`}
            </p>
          </div>
        )}
        <input
          type="file"
          ref={inputRef}
          accept={accept === "pdf" ? "application/pdf" : "image/*"}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </FormField>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────
export default function CreateBook() {
  const { id }   = useParams();
  const navigate = useNavigate();

  const token   = useSelector((state) => state.auth?.token);
  const ownerId = useSelector((state) => state.auth?.user?.id);

  const [createBook, { isLoading }]                     = useCreateBookMutation();
  const [updateBook, { isLoading: isUpdating }]         = useUpdateBookMutation();
  const { data: categoriesData, isLoading: catLoading } = useGetCategoriesQuery();

  const { data: ownerData } = useGetOwnerBooksQuery(
    { owner_id: ownerId, page: 1, limit: 100 },
    { skip: !ownerId || !id }
  );

  const categories = categoriesData?.map((c) => ({ value: c.id, label: c.name })) || [];

  const bookToEdit = id
    ? (ownerData?.items ?? []).find((b) => b.id === Number(id))
    : null;

  // ── Form state ──────────────────────────────────────────────────────────────
  const [title,          setTitle]          = useState("");
  const [description,    setDescription]    = useState("");
  const [category,       setCategory]       = useState("");
  const [metadata,       setMetadata]       = useState("");
  const [fileBook,       setFileBook]       = useState(null);
  const [thumbnailFile,  setThumbnailFile]  = useState(null);
  const [isConverting,   setIsConverting]   = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");

  useEffect(() => {
    if (bookToEdit) {
      setTitle(bookToEdit.title || "");
      setDescription(bookToEdit.description || "");
      setCategory(bookToEdit.category_ids?.[0] ?? "");
      setMetadata(bookToEdit.metadata || "");
      setFileBook(bookToEdit.file_url ? { url: bookToEdit.file_url } : null);
      setThumbnailFile(bookToEdit.thumbnail ? { url: bookToEdit.thumbnail } : null);
    } else {
      setTitle(""); setDescription(""); setCategory("");
      setMetadata(""); setFileBook(null); setThumbnailFile(null);
    }
  }, [bookToEdit]);

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !category || !fileBook || !thumbnailFile) {
      toast.error("Please fill all required fields!");
      return;
    }

    try {
      setIsConverting(true);

      // 1. Compress + upload thumbnail → Cloudinary
      let thumbnail = bookToEdit?.thumbnail ?? "";
      if (thumbnailFile instanceof File) {
        setUploadProgress("Compressing cover image…");
        const compressed = await compressToTarget(thumbnailFile, MAX_THUMB_BYTES);
        setUploadProgress("Uploading cover image…");
        thumbnail = await uploadImageToCloudinary(compressed);
      }

      // 2. Upload PDF → backend /files/upload
      let file_url = bookToEdit?.file_url ?? "";
      if (fileBook instanceof File) {
        setUploadProgress("Uploading PDF…");
        try {
          file_url = await uploadPdfToBackend(fileBook, token);
        } catch (uploadErr) {
          toast.error(uploadErr?.data || "Failed to upload PDF.");
          setIsConverting(false);
          setUploadProgress("");
          return;
        }
      }

      setIsConverting(false);
      setUploadProgress("");

      const payload = {
        title,
        description,
        category_ids: [category],
        file_url,
        thumbnail,
        metadata,
      };

      try {
        if (id) {
          await updateBook({ id: Number(id), ...payload }).unwrap();
          toast.success("Book updated successfully!");
          navigate("/profile/all-books");
        } else {
          await createBook(payload).unwrap();
          toast.success("Book created successfully!");
          navigate("/profile/all-books");
        }
      } catch (saveErr) {
        const s = saveErr?.status ?? saveErr?.originalStatus;
        const isSuccess =
          s === "PARSING_ERROR" ||
          (typeof s === "number" && s >= 200 && s < 300);
        if (isSuccess) {
          toast.success(id ? "Book updated successfully!" : "Book created successfully!");
          navigate("/profile/all-books");
          return;
        }
        throw saveErr;
      }

    } catch (err) {
      setIsConverting(false);
      setUploadProgress("");
      const status = err?.status ?? err?.originalStatus;
      if (status === "FETCH_ERROR") {
        toast.error("Cannot reach the server. Check your connection.");
      } else {
        toast.error(err?.data?.detail || err?.data?.message || err?.data || "Failed to save book!");
      }
    }
  };

  const busy = isLoading || isUpdating || isConverting;

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-10"
      style={{ background: "var(--bg)" }}
    >
      <div className="w-full max-w-3xl">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs mb-6" style={{ color: "var(--text-muted)" }}>
          <Link to="/profile"       className="hover:text-indigo-600 transition-colors">Dashboard</Link>
          <ChevronRight size={13} style={{ color: "var(--border)" }} />
          <Link to="/profile/books" className="hover:text-indigo-600 transition-colors">My Books</Link>
          <ChevronRight size={13} style={{ color: "var(--border)" }} />
          <span className="font-semibold" style={{ color: "var(--text)" }}>{id ? "Edit Book" : "Add Book"}</span>
        </nav>

        {/* Page heading */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-200 bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-widest mb-4">
            <Circle size={6} className="fill-indigo-500 text-indigo-500" />
            {id ? "Edit Book" : "New Book"}
          </div>
          <h1 className="text-2xl font-black" style={{ color: "var(--text)" }}>
            {id ? "Update your " : "Publish a "}
            <span className="text-indigo-600">Book</span>
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            {id
              ? "Make changes to the book details below."
              : "Fill in the details and upload your PDF and cover image."}
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">

          {/* Section 1 — Book Details */}
          <section className="rounded-2xl p-7 shadow-sm" style={sectionStyle}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                <BookMarked size={18} className="text-indigo-500" />
              </div>
              <h2 className="text-base font-bold" style={{ color: "var(--text)" }}>Book Details</h2>
            </div>

            <div className="space-y-5">
              <FormField label="Title *">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter book title"
                  className={inputCls}
                  style={inputStyle}
                />
              </FormField>

              <FormField label="Description *">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What is this book about?"
                  rows={4}
                  className={`${inputCls} resize-none`}
                  style={inputStyle}
                />
              </FormField>

              <FormField label="Category *">
                <CustomDropdown
                  options={categories}
                  placeholder={catLoading ? "Loading categories…" : "Select a category"}
                  value={category}
                  onChange={setCategory}
                />
              </FormField>

              <FormField label="Metadata">
                <input
                  type="text"
                  value={metadata}
                  onChange={(e) => setMetadata(e.target.value)}
                  placeholder="Optional metadata (JSON string, tags, etc.)"
                  className={inputCls}
                  style={inputStyle}
                />
              </FormField>
            </div>
          </section>

          {/* Section 2 — Files */}
          <section className="rounded-2xl p-7 shadow-sm" style={sectionStyle}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center">
                <Paperclip size={18} className="text-purple-500" />
              </div>
              <h2 className="text-base font-bold" style={{ color: "var(--text)" }}>
                Files
                {isConverting && (
                  <span className="ml-3 inline-flex items-center gap-1.5 text-xs text-indigo-500 font-normal">
                    <Loader2 size={12} className="animate-spin" />
                    {uploadProgress || "Processing…"}
                  </span>
                )}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <DragAndDropArea
                label="Cover Thumbnail *"
                file={thumbnailFile}
                onFileSelect={setThumbnailFile}
                accept="image"
                maxBytes={MAX_THUMB_BYTES}
              />
              <DragAndDropArea
                label={`Book PDF * (max ${MAX_PDF_MB} MB)`}
                file={fileBook}
                onFileSelect={setFileBook}
                accept="pdf"
                maxBytes={MAX_PDF_BYTES}
              />
            </div>
          </section>

          {/* Footer — Actions */}
          <div className="flex items-center justify-end gap-3 pb-4">
            <button
              type="button"
              onClick={() => navigate("/library")}
              className="px-6 py-3.5 rounded-xl text-sm font-medium transition-all"
              style={{
                background: "var(--bg-card)",
                border:     "1px solid var(--border)",
                color:      "var(--text-muted)",
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={busy}
              className="flex items-center gap-2 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-200 active:translate-y-0"
            >
              {busy ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  {uploadProgress || (isConverting ? "Converting…" : id ? "Updating…" : "Publishing…")}
                </>
              ) : (
                <>
                  {id ? "Update Book" : "Publish Book"}
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}