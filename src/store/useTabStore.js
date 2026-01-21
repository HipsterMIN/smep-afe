// useTabStore.js
import { create } from 'zustand';

const useTabStore = create((set) => ({
    openTabs: [], // { path: string, name: string } 객체 배열
    activeTabPath: null,
    MAX_TABS: 10,

    // 탭 추가
    addTab: (tab) => set((state) => {
        const isExist = state.openTabs.find((t) => t.path === tab.path);
        if (isExist) return { activeTabPath: tab.path };

        // 탭 개수 MAX_TABS개 제한
        if (state.openTabs.length >= state.MAX_TABS) {
            alert(`최대 ${state.MAX_TABS}개의 탭만 열 수 있습니다. 기존 탭을 닫아주세요.`);
            return state;
        }

        return {
            openTabs: [...state.openTabs, tab],
            activeTabPath: tab.path
        };
    }),

    // 탭 닫기 (activeTab 변경은 외부에서 처리)
    removeTab: (path) => set((state) => ({
        openTabs: state.openTabs.filter((t) => t.path !== path),
        // activeTabPath는 외부에서 setActiveTab으로 관리
        activeTabPath: state.openTabs.filter((t) => t.path !== path).length === 0
            ? null
            : state.activeTabPath
    })),

    // 활성 탭 변경
    setActiveTab: (path) => set({ activeTabPath: path }),

    // 전체 탭 닫기 (리소스 해제)
    clearTabs: () => set({ openTabs: [], activeTabPath: null }),
}));

export default useTabStore;
