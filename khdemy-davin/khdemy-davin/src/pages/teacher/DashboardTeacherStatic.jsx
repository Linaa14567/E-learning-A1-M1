import { useSelector } from 'react-redux'
import MyCourse from '../../components/ui/MyCourse'
import MyArticle from '../../components/ui/MyArticle'
import MyBook from '../../components/ui/MyBook'


export default function DashboardTeacherStatic() {
  const { user } = useSelector((state) => state.auth)

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-800">
          Welcome,{' '}
          <span className="text-indigo-600">
            {user?.full_name?.split(' ')[1] || 'Teacher1'}
          </span>{' '}
          !
        </h1>
        <p className="text-xs text-gray-400 mt-1 font-bold uppercase tracking-widest">
          Dashboard
        </p>
      </div>

      <StatsCards />
      <MyCourse />
      <MyArticle />
      <MyBook />
    </div>
  )
}