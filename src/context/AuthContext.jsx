import React, { createContext, useCallback, useContext, useEffect, useState, useRef } from 'react';
import http from '../lib/http';

/**
 * AuthContext
 *
 * 사용자 인증 상태 및 토큰 관리용 context입니다.
 * JWT 기반으로 수정되어 Pod 오토 스케일링 환경에서도 로그인 상태가 유지됩니다.
 * 
 * [추가 기능]
 * - 세션 타이머 관리 (30분)
 * - 리프레시 토큰을 이용한 시간 연장 기능
 * - 유휴 시간(Idle Time) 감지 모드 지원
 *   - 활동 중: 타이머 일시 정지
 *   - 활동 중단(10초): 타이머 재개
 */

const AuthContext = createContext();

// ==========================================
// 설정 상수
// ==========================================
// 세션 만료 시간 (30분 = 1800초)
const SESSION_TIMEOUT_SECONDS = 1800;

// 활동 중단 판단 시간 (10초)
const IDLE_THRESHOLD_MS = 10000;

// 타이머 모드 설정 ('ABSOLUTE' | 'IDLE')
const TIMER_MODE = 'IDLE'; 

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('access_token'));
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refresh_token'));
  const [loading, setLoading] = useState(true);
  
  // 세션 남은 시간 (초 단위)
  const [remainingTime, setRemainingTime] = useState(SESSION_TIMEOUT_SECONDS);
  
  // 타이머 일시 정지 여부
  const [isPaused, setIsPaused] = useState(false);
  
  // 활동 중단 감지용 Timeout ID 저장용 Ref
  const idleTimeoutRef = useRef(null);

  /**
   * 로그아웃 (내부용)
   */
  const handleLogout = useCallback(async () => {
    try {
      // 로그아웃 API 호출 (선택 사항)
      // await http.post('/api/v1/account/logout');
    } catch (e) {
      console.error('Logout API failed', e);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setToken(null);
      setRefreshToken(null);
      setUser(null);
      // 타이머 정지는 useEffect에서 token 변경 감지로 처리됨
      removeActivityListeners(); // 이벤트 리스너 제거
      alert('세션이 만료되어 로그아웃되었습니다.'); // 만료 알림
      const base = import.meta.env.BASE_URL || '/';
      const normalizedBase = base.endsWith('/') ? base : `${base}/`;
      window.location.replace(`${normalizedBase}login`);
    }
  }, []); 

  /**
   * 시간 연장 (토큰 재발급)
   */
  const extendSession = useCallback(async (silent = false) => {
    try {
      const currentRefreshToken = refreshToken || localStorage.getItem('refresh_token');
      
      if (!currentRefreshToken) {
        throw new Error('리프레시 토큰이 없습니다.');
      }

      const res = await http.post('/api/v1/account/token/reissue', {
        refreshToken: currentRefreshToken
      });

      const newAccessToken = res.accessToken || res.data?.accessToken;
      const newRefreshToken = res.refreshToken || res.data?.refreshToken;

      if (newAccessToken) {
        localStorage.setItem('access_token', newAccessToken);
        setToken(newAccessToken);
        
        if (newRefreshToken) {
          localStorage.setItem('refresh_token', newRefreshToken);
          setRefreshToken(newRefreshToken);
        }

        // 타이머 재시작 (30분으로 초기화)
        setRemainingTime(SESSION_TIMEOUT_SECONDS);
        setIsPaused(false); // 일시 정지 해제
        
        if (!silent) {
          alert('로그인 시간이 연장되었습니다.');
        }
        return true;
      } else {
        throw new Error('토큰 갱신 응답이 올바르지 않습니다.');
      }
    } catch (error) {
      console.error('Session extension failed:', error);
      if (!silent) {
        alert('세션 연장에 실패했습니다. 다시 로그인해주세요.');
        handleLogout();
      }
      return false;
    }
  }, [refreshToken, handleLogout]);

  /**
   * 사용자 활동 감지 핸들러
   * - 활동 감지 시: 타이머 일시 정지 (isPaused = true)
   * - 10초간 활동 없으면: 타이머 재개 (isPaused = false)
   */
  const handleUserActivity = useCallback(() => {
    // 1. 활동 감지 즉시 타이머 일시 정지
    setIsPaused(true);

    // 2. 기존의 "활동 중단 감지 타이머"가 있다면 취소 (Debounce)
    if (idleTimeoutRef.current) {
      clearTimeout(idleTimeoutRef.current);
    }

    // 3. 새로운 "활동 중단 감지 타이머" 설정 (10초 후 실행)
    idleTimeoutRef.current = setTimeout(() => {
      // 10초 동안 추가 활동이 없으면 타이머 재개
      setIsPaused(false);
    }, IDLE_THRESHOLD_MS);
  }, []);

  /**
   * 이벤트 리스너 등록
   */
  const addActivityListeners = useCallback(() => {
    if (TIMER_MODE !== 'IDLE') return;

    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);
    window.addEventListener('click', handleUserActivity);
    window.addEventListener('scroll', handleUserActivity);
    window.addEventListener('touchstart', handleUserActivity);
  }, [handleUserActivity]);

  /**
   * 이벤트 리스너 제거
   */
  const removeActivityListeners = useCallback(() => {
    if (TIMER_MODE !== 'IDLE') return;

    window.removeEventListener('mousemove', handleUserActivity);
    window.removeEventListener('keydown', handleUserActivity);
    window.removeEventListener('click', handleUserActivity);
    window.removeEventListener('scroll', handleUserActivity);
    window.removeEventListener('touchstart', handleUserActivity);
    
    // 타임아웃 정리
    if (idleTimeoutRef.current) {
      clearTimeout(idleTimeoutRef.current);
    }
  }, [handleUserActivity]);

  // ==========================================
  // 타이머 로직 (useEffect로 재구성)
  // ==========================================
  useEffect(() => {
    // 토큰이 없으면 타이머 동작 안 함
    if (!token) return;

    // 1초마다 실행되는 타이머
    const intervalId = setInterval(() => {
      // 일시 정지 상태이면 시간 감소 안 함
      if (isPaused) return;

      setRemainingTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(intervalId);
          handleLogout();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    // cleanup
    return () => clearInterval(intervalId);
  }, [token, isPaused, handleLogout]); // isPaused가 변경될 때마다 타이머 재설정 (올바른 동작)

  // 초기 로드 및 리스너 등록
  useEffect(() => {
    const savedToken = localStorage.getItem('access_token');
    const savedRefreshToken = localStorage.getItem('refresh_token');
    
    if (savedToken) {
      setToken(savedToken);
      if (savedRefreshToken) {
        setRefreshToken(savedRefreshToken);
      }
      if (TIMER_MODE === 'IDLE') {
        addActivityListeners();
      }
    }
    setLoading(false);
    
    return () => {
      removeActivityListeners();
    };
  }, [addActivityListeners, removeActivityListeners]);


  /**
   * 로그인
   */
  const login = useCallback(async (username, password) => {
    try {
      const res = await http.post('/api/v1/account/login', { username, password });
      
      const accessToken = res.accessToken || res.data?.accessToken;
      const newRefreshToken = res.refreshToken || res.data?.refreshToken;
      const userData = res.data?.user || res.user || { username };

      if (accessToken) {
        localStorage.setItem('access_token', accessToken);
        setToken(accessToken);
        
        if (newRefreshToken) {
          localStorage.setItem('refresh_token', newRefreshToken);
          setRefreshToken(newRefreshToken);
        }
        
        setUser(userData);
        // 타이머 초기화
        setRemainingTime(SESSION_TIMEOUT_SECONDS);
        setIsPaused(false);
        if (TIMER_MODE === 'IDLE') {
          addActivityListeners();
        }
        
        return { success: true };
      } else {
        return { success: false, error: '토큰을 받지 못했습니다.' };
      }
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error: error.response?.data?.message || error.message };
    }
  }, [addActivityListeners]);

  /**
   * 임시 로그인 (아이디만)
   */
  const temporaryLogin = useCallback(async (username) => {
    try {
      const res = await http.post('/api/v1/account/temporary-login', { username });
      const accessToken = res.accessToken || res.data?.accessToken;
      const newRefreshToken = res.refreshToken || res.data?.refreshToken;
      
      if (accessToken) {
        localStorage.setItem('access_token', accessToken);
        setToken(accessToken);
        
        if (newRefreshToken) {
          localStorage.setItem('refresh_token', newRefreshToken);
          setRefreshToken(newRefreshToken);
        }
        
        setUser({ username });
        // 타이머 초기화
        setRemainingTime(SESSION_TIMEOUT_SECONDS);
        setIsPaused(false);
        if (TIMER_MODE === 'IDLE') {
          addActivityListeners();
        }
        
        return { success: true };
      } else {
        return { success: false, error: '토큰을 받지 못했습니다.' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, [addActivityListeners]);

  /**
   * 로그아웃 (외부 호출용)
   */
  const logout = useCallback(async () => {
    await http.post('/api/v1/account/logout').catch(() => {});
    handleLogout();
  }, [handleLogout]);

  /**
   * 현재 토큰 반환
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
    
    // 세션 관련 추가 값
    remainingTime, // 남은 시간 (초)
    extendSession, // 시간 연장 함수
    timerMode: TIMER_MODE, // 현재 타이머 모드
    isPaused, // 타이머 일시 정지 여부 (UI 표시용)
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * useAuth Hook
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export default AuthContext;
