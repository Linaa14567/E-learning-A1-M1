// components/teacher/TeacherLayout.jsx
import { Outlet } from "react-router-dom";
import Sidebar from "../ui/Sidebar";

export default function TeacherLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100 p-6 gap-6">
      <Sidebar />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}