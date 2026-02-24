import axios from 'axios'

const getLoginRoutePath = () => {
  const base = import.meta.env.BASE_URL || '/'
  const normalizedBase =
    base.endsWith('/') && base !== '/' ? base.slice(0, -1) : base
  const basePath = normalizedBase === '/' ? '' : normalizedBase
  return `${basePath}/login`
}

const isAuthLoginRequest = (url = '') => {
  return (
    url.includes('/api/v1/account/login') ||
    url.includes('/api/v1/account/temporary-login')
  )
}

// 공통 Axios 인스턴스: 세션 쿠키(JSESSIONID)를 포함하여 요청
const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 요청 인터셉터: 토큰 자동 포함
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    // SonarQube: Expected the Promise rejection reason to be an Error.
    return Promise.reject(error instanceof Error ? error : new Error(error))
  }
)

// 응답 인터셉터 추가
http.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    if (error.response?.status === 401) {
      console.error('[HTTP] 401 Unauthorized: 세션이 만료되었거나 권한이 없습니다.')
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')

      if (typeof window !== 'undefined' && !isAuthLoginRequest(error.config?.url)) {
        const loginPath = getLoginRoutePath()
        const isLoginPage = window.location.pathname.endsWith('/login')

        if (!isLoginPage) {
          window.location.replace(loginPath)
        }
      }
    }
    // SonarQube: Expected the Promise rejection reason to be an Error.
    return Promise.reject(error instanceof Error ? error : new Error(error))
  }
)

export default http
