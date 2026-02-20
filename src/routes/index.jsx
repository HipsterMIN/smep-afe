import { generateDynamicRoutes } from '@routes/dynamicRoutes.jsx';
import { staticRoutes } from '@routes/staticRoutes.jsx';
import { useMenuStore } from '@store/useMenuStore';
import { useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

/**
 * Router 생성 함수
 */
const createAppRouter = (menuTree, flatMenuMap) => {
  // 동적 라우트 생성
  const dynamicRoutes = generateDynamicRoutes(menuTree, flatMenuMap);

  // 모든 라우트 병합
  const allRoutes = [
    ...dynamicRoutes, // 동적 라우트
    ...staticRoutes, // 정적 라우트
  ];

  // 개발용 라우트 정보 출력
  console.log('정적 라우트:', staticRoutes);
  console.log('동적 라우트:', dynamicRoutes);
  // console.log(
  //   '🚀 Generated dynmic routes:',
  //   JSON.stringify(dynamicRoutes, null, 2)
  // );
  // console.log(
  //   '🚀 Generated static routes:',
  //   JSON.stringify(staticRoutes, null, 2)
  // );
  console.log(
    `총 ${allRoutes.length}개 라우트 생성 (동적: ${dynamicRoutes.length}, 정적: ${staticRoutes.length})`
  );

  // BASE_URL 설정
  const base = import.meta.env.BASE_URL || '/'; // 기본값 '/'
  // ✅ React Router의 basename은 트레일링 슬래시가 없어야 함 (단, '/' 자체인 경우는 제외)
  // 트레일링 슬래시가 있으면 /main-dev (슬래시 없음)와 매칭되지 않는 문제가 발생함
  const basename =
    base.endsWith('/') && base !== '/' ? base.slice(0, -1) : base;

  // 브라우저 라우터 생성
  return createBrowserRouter(allRoutes, { basename });
};

/**
 * AppRouter - 메뉴 로드 및 router 생성을 담당하는 컴포넌트
 */
function AppRouter() {
  const { menuTree, flatMenuMap, fetchMenuData, isLoading, error } = useMenuStore();
  const [routerInstance, setRouterInstance] = useState(null);
  const [initError, setInitError] = useState(null);

  /**
   * menuTree, fetchMenuData 의존성으로 메뉴 데이터 fetch
   */
  useEffect(() => {
    // 메뉴 트리가 없을 때만 데이터 fetch
    if (!menuTree && !isLoading) {
      fetchMenuData();
    }
  }, [menuTree, fetchMenuData, isLoading]);

  /**
   * menuTree, flatMenuMap 의존성으로 라우터 생성
   */
  useEffect(() => {
    // 메뉴 트리와 flatMenuMap이 준비되면 라우터 생성
    if (menuTree && flatMenuMap) {
      try {
        console.log('라우터 생성 시작...');
        const router = createAppRouter(menuTree, flatMenuMap);
        setRouterInstance(router);
        setInitError(null);
      } catch (e) {
        console.error('라우터 생성 중 오류 발생:', e);
        setInitError(e.message || '라우터 생성 오류');
      }
    }
  }, [menuTree, flatMenuMap]);

  // 에러 발생 시 에러 화면 표시
  if (initError || error) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          gap: '16px',
        }}
      >
        <h3 style={{ color: 'red' }}>초기화 오류</h3>
        <p>{initError || error}</p>
        <button onClick={() => window.location.reload()}>다시 시도</button>
      </div>
    );
  }

  // 로딩 중이거나 라우터 인스턴스가 없으면 로딩 화면 표시
  if (isLoading || !routerInstance) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <div>
          <div style={{ marginBottom: '10px', textAlign: 'center' }}>
            라우터 초기화 중...
          </div>
          {/* 장시간 로딩 시 표시될 안내 메시지 (디버깅용) */}
          <div style={{ fontSize: '12px', color: '#999' }}>
            {!menuTree ? '메뉴 데이터를 불러오는 중입니다.' : '라우터 경로를 구성하고 있습니다.'}
          </div>
        </div>
      </div>
    );
  }

  return <RouterProvider router={routerInstance} />;
}

export default AppRouter;
