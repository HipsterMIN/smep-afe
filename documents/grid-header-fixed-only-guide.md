# Grid Header Fixed-Only 적용 가이드

## Quickstart
무한스크롤이 필요 없고 헤더만 고정하려면 아래 구조로 적용합니다.

```jsx
return (
  <div className="ongrid-tableform">
    <Willow>
      <div
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

---

## 1. 목적
페이지 스크롤이 아니라 Grid 내부 스크롤로 전환해
헤더가 항상 고정되도록 만드는 패턴입니다.

현재 레퍼런스:
- `src/pages/menu/MenuBase.jsx` (`MenuUser`, `MenuAdmin` 공통)

## 2. 적용 규칙
1. Grid 외부 컨테이너(`ongrid-tableform`)에 스크롤을 주지 않는다.
2. `Willow`는 외부에서 명시적으로 감싼다.
3. `GridTable`는 `useWillow={false}`로 중복 래핑을 방지한다.
4. viewport div에 인라인으로 높이/overflow를 지정한다.
5. Infinite scroll 훅(`useGridInfiniteScroll`)은 사용하지 않는다.

## 3. 적용 절차
1. 기존 외부 스크롤 클래스(`onSCrollBox`, `overflow-y:auto`) 제거
2. `Willow + viewport + GridTable` 구조로 교체
3. viewport style 적용
```jsx
style={{
  height: 'max(420px, calc(100dvh - 390px))',
  overflow: 'hidden',
}}
```
4. 기능 회귀 확인
- 정렬/필터/행 클릭
- 커스텀 cell 버튼 이벤트
- tree grid의 경우 `gridProps.ref` API 호출(`open-row`, `close-row`)

## 4. 높이 식 기준
기준식:
- `max(420px, calc(100dvh - 390px))`

의미:
- 최소 `420px` 보장
- 화면이 커지면 `100dvh - 390px`만큼 확장
- 상한은 두지 않음

조정 기준:
- 그리드가 너무 작다: `390px` 값을 줄임 (`360`, `330`)
- 그리드가 너무 크다: `390px` 값을 키움 (`420`, `450`)

## 5. 트러블슈팅
### 헤더가 같이 스크롤됨
- viewport 높이 지정 누락 여부 확인
- viewport `overflow: hidden` 누락 여부 확인
- 외부 컨테이너에 `overflow-y:auto`가 남아있는지 확인

### 그리드가 너무 높거나 낮음
- `calc(100dvh - Npx)`의 `N`만 조정
- 작은 화면에서 너무 작으면 `max`의 최소값을 올림 (`420 -> 460`)

### `Willow`가 중복됨
- `GridTable` 기본 `useWillow=true`와 외부 `Willow`를 동시에 쓰지 않도록
  `useWillow={false}` 확인

## 6. 코드 리뷰 체크리스트
- [ ] `onSCrollBox`/외부 스크롤 의존 제거
- [ ] `Willow` 외부 래핑 + `GridTable useWillow={false}`
- [ ] viewport 높이/overflow 인라인 지정
- [ ] 무한스크롤 훅 미사용(요구사항이 header-only인 경우)
- [ ] 화면 리사이즈 시 헤더 고정 유지 확인
