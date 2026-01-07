import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  // 운영 배포는 /admin/ 하위 경로, 로컬 개발은 루트('/') 경로에서 서비스
  base: mode === 'production' ? '/admin/' : '/',
  plugins: [react()],
  server: {
    proxy: {
      // 로컬 개발 시 API는 '/main-dev'로 호출하면 8082로 프록시됩니다.
      '/main-dev': {
        target: 'http://localhost:8082', // 실제 로컬 백엔드 주소
        changeOrigin: true,
        secure: false
        // rewrite 불필요: '/main-dev' 경로를 그대로 백엔드로 전달
      },
    }
  }
}))
