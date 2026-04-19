// import { useGetBlogsQuery } from "../../features/blog/blogApi";
// import { MediaThumb, SectionHeader, SmallAvatar } from "./Profile";

// // ── Skeleton row ──────────────────────────────────────────────────────────────
// const SkeletonRow = () => (
//   <div className="flex items-center gap-5 py-4 animate-pulse">
//     <div className="w-24 h-16 rounded-lg bg-gray-100 flex-shrink-0" />
//     <div className="flex-1 space-y-2">
//       <div className="h-3 w-48 bg-gray-100 rounded" />
//       <div className="h-2 w-64 bg-gray-100 rounded" />
//       <div className="flex items-center gap-2">
//         <div className="w-8 h-8 rounded-full bg-gray-100" />
//         <div className="h-2 w-16 bg-gray-100 rounded" />
//       </div>
//     </div>
//   </div>
// );

// // ── Article row ───────────────────────────────────────────────────────────────
// const ArticleRow = ({ article, idx }) => (
//   <div className="flex items-center gap-5 py-4 rounded-xl
//     transition-colors duration-150 hover:bg-slate-50">
//     {article.thumbnail_url ? (
//       <img
//         src={article.thumbnail_url}
//         alt={article.title}
//         className="w-24 h-16 rounded-lg object-cover flex-shrink-0 shadow"
//       />
//     ) : (
//       <MediaThumb idx={idx} />
//     )}
//     <div className="flex-1 min-w-0">
//       <p className="text-base font-bold text-gray-800 truncate">{article.title}</p>
//       <p className="text-sm text-gray-400 truncate mb-2">{article.desc}</p>
//       <div className="flex items-center gap-2">
//         <SmallAvatar />
//         <span className="text-sm text-gray-500 font-medium">{article.author}</span>
//       </div>
//     </div>
//   </div>
// );

// // ── MyArticle ─────────────────────────────────────────────────────────────────
// export default function MyArticle() {
//   const { data, isLoading, isError } = useGetBlogsQuery({ limit: 5 });

//   // 👇 handles: array, { blogs: [] }, { data: [] }, { results: [] }
//   const articles = Array.isArray(data)
//     ? data
//     : data?.blogs ?? data?.data ?? data?.results ?? [];

//   return (
//     <div className="bg-white rounded-2xl shadow-sm p-7 mb-6">
//       <SectionHeader
//         title="Article"
//         highlight="My"
//         linkLabel="See All Articles"
//         onLink={() => { /* navigate("/dashboard/blogs") */ }}
//       />

//       {isError && (
//         <p className="text-xs text-red-400 py-3 text-center">Failed to load articles.</p>
//       )}

//       <div className="divide-y divide-gray-50">
//         {isLoading
//           ? Array.from({ length: 2 }).map((_, i) => <SkeletonRow key={i} />)
//           : articles.map((article, idx) => (
//               <ArticleRow key={article.id} article={article} idx={idx} />
//             ))
//         }
//       </div>
//     </div>
//   );
// }


import { useNavigate } from "react-router-dom";
import { useGetBlogsQuery } from "../../features/blog/blogApi";
import { MediaThumb, SectionHeader, SmallAvatar } from "./Profile";

const SkeletonRow = () => (
  <div className="flex items-center gap-5 py-4 animate-pulse">
    <div className="w-24 h-16 rounded-lg bg-gray-100 dark:bg-gray-700 flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="h-3 w-48 bg-gray-100 dark:bg-gray-700 rounded" />
      <div className="h-2 w-64 bg-gray-100 dark:bg-gray-700 rounded" />
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700" />
        <div className="h-2 w-16 bg-gray-100 dark:bg-gray-700 rounded" />
      </div>
    </div>
  </div>
);

const ArticleRow = ({ article, idx }) => (
  <div className="flex items-center gap-5 py-4 rounded-xl transition-colors duration-150
    hover:bg-slate-50 dark:hover:bg-gray-700/50">
    {article.thumbnail_url ? (
      <img
        src={article.thumbnail_url}
        alt={article.title}
        className="w-24 h-16 rounded-lg object-cover flex-shrink-0 shadow"
      />
    ) : (
      <MediaThumb idx={idx} />
    )}
    <div className="flex-1 min-w-0">
      <p className="text-base font-bold text-gray-800 dark:text-gray-100 truncate">
        {article.title}
      </p>
      <p className="text-sm text-gray-400 dark:text-gray-500 truncate mb-2">
        {article.desc}
      </p>
      <div className="flex items-center gap-2">
        <SmallAvatar />
        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
          {article.author}
        </span>
      </div>
    </div>
  </div>
);

export default function MyArticle() {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetBlogsQuery({ limit: 3 });

  const articles = (
    Array.isArray(data) ? data : data?.blogs ?? data?.data ?? data?.results ?? []
  ).slice(0, 3);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm dark:shadow-gray-900/30 p-7 mb-6">
      <SectionHeader
        title="Article"
        highlight="My"
        linkLabel="See All Articles"
        onLink={() => navigate("/profile/all-blogs")}
      />

      {isError && (
        <p className="text-xs text-red-400 dark:text-red-500 py-3 text-center">
          Failed to load articles.
        </p>
      )}

      <div className="divide-y divide-gray-50 dark:divide-gray-700/50">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} />)
          : articles.map((article, idx) => (
              <ArticleRow key={article.id} article={article} idx={idx} />
            ))}
      </div>
    </div>
  );
}