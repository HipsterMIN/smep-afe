# Grid Infinite Scroll 적용 가이드

## Quickstart (먼저 이대로 적용)
아래 4단계만 하면 기존 패턴과 동일하게 동작합니다.

1. 페이지에 훅 import 추가
```jsx
import useGridInfiniteScroll from '@components/ui/useGridInfiniteScroll.js';
```

2. 뷰포트 ref 준비
```jsx
const gridViewportRef = useRef(null);
const loadingRef = useRef(false);
const [loading, setLoading] = useState(false);
const [hasNext, setHasNext] = useState(true);
const [cursor, setCursor] = useState(null);
```

3. fetch 함수는 기존처럼 유지 (`loadingRef`, `hasNext`, `cursor` 관리)
```jsx
const fetchList = async (nextCursor = null, reset = false) => {
  if (loadingRef.current) return;
  if (!hasNext && !reset) return;

  loadingRef.current = true;
  setLoading(true);
  try {
    // API 호출 + rows append + cursor/hasNext 갱신
  } finally {
    loadingRef.current = false;
    setLoading(false);
  }
};
```

4. 스크롤 훅 연결 + Grid viewport 높이 고정
```jsx
useGridInfiniteScroll({
  viewportRef: gridViewportRef,
  loading,
  loadingRef,
  hasNext,
  onLoadMore: () => fetchList(cursor, false),
});

return (
  <div className="ongrid-tableform">
    <Willow>
      <div ref={gridViewportRef} style={{ height: 500, overflow: 'hidden' }}>
        <GridTable data={rows} columns={columns} useWillow={false} />
      </div>
    </Willow>
  </div>
);
```

---

## 1. 이 가이드의 목적
중복된 Grid 내부 스크롤 `useEffect` 코드를 페이지마다 복붙하지 않고,  
공통 훅(`useGridInfiniteScroll`)으로 일관되게 적용하기 위한 실전 가이드입니다.

현재 기준 적용 파일:
- `src/components/ui/useGridInfiniteScroll.js`
- `src/pages/business/policy-finance/policyFinanceList.jsx`
- `src/pages/support-business/SupportBusiness.jsx`

## 2. 공통 훅 API
`useGridInfiniteScroll(options)`

옵션:
- `viewportRef`: Grid를 감싸는 viewport div ref
- `loading`: React state 로딩 여부
- `loadingRef`: 중복 호출 방지용 ref (`true`면 재호출 차단)
- `hasNext`: 다음 페이지 존재 여부
- `onLoadMore`: 추가 조회 실행 함수
- `threshold`(optional): 하단 트리거 거리(px), 기본 `80`

동작 요약:
1. `viewportRef.current` 내부에서 `.wx-scroll` 요소를 찾음
2. 스크롤 이벤트 등록
3. `remain = scrollHeight - scrollTop - clientHeight` 계산
4. `remain <= threshold`이면 `onLoadMore()` 호출
5. 언마운트/의존성 변경 시 이벤트 제거

## 3. 적용 규칙 (팀 공통)
1. Grid는 내부 스크롤 모드로 사용한다.
2. viewport 높이는 페이지 인라인 스타일로 직접 지정한다.
3. `GridTable`는 `useWillow={false}`로 두고, 페이지에서 `Willow`를 감싼다.
4. load-more 감지는 공통 훅만 사용하고, 페이지 내 직접 `scroll` 리스너를 만들지 않는다.

## 4. 왜 이 구조를 쓰는가
- 헤더 고정은 Grid 내부 스크롤 컨텍스트가 안정적으로 잡혀야 동작한다.
- viewport 높이를 명시하면 스크롤 주체가 페이지가 아니라 Grid 내부가 된다.
- `Willow`를 페이지에서 명시적으로 감싸면, 레이아웃/높이 제어 의도가 코드에서 드러난다.
- 무한스크롤 로직을 훅으로 분리해 중복 제거 + 회귀 리스크를 줄인다.

