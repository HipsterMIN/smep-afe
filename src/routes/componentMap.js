import { AdminLayoutWithAuth } from '@layouts';
import { lazy } from 'react';

// Lazy import (필요할 때 로드)
const CommonCode = lazy(() => import('@pages/CommonCode'));
const AccountView = lazy(() => import('@pages/account/AccountView'));
const BbsList = lazy(() => import('@pages/board/BbsList'));
const BbsForm = lazy(() => import('@pages/board/BbsForm'));
const BbsInfoList = lazy(() => import('@pages/board/BbsInfoList'));
const PstList = lazy(() => import('@pages/board/PstList'));
const PstForm = lazy(() => import('@pages/board/PstForm'));
const MemberList = lazy(() => import('@pages/member/MemberList'));
const MenuUserMng = lazy(() => import('@pages/menu/MenuUser.jsx'));
const MenuAdminMng = lazy(() => import('@pages/menu/MenuAdmin.jsx'));
const SupportBusiness = lazy(
  () => import('@pages/support-business/SupportBusiness.jsx')
);
const SupportBusinessDetail = lazy(
  () => import('@pages/support-business/SupportBusinessDetail.jsx')
);
const SupportBusinessForm = lazy(
  () => import('@pages/support-business/SupportBusinessForm.jsx')
);
const PublicAnnouncement = lazy(
  () => import('@pages/public-announcement/PublicAnnouncement.jsx')
);
const PublicAnnouncementDetail = lazy(
  () => import('@pages/public-announcement/PublicAnnouncementDetail.jsx')
);
const SurveyList = lazy(() => import('@pages/survey/SurveyList'));
const SurveyManage = lazy(() => import('@pages/survey/SurveyManage'));
const SurveyResult = lazy(() => import('@pages/survey/SurveyResult'));
const IntegrationLoginSiteList = lazy(
  () => import('@pages/member/IntegrationLoginSiteList.jsx')
);
const IntegrationLoginSiteDetail = lazy(
  () => import('@pages/member/IntegrationLoginSiteDetail.jsx')
);
const IntegrationLoginSiteUpdate = lazy(
  () => import('@pages/member/IntegrationLoginSiteUpdate.jsx')
);
const IntegrationLoginSiteCreate = lazy(
  () => import('@pages/member/IntegrationLoginSiteCreate.jsx')
);
const IntegrationLoginSiteSort = lazy(
  () => import('@pages/member/IntegrationLoginSiteSort.jsx')
);
const PolicyFinanceList = lazy(
  () => import('@pages/business/policyFinanceList.jsx')
);
const PolicyFinanceDetail = lazy(
  () => import('@pages/business/policyFinanceDetail.jsx')
);
const PolicyFinanceCreate = lazy(
  () => import('@pages/business/policyFinanceCreate.jsx')
);
const PolicyFinanceUpdate = lazy(
  () => import('@pages/business/policyFinanceUpdate.jsx')
);

const CertificateList = lazy(
  () => import('@pages/certificate/CertificateList')
);
const CertificateForm = lazy(
  () => import('@pages/certificate/CertificateForm')
);
const CertificateDetail = lazy(
  () => import('@pages/certificate/CertificateDetail')
);
const CertificateIssuanceList = lazy(
  () => import('@pages/certificate/CertificateIssuanceList')
);
const PopupManagement = lazy(() => import('@pages/popup/PopupManagement.jsx'));
const BannerManagement = lazy(
  () => import('@pages/banner/BannerManagement.jsx')
);

