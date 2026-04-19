import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss(),
    
  ],
  // server: {
  //   port: 5173,
  //   proxy: {
  //     "/api": {
  //       target: "https://khdemy.anajak-khmer.site",
  //       changeOrigin: true,
  //       secure: false,
  //       rewrite: (path) => path.replace(/^\/api/, ""),
  //     },
  //   },
  // },
  
})



// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// export default defineConfig({
//   plugins: [react()],

//   server: {
//     proxy: {
//       // ✅ រាល់ request ទៅ /api នឹង forward ទៅ backend ដោយស្វ័យប្រវត្តិ
//       "/api": {
//         target: "https://khdemy.anajak-khmer.site",
//         changeOrigin: true,   // ✅ ដោះស្រាយ CORS
//         secure: true,
//         rewrite: (path) => path.replace(/^\/api/, ""),
//       },
//     },
//   },
// });






