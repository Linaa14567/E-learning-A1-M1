// import Banner from "../ui/Banner";
// import MyArticle from "../ui/MyArticle";
// import MyBook from "../ui/MyBook";
// import MyCourse from "../ui/MyCourse";
// import Sidebar from "../ui/Sidebar";

// export default function TeacherDashboard() {
//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-[#0f0f1a] transition-colors duration-300">
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap');
//         * { font-family: 'Nunito', sans-serif; }
//       `}</style>

//       <div className="w-full max-w-screen-2xl mx-auto px-8 py-8">
//         <div className="flex gap-8">

//           {/* Left sidebar (profile + nav) */}
//           <Sidebar />

//           {/* Main content */}
//           <div className="flex-1 min-w-0">
//             <Banner teacherName="Teacher1" />
//             <MyCourse />
//             <MyArticle />
//             <MyBook />
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }

import Banner   from "../ui/Banner"
import MyArticle from "../ui/MyArticle"
import MyBook    from "../ui/MyBook"
import MyCourse  from "../ui/MyCourse"

// This component is now purely content — layout/sidebar live in TeacherLayout
export default function TeacherDashboard() {
  return (
    <div className="flex flex-col gap-6">
      <Banner />
      <MyCourse />
      <MyArticle />
      <MyBook />
    </div>
  )
}