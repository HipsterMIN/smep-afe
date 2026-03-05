import http from '@lib/http.js';
import { mockMenuData } from '@lib/menuData.js';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

/**
 * =============================================================================
 * useMenuStore - 메뉴 트리 데이터 전역 관리
 * =============================================================================
 *
 * 역할:
 * - 백엔드에서 받은 메뉴 트리를 Zustand로 관리
 * - 메뉴 데이터 로딩 상태 및 에러 핸들링
 * - 전체 앱에서 메뉴 데이터 접근 가능
 */
const menuStoreImpl = (set, get) => ({
  // 상태
  menuTree: null, // 메뉴 트리 데이터
  flatMenuMap: {}, // menuId를 key로 하는 flat map (빠른 조회용)
  isLoading: false, // 로딩 상태
  error: null, // 에러
  lastFetchedAuthState: null, // 마지막 메뉴 조회 시점의 인증 상태 ('ANON' | 'AUTH')

  /**
   * 메뉴 트리를 평탄화하여 menuId 맵 생성
   * @param {Object|Array} menuData - 메뉴 데이터
   */
  _buildFlatMap: (menuData) => {
    const flatMap = {};
    const buildFlatMap = (node) => {
      if (!node || typeof node !== 'object') return;
      if (node.menuId) {
        flatMap[node.menuId] = node;
      }
      if (node.children && Array.isArray(node.children)) {
        node.children.forEach(buildFlatMap);
      }
    };

    if (Array.isArray(menuData)) {
      menuData.forEach(buildFlatMap);
    } else {
      buildFlatMap(menuData);
    }
    return flatMap;
  },

  /**
   * 현재 인증 상태 반환
   * - ANON: 비로그인
   * - AUTH: 로그인
   */
  _getAuthState: () => {
    const token = localStorage.getItem('access_token');
    return token ? 'AUTH' : 'ANON';
  },

  /**
   * 메뉴 데이터 API 호출 및 상태 업데이트
   */
  fetchMenuData: async (authStateArg) => {
    // 중복 호출 방지
    if (get().isLoading) return get().menuTree;

    const authState = authStateArg || get()._getAuthState();

    // 로딩 상태 설정
    set({ isLoading: true, error: null });

    try {
      const response = await http.get('/api/v1/menu');
      // interceptor에 의해 response는 이미 response.data임. 
      // 하지만 감싸진 형태({ data: ... })일 수도 있으므로 체크
      const menuData = response?.data || response;

      if (!menuData) {
        throw new Error('응답 데이터가 비어있습니다.');
      }

      // 메뉴 데이터를 평탄화된 맵으로 변환
      const flatMap = get()._buildFlatMap(menuData);

      // 상태 업데이트
      set({
        menuTree: menuData,
        flatMenuMap: flatMap,
        isLoading: false,
        lastFetchedAuthState: authState,
      });

      return menuData;
    } catch (error) {
      const isDev = import.meta.env.MODE === 'development';
      const errorMsg = error.response?.data?.message || error.message;

      if (isDev) {
        console.warn(
          '메뉴 데이터 API 호출 실패, 개발 환경이므로 목데이터를 사용합니다:',
          errorMsg
        );
      } else {
        console.error('메뉴 데이터 로드 실패:', errorMsg);
      }

      try {
        const flatMap = get()._buildFlatMap(mockMenuData);
        set({
          menuTree: mockMenuData,
          flatMenuMap: flatMap,
          isLoading: false,
          error: isDev ? null : errorMsg,
          lastFetchedAuthState: authState,
        });
        return mockMenuData;
      } catch (innerError) {
        console.error('목데이터 빌드 실패:', innerError);
        set({ isLoading: false, error: '데이터 초기화 치명적 오류' });
      }
    }
  },

  // menuId로 메뉴 노드 찾기
  getMenuById: (menuId) => {
    return get().flatMenuMap[menuId] || null;
  },

  // 메뉴 데이터 초기화
  resetMenu: () => {
    set({
      menuTree: null,
      flatMenuMap: {},
      error: null,
      lastFetchedAuthState: null,
    });
  },
});

// devtools 적용 : 브라우저 개발자 도구에서 상태 추적 가능(redux devtools 등)
export const useMenuStore = create(
  devtools(menuStoreImpl, { name: 'MenuStore' })
);
