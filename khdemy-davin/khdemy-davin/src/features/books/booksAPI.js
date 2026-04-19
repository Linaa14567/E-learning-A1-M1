// import { createApi } from "@reduxjs/toolkit/query/react";
// import { baseQuery } from "../baseQuery";

// // ─── Normalise a single book item to a consistent shape ───────────────────────
// const normaliseItem = (b) => ({
//   id: b.id,
//   title: b.title ?? "",
//   description: b.description ?? "",
//   file_url: b.file_url ?? "",
//   thumbnail: b.thumbnail ?? b.thumbnail_url ?? null,
//   author_id: b.author_id ?? null,
//   author: b.author?.full_name ?? b.author ?? null,
//   // Keep full category objects so consumers can read .name; also expose flat id array
//   category_ids: (b.categories ?? []).map((c) =>
//     typeof c === "object" ? c.id : c,
//   ),
//   categories: (b.categories ?? []).map((c) =>
//     typeof c === "object" ? c : { id: c, name: "General" },
//   ),
//   metadata: b.metadata ?? "",
//   uploaded_at: b.uploaded_at ?? null,
// });

// // ─── Normalise a paginated response ──────────────────────────────────────────
// const normalisePage = (res) => {
//   // API may return { total, page, limit, total_pages, items: [...] }
//   // or legacy shapes like { books: [...] }
//   const raw = res?.items ?? res?.books ?? (Array.isArray(res) ? res : []);
//   return {
//     total: res?.total ?? raw.length,
//     page: res?.page ?? 1,
//     limit: res?.limit ?? 10,
//     // total_pages: res?.total_pages ?? 1,
//     total_pages: res?.total_pages ?? 1,
//     items: raw.map(normaliseItem),
//   };
// };

// export const booksApi = createApi({
//   reducerPath: "booksApi",
//   baseQuery,
//   tagTypes: ["Book", "Bookmark"],
//   endpoints: (builder) => ({
//     // GET /books/?page=1&limit=6  — paginated, used by Explore section
//     getBooks: builder.query({
//       query: ({ page = 1, limit = 6, category_id } = {}) => {
//         let url = `/books/?page=${page}&limit=${limit}`;
//         if (category_id) url += `&category_id=${category_id}`;
//         return url;
//       },
//       transformResponse: (res) => {
//         const raw = res?.books ?? res?.items ?? (Array.isArray(res) ? res : []);
//         return {
//           items: raw.map(normaliseItem),
//           total: res?.total ?? raw.length,
//           page: res?.page ?? 1,
//           total_pages: res?.total_pages ?? 1,
//         };
//       },
//       providesTags: ["Book"],
//     }),

//     // GET /books/?page=1&limit=N  — used by Trending / hero sections
//     getAllBooks: builder.query({
//       query: ({ page = 1, limit = 6 } = {}) =>
//         `/books/?page=${page}&limit=${limit}`,
//       transformResponse: (res) => {
//         const raw = res?.books ?? res?.items ?? (Array.isArray(res) ? res : []);
//         return raw.map(normaliseItem);
//       },
//       providesTags: ["Book"],
//     }),

//     getBookById: builder.query({
//       query: (id) => `/books/${id}`,
//       transformResponse: (res) => normaliseItem(res),
//       providesTags: (_res, _err, id) => [{ type: "Book", id }],
//     }),

//     // GET /books/owner/{owner_id}?page=1&limit=10
//     getOwnerBooks: builder.query({
//       query: ({ owner_id, page = 1, limit = 10 }) =>
//         `/books/owner/${owner_id}?page=${page}&limit=${limit}`,
//       transformResponse: normalisePage, // returns { total, page, limit, total_pages, items }
//       providesTags: (result, error, { owner_id }) => [
//         { type: "Book", id: `OWNER_${owner_id}` },
//         "Book",
//       ],
//     }),

//     // POST /books/
//     createBook: builder.mutation({
//       query: (body) => ({ url: "/books/", method: "POST", body }),
//       invalidatesTags: ["Book"],
//     }),

//     // PUT /books/:id

