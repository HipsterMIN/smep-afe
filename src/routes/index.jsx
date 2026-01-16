// ============================================
// React Router 설정 파일
// ============================================
import { createBrowserRouter, Navigate } from 'react-router-dom';

import Admin from '../Admin.jsx';
import AuthBar from '../components/AuthBar.jsx';
import Login from '../pages/Login.jsx';
import LoginView from '../pages/LoginView.jsx';
import PublishingMain from "../publishing/PublishingMain.jsx";
import { autoPublishingRoutes } from "./autoRoutes.jsx";
import DynamicRoute from './DynamicRoute.jsx';

// Vite의 BASE_URL은 vite.config.js의 base와 일치합니다. (예: '/', '/admin/')
// React Router의 basename은 마지막 슬래시를 제거한 값으로 전달합니다. (예: '', '/admin')
const base = import.meta.env.BASE_URL || '/';
const basename = base.endsWith('/') ? base.slice(0, -1) : base;

const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <>
                <AuthBar />
                <Admin />
            </>
        ),
        children: [
            {
                index: true,
                element: <Navigate to="/common-code" replace />,
            },
            {
                path: ':menuCode',  // 동적 라우팅
                element: <DynamicRoute />,
            },
        ],
    },
    { path: '/login', element: <Login /> },
    { path: '/LoginView', element: <LoginView /> },
    {
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
            ...autoPublishingRoutes,
        ],
    },
    {
        path: '*',
        element: <div>페이지를 찾을 수 없습니다. (404)</div>,
    },
], {
    basename,
});

export default router;