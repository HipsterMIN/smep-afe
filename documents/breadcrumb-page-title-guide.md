# Breadcrumb `pageTitle` 적용 가이드

## 목적
아래 패턴으로 페이지 타이틀과 브레드크럼브를 동일한 값으로 맞춥니다.

```jsx
<div className="oncontentTitle">
  <h2>{pageTitle}</h2>
  <Breadcrumb pageTitle={pageTitle} />
</div>
```

## 적용 규칙
1. `pageTitle`은 `route handle.menuNm`을 우선 사용합니다.
2. `menuNm`이 없으면 `'통합로그인 사이트 목록'`을 fallback으로 사용합니다.

## 구현 방법
1. 파일 상단에 `useMatches`를 추가합니다.

```jsx
import { useMatches } from 'react-router-dom';
```

2. 컴포넌트 내부에서 `pageTitle`을 계산합니다.

```jsx
const matches = useMatches();
const routeMenuName =
  [...matches]
    .reverse()
    .map((match) => match?.handle?.menuNm)
    .find((menuNm) => typeof menuNm === 'string' && menuNm.trim()) || '';

const pageTitle = routeMenuName || '통합로그인 사이트 목록';
```

3. 타이틀 영역을 아래처럼 통일합니다.

```jsx
<div className="oncontentTitle">
  <h2>{pageTitle}</h2>
  <Breadcrumb pageTitle={pageTitle} />
</div>
```

## 체크 포인트
- `Breadcrumb`에는 `pageTitle`을 전달합니다.
- `h2`에도 동일한 `pageTitle`을 바인딩합니다.
- 하드코딩된 `<ul className="onbreadcrumb">...</ul>`은 제거합니다.