/**
 * =============================================================================
 * Component Map - menuId와 실제 컴포넌트 매핑
 * =============================================================================
 *
 * @description
 * 메뉴 ID(menuId)를 기반으로 동적 라우팅을 위한 컴포넌트 매핑 테이블
 * - 각 메뉴에 대응하는 컴포넌트와 레이아웃을 정의
 * - 중첩 라우팅(children) 지원
 *
 * @structure
 * {
 *   'MENU_ID': {
 *     component: ReactComponent,        // 렌더링할 컴포넌트
 *     layout: LayoutComponent,          // 적용할 레이아웃 (옵션)
 *     children: [                       // 자식 라우트 (옵션)
 *       {
 *         path: 'relative-path',        // 상대 경로 (:id, :slug 등 동적 파라미터 가능)
 *         component: ChildComponent,    // 자식 컴포넌트
 *       }
 *     ]
 *   }
 * }
 *
 * @example
 * // 기본 사용 (단일 페이지)
 * 'M_PIIO_00096': {
 *   component: ApiGuide,
 *   layout: SubpageLayoutWithMenu,
 * }
 *
 * @example
 * // 중첩 라우팅 (목록 + 상세)
 * 'M_PIIO_00075': {
 *   component: SprtBizList,              // /req/suprt/suprt
 *   layout: SubpageLayoutWithMenu,
 *   children: [
 *     {
 *       path: ':id',                      // /req/suprt/suprt/123
 *       component: SprtBizDetail,
 *     }
 *   ]
 * }
 *
 * @example
 * // 복잡한 중첩 라우팅
 * 'M_PIIO_00076': {
 *   component: PbancList,
 *   layout: SubpageLayoutWithMenu,
 *   children: [
 *     { path: ':id', component: PbancView },           // 상세
 *     { path: ':id/edit', component: PbancEdit },      // 수정
 *     { path: 'create', component: PbancCreate },      // 생성
 *   ]
 * }
 */

