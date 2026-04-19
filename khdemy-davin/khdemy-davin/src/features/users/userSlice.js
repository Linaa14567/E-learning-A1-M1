import { apiSlice } from "../api/apiSlice";

export const userApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getUserInfo: build.query({
      query: (userId) => `/users/students/${userId}`,
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),
    getTeacherInfo: build.query({
      query: (teacherId) => `/users/teachers/${teacherId}`,
      providesTags: (result, error, id) => [{ type: "Teacher", id }],
    }),
    updateUserInfo: build.mutation({
      query: ({ id, ...data }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "User", id }],
    }),
  }),
});

export const {
  useGetUserInfoQuery,
  useGetTeacherInfoQuery,
  useUpdateUserInfoMutation,
} = userApi;
