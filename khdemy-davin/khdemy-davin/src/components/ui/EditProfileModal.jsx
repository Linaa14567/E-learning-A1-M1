import { useState, useEffect, useRef } from "react"
import { useGetProfileQuery, useUpdateProfileMutation } from "../../features/teacher/teacherApi"
import { X, Save, Loader2, ImagePlus } from "lucide-react"
import { toast } from "react-toastify"

const CLOUD_NAME     = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET  = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`

export default function EditProfileModal({ onClose }) {
  const { data: user } = useGetProfileQuery()
  const [updateProfile, { isLoading: isSaving }] = useUpdateProfileMutation()
  const fileInputRef = useRef(null)

  const [avatarPreview, setAvatarPreview] = useState(null)
  const [isDragging,    setIsDragging]    = useState(false)
  const [uploadingImg,  setUploadingImg]  = useState(false)

  const [form, setForm] = useState({
    full_name:   "",
    bio:         "",
    address:     "",
    gender:      "",
    profile_url: "",
  })

  useEffect(() => {
    if (user) {
      setForm({
        full_name:   user.name       ?? "",
        bio:         user.bio        ?? "",
        address:     user.address    ?? "",
        gender:      user.gender     ?? "",
        profile_url: user.avatar_url ?? "",
      })
      setAvatarPreview(user.avatar_url ?? null)
    }
  }, [user])

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  // ✅ Upload to Cloudinary
  const uploadToCloudinary = async (file) => {
  if (!file || !file.type.startsWith("image/")) {
    toast.error("Please select a valid image.")
    return
  }
  if (file.size > 5 * 1024 * 1024) {
    toast.error("Image must be under 5MB.")
    return
  }

  setAvatarPreview(URL.createObjectURL(file))
  setUploadingImg(true)

  try {
    const cloudName    = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

    // ✅ Debug — remove after fix
    console.log("cloud_name:",    cloudName)
    console.log("upload_preset:", uploadPreset)

    if (!cloudName || !uploadPreset) {
      toast.error("Cloudinary config missing. Check your .env file.")
      return
    }

    const fd = new FormData()
    fd.append("file",          file)
    fd.append("upload_preset", uploadPreset)
    // ✅ Removed "folder" — some presets block custom folders

    const res  = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: "POST", body: fd }
    )

    const data = await res.json()

    // ✅ Log actual Cloudinary error before throwing
    if (!res.ok) {
      console.error("Cloudinary error:", data)
      throw new Error(data?.error?.message ?? "Upload failed")
    }

    const url = data.secure_url
    setAvatarPreview(url)
    setForm((prev) => ({ ...prev, profile_url: url }))
    toast.success("Photo uploaded!")
  } catch (err) {
    toast.error(err.message || "Failed to upload image.")
    console.error("Full error:", err)
  } finally {
    setUploadingImg(false)
  }
}

  const handleFileInput  = (e) => { const f = e.target.files?.[0];       if (f) uploadToCloudinary(f) }
  const handleDragOver   = (e) => { e.preventDefault(); setIsDragging(true)  }
  const handleDragLeave  = ()  =>  setIsDragging(false)
  const handleDrop       = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const f = e.dataTransfer.files?.[0]
    if (f) uploadToCloudinary(f)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await updateProfile({ id: user.id, ...form }).unwrap()
      toast.success("Profile updated!")
      onClose()
    } catch (err) {
      toast.error(err?.data?.detail || "Failed to update profile.")
    }
  }

  const initial = (user?.name ?? "T")[0].toUpperCase()

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="relative h-20 bg-gradient-to-br from-slate-800 via-slate-700 to-indigo-900 flex items-center px-7 flex-shrink-0">
          <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="editDots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.5" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#editDots)" />
          </svg>
          <h2 className="relative text-white font-black text-lg tracking-tight">Edit Profile</h2>
          <button
            onClick={onClose}
            className="relative ml-auto w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-all"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-7 py-6 space-y-4">

          {/* ── Image Upload ── */}
          <div>
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest block mb-2">
              Profile Photo
            </label>

            <div className="flex items-center gap-5">
              {/* Preview circle */}
              <div className="w-20 h-20 rounded-2xl ring-4 ring-slate-100 shadow overflow-hidden bg-indigo-100 flex items-center justify-center flex-shrink-0">
                {uploadingImg ? (
                  <div className="flex flex-col items-center gap-1">
                    <Loader2 size={20} className="text-indigo-400 animate-spin" />
                    <span className="text-[9px] text-indigo-400 font-bold">Uploading</span>
                  </div>
                ) : avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="preview"
                    className="w-full h-full object-cover"
                    onError={() => setAvatarPreview(null)}
                  />
                ) : (
                  <span className="text-2xl font-black text-indigo-500">{initial}</span>
                )}
              </div>

              {/* Drop zone */}
              <div
                onClick={() => !uploadingImg && fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`flex-1 border-2 border-dashed rounded-2xl p-5 flex flex-col items-center justify-center transition-all
                  ${uploadingImg
                    ? "opacity-50 cursor-not-allowed border-gray-200"
                    : isDragging
                      ? "border-indigo-400 bg-indigo-50 scale-[1.02] cursor-copy"
                      : "border-gray-200 hover:border-indigo-300 hover:bg-slate-50 cursor-pointer"
                  }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 transition-colors
                  ${isDragging ? "bg-indigo-100" : "bg-indigo-50"}`}
                >
                  <ImagePlus size={18} className="text-indigo-400" />
                </div>
                <p className="text-xs font-bold text-gray-600 text-center">
                  {uploadingImg ? "Uploading to Cloudinary…" : "Click or drag & drop"}
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5">PNG, JPG, WEBP · max 5MB</p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/webp"
                className="hidden"
                onChange={handleFileInput}
              />
            </div>

            {/* Cloudinary URL preview (readonly) */}
            {form.profile_url && !uploadingImg && (
              <div className="mt-2 flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-3 py-2">
                <span className="text-green-500 text-xs">✓</span>
                <p className="text-[11px] text-green-700 font-medium truncate flex-1">{form.profile_url}</p>
              </div>
            )}
          </div>

          {/* Full Name */}
          <div>
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest block mb-1.5">
              Full Name
            </label>
            <input
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              placeholder="Your full name"
              className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest block mb-1.5">
              Bio
            </label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              placeholder="Tell something about yourself..."
              rows={3}
              className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all resize-none"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest block mb-1.5">
              Gender
            </label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Address */}
          <div>
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest block mb-1.5">
              Address
            </label>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Cambodia, Phnom Penh"
              className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-bold text-sm hover:border-gray-300 hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving || uploadingImg}
              className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-indigo-200 disabled:opacity-60"
            >
              {isSaving
                ? <><Loader2 size={15} className="animate-spin" /> Saving…</>
                : <><Save size={15} /> Save Changes</>
              }
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}


// import { useState, useEffect, useRef } from "react"
// import { useGetProfileQuery, useUpdateProfileMutation } from "../../features/teacher/teacherApi"
// import { X, Save, Loader2, Upload, ImagePlus } from "lucide-react"
// import { toast } from "react-toastify"

// export default function EditProfileModal({ onClose }) {
//   const { data: user } = useGetProfileQuery()
//   const [updateProfile, { isLoading: isSaving }] = useUpdateProfileMutation()
//   const fileInputRef = useRef(null)

//   const [avatarPreview, setAvatarPreview] = useState(null)
//   const [isDragging,    setIsDragging]    = useState(false)
//   const [uploadingImg,  setUploadingImg]  = useState(false)

//   const [form, setForm] = useState({
//     full_name:   "",
//     bio:         "",
//     address:     "",
//     gender:      "",
//     profile_url: "",
//   })

//   useEffect(() => {
//     if (user) {
//       setForm({
//         full_name:   user.name       ?? "",
//         bio:         user.bio        ?? "",
//         address:     user.address    ?? "",
//         gender:      user.gender     ?? "",
//         profile_url: user.avatar_url ?? "",
//       })
//       setAvatarPreview(user.avatar_url ?? null)
//     }
//   }, [user])

//   const handleChange = (e) => {
//     setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
//   }

//   // ✅ Handle image file — upload to your file server and get back URL
//   const handleImageFile = async (file) => {
//     if (!file || !file.type.startsWith("image/")) {
//       toast.error("Please select a valid image file.")
//       return
//     }

//     // Instant local preview
//     const localUrl = URL.createObjectURL(file)
//     setAvatarPreview(localUrl)
//     setUploadingImg(true)

//     try {
//       // ── Option A: Upload to your own /files endpoint ──────────────────
//       const fd = new FormData()
//       fd.append("file", file)

//       const res = await fetch(`${import.meta.env.VITE_API_URL}/files`, {
//         method: "POST",
//         body: fd,
//         headers: {
//           // include auth token if needed
//           Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
//         },
//       })

//       if (!res.ok) throw new Error("Upload failed")

//       const data = await res.json()
//       // adjust field name to whatever your API returns e.g. data.url / data.file_url
//       const uploadedUrl = data.url ?? data.file_url ?? data.profile_url ?? localUrl

//       setAvatarPreview(uploadedUrl)
//       setForm((prev) => ({ ...prev, profile_url: uploadedUrl }))
//       toast.success("Image uploaded!")
//     } catch (err) {
//       // ── Option B: fallback — keep local preview, user saves later ─────
//       console.warn("Upload failed, using local preview:", err)
//       toast.warning("Could not upload image to server. Using local preview.")
//     } finally {
//       setUploadingImg(false)
//     }
//   }

//   const handleFileInput = (e) => {
//     const file = e.target.files?.[0]
//     if (file) handleImageFile(file)
//   }

//   // Drag & drop handlers
//   const handleDragOver  = (e) => { e.preventDefault(); setIsDragging(true)  }
//   const handleDragLeave = ()    => setIsDragging(false)
//   const handleDrop      = (e)   => {
//     e.preventDefault()
//     setIsDragging(false)
//     const file = e.dataTransfer.files?.[0]
//     if (file) handleImageFile(file)
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     try {
//       await updateProfile({ id: user.id, ...form }).unwrap()
//       toast.success("Profile updated!")
//       onClose()
//     } catch (err) {
//       toast.error(err?.data?.detail || "Failed to update profile.")
//     }
//   }

//   const initial = (user?.name ?? "T")[0].toUpperCase()

//   return (
//     <div
//       className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
//       onClick={onClose}
//     >
//       <div
//         className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* ── Header ── */}
//         <div className="relative h-20 bg-gradient-to-br from-slate-800 via-slate-700 to-indigo-900 flex items-center px-7 flex-shrink-0">
//           <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
//             <defs>
//               <pattern id="editDots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
//                 <circle cx="2" cy="2" r="1.5" fill="white" />
//               </pattern>
//             </defs>
//             <rect width="100%" height="100%" fill="url(#editDots)" />
//           </svg>
//           <h2 className="relative text-white font-black text-lg tracking-tight">Edit Profile</h2>
//           <button
//             onClick={onClose}
//             className="relative ml-auto w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-all"
//           >
//             <X size={16} />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="px-7 py-6 space-y-4">

//           {/* ── Image Upload Zone ── */}
//           <div>
//             <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest block mb-2">
//               Profile Photo
//             </label>

//             <div className="flex items-center gap-5">
//               {/* Preview */}
//               <div className="w-20 h-20 rounded-2xl ring-4 ring-slate-100 shadow overflow-hidden bg-indigo-100 flex items-center justify-center flex-shrink-0">
//                 {uploadingImg ? (
//                   <Loader2 size={22} className="text-indigo-400 animate-spin" />
//                 ) : avatarPreview ? (
//                   <img
//                     src={avatarPreview}
//                     alt="preview"
//                     className="w-full h-full object-cover"
//                     onError={() => setAvatarPreview(null)}
//                   />
//                 ) : (
//                   <span className="text-2xl font-black text-indigo-500">{initial}</span>
//                 )}
//               </div>

//               {/* Drop zone */}
//               <div
//                 onClick={() => fileInputRef.current?.click()}
//                 onDragOver={handleDragOver}
//                 onDragLeave={handleDragLeave}
//                 onDrop={handleDrop}
//                 className={`flex-1 border-2 border-dashed rounded-2xl p-5 flex flex-col items-center justify-center cursor-pointer transition-all
//                   ${isDragging
//                     ? "border-indigo-400 bg-indigo-50 scale-[1.02]"
//                     : "border-gray-200 hover:border-indigo-300 hover:bg-slate-50"
//                   }`}
//               >
//                 <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center mb-2">
//                   <ImagePlus size={18} className="text-indigo-400" />
//                 </div>
//                 <p className="text-xs font-bold text-gray-600 text-center">
//                   Click or drag & drop
//                 </p>
//                 <p className="text-[11px] text-gray-400 mt-0.5">PNG, JPG, WEBP up to 5MB</p>
//               </div>

