import { AdminLayoutWithAuth } from '@layouts';
import EmailFormCreate from '@pages/notification/email/form/EmailFormCreate.jsx';
import EmailFormUpdate from '@pages/notification/email/form/EmailFormUpdate.jsx';
import { lazy } from 'react';

// Lazy import (필요할 때 로드)
const CommonCode = lazy(() => import('@pages/CommonCode'));
const AccessAllowIp = lazy(() => import('@pages/access/AccessAllowIp'));
const SecurityPolicy = lazy(
  () => import('@pages/security-policy/SecurityPolicy.jsx')
);
const BbsList = lazy(() => import('@pages/board/BbsList'));
const BbsForm = lazy(() => import('@pages/board/BbsForm'));
const BbsInfoList = lazy(() => import('@pages/board/BbsInfoList'));
const PstList = lazy(() => import('@pages/board/PstList'));
const PstForm = lazy(() => import('@pages/board/PstForm'));
const MemberList = lazy(() => import('@pages/member/manager/MemberList.jsx'));
const ManagerList = lazy(() => import(`@pages/member/manager/ManagerList`));
const ManagerCreate = lazy(
  () => import('@pages/member/manager/ManagerCreate.jsx')
);
const ManagerUpdate = lazy(
  () => import('@pages/member/manager/ManagerUpdate.jsx')
);

const RoleList = lazy(() => import('@pages/member/role/RoleList.jsx'));
const RoleMenuAssigner = lazy(
  () => import('@pages/member/role/RoleMenuAssigner.jsx')
);
const ManagerChangedHistory = lazy(
  () => import('@pages/member/history/ManagerChangedHistory.jsx')
);

