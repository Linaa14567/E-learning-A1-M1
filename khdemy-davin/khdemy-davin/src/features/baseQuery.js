// // features/baseQuery.js — single shared baseQuery for all slices
// import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// export const baseQuery = fetchBaseQuery({
//   baseUrl: "https://khdemy.anajak-khmer.site",
//   prepareHeaders: (headers) => {
//     const token = localStorage.getItem("access_token"); // ✅ FIXED
//     if (token) headers.set("Authorization", `Bearer ${token}`);
//     return headers;
//   },
// });

import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL, // ✅ use env
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});