//               {/* Hidden input */}
//               <input
//                 ref={fileInputRef}
//                 type="file"
//                 accept="image/*"
//                 className="hidden"
//                 onChange={handleFileInput}
//               />
//             </div>
//           </div>

//           {/* Full Name */}
//           <div>
//             <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest block mb-1.5">
//               Full Name
//             </label>
//             <input
//               name="full_name"
//               value={form.full_name}
//               onChange={handleChange}
//               placeholder="Your full name"
//               className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
//             />
//           </div>

//           {/* Bio */}
//           <div>
//             <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest block mb-1.5">
//               Bio
//             </label>
//             <textarea
//               name="bio"
//               value={form.bio}
//               onChange={handleChange}
//               placeholder="Tell something about yourself..."
//               rows={3}
//               className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all resize-none"
//             />
//           </div>

//           {/* Gender */}
//           <div>
//             <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest block mb-1.5">
//               Gender
//             </label>
//             <select
//               name="gender"
//               value={form.gender}
//               onChange={handleChange}
//               className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
//             >
//               <option value="">Select</option>
//               <option value="male">Male</option>
//               <option value="female">Female</option>
//               <option value="other">Other</option>
//             </select>
//           </div>

//           {/* Address */}
//           <div>
//             <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest block mb-1.5">
//               Address
//             </label>
//             <input
//               name="address"
//               value={form.address}
//               onChange={handleChange}
//               placeholder="Cambodia, Phnom Penh"
//               className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
//             />
//           </div>

//           {/* Buttons */}
//           <div className="flex gap-3 pt-2">
//             <button
//               type="button"
//               onClick={onClose}
//               className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-bold text-sm hover:border-gray-300 hover:bg-gray-50 transition-all"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={isSaving || uploadingImg}
//               className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-indigo-200 disabled:opacity-60"
//             >
//               {isSaving
//                 ? <><Loader2 size={15} className="animate-spin" /> Saving…</>
//                 : <><Save size={15} /> Save Changes</>
//               }
//             </button>
//           </div>

//         </form>
//       </div>
//     </div>
//   )
// }