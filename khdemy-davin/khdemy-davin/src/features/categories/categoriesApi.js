// features/categories/categoriesApi.js
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";

export const categoriesApi = createApi({
  reducerPath: "categoriesApi",
  baseQuery,
  tagTypes: ["Category"],
  endpoints: (builder) => ({

    getCategories: builder.query({
      query: () => "/categories/",
      providesTags: ["Category"],
    }),

    getCategoryById: builder.query({
      query: (id) => `/categories/${id}/`,
      providesTags: ["Category"],
    }),

    createCategory: builder.mutation({
      query: (body) => ({
        url: "/categories/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Category"],
    }),

  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
} = categoriesApi;

// import { createApi } from "@reduxjs/toolkit/query/react";
// import { baseQuery } from "../baseQuery";

// export const categoriesApi = createApi({
//   reducerPath: "categoriesApi",
//   baseQuery,
//   tagTypes: ["Category"],
//   endpoints: (builder) => ({
//     getCategories: builder.query({
//       query: () => "/categories/",
//       providesTags: ["Category"],
//     }),
//     getCategoryById: builder.query({
//       query: (id) => `/categories/${id}/`,
//       providesTags: ["Category"],
//     }),
//     createCategory: builder.mutation({
//       query: (body) => ({
//         url: "/categories/",
//         method: "POST",
//         body,
//       }),
//       invalidatesTags: ["Category"],
//     }),
//   }),
// });

// export const {
//   useGetCategoriesQuery,
//   useGetCategoryByIdQuery,
//   useCreateCategoryMutation,
// } = categoriesApi;