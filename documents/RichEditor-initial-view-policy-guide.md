# RichEditor `initialViewPolicy` 상세 동작 가이드

## 1. 문서 목적
- 대상 파일: `src/components/ui/RichEditor.jsx`
- 목적: `initialViewPolicy`가 어떤 조건에서 어떤 모드(HTML/WYSIWYG)로 진입하는지, 경고 표시 여부와 값 동기화 방식까지 코드 기준으로 상세 설명
- 범위: 초기 진입, 외부 `value` 재바인딩, HTML 복귀 시 경고 처리, 내부 `onChange` 에코 방지

## 2. 핵심 코드 위치
- 정책 상수/정규화
  - `HTML_VIEW_POLICIES`: `src/components/ui/RichEditor.jsx:194`
  - `normalizeInitialViewPolicy(...)`: `src/components/ui/RichEditor.jsx:196`
  - `shouldBootstrapInHtmlView(...)`: `src/components/ui/RichEditor.jsx:204`
- Props
  - `initialHtmlView`: `src/components/ui/RichEditor.jsx:236`
  - `initialViewPolicy = 'auto'`: `src/components/ui/RichEditor.jsx:237`
- 초기 상태/Ref
  - `resolvedInitialViewPolicy`: `src/components/ui/RichEditor.jsx:899`
  - `bootstrapHtmlView`: `src/components/ui/RichEditor.jsx:904`
  - `isHtmlView`, `htmlSource`: `src/components/ui/RichEditor.jsx:911`, `:912`
  - `lastExternalValueRef`, `lastInternalEmitValueRef`: `src/components/ui/RichEditor.jsx:922`, `:923`
  - `emitChangeValue(...)`: `src/components/ui/RichEditor.jsx:931`
- 정책 기반 `value` 동기화 effect
  - `src/components/ui/RichEditor.jsx:1665`
- 유실 감지/리포트
  - `detectHtmlLossOnRoundtrip(...)`: `src/components/ui/RichEditor.jsx:1083`
- HTML -> WYSIWYG 적용 시 경고
  - `applyHtmlSourceToEditor(...)`: `src/components/ui/RichEditor.jsx:1118`
- 경고 렌더 조건
  - `htmlRoundtripWarning?.hasLoss`: `src/components/ui/RichEditor.jsx:2465`, `:2476`

## 3. `initialViewPolicy` 입력값과 정규화
- 허용 정책: `'auto' | 'html' | 'wysiwyg'`
- 공백/대소문자 입력은 `trim().toLowerCase()`로 정규화 후 허용값 검사
- 허용값이 아니면 `initialHtmlView`로 하위 호환:
  - `initialHtmlView === true` -> `'html'`
  - `initialHtmlView === false` -> `'wysiwyg'`

정리:
1. 새 정책이 유효하면 새 정책 우선
2. 새 정책이 없거나 잘못되면 기존 `initialHtmlView` 기반으로 폴백

## 4. 초기 부트스트랩(첫 렌더) 규칙
첫 렌더에서 `isHtmlView` 초기값은 `bootstrapHtmlView`로 결정된다.

결정 함수:
- `shouldBootstrapInHtmlView(policy, sourceValue)`

규칙:
1. `policy === 'html'` 이면 무조건 HTML 시작
2. `policy === 'auto'` 또는 `'wysiwyg'` 이면 `sourceValue`가 비어있지 않을 때 HTML 시작
3. 그 외(실제론 없음)면 WYSIWYG 시작

중요 포인트:
- `wysiwyg` 정책이라도 **초기 `value`가 비어있지 않으면 일단 HTML로 부트스트랩**될 수 있다.
- 이유: 에디터 인스턴스가 준비된 뒤 loss-check 기반 최종 모드 결정을 안정적으로 수행하기 위해서다.

## 5. 런타임 `value` 동기화 알고리즘 (실제 최종 모드 결정)
정책의 실제 동작 핵심은 `useEffect`(`src/components/ui/RichEditor.jsx:1665`)에 있다.

### 5-1. 전처리
1. `editor` 없으면 중단
2. `nextValue`를 문자열로 정규화
3. 직전 외부값(`lastExternalValueRef`)과 같으면 중단

### 5-2. 내부 에코(onChange 왕복) 차단
1. `lastInternalEmitValueRef.current === nextValue`면 내부 에코로 판단
2. 내부 에코인 경우:
  - 플래그만 해제
  - 현재 HTML 모드면 `htmlSource`만 동기화
  - 모드 강제 전환/유실 검사 없음

### 5-3. 정책 분기
공통으로 `htmlPreviewNotice`는 먼저 클리어한다.

#### A) `policy === 'html'`
1. `htmlSource` 동기화
2. 경고 클리어
3. HTML 모드 강제 유지 (`setIsHtmlView(true)`)
4. `setContent` 호출하지 않음

#### B) `nextValue`가 빈 문자열
1. 경고 클리어
2. WYSIWYG 모드로 복귀
3. `editor.getHTML() !== nextValue`면 `setContent('', false)`

