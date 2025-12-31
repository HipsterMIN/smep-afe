import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // .env.localhost의 VITE_API_BASE_URL 설정에 맞춰 경로를 가로챕니다.
      '/main-dev': {
        target: 'http://localhost:8082', // 실제 백엔드 주소
        changeOrigin: true,
        secure: false,
        // 필요하다면 경로 재작성 (백엔드에 /api/v1이 없다면 사용)
        // rewrite: (path) => path.replace(/^\/api\/v1/, '')
      },
    }
  }
})
