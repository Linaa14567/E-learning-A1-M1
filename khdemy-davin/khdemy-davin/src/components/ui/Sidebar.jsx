import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useGetProfileQuery } from "../../features/teacher/teacherApi"
import { Avatar } from "./Profile"
import EditProfileModal from "./EditProfileModal"
import { GraduationCap, BookOpen, BookMarked, MessageSquare, LayoutDashboard, Pencil, BookMarkedIcon } from "lucide-react"

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard",   path: "/teacher/dashboard"   },
  { icon: GraduationCap,   label: "Create Course", path: "/teacher/create-course" },
  { icon: Pencil,          label: "Add Lesson",   path: "/teacher/add-lesson"  },
  { icon: BookMarked,      label: "Add Book",     path: "/teacher/add-book"    },
  { icon: MessageSquare,   label: "Add Article",  path: "/blogs/create"        },
  { icon: BookMarkedIcon,   label: "My Favorite",  path: "/bookmarks"        },
]

export default function Sidebar() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const [showEdit, setShowEdit] = useState(false)

  const { data: user, isLoading, isError } = useGetProfileQuery()

  return (
    <>
      <div className="w-72 flex-shrink-0">

        {/* Profile Card */}
        <div className="bg-white dark:bg-[#1e1e30] rounded-2xl shadow-sm border border-transparent dark:border-[#2e2e45] mb-5 overflow-hidden transition-colors duration-300">
          {isLoading ? (
            <div className="p-7 text-center text-gray-400 dark:text-[#9b9baa] text-sm animate-pulse">
              Loading...
            </div>
          ) : isError ? (
            <div className="p-7 text-center text-red-400 text-sm">
              Failed to load profile
            </div>
          ) : (
            <div className="p-7 flex flex-col items-center text-center">
              {/* Clickable avatar */}
              <button
                onClick={() => setShowEdit(true)}
                className="group relative focus:outline-none"
              >
                {user?.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.name}
                    className="w-24 h-24 rounded-full object-cover border-2 border-white dark:border-[#2e2e45] shadow group-hover:opacity-90 transition-opacity"
                  />
                ) : (
                  <Avatar size={24} />
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/10 transition-all flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 text-white text-[10px] font-bold transition-opacity">
                    Edit
                  </span>
                </div>
              </button>

              <p className="font-bold text-gray-800 dark:text-[#f1f1f1] text-base mt-2">
                {user?.name ?? "Teacher"}
              </p>
              <p className="text-blue-500 dark:text-blue-400 font-semibold text-xs mb-2 capitalize">
                {user?.role ?? ""}
              </p>
              <p className="text-gray-400 dark:text-[#9b9baa] text-xs mb-4">
                {user?.bio ?? ""}
              </p>

              <button
                onClick={() => setShowEdit(true)}
                className="w-full border border-gray-200 dark:border-[#2e2e45]
                  rounded-xl py-2 text-xs font-semibold
                  text-gray-600 dark:text-[#9b9baa]
                  hover:bg-gray-50 dark:hover:bg-[#25253a]
                  transition-colors duration-200
                  flex items-center justify-center gap-1.5"
              >
                <Pencil size={12} />
                Edit Profile
              </button>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="bg-white dark:bg-[#1e1e30] rounded-2xl shadow-sm border border-transparent dark:border-[#2e2e45] p-4 flex flex-col gap-1 transition-colors duration-300">
          {navItems.map(({ icon: Icon, label, path }) => {
            const isActive = location.pathname === path
            return (
              <button
                key={label}
                onClick={() => navigate(path)}
                className={`flex items-center gap-3 px-4 py-3 text-base w-full text-left rounded-lg transition-colors duration-200
                  ${isActive
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-bold"
                    : "text-gray-600 dark:text-[#9b9baa] hover:text-blue-700 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  }`}
              >
                <Icon size={18} className="flex-shrink-0" />
                <span>{label}</span>
              </button>
            )
          })}
        </div>

      </div>

      {showEdit && <EditProfileModal onClose={() => setShowEdit(false)} />}
    </>
  )
}