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

    // 탭 닫기
    removeTab: (path) => set((state) => {
        const newTabs = state.openTabs.filter((t) => t.path !== path);
        let newActivePath = state.activeTabPath;

        // 닫으려는 탭이 현재 활성화된 탭이라면 다른 탭으로 포커스 이동
        if (state.activeTabPath === path) {
            newActivePath = newTabs.length > 0 ? newTabs[newTabs.length - 1].path : null;
        }

        return {
            openTabs: newTabs,
            activeTabPath: newActivePath
        };
    }),

    // 활성 탭 변경
    setActiveTab: (path) => set({ activeTabPath: path }),

    // 전체 탭 닫기 (리소스 해제)
    clearTabs: () => set({ openTabs: [], activeTabPath: null }),
}));

export default useTabStore;