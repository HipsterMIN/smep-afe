import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  // 운영 배포는 /admin/ 하위 경로, 로컬 개발은 루트('/') 경로에서 서비스
  // 요구사항: 개발(admin-dev), 운영(admin) 컨텍스트 분리
  base: mode === 'production' ? '/admin/' : '/admin-dev/',
  plugins: [react()],
  server: {
    proxy: {
      // 로컬 개발 시 API는 '/admin-dev/main-dev' 또는 '/main-dev'로 호출하면 8082로 프록시됩니다.
      // 새 컨텍스트 경로(admin-dev) 대응
      '/admin-dev/main-dev': {
        target: 'http://localhost:8082',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/admin-dev/, ''), // '/admin-dev/main-dev' -> '/main-dev'
        // 백엔드가 Set-Cookie에 Path=/main-dev 를 지정하는 경우, 브라우저 요청 경로(/admin-dev/...)와
        // 쿠키 Path가 불일치하여 쿠키가 재전송되지 않는 문제가 생길 수 있습니다.
        // proxy 응답 헤더에서 Set-Cookie Path를 '/'로 재작성하여 dev 환경 호환성을 보장합니다.
        configure: (proxy) => {
          proxy.on('proxyRes', (proxyRes) => {
            const setCookie = proxyRes.headers['set-cookie']
            if (Array.isArray(setCookie)) {
              proxyRes.headers['set-cookie'] = setCookie.map((c) =>
                c.replace(/;\s*Path=\/main-dev\/?/i, '; Path=/')
              )
            } else if (typeof setCookie === 'string') {
              proxyRes.headers['set-cookie'] = setCookie.replace(/;\s*Path=\/main-dev\/?/i, '; Path=/')
            }
          })
        }
      },
      '/main-dev': {
        target: 'http://localhost:8082', // 실제 로컬 백엔드 주소
        changeOrigin: true,
        secure: false
        // rewrite 불필요: '/main-dev' 경로를 그대로 백엔드로 전달
      },
    }
  }
}))
