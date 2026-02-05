import { useState } from 'react'
import { Link } from 'react-router-dom'

import http from '../lib/http.js'

export default function AuthBar() {
  const [msg, setMsg] = useState('')

  const checkAuth = async () => {
    setMsg('')
    try {
      const res = await http.get('/api/v1/example')
      setMsg('인증 성공 (success 여부): ' + (res.success || true))
    } catch (e) {
      setMsg('인증 실패: ' + (e?.response?.status || e.message))
    }
  }

  const logout = async () => {
    setMsg('')
    try {
      await http.post('/api/v1/account/logout')
      setMsg('로그아웃 완료')
    } catch (e) {
      setMsg('로그아웃 실패: ' + (e?.response?.status || e.message))
    }
  }

  return (
    <div style={{ padding: 8, background: '#f7f7f7', borderBottom: '1px solid #eee', display: 'flex', gap: 8 }}>
      <Link to="/">홈</Link>
      <Link to="/login">로그인</Link>
      <button onClick={checkAuth}>인증 확인(/example)</button>
      <button onClick={logout}>로그아웃</button>
      <span style={{ marginLeft: 12, color: '#666' }}>{msg}</span>
    </div>
  )
}