## 5. 페이지 적용 절차 (상세)
1. 기존 `useEffect` 기반 scroll listener 구간을 찾는다.
2. 동일 파일 상단에 `useGridInfiniteScroll` import 추가.
3. 기존 scroll `useEffect`를 제거한다.
4. `useGridInfiniteScroll({...})` 호출을 추가한다.
5. Grid 마크업이 아래 형태인지 확인한다.
```jsx
<Willow>
  <div ref={gridViewportRef} style={{ height: 500, overflow: 'hidden' }}>
    <GridTable columns={columns} data={rows} useWillow={false} />
  </div>
</Willow>
```
6. `fetchList` 내부에 아래 2가지 가드가 반드시 있는지 확인한다.
- `if (loadingRef.current) return;`
- `if (!hasNext && !reset) return;`

## 6. 파라미터 결정 기준
### 6.1 `height`
- 업무 화면 UX 기준으로 페이지 개발자가 결정한다.
- 값이 작으면 스크롤 구간이 짧아지고 load-more가 자주 발생한다.
- 값이 크면 한 번에 더 많은 행을 보지만, 첫 인지 구간이 길어진다.

권장 시작값:
- 일반 목록: `480 ~ 560`
- 행 높이가 큰 목록: `560+`

### 6.2 `threshold`
- 기본값 `80`을 먼저 사용한다.
- 잦은 API 호출이 보이면 값을 줄인다 (`40~60`).
- 하단에서 로딩 체감이 늦으면 값을 올린다 (`100~160`).

### 6.3 `useWillow`
- 페이지에서 레이아웃을 명확히 제어할 때: `GridTable useWillow={false}` + 외부 `Willow` 래핑
- 단순 페이지(빠른 구축): `GridTable` 기본값(`useWillow=true`) 사용 가능

## 7. 내부 스크롤 vs 페이지 스크롤
이 가이드는 **내부 스크롤 방식** 기준입니다.

내부 스크롤 방식:
- viewport 높이 고정
- Grid 영역 내부에서만 스크롤
- 헤더 고정에 유리

페이지 스크롤 방식:
- 문서 전체 스크롤 기준으로 load-more
- 헤더 고정/레이아웃 일관성 관리가 어려워질 수 있음

## 8. 트러블슈팅
### 증상 1: 헤더가 고정되지 않고 같이 움직임
확인:
- viewport 높이가 고정되어 있는가 (`style={{ height: ... }}`)
- viewport에 `overflow: 'hidden'`이 있는가
- Grid가 내부 스크롤을 가지는 구조인가
- `Willow` 중복 래핑이 없는가 (`GridTable useWillow`와 외부 `Willow` 확인)

### 증상 2: load-more가 너무 빨리/늦게 호출됨
확인:
- `threshold` 값 조정
- `loadingRef` 가드 누락 여부
- `hasNext` 갱신 로직 정확성

### 증상 3: 같은 페이지가 중복 조회됨
확인:
- `loadingRef.current` true/false 전환 누락 여부
- API 응답의 `nextCursor`, `hasNext` 처리
- `onLoadMore`가 stale cursor를 참조하지 않는지 확인

### 증상 4: 최초 진입 시 스크롤이 없어 추가 조회가 안 됨
설명:
- 훅 내부에서 `handleGridScroll()`을 최초 1회 즉시 호출하므로,  
  컨텐츠 높이가 viewport보다 작으면 자동으로 다음 조회가 이어질 수 있습니다.

## 9. 코드 리뷰 체크리스트
- [ ] scroll listener를 페이지에서 직접 만들지 않았는가
- [ ] `useGridInfiniteScroll`로 통일했는가
- [ ] `fetchList` 가드 (`loadingRef`, `hasNext`)가 있는가
- [ ] Grid viewport 높이가 페이지 의도대로 명시되어 있는가
- [ ] `Willow` 래핑과 `useWillow` 설정이 중복/충돌하지 않는가
- [ ] 검색(reset) 시 `cursor`/`hasNext` 초기화가 되는가

## 10. 현재 레퍼런스 구현
- `policyFinanceList.jsx`: 높이 `480`, 내부 스크롤 + 공통 훅 적용
- `SupportBusiness.jsx`: 높이 `510`, 내부 스크롤 + 공통 훅 적용

둘 다 같은 구조를 사용하므로, 신규 페이지는 이 패턴을 그대로 복제하면 됩니다.

