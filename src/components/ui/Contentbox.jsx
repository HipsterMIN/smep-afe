// ============================================
// 컨텐츠 박스 컴포넌트
// - 탭 UI 렌더링
// - 탭 클릭, 닫기, 전체 닫기 이벤트 처리
// - 선택된 탭 닫기 시 다음 탭으로 자동 이동
// ============================================
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import useTabStore from '../../store/useTabStore';
import Button from './Button';
import Contents from './Contents';

// eslint-disable-next-line react/prop-types
export default function Contentbox({ children }) {
  // React Router의 navigate 함수 (페이지 이동용)
  const navigate = useNavigate();
  const location = useLocation();
  const lastVisitedPathByTabRef = useRef(new Map());

  // Zustand store에서 탭 관련 상태와 함수들 가져오기
  const {
    openTabs, // 열린 탭 목록 배열
    activeTabPath, // 현재 활성화된 탭의 path
    removeTab, // 탭 제거 함수
    setActiveTab, // 활성 탭 변경 함수
    clearTabs, // 전체 탭 닫기 함수
  } = useTabStore();

  // ==========================================
  // 홈으로 이동하는 헬퍼 함수
  // - base URL의 마지막 슬래시를 보장
  // ==========================================
  const navigateToHome = () => {
    // window.location을 사용하여 완전한 URL로 이동
    // 예: http://localhost:5173/home-admin-dev/ 로 이동
    const baseUrl = import.meta.env.BASE_URL || '/';
    // 마지막 슬래시가 없으면 추가
    const homeUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;

    // 현재 origin과 결합하여 완전한 URL 생성
    window.location.href = window.location.origin + homeUrl;
  };

  // ==========================================
  // 전체 닫기 버튼 클릭 핸들러
  // ==========================================
  /**
   * 모든 탭을 닫고 홈으로 이동
   * - 사용자에게 확인 메시지 표시
   * - 확인 시 clearTabs() 호출하여 모든 탭 제거
   * - 홈(/)으로 이동하여 EmptyState 표시
   * - URL은 명확히 마지막 슬래시 포함하여 표시
   */
  const handleClearAll = () => {
    if (window.confirm('모든 탭을 닫으시겠습니까?')) {
      clearTabs();
      navigateToHome();
    }
  };

  // ==========================================
  // 탭 클릭 핸들러
  // ==========================================
  // basename(/home-admin-dev) 차이를 제거해 경로 비교를 안정적으로 처리합니다.
  const normalizePath = useCallback((path = '') => {
    if (!path) return '';
    const withLeadingSlash = path.startsWith('/') ? path : `/${path}`;
    return withLeadingSlash.length > 1 && withLeadingSlash.endsWith('/')
      ? withLeadingSlash.slice(0, -1)
      : withLeadingSlash;
  }, []);

  const basePath = useMemo(
    () => normalizePath(import.meta.env.BASE_URL || '/'),
    [normalizePath]
  );

  const toCanonicalPath = useCallback((path = '') => {
    const normalized = normalizePath(path);
    if (!normalized) return '';
    if (basePath && basePath !== '/' && normalized.startsWith(basePath)) {
      const stripped = normalized.slice(basePath.length) || '/';
      return normalizePath(stripped);
    }
    return normalized;
  }, [basePath, normalizePath]);

  // 현재 URL이 해당 탭의 하위 경로를 포함하면 같은 탭 범위로 간주합니다.
  const isCurrentWithinTab = (tabPath) => {
    const currentPath = toCanonicalPath(location.pathname);
    const canonicalTabPath = toCanonicalPath(tabPath);

    if (!currentPath || !canonicalTabPath) return false;
    return (
      currentPath === canonicalTabPath ||
      currentPath.startsWith(`${canonicalTabPath}/`)
    );
  };

  // 현재 경로가 어느 탭 범위(기본/하위경로)에 속하는지 찾습니다.
  // prefix가 가장 긴 탭을 우선하여 정확도를 높입니다.
  const findMatchedTabPath = useCallback((pathname) => {
    const currentPath = toCanonicalPath(pathname);
    if (!currentPath) return null;

    let matchedPath = null;
    let matchedLength = -1;

    openTabs.forEach((tab) => {
      const tabPath = toCanonicalPath(tab.path);
      if (!tabPath) return;

      const isMatch =
        currentPath === tabPath || currentPath.startsWith(`${tabPath}/`);

      if (isMatch && tabPath.length > matchedLength) {
        matchedPath = tabPath;
        matchedLength = tabPath.length;
      }
    });

    return matchedPath;
  }, [openTabs, toCanonicalPath]);

  const resolveTabNavigatePath = useCallback((tabPath) => {
    const canonicalTabPath = toCanonicalPath(tabPath);
    const rememberedPath =
      lastVisitedPathByTabRef.current.get(canonicalTabPath);
    return rememberedPath || tabPath;
  }, [toCanonicalPath]);

  // 탭별 마지막 방문 경로를 기억합니다.
  useEffect(() => {
    const matchedTabPath = findMatchedTabPath(location.pathname);
    const currentPath = toCanonicalPath(location.pathname);

    if (matchedTabPath && currentPath) {
      lastVisitedPathByTabRef.current.set(matchedTabPath, currentPath);
    }

    // 닫힌 탭의 기록은 정리합니다.
    const openTabPathSet = new Set(openTabs.map((tab) => toCanonicalPath(tab.path)));
    for (const tabPath of lastVisitedPathByTabRef.current.keys()) {
      if (!openTabPathSet.has(tabPath)) {
        lastVisitedPathByTabRef.current.delete(tabPath);
      }
    }
  }, [location.pathname, openTabs, findMatchedTabPath, toCanonicalPath]);

  /**
   * 탭을 클릭했을 때 해당 탭으로 전환
   * - 선택한 탭을 활성화
   * - 해당 페이지로 라우팅
   *
   * @param {string} tabPath - 클릭한 탭의 path (예: 'common-code')
   */
  const handleTabClick = (tabPath) => {
    setActiveTab(tabPath); // Zustand store의 활성 탭 변경

    // 같은 탭(상세/수정 포함) 내부라면 URL 이동을 강제하지 않습니다.
    // 예: /intgLgnSite/0050/update 상태에서 같은 탭 클릭 시 현재 경로 유지
    if (isCurrentWithinTab(tabPath)) {
      return;
    }

    navigate(resolveTabNavigatePath(tabPath)); // 마지막 방문 경로 우선 이동
  };

  // ==========================================
  // 탭 닫기 버튼 클릭 핸들러
  // ==========================================
  /**
   * 탭의 X 버튼을 클릭했을 때 처리
   *
   * [케이스 1] 선택되지 않은 탭 닫기
   * - 현재 활성 탭과 화면 유지
   * - 해당 탭만 목록에서 제거
   *
   * [케이스 2] 선택된 탭 닫기
   * - 다음 탭으로 자동 이동 (없으면 이전 탭)
   * - 마지막 탭이면 홈(/)으로 이동
   *
   * @param {Event} e - 클릭 이벤트 (이벤트 버블링 방지 필요)
   * @param {string} tabPath - 닫을 탭의 path
   */
  const handleTabClose = (e, tabPath) => {
    // 이벤트 버블링 방지
    // X 버튼 클릭 시 부모 li의 onClick(탭 전환)이 실행되지 않도록 함
    e.stopPropagation();

    // 닫으려는 탭이 현재 활성 탭인지 확인
    const isActiveTab = activeTabPath === tabPath;

    if (isActiveTab) {
      // ========================================
      // [케이스 2] 현재 활성 탭을 닫는 경우
      // ========================================

      // 현재 탭의 인덱스 찾기
      const currentIndex = openTabs.findIndex((t) => t.path === tabPath);

      // 닫은 후 남을 탭들 계산
      const remainingTabs = openTabs.filter((t) => t.path !== tabPath);

      if (remainingTabs.length > 0) {
        // 남은 탭이 있는 경우: 다음 탭으로 이동
        let nextTab;

        if (currentIndex < openTabs.length - 1) {
          // 닫은 탭 다음에 탭이 있으면 다음 탭으로 이동
          // 예: [탭1, 탭2(닫기), 탭3, 탭4] -> 탭3으로 이동
          nextTab = openTabs[currentIndex + 1];
        } else {
          // 마지막 탭을 닫은 경우 이전 탭으로 이동
          // 예: [탭1, 탭2, 탭3(닫기)] -> 탭2로 이동
          nextTab = remainingTabs[remainingTabs.length - 1];
        }

        // 순서 중요: 탭 제거 -> 활성 탭 변경 -> 페이지 이동
        removeTab(tabPath); // 1. 탭 목록에서 제거
        setActiveTab(nextTab.path); // 2. 다음 탭을 활성화
        navigate(resolveTabNavigatePath(nextTab.path)); // 3. 다음 탭의 페이지로 이동
      } else {
        // ========================================
        // 마지막 남은 탭을 닫는 경우: 홈으로 이동
        // ========================================
        // 모든 탭이 닫히면 EmptyState 표시
        // URL은 명확히 마지막 슬래시 포함하여 표시
        removeTab(tabPath); // 탭 제거
        navigateToHome(); // 홈으로 이동 (마지막 슬래시 보장)
      }
    } else {
      // ========================================
      // [케이스 1] 선택되지 않은 탭을 닫는 경우
      // ========================================
      // 현재 활성 탭과 화면을 그대로 유지하면서 해당 탭만 제거
      removeTab(tabPath);
    }
  };

  return (
    <div className="oncontentbox-wrap">
      {/* ====================================== */}
      {/* 탭 바 영역 */}
      {/* ====================================== */}
      <div className="oncontentTab">
        <ul>
          {/* 열린 탭 목록을 순회하며 렌더링 */}
          {openTabs.map((tab) => (
            <li
              // 현재 활성 탭이면 'active' 클래스 추가
              className={activeTabPath === tab.path ? 'active' : ''}
              key={tab.path}
            >
              {/* 탭 이름 표시 */}
              <a
                href={tab.path}
                onClick={(e) => {
                  e.preventDefault();
                  handleTabClick(tab.path);
                }}
              >
                {tab.name}
              </a>

              {/* 탭 닫기 버튼 (X 아이콘) */}
              <i
                className="close"
                onClick={(e) => handleTabClose(e, tab.path)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleTabClose(e, tab.path);
                  }
                }}
                role="button"
                tabIndex={0}
              />
            </li>
          ))}
        </ul>

        {/* 전체 닫기 버튼 - 탭이 있을 때만 표시 */}
        {openTabs.length > 0 && (
          <Button
            btnType="closeAll"
            btnNames="전체닫기"
            onClick={handleClearAll}
          />
        )}
      </div>

      {/* ====================================== */}
      {/* 실제 컨텐츠 영역 */}
      {/* ====================================== */}
      {/*
        children: DynamicRoute에서 전달된 실제 페이지 컴포넌트
        예: CommonCode, AuthMgmt, MenuMgmt 등
      */}
      <Contents>{children}</Contents>
    </div>
  );
}
