// import { createApi } from "@reduxjs/toolkit/query/react";
// import { baseQuery } from "../baseQuery";

// const COLORS = [
//   "#6366f1",
//   "#8b5cf6",
//   "#ec4899",
//   "#0ea5e9",
//   "#10b981",
//   "#f59e0b",
// ];

// export const coursesApi = createApi({
//   reducerPath: "coursesApi",
//   baseQuery,
//   tagTypes: ["Course", "Enrollment", "Progress"],
//   endpoints: (builder) => ({
//     // ─────────────────────────────────────────────────────────────────────
//     // PUBLIC
//     // ─────────────────────────────────────────────────────────────────────

//     // GET /courses/
//     getCourses: builder.query({
//       query: (params = {}) => ({ url: "/courses/", params }),
//       transformResponse: (res) =>
//         Array.isArray(res) ? res : res?.courses ?? res?.data ?? [],
//       providesTags: ["Course"],
//     }),

//     // GET /courses/{id}  ← backend returns 405, use getTeacherCourses + find instead
//     // getCourseById: builder.query({
//     //   query: (id) => `/courses/${id}`,
//     //   providesTags: (_res, _err, id) => [{ type: "Course", id }],
//     // }),
    
//     getCourseById: builder.query({
//       query: (id) => `/courses/?id=${id}`, // try this first
//       transformResponse: (res) => {
//         const list = Array.isArray(res) ? res : res?.courses ?? res?.data ?? [];
//         return list[0] ?? null;
//       },
//     }),
//     // ─────────────────────────────────────────────────────────────────────
//     // TEACHER
//     // ─────────────────────────────────────────────────────────────────────

//     // GET /courses/get-own-course
//     getTeacherCourses: builder.query({
//       query: () => "/courses/get-own-course",
//       transformResponse: (res) => {
//         const list = Array.isArray(res) ? res : res?.courses ?? res?.data ?? [];
//         return list.map((c, i) => ({
//           id: c.id,
//           title: c.title ?? "",
//           description: c.description ?? "",
//           category: c.category?.name ?? c.category ?? "",
//           category_id: c.category_id ?? c.category?.id ?? null,
//           type: c.is_paid ? "Paid" : "Free",
//           students: c.total_students ?? 0,
//           thumbnail_url: c.thumbnail_url ?? c.thumbnail ?? null,
//           thumbnail: c.thumbnail ?? c.thumbnail_url ?? null,
//           color: c.color ?? COLORS[i % COLORS.length],
//           lessons: c.lessons ?? [], // [{id,title,description,video_url,attachments}]
//           tags: c.tags ?? [], // [{id,name}]
//         }));
//       },
//       providesTags: ["Course"],
//     }),

//     // POST /courses
//     createCourse: builder.mutation({
//       query: (body) => ({
//         url: "/courses/",
//         method: "POST",
//         body,
//       }),
//       invalidatesTags: ["Course"],
//     }),

//     // PATCH /courses/{id}
//     updateCourse: builder.mutation({
//       query: ({ id, ...body }) => ({
//         url: `/courses/${id}`,
//         method: "PATCH",
//         body,
//       }),
//       invalidatesTags: ["Course"],
//     }),

//     // DELETE /courses/{id}
//     deleteCourse: builder.mutation({
//       query: (id) => ({
//         url: `/courses/${id}`,
//         method: "DELETE",
//       }),
//       invalidatesTags: ["Course"],
//     }),

//     // ─────────────────────────────────────────────────────────────────────
//     // STUDENT
//     // ─────────────────────────────────────────────────────────────────────

//     // GET /courses/get-enrolled-course
//     // getEnrolledCourses: builder.query({
//     //   query: () => "/courses/get-enrolled-course",
//     //   transformResponse: (res) => {
//     //     const list = Array.isArray(res) ? res : res?.courses ?? res?.data ?? [];
//     //     return list.map((c) => ({
//     //       id: c.id,
//     //       title: c.title ?? "",
//     //       description: c.description ?? "",
//     //       thumbnail_url: c.thumbnail_url ?? c.thumbnail ?? null,
//     //       category: c.category?.name ?? c.category ?? "",
//     //       type: c.is_paid ? "Paid" : "Free",
//     //       progress: c.progress ?? 0,
//     //       lessons: c.lessons ?? [],
//     //     }));
//     //   },
//     //   providesTags: ["Enrollment"],
//     // }),

