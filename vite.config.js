import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import svgr from 'vite-plugin-svgr';
// https://vitejs.dev/config/
export default defineConfig({
  // cho phép Vite sử dụng được process.env, không thì phải dùng import.meta.env
  define: {
    'process.env': process.env
  },
  plugins: [react(), svgr()],
  resolve: {
    alias: [{ find: '~', replacement: '/src' }]
  },
  server: {
    historyApiFallback: true // Chuyển hướng các request không tìm thấy về index.html
  }
});
