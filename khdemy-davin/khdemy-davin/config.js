/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: {} },
  plugins: [],
}







// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'   // ឬ plugin ផ្សេងទៀត បើប្រើ Vue/Svelte

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     proxy: {
//       '/api': {                                 // រាល់សំណើចាប់ផ្តើមដោយ /api
//         target: 'https://khdemy.anajak-khmer.site',
//         changeOrigin: true,
//         secure: false,                          // បើ cert មានបញ្ហា (self-signed)
//         rewrite: (path) => path.replace(/^\/api/, '')
//       }
//     }
//   }
// })