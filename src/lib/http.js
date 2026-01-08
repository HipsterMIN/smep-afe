import axios from 'axios'

// 공통 Axios 인스턴스: 세션 쿠키(JSESSIONID)를 포함하여 요청
const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // 예: /admin-dev/main-dev
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

export default http