const ManagerChangedHistoryDetail = lazy(
  () => import('@pages/member/history/ManagerChangedHistoryDetail.jsx')
);
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
const ApplicationCompanyInfoList = lazy(
  () => import('@pages/application/ApplicationCompanyInfoList.jsx')
);
const PublicAnnouncement = lazy(
  () => import('@pages/public-announcement/PublicAnnouncement.jsx')
);
const PublicAnnouncementDetail = lazy(
  () => import('@pages/public-announcement/PublicAnnouncementDetail.jsx')
);
const HousingSpecialSupplyAnnouncement = lazy(
  () =>
    import('@pages/public-announcement/HousingSpecialSupplyAnnouncement.jsx')
);
const HousingSpecialSupplyAnnouncementDetail = lazy(
  () =>
    import('@pages/public-announcement/HousingSpecialSupplyAnnouncementDetail.jsx')
);
const SurveyList = lazy(() => import('@pages/survey/SurveyList'));
const SurveyManage = lazy(() => import('@pages/survey/SurveyManage'));
const SurveyResult = lazy(() => import('@pages/survey/SurveyResult'));
const IntegrationLoginSiteList = lazy(
  () =>
    import('@pages/member/integration-login-site/IntegrationLoginSiteList.jsx')
);
const IntegrationLoginSiteDetail = lazy(
  () =>
    import('@pages/member/integration-login-site/IntegrationLoginSiteDetail.jsx')
);
const IntegrationLoginSiteUpdate = lazy(
  () =>
    import('@pages/member/integration-login-site/IntegrationLoginSiteUpdate.jsx')
);
const IntegrationLoginSiteCreate = lazy(
  () =>
    import('@pages/member/integration-login-site/IntegrationLoginSiteCreate.jsx')
);
const IntegrationLoginSiteSort = lazy(
  () =>
    import('@pages/member/integration-login-site/IntegrationLoginSiteSort.jsx')
);
const PolicyFinanceList = lazy(
  () => import('@pages/business/policy-finance/policyFinanceList.jsx')
);
const PolicyFinanceDetail = lazy(
  () => import('@pages/business/policy-finance/policyFinanceDetail.jsx')
);
const PolicyFinanceCreate = lazy(
  () => import('@pages/business/policy-finance/policyFinanceCreate.jsx')
);
const PolicyFinanceUpdate = lazy(
  () => import('@pages/business/policy-finance/policyFinanceUpdate.jsx')
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
const CertificateVerificationList = lazy(
  () => import('@pages/certificate/CertificateVerificationList.jsx')
);

const PopupManagement = lazy(() => import('@pages/popup/PopupManagement.jsx'));
const BannerManagement = lazy(
  () => import('@pages/banner/BannerManagement.jsx')
);

const RlvntSysMng = lazy(() => import('@pages/portalMng/RlvntSysMng.jsx'));

const SmsFormList = lazy(
  () => import('@pages/notification/sms/form/SmsFormList.jsx')
);

const SmsFormCreate = lazy(
  () => import('@pages/notification/sms/form/SmsFormCreate.jsx')
);

const SmsFormUpdate = lazy(
  () => import('@pages/notification/sms/form/SmsFormUpdate.jsx')
);

const SmsSendList = lazy(
  () => import('@pages/notification/sms/send/SmsSendList.jsx')
);

const SmsSendDetail = lazy(
  () => import('@pages/notification/sms/send/SmsSendDetail.jsx')
);

const SmsSendCreate = lazy(
  () => import('@pages/notification/sms/send/SmsSendCreate.jsx')
);

const EmailFormList = lazy(
  () => import('@pages/notification/email/form/EmailFormList.jsx')
);
const EmailSendList = lazy(
  () => import('@pages/notification/email/send/EmailSendList.jsx')
);

const EmailSendDetail = lazy(
  () => import('@pages/notification/email/send/EmailSendDetail.jsx')
);

const EmailSendCreate = lazy(
  () => import('@pages/notification/email/send/EmailSendCreate.jsx')
);

const EventInfoList = lazy(() => import('@pages/event-info/EventInfoList.jsx'));
const EventInfoForm = lazy(() => import('@pages/event-info/EventInfoForm.jsx'));
const EventInfoDetail = lazy(
  () => import('@pages/event-info/EventInfoDetail.jsx')
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
        children: [
          { path: 'create', component: PstForm },
          { path: ':pstNo', component: PstForm },
        ],
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
    component: SecurityPolicy,
    layout: AdminLayoutWithAuth,
  },
  // 접속허용IP 관리
  M_PIIO_00135: {
    component: AccessAllowIp,
    layout: AdminLayoutWithAuth,
  },
  // API 연계 관리
  // 'M_PIIO_00062': {
  //   component: TODO_M_PIIO_00062,
  //   layout: AdminLayoutWithAuth,
  // },

  // 설문 관리
  M_PIIO_00140: {
    component: SurveyList,
    layout: AdminLayoutWithAuth,
    children: [
      {
        path: 'create',
        component: SurveyManage,
      },
      {
        path: ':surveyNo/results',
        component: SurveyResult,
      },
      {
        path: ':surveyNo',
        component: SurveyManage,
      },
    ],
  },
  // ---------- 회원/권한 관리 ----------
  // 회원관리
  M_PIIO_00052: {
    component: MemberList,
    layout: AdminLayoutWithAuth,
  },
  // 관리자계정 관리
  M_PIIO_00054: {
    component: ManagerList,
    layout: AdminLayoutWithAuth,
    children: [
      {
        path: 'create',
        component: ManagerCreate,
      },
      {
        path: ':mbrNo/update',
        component: ManagerUpdate,
      },
    ],
  },
  // 관리자 권한 변경 이력
  M_PIIO_00162: {
    component: ManagerChangedHistory,
    layout: AdminLayoutWithAuth,
    children: [
      {
        path: ':id',
        component: ManagerChangedHistoryDetail,
      },
    ],
  },
  // 권한관리
  M_PIIO_00055: {
    component: RoleList,
    layout: AdminLayoutWithAuth,
    children: [
      {
        path: 'menu',
        component: RoleMenuAssigner, // 역할 메뉴 할당
      },
    ],
  },
  // 통합로그인 사이트 관리
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
  M_PIIO_00030: {
    component: PstList,
    layout: AdminLayoutWithAuth,
    children: [
      {
        path: 'create', //
        component: PstForm, // 게시물 등록
      },
      {
        path: ':pstNo',
        component: PstForm,
      },
    ],
  },
  // FAQ
  M_PIIO_00031: {
    component: PstList,
    layout: AdminLayoutWithAuth,
    children: [
      {
        path: 'create', //
        component: PstForm, // 게시물 등록
      },
      {
        path: ':pstNo',
        component: PstForm,
      },
    ],
  },
  // Q&A
  M_PIIO_00032: {
    component: PstList,
    layout: AdminLayoutWithAuth,
    children: [
      {
        path: 'create', //
        component: PstForm, // 게시물 등록
      },
      {
        path: ':pstNo',
        component: PstForm,
      },
    ],
  },
  // 고객 만족도조사
  // 'M_PIIO_00033': {
  //   component: TODO_M_PIIO_00033,
  //   layout: AdminLayoutWithAuth,
  // },
  // 기업가정신 관리 - 공지사항
  M_PIIO_00147: {
    component: PstList,
    layout: AdminLayoutWithAuth,
    children: [
      {
        path: 'create', //
        component: PstForm, // 게시물 등록
      },
      {
        path: ':pstNo',
        component: PstForm,
      },
    ],
  },
  // 기업가정신 관리 - 언론보도
  M_PIIO_00148: {
    component: PstList,
    layout: AdminLayoutWithAuth,
    children: [
      {
        path: 'create', //
        component: PstForm, // 게시물 등록
      },
      {
        path: ':pstNo',
        component: PstForm,
      },
    ],
  },
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

  // Q&A
  M_PIIO_00168: {
    component: PstList,
    layout: AdminLayoutWithAuth,
    children: [
      {
        path: 'create', //
        component: PstForm, // 게시물 등록
      },
      {
        path: ':pstNo',
        component: PstForm,
      },
    ],
  },
  // SMS 발송
  M_PIIO_00130: {
    component: SmsSendList,
    layout: AdminLayoutWithAuth,
    children: [
      {
        path: ':mSeq',
        component: SmsSendDetail, // SMS발송상세
      },
      {
        path: 'create',
        component: SmsSendCreate, // SMS발송등록
      },
    ],
  },
  // 이메일 발송
  M_PIIO_00131: {
    component: EmailSendList,
    layout: AdminLayoutWithAuth,
    children: [
      {
        path: 'detail/:msgId',
        component: EmailSendDetail, // 이메일발송상세
      },
      {
        path: 'create',
        component: EmailSendCreate, // 이메일발송등록
      },
    ],
  },
  // SMS 양식
  M_PIIO_00132: {
    component: SmsFormList,
    layout: AdminLayoutWithAuth,
    children: [
      {
        path: ':id/update',
        component: SmsFormUpdate, // SMS 양식 수정
      },
      {
        path: 'create',
        component: SmsFormCreate, // SMS 양식 등록
      },
    ],
  },
  // 이메일 양식
  M_PIIO_00133: {
    component: EmailFormList,
    layout: AdminLayoutWithAuth,
    children: [
      {
        path: ':id/update',
        component: EmailFormUpdate, // SMS 양식 수정
      },
      {
        path: 'create',
        component: EmailFormCreate, // SMS 양식 등록
      },
    ],
  },
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
  M_PIIO_00045: {
    component: PstList,
    layout: AdminLayoutWithAuth,
    children: [
      {
        path: 'create', //
        component: PstForm, // 게시물 등록
      },
      {
        path: ':pstNo',
        component: PstForm,
      },
    ],
  },
  // 유관시스템 관리
  M_PIIO_00145: {
    component: RlvntSysMng,
    layout: AdminLayoutWithAuth,
  },
  // ---------- 활용정보 관리 ----------
  // 행사정보
  M_PIIO_00023: {
    component: EventInfoList,
    layout: AdminLayoutWithAuth,
    children: [
      {
        path: 'create', // 신규 등록: /event-info/create
        component: EventInfoForm,
      },
      {
        path: ':evntInfoId', //
        component: EventInfoDetail, // 상세조회
      },
      {
        path: ':evntInfoId/edit',
        component: EventInfoForm,
      },
    ],
  },
  //정책뉴스 (하위 메뉴(보도자료, 카드뉴스, 영상뉴스 카테고리로 구분 )
  M_PIIO_00144: {
    component: PstList,
    layout: AdminLayoutWithAuth,
    children: [
      {
        path: 'create', //
        component: PstForm, // 게시물 등록
      },
      {
        path: ':pstNo',
        component: PstForm,
      },
    ],
  },
  //보도자료(구 정책뉴스 하위 4뎁스메뉴 3뎁스로 구현)
  M_PIIO_00141: {
    component: PstList,
    layout: AdminLayoutWithAuth,
    children: [
      {
        path: 'create', //
        component: PstForm, // 게시물 등록
      },
      {
        path: ':pstNo',
        component: PstForm,
      },
    ],
  },
  //카드뉴스(구 정책뉴스 하위 4뎁스메뉴 3뎁스로 구현)
  M_PIIO_00142: {
    component: PstList,
    layout: AdminLayoutWithAuth,
    children: [
      {
        path: 'create', //
        component: PstForm, // 게시물 등록
      },
      {
        path: ':pstNo',
        component: PstForm,
      },
    ],
  },
  //영상뉴스(구 정책뉴스 하위 4뎁스메뉴 3뎁스로 구현)
  M_PIIO_00143: {
    component: PstList,
    layout: AdminLayoutWithAuth,
    children: [
      {
        path: 'create', //
        component: PstForm, // 게시물 등록
      },
      {
        path: ':pstNo',
        component: PstForm,
      },
    ],
  },
  // 입법·행정예고/고시
  M_PIIO_00025: {
    component: PstList,
    layout: AdminLayoutWithAuth,
    children: [
      {
        path: 'create', //
        component: PstForm, // 게시물 등록
      },
      {
        path: ':pstNo',
        component: PstForm,
      },
    ],
  },
  // 입주기업 모집공고
  M_PIIO_00026: {
    component: PstList,
    layout: AdminLayoutWithAuth,
    children: [
      {
        path: 'create', //
        component: PstForm, // 게시물 등록
      },
      {
        path: ':pstNo',
        component: PstForm,
      },
    ],
  },
  // 월간 중기누리
  M_PIIO_00027: {
    component: PstList,
    layout: AdminLayoutWithAuth,
    children: [
      {
        path: 'create', //
        component: PstForm, // 게시물 등록
      },
      {
        path: ':pstNo',
        component: PstForm,
      },
    ],
  },
  // 월간 중기누리 구독자
  M_PIIO_00028: {
    component: PstList,
    layout: AdminLayoutWithAuth,
    children: [
      {
        path: 'create', //
        component: PstForm, // 게시물 등록
      },
      {
        path: ':pstNo',
        component: PstForm,
      },
    ],
  },
  // 기업업무용 서식
  M_PIIO_00029: {
    component: PstList,
    layout: AdminLayoutWithAuth,
    children: [
      {
        path: 'create', //
        component: PstForm, // 게시물 등록
      },
      {
        path: ':pstNo',
        component: PstForm,
      },
    ],
  },
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
  M_PIIO_00019: {
    component: CertificateVerificationList,
    layout: AdminLayoutWithAuth,
  },
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
  M_PIIO_00014: {
    component: HousingSpecialSupplyAnnouncement,
    layout: AdminLayoutWithAuth,
    children: [
      {
        path: 'create',
        component: HousingSpecialSupplyAnnouncementDetail,
      },
      {
        path: ':bizPbancNo',
        component: HousingSpecialSupplyAnnouncementDetail,
      },
    ],
  },
  // ---------- 신청 관리 ----------
  // 신청기업정보
  M_PIIO_00015: {
    component: ApplicationCompanyInfoList,
    layout: AdminLayoutWithAuth,
  },
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
