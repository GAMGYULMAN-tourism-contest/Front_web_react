import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   // define: {
//   //   global: {},
//   // },
// });
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // 기본 빌드 디렉토리
  },
});