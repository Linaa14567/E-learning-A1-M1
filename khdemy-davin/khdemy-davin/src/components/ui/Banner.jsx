import { useGetTeacherCoursesQuery } from "../../features/courses/coursesApi"
import { useGetBlogsQuery }          from "../../features/blog/blogApi"
import { useGetBooksQuery }          from "../../features/books/booksAPI"
import { useGetProfileQuery }        from "../../features/teacher/teacherApi"

// ── Stat card ─────────────────────────────────────────────────────────────────
const StatCard = ({ gradient, iconBg, icon, value, label, loading }) => (
  <div
    className="
      relative overflow-hidden rounded-2xl p-5 flex items-center gap-4
      shadow-sm cursor-default group
      transition-all duration-300 hover:-translate-y-1 hover:shadow-lg
      bg-white dark:bg-[#1e1e30]
      border border-gray-100 dark:border-[#2e2e45]
    "
  >
    {/* Gradient tint corner */}
    <div
      className={`
        absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-10
        transition-opacity duration-300 group-hover:opacity-20
        ${gradient}
      `}
    />

    {/* Icon bubble */}
    <div
      className={`
        relative z-10 w-12 h-12 ${iconBg} rounded-xl
        flex items-center justify-center shadow-md flex-shrink-0
        transition-transform duration-300 group-hover:scale-110
      `}
    >
      {icon}
    </div>

    {/* Text */}
    <div className="relative z-10 min-w-0">
      {loading ? (
        <div className="animate-pulse space-y-2">
          <div className="h-7 w-14 bg-gray-100 dark:bg-[#2e2e45] rounded-lg" />
          <div className="h-3 w-24 bg-gray-100 dark:bg-[#25253a] rounded" />
        </div>
      ) : (
        <>
          <p className="text-3xl font-extrabold text-gray-900 dark:text-[#f1f1f1] leading-none tabular-nums">
            {(value ?? 0).toLocaleString()}
          </p>
          <p className="text-sm text-gray-400 dark:text-[#9b9baa] font-medium mt-1 truncate">
            {label}
          </p>
        </>
      )}
    </div>
  </div>
)

// ── Icons ─────────────────────────────────────────────────────────────────────
const IconCourses = () => (
  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
  </svg>
)
const IconPeople = () => (
  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-1a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v1h-3zM4.75 14.094A5.973 5.973 0 004 17v1H1v-1a3 3 0 013.75-2.906z" />
  </svg>
)
const IconBlog = () => (
  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clipRule="evenodd" />
  </svg>
)
const IconBook = () => (
  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
  </svg>
)

// ── Greeting sub-label ────────────────────────────────────────────────────────
const TimeLabel = () => {
  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? "Good morning" :
    hour < 17 ? "Good afternoon" :
               "Good evening"
  return (
    <span className="text-gray-400 dark:text-[#9b9baa] text-sm">
      {greeting} · Dashboard
    </span>
  )
}

// ── Banner ────────────────────────────────────────────────────────────────────
export default function Banner() {
  const { data: profile                          } = useGetProfileQuery()
  const { data: courses  = [], isLoading: cLoad  } = useGetTeacherCoursesQuery()
  const { data: blogsData,     isLoading: bLoad  } = useGetBlogsQuery({ limit: 100 })
  const { data: booksData,     isLoading: bkLoad } = useGetBooksQuery({ limit: 100 })

  const isLoading = cLoad || bLoad || bkLoad

  const teacherName   = profile?.name ?? "Teacher"
  const totalCourses  = courses.length
  const totalStudents = courses.reduce((sum, c) => sum + (c.students ?? 0), 0)
  const totalBlogs    = Array.isArray(blogsData)
    ? blogsData.length
    : blogsData?.blogs?.length ?? blogsData?.total ?? 0
  const totalBooks    = Array.isArray(booksData)
    ? booksData.length
    : booksData?.books?.length ?? booksData?.total ?? 0

  const stats = [
    {
      gradient: "bg-pink-500",
      iconBg:   "bg-gradient-to-br from-pink-400 to-rose-500",
      icon:     <IconCourses />,
      value:    totalCourses,
      label:    "Total Courses",
    },
    {
      gradient: "bg-orange-500",
      iconBg:   "bg-gradient-to-br from-orange-400 to-amber-500",
      icon:     <IconPeople />,
      value:    totalStudents,
      label:    "Total Enrollment",
    },
    {
      gradient: "bg-emerald-500",
      iconBg:   "bg-gradient-to-br from-emerald-400 to-green-500",
      icon:     <IconBlog />,
      value:    totalBlogs,
      label:    "Total Blogs",
    },
    {
      gradient: "bg-purple-500",
      iconBg:   "bg-gradient-to-br from-violet-400 to-purple-600",
      icon:     <IconBook />,
      value:    totalBooks,
      label:    "Total Books",
    },
  ]

  return (
    <section className="mb-8 w-full">
      {/* ── Welcome heading ── */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-[#f1f1f1] leading-tight">
            Welcome,{" "}
            <span className="text-primary dark:text-accent-pink">{teacherName}!</span>
          </h1>
          <TimeLabel />
        </div>

        {/* Date pill */}
        <span className="
          self-start sm:self-auto
          text-xs font-semibold px-3 py-1.5 rounded-full
          bg-gray-100 dark:bg-[#1e1e30]
          text-gray-500 dark:text-[#9b9baa]
          border border-gray-200 dark:border-[#2e2e45]
        ">
          {new Date().toLocaleDateString(undefined, {
            weekday: "short", month: "short", day: "numeric", year: "numeric"
          })}
        </span>
      </div>

      {/* ── Stat cards grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} loading={isLoading} />
        ))}
      </div>
    </section>
  )
}