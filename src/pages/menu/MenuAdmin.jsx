import MenuBase from './MenuBase.jsx';

export default function MenuAdmin() {
  return MenuBase({
    pageTitle: '관리자 메뉴 관리',
    breadcrumb: ['시스템 관리', '시스템 설정', '관리자 메뉴관리', '관리자 메뉴목록'],
    mbrTypeCd: 'MNG',
    maxDepth: 4,
    showBoardOption: false,
  });
}