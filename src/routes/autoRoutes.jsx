import React, {lazy, Suspense} from 'react';

// src/pages/publishing 하위의 모든 .jsx 파일을 가져옵니다.
const modules = import.meta.glob('../publishing/*.jsx');

export const autoPublishingRoutes = Object.keys(modules).map((path) => {
    // 1. 파일 경로에서 순수 파일명 추출 및 확장자 제거, 앞뒤 공백 제거
    const fileName = path.split('/').pop().replace('.jsx', '').trim();

    // PublishingMain.jsx는 레이아웃이므로 자동 라우팅 목록에서 제외합니다.
    if (fileName === 'PublishingMain') return null;

    const PageComponent = lazy(modules[path]);

    // 2. URL로 사용하기 위해 모든 공백과 특수문자를 하이픈으로 대체 (소문자 변환)
    // 예: "UI-ADM-L-431 [공통코드관리] " -> "ui-adm-l-431-공통코드관리"
    const safePath = fileName
        .replace(/[^a-zA-Z0-9가-힣]/g, '-') // 영문, 숫자, 한글 제외 모두 -로 변경
        .replace(/-+/g, '-')               // 연속된 -를 하나로 축소
        .replace(/^-|-$/g, '')             // 시작과 끝의 - 제거
        .toUpperCase();

    return {
        path: safePath, // URL 경로를 소문자로 설정
        name: fileName,
        element: (
            <Suspense fallback={<div>Loading...</div>}>
                <PageComponent/>
            </Suspense>
        ),
    };
}).filter(Boolean); // null 값(PublishingMain) 제거