# Grid Cell Action 공통 컴포넌트 가이드

## 문서 목적
이 문서는 `GridTable`의 `cell`에서 자주 반복되는 "값 클릭 + 이벤트 전파 차단" 패턴을
팀 공통 방식으로 빠르게 적용하기 위한 실전 가이드입니다.

다음 상황에서 바로 사용하면 됩니다.
- 행(row) 클릭 이벤트가 있는데, 특정 컬럼은 별도 클릭 동작을 가져야 할 때
- `data-action="ignore-click"` / `stopPropagation()` 코드를 화면마다 복붙하고 있을 때
- 값이 비어 있을 때 `-` 같은 fallback을 일관되게 표시하고 싶을 때

## 추가된 공통 파일
- `src/components/ui/GridCellActionButton.jsx`
- `src/components/ui/createGridValueActionCell.js`

## 왜 2개로 분리했나
- `GridCellActionButton`: 버튼 UI/이벤트 규칙 전담
- `createGridValueActionCell`: Grid cell에서 row 값 추출/표시/클릭 연결 전담

분리의 장점은 "표현(UI)과 데이터 바인딩(cell 생성)"을 분리해서
유지보수 시 수정 포인트를 좁힐 수 있다는 점입니다.

## 빠른 시작 (복붙용)
```jsx
import { createGridValueActionCell } from '@components/ui/createGridValueActionCell.js';

const nameCell = createGridValueActionCell({
  valueKey: 'bbsNm',
  fallback: '-',
  onClick: (row) => handleSelect(row),
  variant: 'link',
});

const columns = [
  { id: 'bbsNm', header: '게시판 명', cell: nameCell },
];
```

## 실제 적용 예시 (BbsInfoList)
```jsx
const bbsNameActionCell = createGridValueActionCell({
  valueKey: 'bbsNm',
  fallback: '-',
  onClick: (row) => handleSelect(row),
  variant: 'link',
});

const bbsColumns = [
  {
    id: 'bbsNm',
    width: 300,
    header: '게시판 명',
    dataAlign: 'left',
    cell: bbsNameActionCell,
  },
];
```

## 버튼형 셀 예시 (기존 className 그대로 사용)
```jsx
const selectCell = createGridValueActionCell({
  getValue: () => '선택',
  fallback: '선택',
  onClick: (row) => handleSelect(row),
  variant: 'button',
  className: 'defaultbutton edit',
});
```

## API 설명
`createGridValueActionCell(options)`의 `options`:
- `valueKey`: row에서 텍스트를 꺼낼 필드명
- `getValue(row)`: 텍스트 계산 함수 (`valueKey`보다 우선)
- `fallback`: 값이 `null/undefined/''`일 때 표시할 텍스트
- `onClick(row, event)`: 클릭 시 실행할 화면별 로직
- `variant`: `'link' | 'button'`
- `className`: 버튼형에서 기존 CSS 클래스 연결
- `style`: 인라인 스타일 확장
- `buttonProps`: `disabled`, `title` 같은 버튼 추가 속성

## 내부 동작 요약
- 공통 버튼은 항상 `data-action="ignore-click"`을 붙입니다.
- `onMouseDown`, `onPointerDown`, `onClick` 모두에서 전파를 차단합니다.
- `onClick` 시 `onClick(row, event)` 형태로 row를 넘겨줍니다.

## 주의사항
- row 클릭과 cell 버튼 클릭이 함께 있는 화면에서 특히 효과가 큽니다.
- button 스타일이 이미 CSS로 정해진 경우 `variant: 'button'` + `className` 사용을 권장합니다.
- 단일 화면에서 1회성으로만 쓰는 경우는 인라인 구현도 가능하지만, 2회 이상 반복되면 공통화 권장합니다.

