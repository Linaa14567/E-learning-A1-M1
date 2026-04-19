// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// export const apiSlice = createApi({
//   reducerPath: 'api',
//   baseQuery: fetchBaseQuery({
//     baseUrl: import.meta.env.VITE_API_BASE_URL,
//     prepareHeaders: (headers) => {
//       const token = localStorage.getItem('access_token');
//       if (token) {
//         headers.set('Authorization', `Bearer ${token}`);
//       }
//       return headers;
//     },
//   }),
//   tagTypes: ['User'],
//   endpoints: (builder) => ({
//     uploadFile: builder.mutation({
//       query: (formData) => ({
//         url:    "/upload",
//         method: "POST",
//         body:   formData,
//       }),
//     }),
//   }),
// });

// export const { useUploadFileMutation } = apiSlice;


import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// ─── File size limit — adjust to match your nginx client_max_body_size ────────
export const MAX_FILE_SIZE_MB    = 10;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('access_token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['User'],
  endpoints: (builder) => ({

    // POST /upload  →  returns a plain string URL on success
    uploadFile: builder.mutation({
      queryFn: async (formData, _api, _extraOptions, baseQueryFn) => {
        // 1. Client-side guard — reject before touching the network
        const file = formData.get('file');
        if (file instanceof File && file.size > MAX_FILE_SIZE_BYTES) {
          return {
            error: {
              status: 413,
              data: `"${file.name}" is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum allowed size is ${MAX_FILE_SIZE_MB} MB.`,
            },
          };
        }

        // 2. Send to server
        const result = await baseQueryFn({
          url:    '/upload',
          method: 'POST',
          body:   formData,
        });

        // 3. Map server-side 413 → readable message
        if (result.error?.status === 413) {
          return {
            error: {
              status: 413,
              data: `The server rejected the file — it exceeds the ${MAX_FILE_SIZE_MB} MB limit. Please compress or resize it and try again.`,
            },
          };
        }

        return result;
      },
    }),

  }),
});

export const { useUploadFileMutation } = apiSlice;