import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/admin/',
  plugins: [react()],
  server: {
    proxy: {
      // .env.localhost의 VITE_API_BASE_URL 설정에 맞춰 경로를 가로챕니다.
      '/admin/main-dev': {
        target: 'http://localhost:8082', // 실제 백엔드 주소
        changeOrigin: true,
        secure: false,
        // 브라우저에서는 /admin/main-dev로 쏘지만,
        // 로컬 백엔드 서버가 /main-dev만 기대한다면 아래와 같이 rewrite 합니다.
        rewrite: (path) => path.replace(/^\/admin/, '')
      },
    }
  }
})
