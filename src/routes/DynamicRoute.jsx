// DynamicRoute.jsx
import { Navigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';

import ContentBox from '../components/ui/Contentbox';
import { routeConfig } from './componentMapForDynamicRoute.js';
import useTabStore from '../store/useTabStore';

export default function DynamicRoute() {
    const { menuCode } = useParams();
    const { addTab } = useTabStore();

    const routeInfo = routeConfig[menuCode];

    // 메뉴 접근 시 탭 자동 추가
    useEffect(() => {
        if (routeInfo) {
            addTab({
                path: menuCode,
                name: routeInfo.name
            });
        }
    }, [menuCode, routeInfo, addTab]);

    if (!routeInfo) {
        return <Navigate to="/" replace />;
    }

    const PageComponent = routeInfo.component;

    return (
        <ContentBox>
            <PageComponent />
        </ContentBox>
    );
}
