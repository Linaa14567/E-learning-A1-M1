import { useSelector } from "react-redux"

import {
  MapPin, User, Venus, Mars, Loader2, AlertCircle
} from "lucide-react"
import { useGetProfileQuery } from "../../features/teacher/teacherApi"

// ─── Gender icon ──────────────────────────────────────────────────────────────
function GenderIcon({ gender }) {
  if (gender === "female") return <Venus size={13} className="text-pink-400" />
  if (gender === "male")   return <Mars  size={13} className="text-sky-400"  />
  return null
}

// ─── Stat pill ────────────────────────────────────────────────────────────────
function StatPill({ label, value }) {
  return (
    <div className="flex flex-col items-center px-6 py-3">
      <span className="text-xl font-black text-gray-900 leading-none">{value}</span>
      <span className="text-[11px] text-gray-400 font-semibold uppercase tracking-widest mt-1">{label}</span>
    </div>
  )
}

// ─── Info row ─────────────────────────────────────────────────────────────────
function InfoRow({ icon, label, value }) {
  if (!value) return null
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
      <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0 mt-0.5">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-widest leading-none mb-1">{label}</p>
        <p className="text-sm text-gray-800 font-medium leading-snug">{value}</p>
      </div>
    </div>
  )
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function ProfileSkeleton() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10 animate-pulse">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="h-32 bg-gray-100" />
        <div className="px-8 pb-8">
          <div className="flex items-end gap-5 -mt-12 mb-6">
            <div className="w-24 h-24 rounded-2xl bg-gray-200 ring-4 ring-white flex-shrink-0" />
            <div className="pb-2 flex-1 space-y-2">
              <div className="h-5 bg-gray-100 rounded-full w-40" />
              <div className="h-3 bg-gray-100 rounded-full w-24" />
            </div>
          </div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-100 rounded-full w-full" />
            <div className="h-3 bg-gray-100 rounded-full w-3/4" />
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function ProfileCard() {
  const { user } = useSelector((state) => state.auth)
  const { data: profile, isLoading, isError } = useGetProfileQuery(undefined, {
    skip: !user,
  })

  if (isLoading) return <ProfileSkeleton />

  if (isError) return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="bg-white rounded-3xl border border-red-100 shadow-sm p-10 flex flex-col items-center text-center gap-3">
        <AlertCircle size={32} className="text-red-300" />
        <p className="text-sm font-semibold text-gray-500">Failed to load profile.</p>
      </div>
    </div>
  )

  const p = profile ?? {}
  const fullName   = p.full_name   ?? user?.name ?? "—"
  const gender     = p.gender      ?? ""
  const bio        = p.bio         ?? ""
  const address    = p.address     ?? ""
  const avatarUrl  = p.profile_url ?? ""
  const initial    = fullName.charAt(0).toUpperCase()

  // Capitalise gender label
  const genderLabel = gender
    ? gender.charAt(0).toUpperCase() + gender.slice(1)
    : ""

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

        {/* ── Cover banner ── */}
        <div className="relative h-36 bg-gradient-to-br from-slate-800 via-slate-700 to-indigo-900 overflow-hidden">
          {/* Subtle pattern */}
          <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.5" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>

        {/* ── Avatar + name row ── */}
        <div className="px-7 pb-0">
          <div className="flex items-end justify-between -mt-12 mb-5">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-24 h-24 rounded-2xl ring-4 ring-white shadow-lg overflow-hidden bg-indigo-100 flex items-center justify-center">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={fullName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-black text-indigo-600">{initial}</span>
                )}
              </div>
              {/* Gender dot */}
              {gender && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center border border-gray-100">
                  <GenderIcon gender={gender} />
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="pb-2 flex gap-2">
              <button className="text-xs font-bold px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
                Edit Profile
              </button>
              <button className="text-xs font-bold px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 hover:-translate-y-0.5 transition-all">
                Share
              </button>
            </div>
          </div>

          {/* Name + gender */}
          <div className="mb-1 flex items-center gap-2 flex-wrap">
            <h2 className="text-xl font-black text-gray-900 tracking-tight">{fullName}</h2>
            {genderLabel && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-50 border border-gray-100 text-gray-500">
                <GenderIcon gender={gender} />
                {genderLabel}
              </span>
            )}
          </div>

          {/* Username / email fallback */}
          {user?.email && (
            <p className="text-xs text-gray-400 font-medium mb-5">{user.email}</p>
          )}

          {/* Bio */}
          {bio && (
            <p className="text-sm text-gray-600 leading-relaxed mb-6 max-w-lg">{bio}</p>
          )}
        </div>

        {/* ── Stats strip ── */}
        <div className="mx-7 mb-6 bg-slate-50 rounded-2xl border border-gray-100 flex divide-x divide-gray-100">
          <StatPill label="Courses"  value={p.total_courses  ?? 0} />
          <StatPill label="Articles" value={p.total_articles ?? 0} />
          <StatPill label="Books"    value={p.total_books    ?? 0} />
        </div>

        {/* ── Info rows ── */}
        <div className="mx-7 mb-7">
          <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">Details</p>
          <div className="bg-slate-50 rounded-2xl border border-gray-100 px-4 py-1">
            <InfoRow
              icon={<User size={14} className="text-indigo-400" />}
              label="Full Name"
              value={fullName}
            />
            <InfoRow
              icon={<GenderIcon gender={gender} />}
              label="Gender"
              value={genderLabel}
            />
            <InfoRow
              icon={<MapPin size={14} className="text-rose-400" />}
              label="Location"
              value={address}
            />
          </div>
        </div>

      </div>
    </div>
  )
}