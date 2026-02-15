import axios from 'axios'

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
  (error) => Promise.reject(error)
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
      // 필요시 로그인 페이지로 이동 로직 추가 가능
    }
    return Promise.reject(error)
  }
)

export default http
