# Editor HTML 공통 유틸 가이드

## 문서 목적
`RichEditor`로 저장된 HTML 문자열을 상세 화면에서 **안전하게 렌더링**하기 위한
공통 유틸 사용법을 정리합니다.

대상 유틸:
- `src/utils/editorHtmlUtils.js`

제공 API:
- `sanitizeHtml(value)`
- `renderEditorHtml(value, emptyText = '-')`

## 왜 필요한가
`RichEditor` 값은 DB에 HTML 문자열로 저장됩니다.
상세 화면에서 단순 텍스트 출력(`{value}`)을 하면 태그가 문자열 그대로 보입니다.

예:
- 입력: `<p>상품목적</p><ol><li>항목1</li></ol>`
- 텍스트 출력: `<p>상품목적</p><ol>...`
- HTML 렌더 출력: 문단/목록 형태로 정상 표시

## 동작 원리
`renderEditorHtml`은 아래 순서로 동작합니다.
1. `sanitizeHtml`로 위험 요소 제거
2. DOM 파싱 후 허용 태그/속성만 React 노드로 변환
3. 렌더 가능한 노드가 없으면 fallback(`-`) 반환

보안 처리 핵심:
- 제거 태그: `script`, `style`, `iframe`, `object`, `embed`, `link`, `meta`
- 제거 속성: `on*` 이벤트 속성 전부
- 차단 URL: `href/src`의 `javascript:` 프로토콜
- 허용 태그/속성 allow-list 기반 변환

## 빠른 사용법
```jsx
import { renderEditorHtml } from '@utils/editorHtmlUtils.js';

<td>{renderEditorHtml(detail.plcyFnncGdsPrpsCn)}</td>
```

빈 값 커스텀:
```jsx
<td>{renderEditorHtml(detail.descriptionHtml, '내용 없음')}</td>
```

## 정책금융 적용 예시
현재 적용 위치:
- `src/pages/business/policy-finance/components/policyFinanceDetailLoan.jsx`
- `src/pages/business/policy-finance/components/policyFinanceDetailGuarantee.jsx`
- `src/pages/business/policy-finance/components/policyFinanceDetailInsurance.jsx`

공통 스타일(문단/리스트 여백)은 다음 화면에서 관리:
- `src/pages/business/policy-finance/policyFinanceDetail.jsx`

## 권장 스타일
렌더된 HTML 컨테이너 클래스는 `.editor-html-content`입니다.
화면별로 최소 스타일을 같이 두는 것을 권장합니다.

```css
.editor-html-content p,
.editor-html-content ul,
.editor-html-content ol {
  margin: 0 0 8px 0;
}
.editor-html-content ul,
.editor-html-content ol {
  padding-left: 20px;
}
.editor-html-content p:last-child,
.editor-html-content ul:last-child,
.editor-html-content ol:last-child {
  margin-bottom: 0;
}
```

## 주의사항
- 이 유틸은 실무용 경량 방어입니다. 고도화 보안 요건이 있으면 전용 sanitize 라이브러리 검토가 필요합니다.
- 서버 사이드 렌더링 환경에서는 DOMParser를 쓰지 못하므로 fallback 문자열 경로를 사용합니다.
- 외부 HTML을 그대로 신뢰하지 말고, 반드시 `renderEditorHtml` 경유를 권장합니다.

## 체크리스트
- 에디터 필드를 상세에서 출력할 때 `toDisplayText` 대신 `renderEditorHtml` 사용
- 리스트/문단 스타일이 깨지지 않도록 `.editor-html-content` CSS 적용
- 링크/이미지 렌더가 필요한 경우 허용 속성 범위(`editorHtmlUtils.js`) 점검
