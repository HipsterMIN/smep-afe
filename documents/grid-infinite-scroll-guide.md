# Grid Infinite Scroll 적용 가이드

## Quickstart
아래 4단계로 무한스크롤 + 헤더고정을 동일 패턴으로 적용합니다.

1. 페이지에 훅 import 추가
```jsx
import useGridInfiniteScroll from '@components/ui/useGridInfiniteScroll.js';
```

2. 뷰포트 ref/로딩 ref 준비
```jsx
const gridViewportRef = useRef(null);
const loadingRef = useRef(false);
const [loading, setLoading] = useState(false);
const [hasNext, setHasNext] = useState(true);
const [cursor, setCursor] = useState(null);
```

3. fetch 함수에 공통 가드 적용
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

4. 훅 연결 + 내부 스크롤 viewport 구성
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
      <div
        ref={gridViewportRef}
        style={{
          height: 'max(420px, calc(100dvh - 390px))',
          overflow: 'hidden',
        }}
      >
        <GridTable data={rows} columns={columns} useWillow={false} />
      </div>
    </Willow>
  </div>
);
```

Header 고정-only 패턴은 별도 문서 사용:
- `documents/grid-header-fixed-only-guide.md`

---

## 1. 목적
페이지별로 흩어진 `IntersectionObserver`/`scroll listener`를 공통 훅으로 통일해
무한스크롤 동작과 헤더고정 동작을 일관되게 유지합니다.

현재 기준 적용 파일:
- `src/components/ui/useGridInfiniteScroll.js`
- `src/pages/business/policy-finance/policyFinanceList.jsx`
- `src/pages/support-business/SupportBusiness.jsx`
- `src/pages/public-announcement/PublicAnnouncement.jsx`
- `src/pages/board/BbsList.jsx`
- `src/pages/board/BbsInfoList.jsx`
- `src/pages/access/AccessAllowIp.jsx`

## 2. 공통 훅 API
`useGridInfiniteScroll(options)`

옵션:
- `viewportRef`: Grid를 감싸는 viewport div ref
- `loading`: React state 로딩 여부
- `loadingRef`: 중복 호출 방지용 ref
- `hasNext`: 다음 페이지 존재 여부
- `onLoadMore`: 추가 조회 실행 함수
- `threshold`(optional): 하단 트리거 거리(px), 기본 `80`

동작:
1. `viewportRef.current` 안에서 `.wx-scroll` 탐색
2. scroll 이벤트 등록
3. `remain = scrollHeight - scrollTop - clientHeight` 계산
4. `remain <= threshold`일 때 `onLoadMore()` 실행
5. 언마운트/의존성 변경 시 이벤트 제거

## 3. 적용 규칙
1. Grid는 내부 스크롤 모드로 유지한다.
2. viewport 높이는 페이지 인라인 스타일로 관리한다.
3. `GridTable`는 `useWillow={false}`로 두고, 외부에서 `Willow`로 감싼다.
4. load-more는 공통 훅으로만 처리한다.
5. 페이지 내 직접 `IntersectionObserver`/`scroll` 리스너를 추가하지 않는다.

## 4. 적용 절차
1. 기존 observer/scroll `useEffect` 제거
2. `useGridInfiniteScroll` import 및 호출 추가
3. `fetchList`에 `loadingRef` 가드 추가
4. Grid 마크업을 아래 형태로 통일
```jsx
<Willow>
  <div
    ref={gridViewportRef}
    style={{
      height: 'max(420px, calc(100dvh - 390px))',
      overflow: 'hidden',
    }}
  >
    <GridTable columns={columns} data={rows} useWillow={false} />
  </div>
</Willow>
```

## 5. 파라미터 기준
### 5.1 `height`
- 표준식: `max(420px, calc(100dvh - 390px))`
- 기본은 표준식을 사용하고, 페이지 구조에 따라 `390`만 조정한다.

### 5.2 `threshold`
- 기본값 `80`부터 시작
- 잦은 호출 시 `40~60`
- 늦은 호출 시 `100~160`

## 6. 트러블슈팅
### 헤더가 고정되지 않음
- viewport 높이 지정 여부 확인
- viewport `overflow: 'hidden'` 확인
- `Willow` 중복 래핑 여부 확인

### load-more 중복 호출
- `loadingRef` true/false 전환 확인
- `hasNext`/`nextCursor` 갱신 확인

### 첫 진입 시 추가 호출이 바로 일어남
- 정상 동작일 수 있음
- 훅이 초기 1회 `handleGridScroll()`을 실행해 빈 화면을 채움

## 7. 코드 리뷰 체크리스트
- [ ] observer/직접 scroll listener를 제거했는가
- [ ] `useGridInfiniteScroll`를 사용했는가
- [ ] `fetchList` 가드(`loadingRef`, `hasNext`)가 있는가
- [ ] viewport 높이와 `overflow: hidden`이 지정되었는가
- [ ] `GridTable useWillow={false}` + 외부 `Willow`가 유지되는가
