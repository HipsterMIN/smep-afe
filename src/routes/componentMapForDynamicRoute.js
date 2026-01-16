// ============================================
// 동적 라우팅을 위한 컴포넌트 맵핑
// 페이지(컴포넌트) 추가 시 이 객체에 매핑을 추가하세요.
// 일단 평탄화 패턴으로 구현. 향후 필요시 중첩 패턴도 고려 가능.
// ============================================

import { lazy } from 'react';

export const componentMapForDynamicRoute = {
    'common-code': lazy(() => import('../pages/CommonCode')),
    'auth-mgmt': lazy(() => import('../pages/AuthMgmt')),
    'menu-mgmt': lazy(() => import('../pages/MenuMgmt')),
    'board-mgmt': lazy(() => import('../pages/BoardMgmt')),
    'biz-info': lazy(() => import('../pages/BizInfo')),
    'biz-reg': lazy(() => import('../pages/BizReg')),
    'grid-example': lazy(() => import('../SvarGridExample')),

    // 회원관리 관련 페이지
    'member-list': lazy(() => import('../pages/member/MemberList')),

    // 필요한 다른 메뉴 코드와 컴포넌트를 여기에 추가하세요.
};