import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery"; // 👈 adjust path if needed

export const blogApi = createApi({
  reducerPath: "blogApi",
  baseQuery,
  tagTypes: ["Blog"],
  endpoints: (builder) => ({
    // GET /blogs?limit=5  — list all blogs (params forwarded)
    // getBlogs: builder.query({
    //   query: (params) => ({ url: "/blogs/", params }),
    //   providesTags: ["Blog"],
    // }),
    getBlogs: builder.query({
      query: (params) => ({
        url: "/blogs/",
        params,
        // Add this if your baseQuery supports it:
        headers: { Authorization: undefined },
      }),
    }),

    // GET /blogs/:id  — single blog (used when editing)
    getBlogById: builder.query({
      query: (id) => `/blogs/${id}`,
      providesTags: (_res, _err, id) => [{ type: "Blog", id }],
    }),

    // POST /blogs
    createBlog: builder.mutation({
      query: (body) => ({
        url: "/blogs/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Blog"],
    }),

    // PUT /blogs/:id
    updateBlog: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/blogs/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_res, _err, { id }) => [{ type: "Blog", id }, "Blog"],
    }),

    // DELETE /blogs/:id
    deleteBlog: builder.mutation({
      query: (id) => ({
        url: `/blogs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Blog"],
    }),
  }),
});

export const {
  useGetBlogsQuery,
  useGetBlogByIdQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} = blogApi;
