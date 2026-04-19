import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { selectCurrentUser, selectIsAuth, selectUserRole, logout } from '@/features/auth/authSlice'
import { useLogoutMutation }  from '@/services/authApi'
import { clearCart }          from '@/features/cart/cartSlice'
import { clearWishlist }      from '@/features/wishlist/wishlistSlice'
import { ROUTES, ROLES }      from '@/constants'

/**
 * useAuth — central auth hook
 *
 * Returns:
 *   user          → full user object from API
 *   isAuth        → boolean
 *   role          → 'student' | 'teacher'
 *   isStudent     → boolean
 *   isTeacher     → boolean  (API role = "teacher")
 *   isInstructor  → alias for isTeacher (backwards compat)
 *   dashboardPath → correct dashboard path for current role
 *   handleLogout  → clears state + localStorage + navigates home
 */
export const useAuth = () => {
  const dispatch    = useDispatch()
  const navigate    = useNavigate()
  const user        = useSelector(selectCurrentUser)
  const isAuth      = useSelector(selectIsAuth)
  const role        = useSelector(selectUserRole)
  const [logoutApi] = useLogoutMutation()

  const isStudent    = role === ROLES.STUDENT                        // 'student'
  const isTeacher    = role === ROLES.TEACHER                        // 'teacher'
  const isInstructor = isTeacher                                     // backwards compat alias

  // Teacher sees teacher dashboard; student sees student dashboard
  const dashboardPath = isTeacher
    ? ROUTES.INSTRUCTOR_DASHBOARD
    : ROUTES.STUDENT_DASHBOARD

  const handleLogout = async () => {
    try { await logoutApi().unwrap() } catch (_) {}
    dispatch(logout())
    dispatch(clearCart())
    dispatch(clearWishlist())
    navigate(ROUTES.HOME)
  }

  return {
    user,
    isAuth,
    role,
    isStudent,
    isTeacher,
    isInstructor,
    dashboardPath,
    handleLogout,
  }
}