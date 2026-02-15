import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import http from '../lib/http';

/**
 * AuthContext
 *
 * 사용자 인증 상태 및 토큰 관리용 context입니다.
 * JWT 기반으로 수정되어 Pod 오토 스케일링 환경에서도 로그인 상태가 유지됩니다.
 */

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('access_token'));
  const [loading, setLoading] = useState(true);

  // 초기 로드 시 토큰 확인 및 사용자 정보 가져오기 (필요시)
  useEffect(() => {
    const savedToken = localStorage.getItem('access_token');
    if (savedToken) {
      setToken(savedToken);
      // 토큰이 있으면 사용자 정보를 가져오는 API를 호출할 수도 있음
      // 예: http.get('/api/v1/account/me').then(res => setUser(res.data))
    }
    setLoading(false);
  }, []);

  /**
   * 로그인
   */
  const login = useCallback(async (username, password) => {
    try {
      const res = await http.post('/api/v1/account/login', { username, password });
      
      // API 응답 구조에 따라 수정 필요 (예: res.accessToken)
      const accessToken = res.accessToken || res.data?.accessToken || res.data?.access_token || res.data?.token || res.token;
      const userData = res.data?.user || res.user;

      if (accessToken) {
        localStorage.setItem('access_token', accessToken);
        setToken(accessToken);
        setUser(userData || { username });
        return { success: true };
      } else {
        return { success: false, error: '토큰을 받지 못했습니다.' };
      }
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error: error.response?.data?.message || error.message };
    }
  }, []);

  /**
   * 임시 로그인 (아이디만)
   */
  const temporaryLogin = useCallback(async (username) => {
    try {
      const res = await http.post('/api/v1/account/temporary-login', { username });
      const accessToken = res.accessToken || res.data?.accessToken || res.data?.access_token || res.data?.token || res.token;
      
      if (accessToken) {
        localStorage.setItem('access_token', accessToken);
        setToken(accessToken);
        setUser({ username });
        return { success: true };
      } else {
        return { success: false, error: '토큰을 받지 못했습니다.' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, []);

  /**
   * 로그아웃
   */
  const logout = useCallback(async () => {
    try {
      await http.post('/api/v1/account/logout');
    } catch (e) {
      console.error('Logout API failed', e);
    } finally {
      localStorage.removeItem('access_token');
      setToken(null);
      setUser(null);
    }
  }, []);

  /**
   * 현재 토큰 반환
   * FileUpload 및 axios interceptor에서 사용
   */
  const getToken = useCallback(() => {
    return token;
  }, [token]);

  /**
   * Authorization 헤더 생성 유틸
   */
  const getAuthHeaders = useCallback(() => {
    if (!token) return {};
    return { Authorization: `Bearer ${token}` };
  }, [token]);

  const value = {
    user,
    token,
    loading,
    login,
    temporaryLogin,
    logout,
    getToken,
    getAuthHeaders,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * useAuth Hook
 *
 * 컴포넌트에서 인증 상태와 함수에 접근하세요:
 * const { user, token, getAuthHeaders, login, logout, isAuthenticated } = useAuth();
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export default AuthContext;