//     getEnrolledCourses: builder.query({
//       query: () => "/courses/enrollments",
//       transformResponse: (res) => {
//         const list = Array.isArray(res) ? res : res?.courses ?? res?.data ?? [];
//         return list.map((c) => ({
//           id:            c.course_id      ?? c.id,
//           title:         c.title         ?? "",
//           description:   c.description   ?? "",
//           thumbnail_url: c.thumbnail_url ?? c.thumbnail ?? null,
//           thumbnail:     c.thumbnail     ?? c.thumbnail_url ?? null,
//           category:      c.category?.name ?? c.category ?? "",
//           type:          c.is_paid ? "Paid" : "Free",
//           progress:      c.process_percentage ?? c.progress ?? 0,
//           is_completed:  c.is_completed   ?? false,
//           enrolled_at:   c.enrolled_at    ?? null,
//           enrollment_id: c.enrollment_id  ?? null,
//           lessons:       c.lessons        ?? [],
//         }));
//       },
//       providesTags: ["Enrollment"],
//     }),

//     // // POST /courses/enroll  body: { course_id: 3 }
//     // enrollCourse: builder.mutation({
//     //   query: (courseId) => ({
//     //     url: "/courses/enroll",
//     //     method: "POST",
//     //     body: { course_id: courseId },
//     //   }),
//     //   invalidatesTags: ["Enrollment", "Course"],
//     // }),

//     // POST /courses/{course_id}/enroll  ← FIXED (was /courses/enroll)
//     enrollCourse: builder.mutation({
//       query: (courseId) => ({
//         url:    `/courses/${courseId}/enroll`,
//         method: "POST",
//       }),
//       invalidatesTags: ["Enrollment", "Course"],
//     }),

//     // GET /courses/enrollments-progress
//     getEnrollmentProgress: builder.query({
//       query: () => "/courses/enrollments-progress",
//       providesTags: ["Progress"],
//     }),

//     // ─────────────────────────────────────────────────────────────────────
//     // LESSONS  — from Postman: POST /courses/{id}/lessons
//     // ─────────────────────────────────────────────────────────────────────

//     // POST /courses/{courseId}/lessons
//     // body: [{ title, description, video_url }, ...]  ← array!
//     addLessons: builder.mutation({
//       query: ({ courseId, lessons }) => ({
//         url: `/courses/${courseId}/lessons`,
//         method: "POST",
//         body: lessons, // send as array
//       }),
//       invalidatesTags: ["Course"],
//     }),

//     // DELETE /courses/{courseId}/lessons/{lessonId}
//     removeLesson: builder.mutation({
//       query: ({ courseId, lessonId }) => ({
//         url: `/courses/${courseId}/lessons/${lessonId}`,
//         method: "DELETE",
//       }),
//       invalidatesTags: ["Course"],
//     }),

//     // POST /lessons/{lessonId}/complete  ← NOT /progress
//     completeLesson: builder.mutation({
//       query: (lessonId) => ({
//         url: `/lessons/${lessonId}/complete`,
//         method: "POST",
//       }),
//       invalidatesTags: ["Progress", "Enrollment"],
//     }),

//     // ─────────────────────────────────────────────────────────────────────
//     // ATTACHMENTS  — from Postman
//     // ─────────────────────────────────────────────────────────────────────

//     // POST /lessons/{lessonId}/attachments
//     addAttachment: builder.mutation({
//       query: ({ lessonId, ...body }) => ({
//         url: `/lessons/${lessonId}/attachments`,
//         method: "POST",
//         body,
//       }),
//       invalidatesTags: ["Course"],
//     }),

//     // PUT /lessons/{lessonId}/attachments/{attachmentId}
//     updateAttachment: builder.mutation({
//       query: ({ lessonId, attachmentId, ...body }) => ({
//         url: `/lessons/${lessonId}/attachments/${attachmentId}`,
//         method: "PUT",
//         body,
//       }),
//       invalidatesTags: ["Course"],
//     }),

//     // DELETE /lessons/{lessonId}/attachments/{attachmentId}
//     deleteAttachment: builder.mutation({
//       query: ({ lessonId, attachmentId }) => ({
//         url: `/lessons/${lessonId}/attachments/${attachmentId}`,
//         method: "DELETE",
//       }),
//       invalidatesTags: ["Course"],
//     }),
//   }),
// });

// export const {
//   // ── Public ──────────────────────────────────────────────
//   useGetCoursesQuery, // GET /courses/
//   useGetCourseByIdQuery, // GET /courses/{id}  (405 — use list+find)

//   // ── Teacher ─────────────────────────────────────────────
//   useGetTeacherCoursesQuery, // GET /courses/get-own-course
//   useCreateCourseMutation, // POST /courses
//   useUpdateCourseMutation, // PATCH /courses/{id}
//   useDeleteCourseMutation, // DELETE /courses/{id}

//   // ── Student ─────────────────────────────────────────────
//   useGetEnrolledCoursesQuery, // GET /courses/get-enrolled-course
//   useEnrollCourseMutation, // POST /courses/enroll  { course_id }
//   useGetEnrollmentProgressQuery, // GET /courses/enrollments-progress

