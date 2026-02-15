import { useState } from 'react'
import { Link } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'
import http from '../lib/http.js'

export default function AuthBar() {
  const [msg, setMsg] = useState('')
  const { logout, user, isAuthenticated } = useAuth()

  const checkAuth = async () => {
    setMsg('')
    try {
      // http.js 인터셉터에 의해 Authorization 헤더가 자동으로 포함됨
      const res = await http.get('/api/v1/example')
      setMsg('인증 성공: ' + (res.message || '정상'))
    } catch (e) {
      setMsg('인증 실패: ' + (e?.response?.status || e.message))
    }
  }

  const handleLogout = async () => {
    setMsg('')
    try {
      await logout()
      setMsg('로그아웃 완료')
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error)
      setMsg('로그아웃 실패')
    }
  }

  return (
    <div style={{ padding: 8, background: '#f7f7f7', borderBottom: '1px solid #eee', display: 'flex', gap: 8, alignItems: 'center' }}>
      <Link to="/">홈</Link>
      {!isAuthenticated ? (
        <Link to="/login">로그인</Link>
      ) : (
        <>
          <span style={{ fontSize: 13, fontWeight: 'bold' }}>{user?.username || user?.name}님</span>
          <button onClick={handleLogout}>로그아웃</button>
        </>
      )}
      <button onClick={checkAuth}>인증 확인(/example)</button>
      <span style={{ marginLeft: 12, color: '#666', fontSize: 13 }}>{msg}</span>
    </div>
  )
}