//     updateBook: builder.mutation({
//       query: ({ id, ...body }) => ({
//         url: `/books/${id}`,
//         method: "PATCH",
//         body,
//       }),
//       invalidatesTags: (_res, _err, { id }) => [{ type: "Book", id }, "Book"], // ← add this
//     }),

//     // DELETE /books/:id
//     deleteBook: builder.mutation({
//       query: (id) => ({ url: `/books/${id}`, method: "DELETE" }),
//       invalidatesTags: ["Book"],
//     }),

//     // POST /upload — caller passes pre-built FormData
//     uploadFile: builder.mutation({
//       query: (formData) => ({
//         url: "/upload/",
//         method: "POST",
//         body: formData,
//       }),
//     }),

//     // GET /books/bookmark/me
//     getMyBookmarks: builder.query({
//       query: () => "/books/bookmark/me",
//       transformResponse: (res) => {
//         const raw =
//           res?.books ??
//           res?.items ??
//           res?.data ??
//           (Array.isArray(res) ? res : []);
//         return raw.map((b) => b.id ?? b.book_id ?? b);
//       },
//       providesTags: ["Bookmark"],
//     }),

//     // POST /books/bookmark
//     addBookmark: builder.mutation({
//       query: (book_id) => ({
//         url: "/books/bookmark",
//         method: "POST",
//         body: { book_id },
//       }),
//       // Optimistic update — instant UI, no waiting for server
//       async onQueryStarted(book_id, { dispatch, queryFulfilled }) {
//         const patch = dispatch(
//           booksApi.util.updateQueryData(
//             "getMyBookmarks",
//             undefined,
//             (draft) => {
//               if (!draft.includes(book_id)) draft.push(book_id);
//             },
//           ),
//         );
//         try {
//           await queryFulfilled;
//         } catch {
//           patch.undo();
//         }
//       },
//     }),

//     // DELETE /books/bookmark/{book_id}
//     removeBookmark: builder.mutation({
//       query: (book_id) => ({
//         url: `/books/bookmark/${book_id}`,
//         method: "DELETE",
//       }),
//       // Optimistic update
//       async onQueryStarted(book_id, { dispatch, queryFulfilled }) {
//         const patch = dispatch(
//           booksApi.util.updateQueryData(
//             "getMyBookmarks",
//             undefined,
//             (draft) => {
//               const idx = draft.indexOf(book_id);
//               if (idx !== -1) draft.splice(idx, 1);
//             },
//           ),
//         );
//         try {
//           await queryFulfilled;
//         } catch {
//           patch.undo();
//         }
//       },
//     }),
//   }),
// });

// export const {
//   useGetBooksQuery,
//   useGetAllBooksQuery,
//   useGetBookByIdQuery,
//   useGetOwnerBooksQuery,
//   useCreateBookMutation,
//   useUpdateBookMutation,
//   useDeleteBookMutation,
//   useUploadFileMutation,
//   useGetMyBookmarksQuery,
//   useAddBookmarkMutation,
//   useRemoveBookmarkMutation,
// } = booksApi;


import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";

const normaliseItem = (b) => ({
  id: b.id,
  title: b.title ?? "",
  description: b.description ?? "",
  file_url: b.file_url ?? "",
  thumbnail: b.thumbnail ?? b.thumbnail_url ?? null,
  author_id: b.author_id ?? null,
  author: b.author?.full_name ?? b.author ?? null,
  category_ids: (b.categories ?? []).map((c) =>
    typeof c === "object" ? c.id : c,
  ),
  categories: (b.categories ?? []).map((c) =>
    typeof c === "object" ? c : { id: c, name: "General" },
  ),
  metadata: b.metadata ?? "",
  uploaded_at: b.uploaded_at ?? null,
});

const normalisePage = (res) => {
  const raw = res?.items ?? res?.books ?? (Array.isArray(res) ? res : []);
  return {
    total: res?.total ?? raw.length,
    page: res?.page ?? 1,
    limit: res?.limit ?? 10,
    total_pages: res?.total_pages ?? 1,
    items: raw.map(normaliseItem),
  };
};

