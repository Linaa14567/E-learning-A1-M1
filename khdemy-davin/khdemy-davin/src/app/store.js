import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '../features/api/apiSlice';
import authReducer from '../features/auth/authSlice';
import { blogApi } from '../features/blog/blogApi';
import { teacherApi } from '../features/teacher/teacherApi';
import { coursesApi } from '../features/courses/coursesApi';
import { booksApi } from '../features/books/booksAPI';
import { categoriesApi } from '../features/categories/categoriesApi';

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    [blogApi.reducerPath]:  blogApi.reducer,
    [teacherApi.reducerPath]: teacherApi.reducer,
    [coursesApi.reducerPath]: coursesApi.reducer,
    [booksApi.reducerPath]:   booksApi.reducer,
    [categoriesApi.reducerPath]: categoriesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
  .concat(apiSlice.middleware)
  .concat(blogApi.middleware)
  .concat(teacherApi.middleware)
  .concat(coursesApi.middleware)
  .concat(booksApi.middleware)
  .concat(categoriesApi.middleware),
});