#### C) 비어있지 않은 값 -> 유실 검사 수행
1. `detectHtmlLossOnRoundtrip(nextValue)` 호출
2. `report.hasLoss === true`:
   - `htmlSource` 동기화
   - `policy === 'auto'` -> 경고 **표시하지 않음** (`setHtmlRoundtripWarning(null)`)
   - `policy === 'wysiwyg'`/`'html'` 경로 -> 경고 리포트 세팅
   - HTML 모드로 전환/유지
3. `report.hasLoss === false`:
   - 경고 클리어
   - WYSIWYG 모드 전환
   - 에디터 내용이 다르면 `setContent(nextValue, false)`

## 6. 정책별 동작 매트릭스
| 정책 | 외부 `value` 상태 | 유실 감지 | 최종 모드 | 초기 경고 표시 |
|---|---|---|---|---|
| `auto` | 빈 값 | 검사 안 함 | WYSIWYG | 없음 |
| `auto` | 비어있지 않음 | `hasLoss=true` | HTML | 없음 (의도적 suppress) |
| `auto` | 비어있지 않음 | `hasLoss=false` | WYSIWYG | 없음 |
| `html` | 값 무관 | 실질적으로 모드 결정에 불필요 | HTML 고정 | 없음 |
| `wysiwyg` | 빈 값 | 검사 안 함 | WYSIWYG | 없음 |
| `wysiwyg` | 비어있지 않음 | `hasLoss=true` | HTML(보호 전환) | 있음 |
| `wysiwyg` | 비어있지 않음 | `hasLoss=false` | WYSIWYG | 없음 |

## 7. 경고(`htmlRoundtripWarning`) 표시 규칙
경고 UI는 HTML 뷰에서만 렌더되며, 조건은 아래 둘 중 하나다.
1. `htmlPreviewNotice` 존재
2. `htmlRoundtripWarning?.hasLoss === true`

즉, `auto`에서 hasLoss여도 경고를 null로 유지하면 경고 박스는 보이지 않는다.

## 8. 수동 복귀(HTML -> WYSIWYG) 시 경고 규칙
`applyHtmlSourceToEditor({ force = false })` 기준:
1. `force=false`면 적용 전 loss-check 수행
2. `hasLoss=true`면 경고 세팅 후 즉시 반환 (HTML 모드 유지)
3. `hasLoss=false`면 `setContent` 후 WYSIWYG 복귀
4. `force=true`면 loss-check 차단 없이 강제 적용

중요:
- `auto` 정책이라도 **수동 복귀 시도 시에는 경고가 정상 표시**된다.
- 즉, `auto`의 경고 suppress 범위는 “초기/외부값 판정”에 한정된다.

## 9. `onChange`와 내부 에코 분리 이유
문제 배경:
- HTML 모드 textarea 편집 -> `onChange` -> 부모 state 갱신 -> `value` 재주입 흐름이 빠르게 반복됨
- 이를 외부값으로 오인하면 모드가 흔들리거나 경고가 재점화될 수 있음

현재 처리:
1. 컴포넌트 내부에서 부모로 값을 내보낼 때 `emitChangeValue` 사용
2. 이 함수가 `lastInternalEmitValueRef`에 값 기록 후 부모 `onChange` 호출
3. 이후 effect에서 같은 값이 다시 들어오면 내부 에코로 인식하여 강한 재동기화 로직을 건너뜀

결과:
- HTML 편집 중 안정성 확보
- 불필요한 모드 전환/경고 재발 방지

## 10. 모드 전환 우선순위
동일 시점에 여러 조건이 겹칠 때의 실질 우선순위:
1. 내부 에코 차단 (`lastInternalEmitValueRef`)
2. `html` 정책 강제 유지
3. 빈 값 처리(WYSIWYG 복귀)
4. loss-check 결과 기반 분기(`auto` suppress 포함)

## 11. 토글 버튼 수동 전환과 정책의 역할 분리
- `initialViewPolicy`는 “초기/외부 `value` 동기화 시 기본 진입 전략”을 정의한다.
- 사용자가 툴바 토글 버튼으로 직접 전환할 때는 별도 경로(`onClick`, `applyHtmlSourceToEditor`)가 동작한다.
- 따라서 정책만으로 수동 전환 로직(경고 차단/강제 적용)이 바뀌지는 않는다.

## 12. 운영 권장안
1. 레거시 HTML 유실 리스크가 큰 화면:
   - `initialViewPolicy="auto"` 권장
   - 이유: 초기 진입 시 사용자에게 경고 스팸 없이 HTML 안전 모드로 시작 가능
2. 항상 소스 편집 우선 화면:
   - `initialViewPolicy="html"`
3. WYSIWYG 우선이지만 유실 가능성은 알려야 하는 화면:
   - `initialViewPolicy="wysiwyg"`

## 13. 수동 QA 체크리스트
1. `auto` + 유실 HTML 데이터 로드
   - 기대: HTML 모드 시작, 경고 미표시
2. 같은 상태에서 `WYSIWYG로 돌아가기` 클릭
   - 기대: 경고 표시, HTML 모드 유지
3. `유실 감수하고 복귀` 클릭
   - 기대: WYSIWYG 복귀
4. `wysiwyg` + 유실 HTML 데이터 로드
   - 기대: HTML 모드로 보호 전환 + 경고 표시
5. `html` 정책
   - 기대: 값 변경/재조회 상황에서도 HTML 모드 유지
