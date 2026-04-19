// DashboardStudent.jsx
import { useState } from 'react'
import { useSelector } from 'react-redux'
import MyCourse   from './Mycourse'
import MyProfile  from './MyProfile'
import CourseCard from './CourseCard'

import {
  useGetMyBookmarksQuery,
  useAddBookmarkMutation,
  useRemoveBookmarkMutation,
} from '../../features/books/booksAPI'

import {
  useGetEnrolledCoursesQuery,  // GET /courses/enrollments
} from '../../features/courses/coursesApi'

// ─── Shared UI ────────────────────────────────────────────────────────────────

function SkeletonCard() {
  return <div className="rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse h-52 w-full" />
}

function ErrorBanner({ message, onRetry }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
      <span>⚠️</span>
      <span className="flex-1">{message ?? 'Something went wrong.'}</span>
      {onRetry && (
        <button onClick={onRetry} className="font-bold underline bg-transparent border-none cursor-pointer text-red-600 dark:text-red-400">
          Retry
        </button>
      )}
    </div>
  )
}

function EmptySaved({ label, sub }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-2xl mb-3">🔖</div>
      <p className="font-bold text-slate-700 dark:text-slate-300 text-sm">{label}</p>
      <p className="text-xs text-slate-400 mt-1">{sub}</p>
    </div>
  )
}

// ─── Reusable section shell ───────────────────────────────────────────────────

function CourseSection({ title, onViewAll, isLoading, isError, error, refetch, data = [], renderCard, emptyMsg }) {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-black text-slate-900 dark:text-white" style={{ fontFamily: "'Outfit',sans-serif" }}>
          {title}
        </h2>
        {onViewAll && (
          <button onClick={onViewAll} className="text-xs font-bold text-indigo-600 hover:underline border-none bg-transparent cursor-pointer">
            View All
          </button>
        )}
      </div>

      {isError && (
        <ErrorBanner
          message={error?.data?.message ?? `Failed to load ${title.toLowerCase()}.`}
          onRetry={refetch}
        />
      )}

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
        </div>
      )}

      {!isLoading && !isError && data.length === 0 && (
        <p className="text-sm text-slate-400">{emptyMsg}</p>
      )}

      {!isLoading && !isError && data.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {data.map(renderCard)}
        </div>
      )}
    </section>
  )
}

// ─── Topic tabs ───────────────────────────────────────────────────────────────

const TOPIC_TABS = ['All Topics', 'Current Course', 'Course Complete', 'Saved']

// ─── HomePage ─────────────────────────────────────────────────────────────────

