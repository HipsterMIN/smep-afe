// routes/staticRoutes.jsx
import AuthBar from '@components/AuthBar.jsx';
import { UserMenuProvider } from '@context/UserMenuContext.jsx';
import AdminLayout from '@layouts/AdminLayout.jsx';
import Login from '@pages/Login.jsx';
import LoginView from '@pages/LoginView.jsx';
import MainPage from '@pages/MainPage.jsx';
import PublishingMain from '@publishing/PublishingMain.jsx';
import { autoPublishingRoutes } from '@routes/autoRoutes.jsx';

/**
 * =============================================================================
 * 정적 라우트 정의
 * =============================================================================
 *
 * 특징:
 * - 메뉴 데이터와 무관하게 항상 존재하는 라우트
 * - 로그인, 메인, 퍼블리싱 페이지 등
 * - outlet |  구조를 활용하여 레이아웃 적용
 */

export const staticRoutes = [
  //=============================================================================
  // 업무 페이지 라우트
  //=============================================================================

  /*
    AdminLayout 적용 route
  */
  {
    element: (
      <UserMenuProvider>
        <AuthBar /> {/* 인증 바 */}
        <AdminLayout /> {/* 메인 레이아웃 (사이드바, outlet 포함) */}
      </UserMenuProvider>
    ),
    children: [
      {
        path: '/',
        element: <MainPage />,
      },
    ],
  },

  /*
    독립 Route (Layout 없음)
  */
  { path: '/login', element: <Login /> },
  { path: '/LoginView', element: <LoginView /> },

  //=============================================================================
  // 퍼블리싱 관련 라우트
  //=============================================================================

  // PublishingMain 레이아웃 적용
  {
    path: '/publishing',
    element: <PublishingMain />,
    children: [
      {
        index: true,
        element: (
          <div
            style={{
              textAlign: 'center',
              paddingTop: '100px',
              color: '#999',
            }}
          >
            <h3>왼쪽 메뉴에서 확인할 페이지를 선택해주세요.</h3>
          </div>
        ),
      },
      // autoPublishingRoutes에서 자동 생성된 라우트들
      ...autoPublishingRoutes,
    ],
  },

  //=============================================================================
  // 기타 페이지
  //=============================================================================

  // 404 페이지 (가장 마지막에 위치)
  {
    path: '*',
    element: (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>404</h1>
        <p>페이지를 찾을 수 없습니다.</p>
        <a href="/">홈으로 돌아가기</a>
      </div>
    ),
  },
];
