import { useNavigate } from "react-router-dom";
import { useGetTeacherCoursesQuery } from "../../features/courses/coursesApi";
import { SectionHeader } from "./Profile";

const COLORS = [
  "from-blue-400 to-purple-500",
  "from-blue-600 to-blue-800",
  "from-orange-400 to-red-500",
  "from-blue-400 to-cyan-500",
  "from-green-400 to-teal-500",
  "from-pink-400 to-rose-500",
];

const SkeletonRow = () => (
  <div className="flex items-center justify-between py-4 px-2 animate-pulse">
    <div className="flex items-center gap-4">
      <div className="w-14 h-10 rounded-lg bg-gray-100 dark:bg-[#2e2e45] flex-shrink-0" />
      <div className="space-y-2">
        <div className="h-3 w-40 bg-gray-100 dark:bg-[#2e2e45] rounded" />
        <div className="h-2 w-24 bg-gray-100 dark:bg-[#25253a] rounded" />
      </div>
    </div>
    <div className="h-3 w-6 bg-gray-100 dark:bg-[#2e2e45] rounded" />
  </div>
);

const CourseRow = ({ course, color }) => (
  <div className="flex items-center justify-between py-4 px-2 rounded-xl
    transition-colors duration-150
    hover:bg-slate-50 dark:hover:bg-[#25253a]">
    <div className="flex items-center gap-4">
      {course.thumbnail_url ? (
        <img
          src={course.thumbnail_url}
          alt={course.title}
          className="w-14 h-10 rounded-lg object-cover flex-shrink-0 shadow-sm"
        />
      ) : (
        <div className={`w-14 h-10 rounded-lg bg-gradient-to-r ${color} flex-shrink-0`} />
      )}
      <div>
        <p className="text-base font-bold text-gray-800 dark:text-[#f1f1f1]">
          {course.title}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-sm text-gray-400 dark:text-[#9b9baa]">
            {course.category}
          </span>
          <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
            course.type === "Free"
              ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
              : "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
          }`}>
            {course.type}
          </span>
        </div>
      </div>
    </div>
    <span className="text-base font-bold text-gray-700 dark:text-[#f1f1f1]">
      {course.students}
    </span>
  </div>
);

export default function MyCourse() {
  const navigate = useNavigate();
  const { data: courses = [], isLoading, isError } = useGetTeacherCoursesQuery();

  const visible = courses.slice(0, 3);

  return (
    <div className="bg-white dark:bg-[#1e1e30] rounded-2xl shadow-sm border border-transparent dark:border-[#2e2e45] p-7 mb-6 transition-colors duration-300">

      <SectionHeader
        title="Course"
        highlight="My"
        linkLabel="See All Course"
        onLink={() => navigate("/profile/all-courses")}
      />

      {/* Column labels */}
      <div className="flex justify-between text-xs text-gray-400 dark:text-[#9b9baa] font-semibold mb-1 px-2 uppercase tracking-widest">
        <span>Course Name</span>
        <span>Total Student</span>
      </div>

      {isError && (
        <p className="text-xs text-red-400 py-3 text-center">Failed to load courses.</p>
      )}

      <div className="divide-y divide-gray-50 dark:divide-[#2e2e45]">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} />)
          : visible.length === 0
            ? (
              <p className="text-xs text-gray-400 dark:text-[#9b9baa] py-6 text-center">
                No courses yet.
              </p>
            )
            : visible.map((course, i) => (
                <CourseRow
                  key={course.id}
                  course={course}
                  color={course.color ?? COLORS[i % COLORS.length]}
                />
              ))
        }
      </div>
    </div>
  );
}