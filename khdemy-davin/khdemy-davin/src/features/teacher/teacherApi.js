// import { createApi } from "@reduxjs/toolkit/query/react";
// import { baseQuery } from "../baseQuery";

// export const teacherApi = createApi({
//   reducerPath: "teacherApi",
//   baseQuery,
//   tagTypes: ["Profile", "Stats"],
//   endpoints: (builder) => ({

//     // GET /users/me
//     getProfile: builder.query({
//       query: () => "/users/me",
//       transformResponse: (res) => ({
//         id:         res.id,
//         name:       res.full_name    ?? res.username ?? "Teacher",
//         username:   res.username     ?? "",
//         email:      res.email        ?? "",
//         role:       res.role         ?? "",
//         bio:        res.bio          ?? "",
//         phone:      res.phone_number ?? "",
//         address:    res.address      ?? "",
//         gender:     res.gender       ?? "",
//         dob:        res.date_of_birth ?? "",
//         avatar_url: res.profile_url  ?? null,
//         online:     true,
//       }),
//       providesTags: ["Profile"],
//     }),

//     // GET /teacher/stats  ← update if backend uses a different route
//     getTeacherStats: builder.query({
//       query: () => "/teacher/stats",
//       transformResponse: (res) => ({
//         totalCourses:    res.totalCourses    ?? res.total_courses    ?? 0,
//         totalEnrollment: res.totalEnrollment ?? res.total_enrollment ?? 0,
//         totalBlogs:      res.totalBlogs      ?? res.total_blogs      ?? 0,
//         totalBooks:      res.totalBooks      ?? res.total_books      ?? 0,
//       }),
//       providesTags: ["Stats"],
//     }),

//   }),
// });

// export const { useGetProfileQuery, useGetTeacherStatsQuery } = teacherApi;

import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";

export const teacherApi = createApi({
  reducerPath: "teacherApi",
  baseQuery,
  tagTypes: ["Profile", "Stats"],
  endpoints: (builder) => ({
    // GET /users/me
    getProfile: builder.query({
      query: () => "/users/me",
      transformResponse: (res) => ({
        id: res.id,
        name: res.full_name ?? res.username ?? "Teacher",
        username: res.username ?? "",
        email: res.email ?? "",
        role: res.role ?? "",
        bio: res.bio ?? "",
        phone: res.phone_number ?? "",
        address: res.address ?? "",
        gender: res.gender ?? "",
        dob: res.date_of_birth ?? "",
        avatar_url: res.profile_url ?? null,
        online: true,
      }),
      providesTags: ["Profile"],
    }),

    // ✅ PUT /users/me
    // updateProfile: builder.mutation({
    //   query: (body) => ({
    //     url: "/users/me",
    //     method: "PUT",
    //     body,
    //   }),
    //   invalidatesTags: ["Profile"], // ← auto-refetches sidebar after save
    // }),

    updateProfile: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        body, // plain JSON, no FormData
      }),
      invalidatesTags: ["Profile"],
    }),

    // GET /teacher/stats
    getTeacherStats: builder.query({
      query: () => "/teacher/stats",
      transformResponse: (res) => ({
        totalCourses: res.totalCourses ?? res.total_courses ?? 0,
        totalEnrollment: res.totalEnrollment ?? res.total_enrollment ?? 0,
        totalBlogs: res.totalBlogs ?? res.total_blogs ?? 0,
        totalBooks: res.totalBooks ?? res.total_books ?? 0,
      }),
      providesTags: ["Stats"],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation, // ✅ new
  useGetTeacherStatsQuery,
} = teacherApi;
