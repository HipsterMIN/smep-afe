// ============================================
// 탭 관리 Zustand Store
// - 전역 탭 상태 관리
// - 탭 추가, 삭제, 활성화, 전체 닫기 기능 제공
// - 최대 탭 개수 제한 (10개)
// ============================================
import { create } from 'zustand';

const useTabStore = create((set) => ({
    // ==========================================
    // 상태 정의
    // ==========================================

    // 열린 탭 목록
    // 구조: [{ path: 'common-code', name: '공통코드 관리' }, ...]
    openTabs: [],

    // 현재 활성화된 탭의 path
    // 예: 'common-code', 'auth-mgmt' 등
    activeTabPath: null,

    // 최대 탭 개수 제한
    MAX_TABS: 10,

    // ==========================================
    // 탭 추가 함수
    // ==========================================
    /**
     * 새로운 탭을 추가하거나 기존 탭을 활성화
     * @param {Object} tab - { path: string, name: string }
     * @param {string} tab.path - 탭 식별자 (URL 경로)
     * @param {string} tab.name - 탭에 표시될 이름
     */
    addTab: (tab) => set((state) => {
        // 이미 존재하는 탭인지 확인
        const isExist = state.openTabs.find((t) => t.path === tab.path);

        if (isExist) {
            // 이미 존재하면 해당 탭을 활성화만
            // openTabs는 변경하지 않고 activeTabPath만 변경
            return { activeTabPath: tab.path };
        }

        // 탭 개수가 MAX_TABS 이상이면 추가 불가
        if (state.openTabs.length >= state.MAX_TABS) {
            alert(`최대 ${state.MAX_TABS}개의 탭만 열 수 있습니다. 기존 탭을 닫아주세요.`);
            return state;  // 상태 변경 없이 현재 상태 반환
        }

        // 새 탭 추가 및 활성화
        return {
            openTabs: [...state.openTabs, tab],  // 배열 끝에 새 탭 추가
            activeTabPath: tab.path              // 새로 추가한 탭을 활성화
        };
    }),

    // ==========================================
    // 탭 닫기 함수
    // ==========================================
    /**
     * 특정 탭을 닫기
     * @param {string} path - 닫을 탭의 path
     *
     * 주의: activeTab 변경은 Contentbox 컴포넌트에서 처리
     * 이 함수는 탭 목록에서만 제거하고, 다음 탭 선택은 UI 레이어에서 처리
     */
    removeTab: (path) => set((state) => ({
        // 해당 path를 제외한 나머지 탭들만 남김
        openTabs: state.openTabs.filter((t) => t.path !== path),

        // 모든 탭이 닫히면 activeTabPath를 null로 설정
        // 그렇지 않으면 현재 activeTabPath 유지
        activeTabPath: state.openTabs.filter((t) => t.path !== path).length === 0
            ? null
            : state.activeTabPath
    })),

    // ==========================================
    // 활성 탭 변경 함수
    // ==========================================
    /**
     * 현재 활성화된 탭을 변경
     * @param {string} path - 활성화할 탭의 path
     */
    setActiveTab: (path) => set({ activeTabPath: path }),

    // ==========================================
    // 전체 탭 닫기 함수
    // ==========================================
    /**
     * 모든 탭을 닫고 상태 초기화
     * 주로 "전체 닫기" 버튼에서 사용
     */
    clearTabs: () => set({
        openTabs: [],           // 모든 탭 제거
        activeTabPath: null     // 활성 탭 없음
    }),
}));

export default useTabStore;
