// TabPageWrapper.jsx
import { useEffect } from 'react';
import { useMatches } from 'react-router-dom';

import ContentBox from '@/components/ui/Contentbox';
import useTabStore from '@/store/useTabStore';

/**
 * Tab Page Wrapper
 * - 메뉴 트리 기반 동적 라우트에서 탭 관리
 * - handle 메타데이터를 읽어서 탭 추가
 */
export default function TabPageWrapper({ children }) {
  const { addTab, setActiveTab } = useTabStore();
  const matches = useMatches();

  // ✅ handle이 있는 match 찾기 (뒤에서부터)
  const matchWithHandle = [...matches].reverse().find((m) => m.handle?.menuId);

  const handle = matchWithHandle?.handle;
  const menuId = handle?.menuId;
  const menuNm = handle?.menuNm;
  const pathname = matchWithHandle?.pathname;

  useEffect(() => {
    if (menuId && menuNm && pathname) {
      addTab({
        path: pathname,
        name: menuNm,
        menuId: menuId,
      });
      setActiveTab(pathname);
    }
  }, [menuId, menuNm, pathname, addTab, setActiveTab]);

  return <ContentBox>{children}</ContentBox>;
}
