// ============================================
// Dynamic Route Component
// - URL 파라미터를 기반으로 동적으로 컴포넌트 로드
// - 메뉴 접근 시 자동으로 탭 생성
// - 존재하지 않는 메뉴 코드는 홈으로 리다이렉트
// ============================================
import { useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';

import ContentBox from '../components/ui/Contentbox';
import useTabStore from '../store/useTabStore';
import { routeConfig } from './componentMapForDynamicRoute.js';

export default function DynamicRoute() {
    // URL에서 menuCode 파라미터 추출
    // 예: /common-code -> menuCode = "common-code"
    const { menuCode } = useParams();

    // Zustand store에서 탭 추가 함수 가져오기
    const { addTab } = useTabStore();

    // routeConfig에서 해당 메뉴 코드의 설정 가져오기
    // routeInfo = { component: LazyComponent, name: '탭 이름' }
    const routeInfo = routeConfig[menuCode];

    // 메뉴 접근 시 자동으로 탭 추가
    useEffect(() => {
        if (routeInfo) {
            // 탭 store에 새 탭 추가
            // - 이미 존재하는 탭이면 활성화만 됨
            // - 최대 10개 제한 확인
            addTab({
                path: menuCode,          // 탭 식별자 (URL 경로와 동일)
                name: routeInfo.name     // 탭에 표시될 이름
            });
        }
    }, [menuCode, routeInfo, addTab]);

    // 유효하지 않은 메뉴 코드인 경우 홈으로 리다이렉트
    // routeConfig에 등록되지 않은 menuCode 접근 시 처리
    if (!routeInfo) {
        return <Navigate to="/" replace />;
    }

    // lazy loading된 컴포넌트 가져오기
    const PageComponent = routeInfo.component;

    return (
        <ContentBox>
            {/* 
                Suspense는 상위 컴포넌트(App.jsx 등)에서 처리하거나
                여기에 추가하여 로딩 중 fallback UI를 표시할 수 있습니다.
                예: <Suspense fallback={<div>로딩중...</div>}>
            */}
            <PageComponent />
        </ContentBox>
    );
}
