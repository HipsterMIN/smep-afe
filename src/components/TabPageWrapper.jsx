// TabPageWrapper.jsx
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useLocation, useMatches, useOutlet } from 'react-router-dom';
import { shallow } from 'zustand/shallow';

import ContentBox from '@/components/ui/Contentbox';
import useTabStore from '@/store/useTabStore';

const normalizePath = (path = '') => {
  if (!path) return '';
  const withLeadingSlash = path.startsWith('/') ? path : `/${path}`;
  return withLeadingSlash.length > 1 && withLeadingSlash.endsWith('/')
    ? withLeadingSlash.slice(0, -1)
    : withLeadingSlash;
};

/**
 * Tab Page Wrapper
 * - 메뉴 트리 기반 동적 라우트에서 탭 관리
 * - handle 메타데이터를 읽어서 탭 추가
 */
export default function TabPageWrapper() {
  const { addTab, openTabs, setActiveTab } = useTabStore(
    (state) => ({
      addTab: state.addTab,
      openTabs: state.openTabs,
      setActiveTab: state.setActiveTab,
    }),
    shallow
  );
  const matches = useMatches();
  const location = useLocation();
  const outlet = useOutlet();
  const panelCacheRef = useRef(new Map());

  const basePath = useMemo(
    () => normalizePath(import.meta.env.BASE_URL || '/'),
    []
  );

  // location과 tab path를 같은 기준으로 비교하기 위해 basename을 제거한 canonical path를 사용합니다.
  const toCanonicalPath = useCallback((path = '') => {
    const normalized = normalizePath(path);
    if (!normalized) return '';
    if (basePath && basePath !== '/' && normalized.startsWith(basePath)) {
      const stripped = normalized.slice(basePath.length) || '/';
      return normalizePath(stripped);
    }
    return normalized;
  }, [basePath]);

  const currentPath = toCanonicalPath(location.pathname);

  // ✅ handle이 있는 실제 화면(T 타입) match 찾기
  const matchWithHandle = [...matches]
    .reverse()
    .find((m) => m.handle?.menuId && m.handle?.scrnTypeCd === 'T');

  const handle = matchWithHandle?.handle;
  const menuId = handle?.menuId;
  const menuNm = handle?.menuNm;
  const pathname = toCanonicalPath(matchWithHandle?.pathname);

  // 현재 라우트 화면을 최초 1회 lazy mount하고 이후에는 캐시된 인스턴스를 유지합니다.
  useEffect(() => {
    if (!currentPath || !outlet) return;

    panelCacheRef.current.set(currentPath, outlet);
  }, [currentPath, outlet]);

  // 탭 목록에서 제거된 경로의 패널은 cache에서도 제거합니다.
  useEffect(() => {
    const openPathSet = new Set([
      ...openTabs.map((tab) => toCanonicalPath(tab.path)),
      currentPath,
    ]);

    for (const cachedPath of panelCacheRef.current.keys()) {
      if (!openPathSet.has(cachedPath)) {
        panelCacheRef.current.delete(cachedPath);
      }
    }
  }, [openTabs, currentPath, toCanonicalPath]);

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

  const panels = (() => {
    const result = [];
    const added = new Set();

    openTabs.forEach((tab) => {
      const tabPath = toCanonicalPath(tab.path);
      if (!tabPath || added.has(tabPath)) return;

      const cachedPanel = panelCacheRef.current.get(tabPath);
      if (cachedPanel !== undefined) {
        result.push([tabPath, cachedPanel]);
        added.add(tabPath);
      }
    });

    // 탭 등록 전 타이밍에도 현재 화면은 즉시 보이도록 보장합니다.
    if (currentPath && !added.has(currentPath)) {
      const currentPanel = panelCacheRef.current.get(currentPath) ?? outlet;
      if (currentPanel !== undefined) {
        result.push([currentPath, currentPanel]);
      }
    }

    return result;
  })();

  return (
    <ContentBox>
      {panels.map(([path, panel]) => (
        <div
          key={path}
          style={{ display: path === currentPath ? 'block' : 'none' }}
        >
          {panel}
        </div>
      ))}
    </ContentBox>
  );
}
