import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  // 운영 배포는 /home-admin/ 하위 경로, 개발은 /home-admin-dev/ 경로에서 서비스
  // 요구사항: 개발(home-admin-dev), 운영(home-admin) 컨텍스트 분리
  base: mode === 'production' ? '/home-admin/' : '/home-admin-dev/',
  plugins: [react()],
  server: {
    proxy: {
      // 백엔드 context path 제거 대응: /home-admin-dev/api 및 주요 경로 프록시
      '/home-admin-dev/api/': {
        target: 'http://localhost:8082',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/home-admin-dev/, ''),
      },
      '/home-admin-dev/example': {
        target: 'http://localhost:8082',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/home-admin-dev/, ''),
      },
      '/home-admin-dev/actuator/': {
        target: 'http://localhost:8082',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/home-admin-dev/, ''),
      },
    }
  }
}))
