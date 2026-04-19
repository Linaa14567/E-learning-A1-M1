import { useSelector } from "react-redux";

export const useRole = () => {
  const user = useSelector(state => state.auth.user);
  const role = user?.role || "";

  return {
    isStudent: role === "student",
    isTeacher: role === "teacher",
    isAdmin: role === "admin", // if you have admin later
    role,
  };
};