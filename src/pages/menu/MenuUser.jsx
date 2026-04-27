import MenuBase from './MenuBase.jsx';

export default function MenuUser() {
  return MenuBase({
    pageTitle: '사용자 메뉴 관리',
    breadcrumb: ['시스템 관리', '시스템 설정', '사용자 메뉴관리', '사용자 메뉴목록'],
    menuUseTrgtSeCd: 'USR',
    maxDepth: 3,
    showBoardOption: true,
  });
}
