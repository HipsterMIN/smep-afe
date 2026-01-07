import {createBrowserRouter, Navigate} from 'react-router-dom';

import Admin from '../Admin.jsx';
import Contentbox from '../components/ui/Contentbox.jsx';
import PublishingMain from "../publishing/PublishingMain.jsx";
import SvarGridExample from '../SvarGridExample.jsx';
import {autoPublishingRoutes} from "./autoRoutes.jsx";

const router = createBrowserRouter([
        {
            path: '/',
            element: <Admin/>,
            children: [
                {
                    path: 'common-code', // type1: 공통코드 관리
                    element: <Contentbox contentType="type1"/>,
                },
                {
                    path: 'auth-mgmt', // type2: 권한 관리
                    element: <Contentbox contentType="type2"/>,
                },
                {
                    path: 'menu-mgmt', // type3: 관리자 메뉴관리
                    element: <Contentbox contentType="type3"/>,
                },
                {
                    path: 'board-mgmt', // type4: 게시판 관리
                    element: <Contentbox contentType="type4"/>,
                },
                {
                    path: 'biz-info', // type5: 사업정보 관리
                    element: <Contentbox contentType="type5"/>,
                },
                {
                    path: 'biz-reg', // type6: 사업정보 등록/수정
                    element: <Contentbox contentType="type6"/>,
                },
                {
                    path: 'grid-example', // 개발자 그리드 예제
                    element: <SvarGridExample/>,
                },
            ],
        },
        {
            path: '/publishing',
            element: <PublishingMain/>,
            children: [
                {
                    index: true,
                    element: (
                        <div style={{textAlign: 'center', paddingTop: '100px', color: '#999'}}>
                            <h3>왼쪽 메뉴에서 확인할 페이지를 선택해주세요.</h3>
                        </div>
                    ),
                },
                ...autoPublishingRoutes,
            ],
        },
        {
            path: '*',
            element: <div>페이지를 찾을 수 없습니다. (404)</div>,
        },
    ], {
        basename: '/admin', // 이 설정으로 인해 코드 상의 '/'는 실제 브라우저에서 '/admin'이 됩니다.
    }
);

export default router;