// 컴포넌트 매핑
export const componentMap = {
  // ==========================================
  // 시스템 관리
  // ==========================================
  // ---------- 시스템 설정 ----------
  // 사용자 메뉴관리
  M_PIIO_00057: {
    component: MenuUserMng,
    layout: AdminLayoutWithAuth,
  },
  // 관리자 메뉴관리
  M_PIIO_00058: {
    component: MenuAdminMng,
    layout: AdminLayoutWithAuth,
  },
  // 게시판 관리
  M_PIIO_00059: {
    component: BbsList,
    layout: AdminLayoutWithAuth,
    // 자식 라우트 정의
    children: [
      {
        path: 'create', //
        component: BbsForm, // 게시판 등록
        // layout 상속 (부모와 동일)
      },
      {
        path: ':bbsNo',
        component: BbsForm,
      },
    ],
  },
  // 게시물 관리 ( 게시판 선택 목록 )
  M_PIIO_00134: {
    component: BbsInfoList,
    layout: AdminLayoutWithAuth,
    // 자식 라우트 정의
    children: [
      {
        path: ':bbsNo',
        component: PstList,
      },
      {
        path: ':bbsNo/create', //
        component: PstForm, // 게시물 등록
      },
      {
        path: ':bbsNo/:pstNo',
        component: PstForm,
      },
    ],
  },

  // 공통코드관리
  M_PIIO_00060: {
    component: CommonCode,
    layout: AdminLayoutWithAuth,
  },
  // 보안설정
  M_PIIO_00061: {
    component: AccountView,
    layout: AdminLayoutWithAuth,
  },
  // 접속허용IP 관리
  M_PIIO_00135: {
    component: AccountView,
    layout: AdminLayoutWithAuth,
  },
  // API 연계 관리
  // 'M_PIIO_00062': {
  //   component: TODO_M_PIIO_00062,
  //   layout: AdminLayoutWithAuth,
  // },

  // 설문 목록
  'survey-list': {
    component: SurveyList,
    layout: AdminLayoutWithAuth,
  },
  // 설문지 관리
  'survey-manage': {
    component: SurveyManage,
    layout: AdminLayoutWithAuth,
  },
  // 설문 결과 보기
  'survey-result': {
    component: SurveyResult,
    layout: AdminLayoutWithAuth,
  },
  // ---------- 회원/권한 관리 ----------
  // 회원관리
  M_PIIO_00052: {
    component: MemberList,
    layout: AdminLayoutWithAuth,
  },
  // 통합회원목록
  // 'M_PIIO_00053': {
  //   component: TODO_M_PIIO_00053,
  //   layout: AdminLayoutWithAuth,
  // },
  // 관리자계정 관리
  // 'M_PIIO_00054': {
  //   component: TODO_M_PIIO_00054,
  //   layout: AdminLayoutWithAuth,
  // },
  // 권한관리
  // 'M_PIIO_00055': {
  //   component: TODO_M_PIIO_00055,
  //   layout: AdminLayoutWithAuth,
  // },
  M_PIIO_00056: {
    component: IntegrationLoginSiteList,
    layout: AdminLayoutWithAuth,
    children: [
      { path: ':id', component: IntegrationLoginSiteDetail },
      { path: ':id/update', component: IntegrationLoginSiteUpdate },
      { path: 'create', component: IntegrationLoginSiteCreate },
      { path: 'sort', component: IntegrationLoginSiteSort },
    ],
  },
  // ==========================================
  // 정보제공
  // ==========================================
  // ---------- 고객지원 관리 ----------
  // 공지사항
  // 'M_PIIO_00030': {
  //   component: TODO_M_PIIO_00030,
  //   layout: AdminLayoutWithAuth,
  // },
  // FAQ
  // 'M_PIIO_00031': {
  //   component: TODO_M_PIIO_00031,
  //   layout: AdminLayoutWithAuth,
  // },
  // Q&A
  // 'M_PIIO_00032': {
  //   component: TODO_M_PIIO_00032,
  //   layout: AdminLayoutWithAuth,
  // },
  // 고객 만족도조사
  // 'M_PIIO_00033': {
  //   component: TODO_M_PIIO_00033,
  //   layout: AdminLayoutWithAuth,
  // },
  // 기업가정신 콘텐츠 관리
  // 'M_PIIO_00034': {
  //   component: TODO_M_PIIO_00034,
  //   layout: AdminLayoutWithAuth,
  // },
  // 팝업관리
  M_PIIO_00035: {
    component: PopupManagement,
    layout: AdminLayoutWithAuth,
  },
  // 배너관리
  M_PIIO_00036: {
    component: BannerManagement,
    layout: AdminLayoutWithAuth,
  },
  // SMS 발송
  // 'M_PIIO_00130': {
  //   component: TODO_M_PIIO_00130,
  //   layout: AdminLayoutWithAuth,
  // },
  // 이메일 발송
  // 'M_PIIO_00131': {
  //   component: TODO_M_PIIO_00131,
  //   layout: AdminLayoutWithAuth,
  // },
  // SMS 양식
  // 'M_PIIO_00132': {
  //   component: TODO_M_PIIO_00132,
  //   layout: AdminLayoutWithAuth,
  // },
  // 이메일 양식
  // 'M_PIIO_00133': {
  //   component: TODO_M_PIIO_00133,
  //   layout: AdminLayoutWithAuth,
  // },
  // ---------- 포털 관리 ----------
  // 중소기업 통합플랫폼 소개
  // 'M_PIIO_00038': {
  //   component: TODO_M_PIIO_00038,
  //   layout: AdminLayoutWithAuth,
  // },
  // 안내 콘텐츠 관리
  // 'M_PIIO_00039': {
  //   component: TODO_M_PIIO_00039,
  //   layout: AdminLayoutWithAuth,
  // },
  // 이용약관
  // 'M_PIIO_00040': {
  //   component: TODO_M_PIIO_00040,
  //   layout: AdminLayoutWithAuth,
  // },
  // 개인정보처리방침
  // 'M_PIIO_00041': {
  //   component: TODO_M_PIIO_00041,
  //   layout: AdminLayoutWithAuth,
  // },
  // 이메일주소 무단 수집 거부안내
  // 'M_PIIO_00042': {
  //   component: TODO_M_PIIO_00042,
  //   layout: AdminLayoutWithAuth,
  // },
  // 저작권정책
  // 'M_PIIO_00043': {
  //   component: TODO_M_PIIO_00043,
  //   layout: AdminLayoutWithAuth,
  // },
  // 웹접근성정책
  // 'M_PIIO_00044': {
  //   component: TODO_M_PIIO_00044,
  //   layout: AdminLayoutWithAuth,
  // },
  // 포털이미지관리
  // 'M_PIIO_00045': {
  //   component: TODO_M_PIIO_00045,
  //   layout: AdminLayoutWithAuth,
  // },
  // ---------- 활용정보 관리 ----------
  // 행사정보
  // 'M_PIIO_00023': {
  //   component: TODO_M_PIIO_00023,
  //   layout: AdminLayoutWithAuth,
  // },
  // 정책뉴스
  // 'M_PIIO_00024': {
  //   component: TODO_M_PIIO_00024,
  //   layout: AdminLayoutWithAuth,
  // },
  // 입법·행정예고/고시
  // 'M_PIIO_00025': {
  //   component: TODO_M_PIIO_00025,
  //   layout: AdminLayoutWithAuth,
  // },
  // 입주기업 모집공고
  // 'M_PIIO_00026': {
  //   component: TODO_M_PIIO_00026,
  //   layout: AdminLayoutWithAuth,
  // },
  // 월간 중기누리
  // 'M_PIIO_00027': {
  //   component: TODO_M_PIIO_00027,
  //   layout: AdminLayoutWithAuth,
  // },
  // 월간 중기누리 구독자
  // 'M_PIIO_00028': {
  //   component: TODO_M_PIIO_00028,
  //   layout: AdminLayoutWithAuth,
  // },
  // 기업업무용 서식
  // 'M_PIIO_00029': {
  //   component: TODO_M_PIIO_00029,
  //   layout: AdminLayoutWithAuth,
  // },
  // ==========================================
  // 증명서 발급 관리
  // ==========================================
  // ---------- 증명서 발급 이력 ----------
  // 증명서 발급 이력
  M_PIIO_00018: {
    component: CertificateIssuanceList,
    layout: AdminLayoutWithAuth,
  },
  // ---------- 증명서 일괄 확인 이력 ----------
  // 증명서 일괄 확인 이력
  // 'M_PIIO_00019': {
  //   component: TODO_M_PIIO_00019,
  //   layout: AdminLayoutWithAuth,
  // },
  // ---------- 증명서 정보 관리 ----------
  // 증명서 정보 관리
  M_PIIO_00017: {
    component: CertificateList,
    layout: AdminLayoutWithAuth,
    children: [
      {
        path: 'create',
        component: CertificateForm,
      },
      {
        path: ':prdocCd',
        component: CertificateDetail,
      },
      {
        path: ':prdocCd/edit',
        component: CertificateForm,
      },
    ],
  },
  // ==========================================
  // 지원사업 관리
  // ==========================================
  // ---------- 사업공고 관리 ----------
  // 사업정보 관리
  M_PIIO_00011: {
    component: SupportBusiness,
    layout: AdminLayoutWithAuth,
    children: [
      {
        path: 'create',
        component: SupportBusinessForm,
      },
      {
        path: ':sprtBizId',
        component: SupportBusinessDetail,
      },
      {
        path: ':sprtBizId/edit',
        component: SupportBusinessForm,
      },
    ],
  },
  // 지원사업 공고관리
  M_PIIO_00012: {
    component: PublicAnnouncement,
    layout: AdminLayoutWithAuth,
    children: [
      {
        path: 'create',
        component: PublicAnnouncementDetail,
      },
      {
        path: ':bizPbancNo',
        component: PublicAnnouncementDetail,
      },
    ],
  },
  // 정책금융관리
  M_PIIO_00013: {
    component: PolicyFinanceList,
    layout: AdminLayoutWithAuth,
    children: [
      {
        path: ':policyNo',
        component: PolicyFinanceDetail,
      },
      {
        path: 'create',
        component: PolicyFinanceCreate,
      },
      {
        path: ':policyNo/update',
        component: PolicyFinanceUpdate,
      },
    ],
  },
  // 주택특별공급 사업공고
  // 'M_PIIO_00014': {
  //   component: TODO_M_PIIO_00014,
  //   layout: AdminLayoutWithAuth,
  // },
  // ---------- 신청 관리 ----------
  // 신청기업정보
  // 'M_PIIO_00015': {
  //   component: TODO_M_PIIO_00015,
  //   layout: AdminLayoutWithAuth,
  // },
  // 지원사업 신청관리
  // 'M_PIIO_00016': {
  //   component: TODO_M_PIIO_00016,
  //   layout: AdminLayoutWithAuth,
  // },
  // ==========================================
  // 통계/분석
  // ==========================================
  // ---------- 분석 ----------
  // 대시보드
  // 'M_PIIO_00049': {
  //   component: TODO_M_PIIO_00049,
  //   layout: AdminLayoutWithAuth,
  // },
  // ---------- 통계 ----------
  // 통계
  // 'M_PIIO_00048': {
  //   component: TODO_M_PIIO_00048,
  //   layout: AdminLayoutWithAuth,
  // },
};

/**
 * 컴포넌트 존재 여부 확인
 */
export const hasComponent = (menuId) => {
  return !!componentMap[menuId];
};

/**
 * 컴포넌트 가져오기
 */
export const getComponent = (menuId) => {
  return componentMap[menuId] || null;
};