//   // ── Lessons ─────────────────────────────────────────────
//   useAddLessonsMutation, // POST /courses/{id}/lessons  (array body)
//   useRemoveLessonMutation, // DELETE /courses/{id}/lessons/{lid}
//   useCompleteLessonMutation, // POST /lessons/{id}/complete

//   // ── Attachments ─────────────────────────────────────────
//   useAddAttachmentMutation, // POST /lessons/{id}/attachments
//   useUpdateAttachmentMutation, // PUT  /lessons/{id}/attachments/{aid}
//   useDeleteAttachmentMutation, // DELETE /lessons/{id}/attachments/{aid}
// } = coursesApi;



import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";

const COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
  "#0ea5e9",
  "#10b981",
  "#f59e0b",
];

export const coursesApi = createApi({
  reducerPath: "coursesApi",
  baseQuery,
  tagTypes: ["Course", "Enrollment", "Progress"],
  endpoints: (builder) => ({
    // ─────────────────────────────────────────────────────────────────────
    // PUBLIC
    // ─────────────────────────────────────────────────────────────────────

    // GET /courses/
    getCourses: builder.query({
      query: (params = {}) => ({ url: "/courses/", params }),
      transformResponse: (res) =>
        Array.isArray(res) ? res : res?.courses ?? res?.data ?? [],
      providesTags: ["Course"],
    }),

    // GET /courses/{id}  ← backend returns 405, use getTeacherCourses + find instead
    // getCourseById: builder.query({
    //   query: (id) => `/courses/${id}`,
    //   providesTags: (_res, _err, id) => [{ type: "Course", id }],
    // }),
    
    getCourseById: builder.query({
      query: (id) => `/courses/?id=${id}`, // try this first
      transformResponse: (res) => {
        const list = Array.isArray(res) ? res : res?.courses ?? res?.data ?? [];
        return list[0] ?? null;
      },
    }),
    // ─────────────────────────────────────────────────────────────────────
    // TEACHER
    // ─────────────────────────────────────────────────────────────────────

    // GET /courses/get-own-course
    getTeacherCourses: builder.query({
      query: () => "/courses/get-own-course",
      transformResponse: (res) => {
        const list = Array.isArray(res) ? res : res?.courses ?? res?.data ?? [];
        return list.map((c, i) => ({
          id: c.id,
          title: c.title ?? "",
          description: c.description ?? "",
          category: c.category?.name ?? c.category ?? "",
          category_id: c.category_id ?? c.category?.id ?? null,
          type: c.is_paid ? "Paid" : "Free",
          students: c.total_students ?? 0,
          thumbnail_url: c.thumbnail_url ?? c.thumbnail ?? null,
          thumbnail: c.thumbnail ?? c.thumbnail_url ?? null,
          color: c.color ?? COLORS[i % COLORS.length],
          lessons: c.lessons ?? [], // [{id,title,description,video_url,attachments}]
          tags: c.tags ?? [], // [{id,name}]
        }));
      },
      providesTags: ["Course"],
    }),

    // POST /courses
    createCourse: builder.mutation({
      query: (body) => ({
        url: "/courses/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Course"],
    }),

    // PATCH /courses/{id}
    updateCourse: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/courses/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Course"],
    }),

    // DELETE /courses/{id}
    deleteCourse: builder.mutation({
      query: (id) => ({
        url: `/courses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Course"],
    }),

    // ─────────────────────────────────────────────────────────────────────
    // STUDENT
    // ─────────────────────────────────────────────────────────────────────

    // GET /courses/get-enrolled-course
    // getEnrolledCourses: builder.query({
    //   query: () => "/courses/get-enrolled-course",
    //   transformResponse: (res) => {
    //     const list = Array.isArray(res) ? res : res?.courses ?? res?.data ?? [];
    //     return list.map((c) => ({
    //       id: c.id,
    //       title: c.title ?? "",
    //       description: c.description ?? "",
    //       thumbnail_url: c.thumbnail_url ?? c.thumbnail ?? null,
    //       category: c.category?.name ?? c.category ?? "",
    //       type: c.is_paid ? "Paid" : "Free",
    //       progress: c.progress ?? 0,
    //       lessons: c.lessons ?? [],
    //     }));
    //   },
    //   providesTags: ["Enrollment"],
    // }),

    getEnrolledCourses: builder.query({
      query: () => "/courses/enrollments",
      transformResponse: (res) => {
        const list = Array.isArray(res) ? res : res?.courses ?? res?.data ?? [];
        return list.map((c) => ({
          id:            c.course_id      ?? c.id,
          title:         c.title         ?? "",
          description:   c.description   ?? "",
          thumbnail_url: c.thumbnail_url ?? c.thumbnail ?? null,
          thumbnail:     c.thumbnail     ?? c.thumbnail_url ?? null,
          category:      c.category?.name ?? c.category ?? "",
          type:          c.is_paid ? "Paid" : "Free",
          progress:      c.process_percentage ?? c.progress ?? 0,
          is_completed:  c.is_completed   ?? false,
          enrolled_at:   c.enrolled_at    ?? null,
          enrollment_id: c.enrollment_id  ?? null,
          lessons:       c.lessons        ?? [],
        }));
      },
      providesTags: ["Enrollment"],
    }),

    // // POST /courses/enroll  body: { course_id: 3 }
    // enrollCourse: builder.mutation({
    //   query: (courseId) => ({
    //     url: "/courses/enroll",
    //     method: "POST",
    //     body: { course_id: courseId },
    //   }),
    //   invalidatesTags: ["Enrollment", "Course"],
    // }),

    // POST /courses/{course_id}/enroll  ← FIXED (was /courses/enroll)
    enrollCourse: builder.mutation({
      query: (courseId) => ({
        url:    `/courses/${courseId}/enroll`,
        method: "POST",
      }),
      invalidatesTags: ["Enrollment", "Course"],
    }),

    // GET /courses/enrollments-progress
    getEnrollmentProgress: builder.query({
      query: () => "/courses/enrollments-progress",
      providesTags: ["Progress"],
    }),

    // ─────────────────────────────────────────────────────────────────────
    // LESSONS  — from Postman: POST /courses/{id}/lessons
    // ─────────────────────────────────────────────────────────────────────

    // POST /courses/{courseId}/lessons
    // body: [{ title, description, video_url }, ...]  ← array!
    addLessons: builder.mutation({
      query: ({ courseId, lessons }) => ({
        url: `/courses/${courseId}/lessons`,
        method: "POST",
        body: lessons, // send as array
      }),
      invalidatesTags: ["Course"],
    }),

    // DELETE /courses/{courseId}/lessons/{lessonId}
    removeLesson: builder.mutation({
      query: ({ courseId, lessonId }) => ({
        url: `/courses/${courseId}/lessons/${lessonId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Course"],
    }),

    // POST /lessons/{lessonId}/complete  ← NOT /progress
    completeLesson: builder.mutation({
      query: (lessonId) => ({
        url: `/lessons/${lessonId}/complete`,
        method: "POST",
      }),
      invalidatesTags: ["Progress", "Enrollment"],
    }),

    // ─────────────────────────────────────────────────────────────────────
    // ATTACHMENTS  — from Postman
    // ─────────────────────────────────────────────────────────────────────

    // POST /lessons/{lessonId}/attachments
    addAttachment: builder.mutation({
      query: ({ lessonId, ...body }) => ({
        url: `/lessons/${lessonId}/attachments`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Course"],
    }),

    // PUT /lessons/{lessonId}/attachments/{attachmentId}
    updateAttachment: builder.mutation({
      query: ({ lessonId, attachmentId, ...body }) => ({
        url: `/lessons/${lessonId}/attachments/${attachmentId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Course"],
    }),

    // DELETE /lessons/{lessonId}/attachments/{attachmentId}
    deleteAttachment: builder.mutation({
      query: ({ lessonId, attachmentId }) => ({
        url: `/lessons/${lessonId}/attachments/${attachmentId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Course"],
    }),
  }),
});

export const {
  // ── Public ──────────────────────────────────────────────
  useGetCoursesQuery, // GET /courses/
  useGetCourseByIdQuery, // GET /courses/{id}  (405 — use list+find)
// ── Teacher ─────────────────────────────────────────────
  useGetTeacherCoursesQuery, // GET /courses/get-own-course
  useCreateCourseMutation, // POST /courses
  useUpdateCourseMutation, // PATCH /courses/{id}
  useDeleteCourseMutation, // DELETE /courses/{id}

  // ── Student ─────────────────────────────────────────────
  useGetEnrolledCoursesQuery, // GET /courses/get-enrolled-course
  useEnrollCourseMutation, // POST /courses/enroll  { course_id }
  useGetEnrollmentProgressQuery, // GET /courses/enrollments-progress

  // ── Lessons ─────────────────────────────────────────────
  useAddLessonsMutation, // POST /courses/{id}/lessons  (array body)
  useRemoveLessonMutation, // DELETE /courses/{id}/lessons/{lid}
  useCompleteLessonMutation, // POST /lessons/{id}/complete

  // ── Attachments ─────────────────────────────────────────
  useAddAttachmentMutation, // POST /lessons/{id}/attachments
  useUpdateAttachmentMutation, // PUT  /lessons/{id}/attachments/{aid}
  useDeleteAttachmentMutation, // DELETE /lessons/{id}/attachments/{aid}
} = coursesApi;
