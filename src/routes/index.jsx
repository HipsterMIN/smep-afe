// ============================================
// React Router 설정 파일
// - 애플리케이션의 전체 라우팅 구조 정의
// - 동적 라우팅과 정적 라우팅 혼합 사용
// ============================================
import { createBrowserRouter, Navigate } from 'react-router-dom';

import Admin from '../Admin.jsx';
import AuthBar from '../components/AuthBar.jsx';
import Login from '../pages/Login.jsx';
import LoginView from '../pages/LoginView.jsx';
import MainPage from "../pages/MainPage.jsx";
import PublishingMain from "../publishing/PublishingMain.jsx";
import { autoPublishingRoutes } from "./autoRoutes.jsx";
import DynamicRoute from './DynamicRoute.jsx';

// Vite의 BASE_URL 설정 처리
// vite.config.js의 base 설정과 일치해야 함 (예: '/', '/admin/')
const base = import.meta.env.BASE_URL || '/';
const basename = base.endsWith('/') ? base.slice(0, -1) : base;

const router = createBrowserRouter([
    {
        // 관리자 메인 레이아웃
        path: '/',
        element: (
            <>
                <AuthBar />  {/* 인증 바 */}
                <Admin />    {/* 메인 레이아웃 (사이드바 포함) */}
            </>
        ),
        children: [
            {
                // 루트 경로: 모든 탭이 닫혔을 때 표시되는 화면
                // index: true 대신 명시적으로 경로 지정
                path: '',  // 또는 path: '/' 도 가능
                element: <MainPage/>,
            },
            {
                // 동적 라우팅: :menuCode 파라미터를 통해 메뉴 식별
                // 예: /common-code, /auth-mgmt, /menu-mgmt 등
                path: ':menuCode',
                element: <DynamicRoute />,
            },
        ],
    },
    // 로그인 페이지
    { path: '/login', element: <Login /> },
    { path: '/LoginView', element: <LoginView /> },
    {
        // 퍼블리싱 개발용 페이지 (별도 레이아웃)
        path: '/publishing',
        element: <PublishingMain />,
        children: [
            {
                index: true,
                element: (
                    <div style={{ textAlign: 'center', paddingTop: '100px', color: '#999' }}>
                        <h3>왼쪽 메뉴에서 확인할 페이지를 선택해주세요.</h3>
                    </div>
                ),
            },
            // autoPublishingRoutes에서 자동 생성된 라우트들
            ...autoPublishingRoutes,
        ],
    },
    {
        // 404 에러 페이지
        path: '*',
        element: <div>페이지를 찾을 수 없습니다. (404)</div>,
    },
], {
    basename,
});

export default router;
