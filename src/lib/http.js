import axios from 'axios'

// 공통 Axios 인스턴스: 세션 쿠키(JSESSIONID)를 포함하여 요청
const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // 예: /admin-dev 또는 /admin
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 응답 인터셉터 추가
http.interceptors.response.use(
  (response) => {
    // 응답 데이터의 data만 반환하여 res.data.data 사용 안 함
    return response.data
  },
  (error) => {
    if (error.response?.status === 401) {
      console.error('[HTTP] 401 Unauthorized: 세션이 만료되었거나 권한이 없습니다.')
    }
    return Promise.reject(error)
  }
)

export default http
