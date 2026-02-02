import { fileURLToPath, URL } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  // 운영 배포는 /admin/ 하위 경로, 로컬 개발은 루트('/') 경로에서 서비스
  // 요구사항: 개발(admin-dev), 운영(admin) 컨텍스트 분리
  base: mode === 'production' ? '/admin/' : '/admin-dev/',
  plugins: [react()],
  server: {
    proxy: {
      // 백엔드 context path(/main-dev) 제거 대응: /admin-dev/api 및 주요 경로 프록시
      '/admin-dev/api/': {
        target: 'http://localhost:8082',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/admin-dev/, ''),
      },
      '/admin-dev/example': {
        target: 'http://localhost:8082',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/admin-dev/, ''),
      },
      '/admin-dev/actuator/': {
        target: 'http://localhost:8082',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/admin-dev/, ''),
      },
    },
  },
  resolve: {
    alias: {
      '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
    },
  },
}));
