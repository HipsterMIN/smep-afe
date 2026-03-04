import { fileURLToPath, URL } from 'node:url';

import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  // 운영 배포는 /home-admin/ 하위 경로, 로컬 개발은 루트('/') 경로에서 서비스
  // 요구사항: 개발(home-admin-dev), 운영(home-admin) 컨텍스트 분리
  base: mode === 'production' ? '/home-admin/' : '/home-admin-dev/',
  plugins: [react()],
  server: {
    proxy: {
      // 백엔드 context path(/home-dev) 제거 대응: /home-admin-dev/api 및 주요 경로 프록시
      '/home-admin-dev/api/': {
        target: 'http://localhost:8082',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/home-admin-dev/, ''),
        onProxyRes: (proxyRes) => {
          const setCookie = proxyRes.headers['set-cookie'];
          if (setCookie) {
            proxyRes.headers['set-cookie'] = setCookie.map(cookie =>
              cookie.replace(/Path=\/[^;]*/i, 'Path=/')
            );
          }
        }
      },
      '/home-admin-dev/example': {
        target: 'http://localhost:8082',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/home-admin-dev/, ''),
        onProxyRes: (proxyRes) => {
          const setCookie = proxyRes.headers['set-cookie'];
          if (setCookie) {
            proxyRes.headers['set-cookie'] = setCookie.map(cookie =>
              cookie.replace(/Path=\/[^;]*/i, 'Path=/')
            );
          }
        }
      },
      '/home-admin-dev/actuator/': {
        target: 'http://localhost:8082',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/home-admin-dev/, ''),
        onProxyRes: (proxyRes) => {
          const setCookie = proxyRes.headers['set-cookie'];
          if (setCookie) {
            proxyRes.headers['set-cookie'] = setCookie.map(cookie =>
              cookie.replace(/Path=\/[^;]*/i, 'Path=/')
            );
          }
        }
      },
    },
  },
  resolve: {
    alias: {
      // 루트 src 디렉토리 (가장 범용적인 alias)
      '@': path.resolve(__dirname, './src'),

      // src 하위 주요 디렉토리들
      '@assets': path.resolve(__dirname, './src/assets'),
      '@components': path.resolve(__dirname, './src/components'),
      '@context': path.resolve(__dirname, './src/context'),
      '@layouts': path.resolve(__dirname, './src/layouts'),
      '@lib': path.resolve(__dirname, './src/lib'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@publishing': path.resolve(__dirname, './src/publishing'),
      '@routes': path.resolve(__dirname, './src/routes'),
      '@store': path.resolve(__dirname, './src/store'),

      '@utils': path.resolve(__dirname, './src/utils'),

      // 루트 레벨 styles 폴더
      '@styles': path.resolve(__dirname, './styles'),

      // public 폴더 (정적 리소스)
      '@public': path.resolve(__dirname, './public'),

      // documents 폴더 (문서/스펙이 있다면)
      '@docs': path.resolve(__dirname, './documents'),
    },
  },
}));
