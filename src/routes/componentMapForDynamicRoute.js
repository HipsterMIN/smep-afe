// ============================================
// 동적 라우팅을 위한 컴포넌트 맵핑
// - 메뉴 코드(menuCode)와 컴포넌트, 탭 이름을 매핑
// - lazy loading을 통한 코드 스플리팅 구현
// - 새로운 페이지 추가 시 이 파일에 항목 추가
// ============================================

import { lazy } from 'react';

// 컴포넌트와 메뉴 정보를 함께 관리
export const routeConfig = {
    // 공통코드 관리 페이지
    'common-code': {
        component: lazy(() => import('../pages/CommonCode')),
        name: '공통코드 관리'
    },
    // 권한 관리 페이지
    'auth-mgmt': {
        component: lazy(() => import('../pages/AuthMgmt')),
        name: '권한 관리'
    },
    // 관리자 메뉴 관리 페이지
    'menu-mgmt': {
        component: lazy(() => import('../pages/MenuMgmt')),
        name: '관리자 메뉴관리'
    },
    // 게시판 목록 페이지
    'bbs-list': {
        component: lazy(() => import('../pages/board/BbsList')),
        name: '게시판 목록'
    },
    // 게시판 등록 페이지
    'bbs-form': {
        component: lazy(() => import('../pages/board/BbsForm')),
        name: '게시판 등록'
    },
    // 사업정보 관리 페이지
    'biz-info': {
        component: lazy(() => import('../pages/BizInfo')),
        name: '사업정보 관리'
    },
    // 사업등록 페이지
    'biz-reg': {
        component: lazy(() => import('../pages/BizReg')),
        name: '사업등록'
    },
    // 그리드 예제 페이지
    'grid-example': {
        component: lazy(() => import('../SvarGridExample')),
        name: '그리드 예제'
    },
    // 회원 목록 페이지
    'member-list': {
        component: lazy(() => import('../pages/member/MemberList')),
        name: '회원 목록'
    },
    // 메뉴 관리 페이지
    'menu-mng': {
        component: lazy(() => import('../pages/menu/Menu')),
        name: '메뉴 관리'
    },

    // ==========================================
    // 새로운 메뉴 추가 예시
    // ==========================================
    // 'new-menu': {
    //     component: lazy(() => import('../pages/NewMenu')),
    //     name: '새로운 메뉴'
    // },
};

// 기존 호환성을 위한 export (컴포넌트만 추출)
// 기존 코드에서 componentMapForDynamicRoute를 사용하는 경우를 위한 처리
// 필요하지 않다면 제거 가능
export const componentMapForDynamicRoute = Object.keys(routeConfig).reduce((acc, key) => {
    acc[key] = routeConfig[key].component;
    return acc;
}, {});
