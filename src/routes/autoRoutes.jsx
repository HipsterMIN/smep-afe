import React, {lazy, Suspense} from 'react';

// src/pages/publishing 하위의 모든 .jsx 파일을 가져옵니다.
const modules = import.meta.glob('../publishing/*.jsx');

export const autoPublishingRoutes = Object.keys(modules).map((path) => {
    // 파일 경로에서 파일명만 추출 (예: ../pages/publishing/UserList.jsx -> UserList)
    const fileName = path.split('/').pop().replace('.jsx', '');

    // PublishingMain.jsx는 레이아웃이므로 자동 라우팅 목록에서 제외합니다.
    if (fileName === 'PublishingMain') return null;

    const PageComponent = lazy(modules[path]);

    return {
        path: fileName.toLowerCase(), // URL 경로를 소문자로 설정
        element: (
            <Suspense fallback={<div>Loading...</div>}>
                <PageComponent/>
            </Suspense>
        ),
    };
}).filter(Boolean); // null 값(PublishingMain) 제거