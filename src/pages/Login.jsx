import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import http from '../lib/http.js'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await http.post('/api/v1/account/login', { username, password })
      if (res?.data?.next) {
        navigate('/')
      } else {
        setError('로그인 응답 형식이 예상과 다릅니다.')
      }
    } catch (err) {
      setError('로그인 실패: ' + (err?.response?.data?.error || err.message))
    } finally {
      setLoading(false)
    }
  }

  const onTemporaryLogin = async () => {
    setError('')
    setLoading(true)
    try {
      const res = await http.post('/api/v1/account/temporary-login', { username: username || 'admin' })
      if (res?.data?.next) {
        navigate('/')
      } else {
        setError('임시로그인 응답 형식이 예상과 다릅니다.')
      }
    } catch (err) {
      setError('임시로그인 실패: ' + (err?.response?.data?.error || err.message))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 380, margin: '80px auto', padding: 20, border: '1px solid #eee', borderRadius: 8 }}>
      <h2 style={{ marginBottom: 16 }}>관리자 로그인</h2>
      <form onSubmit={onSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', fontSize: 12, color: '#666' }}>아이디</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="admin"
            style={{ width: '100%', padding: '8px 10px', border: '1px solid #ddd', borderRadius: 4 }}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 12, color: '#666' }}>비밀번호</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••"
            style={{ width: '100%', padding: '8px 10px', border: '1px solid #ddd', borderRadius: 4 }}
          />
        </div>
        <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px 14px' }}>
          {loading ? '로그인 중...' : '로그인'}
        </button>
      </form>
      <button onClick={onTemporaryLogin} disabled={loading} style={{ width: '100%', padding: '10px 14px', marginTop: 8 }}>
        임시로그인(아이디만)
      </button>
      {error && <p style={{ color: 'red', marginTop: 12 }}>{error}</p>}
    </div>
  )
}
