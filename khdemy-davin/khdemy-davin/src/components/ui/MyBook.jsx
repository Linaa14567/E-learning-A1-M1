import { useNavigate } from "react-router-dom";
import { useGetOwnerBooksQuery } from "../../features/books/booksAPI";
import { SectionHeader } from "./Profile";
import { useSelector } from "react-redux";

const COLORS = [
  "from-indigo-400 to-purple-500",
  "from-blue-500 to-cyan-500",
  "from-pink-400 to-rose-500",
  "from-amber-400 to-orange-500",
  "from-emerald-400 to-teal-500",
  "from-violet-400 to-indigo-500",
];

const SkeletonRow = () => (
  <div className="flex items-center justify-between py-4 px-2 animate-pulse">
    <div className="flex items-center gap-4">
      <div className="w-14 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex-shrink-0" />
      <div className="space-y-2">
        <div className="h-3 w-40 bg-gray-100 dark:bg-gray-700 rounded" />
        <div className="h-2 w-24 bg-gray-100 dark:bg-gray-700 rounded" />
      </div>
    </div>
    <div className="h-3 w-16 bg-gray-100 dark:bg-gray-700 rounded" />
  </div>
);

const BookRow = ({ book, color }) => {
  const categoryName = book.categories?.[0]?.name ?? "General";

  return (
    <div className="flex items-center justify-between py-4 px-2 rounded-xl
      transition-colors duration-150
      hover:bg-slate-50 dark:hover:bg-gray-700/50">
      <div className="flex items-center gap-4">
        {book.thumbnail ? (
          <img
            src={book.thumbnail}
            alt={book.title}
            className="w-14 h-10 rounded-lg object-cover flex-shrink-0 shadow-sm"
          />
        ) : (
          <div className={`w-14 h-10 rounded-lg bg-gradient-to-r ${color} flex-shrink-0`} />
        )}
        <div>
          <p className="text-base font-bold text-gray-800 dark:text-gray-100 line-clamp-1">
            {book.title}
          </p>
          <span className="text-sm text-gray-400 dark:text-gray-500">{categoryName}</span>
        </div>
      </div>
      <span className="text-sm text-gray-500 dark:text-gray-400 font-medium truncate max-w-[120px] text-right">
        {book.author ?? "—"}
      </span>
    </div>
  );
};

export default function MyBook() {
  const navigate = useNavigate();
  const user     = useSelector((state) => state.auth.user);

  const { data, isLoading, isError } = useGetOwnerBooksQuery(
    { owner_id: user?.id, page: 1, limit: 3 },
    { skip: !user?.id }
  );

  const books = data?.items?.slice(0, 3) ?? [];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm dark:shadow-gray-900/30 p-7 mb-6">

      <SectionHeader
        title="Book"
        highlight="My"
        linkLabel="See All Books"
        onLink={() => navigate("/profile/all-books")}
      />

      {/* Column labels */}
      <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 font-semibold mb-1 px-2 uppercase tracking-widest">
        <span>Book Name</span>
        <span>Author</span>
      </div>

      {isError && (
        <p className="text-xs text-red-400 dark:text-red-500 py-3 text-center">
          Failed to load books.
        </p>
      )}

      <div className="divide-y divide-gray-50 dark:divide-gray-700/50">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} />)
          : books.length === 0
            ? <p className="text-xs text-gray-400 dark:text-gray-500 py-6 text-center">No books yet.</p>
            : books.map((book, i) => (
                <BookRow
                  key={book.id}
                  book={book}
                  color={COLORS[i % COLORS.length]}
                />
              ))
        }
      </div>
    </div>
  );
}