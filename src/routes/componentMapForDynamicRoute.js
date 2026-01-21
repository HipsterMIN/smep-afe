// componentMapForDynamicRoute.js
import { lazy } from 'react';

// 컴포넌트와 메뉴 정보를 함께 관리
export const routeConfig = {
    'common-code': {
        component: lazy(() => import('../pages/CommonCode')),
        name: '공통코드 관리'
    },
    'auth-mgmt': {
        component: lazy(() => import('../pages/AuthMgmt')),
        name: '권한 관리'
    },
    'menu-mgmt': {
        component: lazy(() => import('../pages/MenuMgmt')),
        name: '관리자 메뉴관리'
    },
    'board-mgmt': {
        component: lazy(() => import('../pages/BoardMgmt')),
        name: '게시판 관리'
    },
    'biz-info': {
        component: lazy(() => import('../pages/BizInfo')),
        name: '사업정보 관리'
    },
    'biz-reg': {
        component: lazy(() => import('../pages/BizReg')),
        name: '사업등록'
    },
    'grid-example': {
        component: lazy(() => import('../SvarGridExample')),
        name: '그리드 예제'
    },
    'member-list': {
        component: lazy(() => import('../pages/member/MemberList')),
        name: '회원 목록'
    },
    'menu-mng': {
        component: lazy(() => import('../pages/menu/Menu')),
        name: '메뉴 관리'
    },
};

// 기존 호환성을 위한 export (필요시)
export const componentMapForDynamicRoute = Object.keys(routeConfig).reduce((acc, key) => {
    acc[key] = routeConfig[key].component;
    return acc;
}, {});