function HomePage({ go, openCourse, bookmarkedIds }) {
  const [cat,      setCat]      = useState('All Topics')
  const [savedTab, setSavedTab] = useState('books')

  // Single query for all enrollments — transformResponse already normalises shape:
  // { id, title, description, thumbnail_url, category, type,
  //   progress, is_completed, enrolled_at, enrollment_id, lessons }
  const {
    data:    allEnrolled = [],
    isLoading: enrollLoading,
    isError:   enrollError,
    error:     enrollErr,
    refetch:   refetchEnroll,
  } = useGetEnrolledCoursesQuery()

  // Split by is_completed flag — transformResponse already sets this from the API
  // progress value comes directly from process_percentage in transformResponse
  const inProgress = allEnrolled.filter(c => !c.is_completed)
  const completed  = allEnrolled.filter(c =>  c.is_completed)

  const show = key =>
    cat === 'All Topics' ||
    (key === 'enrolled'  && cat === 'Current Course') ||
    (key === 'completed' && cat === 'Course Complete') ||
    (key === 'saved'     && cat === 'Saved')

  return (
    <div className="flex flex-col gap-6">

      {/* ── Topic tabs ── */}
      <div className="flex flex-wrap gap-2">
        {TOPIC_TABS.map(t => (
          <button key={t} onClick={() => setCat(t)}
            className={
              'px-4 py-1.5 rounded-full text-xs font-bold border cursor-pointer transition-all ' +
              (cat === t
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-indigo-300 hover:text-indigo-600')
            }>
            {t}
          </button>
        ))}
      </div>

      {/* ── Current Courses ── */}
      {show('enrolled') && (
        <CourseSection
          title="Current Courses"
          onViewAll={() => go('courses')}
          isLoading={enrollLoading}
          isError={enrollError}
          error={enrollErr}
          refetch={refetchEnroll}
          data={inProgress}
          emptyMsg="You haven't enrolled in any courses yet."
          renderCard={c => (
            <CourseCard key={c.id} c={c} type="enrolled" onClick={() => openCourse(c)} />
          )}
        />
      )}

      {/* ── Completed Courses ── */}
      {/* Reuses the same cached query result — zero extra network calls */}
      {show('completed') && (
        <CourseSection
          title="Complete Courses"
          onViewAll={() => go('courses')}
          isLoading={enrollLoading}
          isError={enrollError}
          error={enrollErr}
          refetch={refetchEnroll}
          data={completed}
          emptyMsg="No completed courses yet — keep going! 🚀"
          renderCard={c => (
            <CourseCard key={c.id} c={c} type="completed" />
          )}
        />
      )}

      {/* ── Saved ── */}
      {show('saved') && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-black text-slate-900 dark:text-white" style={{ fontFamily: "'Outfit',sans-serif" }}>
              Saved
            </h2>
          </div>

          <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl w-fit mb-5 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setSavedTab('books')}
              className={
                'px-4 py-2 rounded-xl text-xs font-bold border-none cursor-pointer transition-all ' +
                (savedTab === 'books' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300')
              }>
              📚 Books ({bookmarkedIds.length})
            </button>
          </div>

          {bookmarkedIds.length === 0
            ? <EmptySaved label="No saved books yet" sub="Tap 🔖 on any book to save it" />
            : (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                You have <span className="font-bold text-indigo-600">{bookmarkedIds.length}</span> bookmarked book{bookmarkedIds.length !== 1 ? 's' : ''}.{' '}
                <button onClick={() => go('library')} className="text-indigo-600 font-bold hover:underline bg-transparent border-none cursor-pointer">
                  View in Library →
                </button>
              </p>
            )
          }
        </section>
      )}
    </div>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function DashboardStudent() {
  const { token } = useSelector(state => state.auth)

  const [page,       setPage]      = useState('home')
  const [selected,   setSel]       = useState(null)
  const [pendingIds, setPendingIds] = useState(new Set())

  const { data: bookmarkedIds = [] } = useGetMyBookmarksQuery(undefined, { skip: !token })
  const [addBookmark]                = useAddBookmarkMutation()
  const [removeBookmark]             = useRemoveBookmarkMutation()

  const handleToggleBookmark = async (bookId, isSaved) => {
    setPendingIds(prev => new Set(prev).add(bookId))
    try {
      if (isSaved) await removeBookmark(bookId).unwrap()
      else         await addBookmark(bookId).unwrap()
    } finally {
      setPendingIds(prev => { const s = new Set(prev); s.delete(bookId); return s })
    }
  }

  const go         = p => setPage(p)
  const openCourse = c => { setSel(c); setPage('lesson') }

  return (
    <>
      {page === 'home' && (
        <HomePage
          go={go}
          openCourse={openCourse}
          bookmarkedIds={bookmarkedIds}
          pendingIds={pendingIds}
          onToggleBookmark={handleToggleBookmark}
        />
      )}

      {page === 'courses'  && <MyCourse openCourse={openCourse} />}
      {page === 'profile'  && <MyProfile token={token} />}

      {page === 'lesson' && selected && (
        <div>
          <button
            onClick={() => go('courses')}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6 border-none bg-transparent cursor-pointer">
            ← Back to Courses
          </button>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white" style={{ fontFamily: "'Outfit',sans-serif" }}>
            {selected.title}
          </h1>
          <p className="text-sm text-slate-400 mt-1">{selected.instructor}</p>
        </div>
      )}
    </>
  )
}