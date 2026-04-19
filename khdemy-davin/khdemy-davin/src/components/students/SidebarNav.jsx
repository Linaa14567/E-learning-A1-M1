import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import {
  LayoutDashboard, BookOpen, BarChart2,
  PenLine, UserCircle, LogOut, Pencil,
} from "lucide-react";
import { Avatar } from "../ui/Profile";
import { useGetMeQuery } from "../../features/users/userApi";

const NAV_GROUPS = [
  {
    label: "Learning",
    items: [
      { id: "home",     label: "Dashboard",  icon: LayoutDashboard, path: "/student/dashboard" },
      { id: "courses",  label: "My Courses", icon: BookOpen,        path: "/student/courses"   },
      { id: "progress", label: "Progress",   icon: BarChart2,       path: "/student/progress"  },
    ],
  },
  {
    label: "Community",
    items: [
      { id: "blog",    label: "My Blog", icon: PenLine,    path: "/student/blog",    badge: "New" },
      { id: "profile", label: "Profile", icon: UserCircle, path: "/student/profile"              },
    ],
  },
];

export default function SidebarNav({ onClose }) {
  const navigate            = useNavigate();
  const location            = useLocation();
  const dispatch            = useDispatch();
  const { token }           = useSelector((state) => state.auth);
  const [imgErr, setImgErr] = useState(false);

  const { data: raw, isLoading, isError } = useGetMeQuery(undefined, { skip: !token });
  const p = raw?.data || raw || {};

  const name      = p.full_name   || p.name   || "Student";
  const role      = p.role                    || "student";
  const bio       = p.bio                     || "";
  const avatarUrl = p.profile_url || p.avatar || "";

  const go = (path) => { navigate(path); onClose?.(); };
  const handleLogout = () => { dispatch(logout()); navigate("/login"); };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white dark:bg-[#0f1117]
      transition-colors duration-300">

      {/* ── Profile Card ── */}
      <div className="flex-shrink-0 px-5 pt-7 pb-5
        border-b border-slate-100 dark:border-white/[0.07]">

        {isLoading ? (
          <div className="flex flex-col items-center gap-3 py-4">
            <div className="w-[72px] h-[72px] rounded-full animate-pulse
              bg-slate-200 dark:bg-white/[0.08]" />
            <div className="h-3 w-24 rounded-full animate-pulse
              bg-slate-200 dark:bg-white/[0.08]" />
            <div className="h-2 w-16 rounded-full animate-pulse
              bg-slate-100 dark:bg-white/[0.05]" />
          </div>
        ) : isError ? (
          <p className="text-center text-xs py-4 text-red-400 dark:text-red-400/70">
            Failed to load profile
          </p>
        ) : (
          <div className="flex flex-col items-center text-center gap-3">

            {/* Avatar with gradient ring */}
            <div className="relative">
              <div className="w-[72px] h-[72px] rounded-full p-[2.5px]"
                style={{ background: "linear-gradient(135deg, #6366f1, #818cf8, #a5b4fc)" }}>
                <div className="w-full h-full rounded-full overflow-hidden
                  bg-slate-200 dark:bg-slate-800">
                  {avatarUrl && !imgErr ? (
                    <img
                      src={avatarUrl}
                      alt={name}
                      className="w-full h-full object-cover object-top"
                      onError={() => setImgErr(true)}
                    />
                  ) : (
                    <Avatar size={16} />
                  )}
                </div>
              </div>
              <span className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full border-2
                bg-emerald-400 border-white dark:border-[#0f1117]" />
            </div>

            {/* Name & role */}
            <div className="flex flex-col gap-0.5">
              <p className="font-bold text-slate-900 dark:text-white text-[15px] leading-tight tracking-tight">
                {name}
              </p>
              <p className="text-[11px] font-semibold capitalize text-indigo-500 dark:text-indigo-400">
                {role}
              </p>
            </div>

            {/* Bio */}
            {bio && (
              <p className="text-[11px] leading-relaxed line-clamp-2 px-2
                text-slate-400 dark:text-white/40">
                {bio}
              </p>
            )}

            {/* Edit Profile button */}
            <button
              onClick={() => go("/student/profile")}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl
                text-[12px] font-semibold transition-all duration-200
                bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200
                text-slate-500 border border-slate-200
                dark:bg-white/[0.06] dark:hover:bg-indigo-500/20 dark:hover:text-indigo-300
                dark:text-white/70 dark:border-white/10 dark:hover:border-indigo-500/50"
            >
              <Pencil size={11} />
              Edit Profile
            </button>
          </div>
        )}
      </div>

      {/* ── Nav groups ── */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-4 min-h-0">
        {NAV_GROUPS.map((group, gi) => (
          <div key={gi} className="flex flex-col gap-0.5">
            {group.label && (
              <p className="text-[9px] font-black tracking-widest uppercase px-3 mb-1
                text-slate-400 dark:text-white/25">
                {group.label}
              </p>
            )}
            {group.items.map(({ id, label, icon: Icon, path, badge }) => {
              const isActive = location.pathname === path;
              return (
                <button
                  key={id}
                  onClick={() => go(path)}
                  className={
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm " +
                    "transition-all border-none text-left cursor-pointer " +
                    (isActive
                      ? "text-white shadow-md shadow-indigo-200 dark:shadow-indigo-900/50 "
                      : "text-slate-600 dark:text-white/50 hover:bg-slate-100 dark:hover:bg-white/[0.06] hover:text-slate-900 dark:hover:text-white/80 ")
                  }
                  style={isActive ? {
                    background: "linear-gradient(135deg, #4f46e5, #6366f1)",
                    boxShadow: "0 4px 12px rgba(99,102,241,0.25)",
                  } : {}}
                >
                  <Icon
                    size={17}
                    className={`flex-shrink-0 ${
                      isActive
                        ? "text-white"
                        : "text-slate-400 dark:text-white/35"
                    }`}
                  />
                  <span className={"flex-1 " + (isActive ? "font-bold" : "font-medium")}>
                    {label}
                  </span>
                  {badge && !isActive && (
                    <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full
                      bg-sky-100 text-sky-600 dark:bg-sky-400/15 dark:text-sky-400">
                      {badge}
                    </span>
                  )}
                  {isActive && (
                    <div className="w-1.5 h-1.5 rounded-full bg-white/60 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* ── Logout ── */}
      <div className="flex-shrink-0 p-3 border-t border-slate-100 dark:border-white/[0.07]">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
            border-none text-left cursor-pointer transition-all
            text-red-400 hover:bg-red-50 hover:text-red-500
            dark:text-red-400/70 dark:hover:bg-red-500/10 dark:hover:text-red-400"
        >
          <LogOut size={17} className="flex-shrink-0" />
          <span className="flex-1">Log out</span>
        </button>
      </div>

    </div>
  );
}