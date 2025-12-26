import { createBrowserRouter, Navigate } from 'react-router-dom';

import Admin from '../Admin.jsx';
import Contentbox from '../components/ui/Contentbox.jsx';
import SvarGridExample from '../SvarGridExample.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/admin" replace />,
  },
  {
    path: '/admin',
    element: <Admin />,
    children: [
      {
        path: 'common-code', // type1: 공통코드 관리
        element: <Contentbox contentType="type1" />,
      },
      {
        path: 'auth-mgmt', // type2: 권한 관리
        element: <Contentbox contentType="type2" />,
      },
      {
        path: 'menu-mgmt', // type3: 관리자 메뉴관리
        element: <Contentbox contentType="type3" />,
      },
      {
        path: 'board-mgmt', // type4: 게시판 관리
        element: <Contentbox contentType="type4" />,
      },
      {
        path: 'biz-info', // type5: 사업정보 관리
        element: <Contentbox contentType="type5" />,
      },
      {
        path: 'biz-reg', // type6: 사업정보 등록/수정
        element: <Contentbox contentType="type6" />,
      },
      {
        path: 'grid-example', // 개발자 그리드 예제
        element: <SvarGridExample />,
      },
    ],
  },
  {
    path: '*',
    element: <div>페이지를 찾을 수 없습니다. (404)</div>,
  },
]);

export default router;