export const booksApi = createApi({
  reducerPath: "booksApi",
  baseQuery,
  tagTypes: ["Book", "Bookmark"],
  endpoints: (builder) => ({
    getBooks: builder.query({
      query: ({ page = 1, limit = 6, category_id } = {}) => {
        let url = `/books/?page=${page}&limit=${limit}`;
        if (category_id) url += `&category_id=${category_id}`;
        return url;
      },
      transformResponse: (res) => {
        const raw = res?.books ?? res?.items ?? (Array.isArray(res) ? res : []);
        return {
          items: raw.map(normaliseItem),
          total: res?.total ?? raw.length,
          page: res?.page ?? 1,
          total_pages: res?.total_pages ?? 1,
        };
      },
      providesTags: ["Book"],
    }),

    getAllBooks: builder.query({
      query: ({ page = 1, limit = 6 } = {}) =>
        `/books/?page=${page}&limit=${limit}`,
      transformResponse: (res) => {
        const raw = res?.books ?? res?.items ?? (Array.isArray(res) ? res : []);
        return raw.map(normaliseItem);
      },
      providesTags: ["Book"],
    }),

    getBookById: builder.query({
      query: (id) => `/books/${id}`,
      transformResponse: (res) => normaliseItem(res),
      providesTags: (_res, _err, id) => [{ type: "Book", id }],
    }),

    getOwnerBooks: builder.query({
      query: ({ owner_id, page = 1, limit = 10 }) =>
        `/books/owner/${owner_id}?page=${page}&limit=${limit}`,
      transformResponse: normalisePage,
      providesTags: (result, error, { owner_id }) => [
        { type: "Book", id: `OWNER_${owner_id}` },
        "Book",
      ],
    }),

    createBook: builder.mutation({
      query: (body) => ({ url: "/books/", method: "POST", body }),
      invalidatesTags: ["Book"],
    }),

    updateBook: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/books/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_res, _err, { id }) => [{ type: "Book", id }, "Book"],
    }),

    deleteBook: builder.mutation({
      query: (id) => ({ url: `/books/${id}`, method: "DELETE" }),
      invalidatesTags: ["Book"],
    }),

    uploadFile: builder.mutation({
      query: (formData) => ({
        url: "/upload/",
        method: "POST",
        body: formData,
      }),
    }),

    getMyBookmarks: builder.query({
      query: () => "/books/bookmark/me",
      transformResponse: (res) => {
        const raw =
          res?.books ??
          res?.items ??
          res?.data ??
          (Array.isArray(res) ? res : []);
        return raw.map((b) => b.id ?? b.book_id ?? b);
      },
      providesTags: ["Bookmark"],
    }),

    // POST /books/bookmark — tries query param first (FastAPI style)
    // If still 422, change to: url: `/books/bookmark?book_id=${book_id}`
    addBookmark: builder.mutation({
      query: (book_id) => ({
        url: `/books/bookmark?book_id=${Number(book_id)}`,
        method: "POST",
      }),
      async onQueryStarted(book_id, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          booksApi.util.updateQueryData(
            "getMyBookmarks",
            undefined,
            (draft) => {
              if (!draft.includes(book_id)) draft.push(book_id);
            },
          ),
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
    }),

    removeBookmark: builder.mutation({
      query: (book_id) => ({
        url: `/books/bookmark/${book_id}`,
        method: "DELETE",
      }),
      async onQueryStarted(book_id, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          booksApi.util.updateQueryData(
            "getMyBookmarks",
            undefined,
            (draft) => {
              const idx = draft.indexOf(book_id);
              if (idx !== -1) draft.splice(idx, 1);
            },
          ),
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
    }),
  }),
});

export const {
  useGetBooksQuery,
  useGetAllBooksQuery,
  useGetBookByIdQuery,
  useGetOwnerBooksQuery,
  useCreateBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation,
  useUploadFileMutation,
  useGetMyBookmarksQuery,
  useAddBookmarkMutation,
  useRemoveBookmarkMutation,
} = booksApi;