## SMEP 고도화 프로젝트 내 LUSY 프레임워크 도입 전략

### 1. 개요
본 보고서는 현재 진행 중인 **SMEP(Smart Manufacturing Execution Platform)** 프런트엔드 프로젝트(`smep-afe`)에 통합 UI 프레임워크인 **LUSY**를 성공적으로 도입하고 안착시키기 위한 심층 분석 및 실행 로직을 제안합니다. 현재 프로젝트는 Vite + React 18 기반으로 구축되어 있으며, 이미 일부 LUSY의 개념적 컴포넌트(FileUpload, RichEditor 등)가 포함되어 있어 도입의 최적기입니다.

---

### 2. 현황 분석 및 도입 필요성
*   **기술 스택 일치**: 프로젝트가 이미 React 18, Zustand, Vite를 사용하고 있어 LUSY 프레임워크의 기술적 요구사항과 완벽히 부합합니다.
*   **컴포넌트 파편화 방지**: 현재 `src/components` 내에 개별적으로 구현된 컴포넌트들을 LUSY 표준으로 통합하여 유지보수 비용을 절감해야 합니다.
*   **보안 및 접근성 준수**: 공공기관/기업용 플랫폼 특성상 엄격한 XSS 방지 및 웹 접근성(WA) 준수가 필수적이며, 이는 LUSY의 핵심 가치와 일치합니다.

---

### 3. 심층 도입 전략 (4단계)

#### 단계 1: LUSY 코어 환경 설정 (Foundation)
LUSY의 표준 규칙과 공통 설정을 프로젝트 전반에 이식합니다.
*   **ESLint/Prettier 동기화**: 이미 설정된 `eslint.config.js`의 보안 규칙(`react/no-danger`)과 접근성 규칙(`jsx-a11y/*`)을 LUSY 표준 가이드라인에 맞춰 최종 확정합니다.
*   **Global Style 가동**: `src/index.css`를 LUSY의 디자인 시스템(Design Tokens) 기반 테마 변수로 교체하여 전역 스타일 일관성을 확보합니다.

#### 단계 2: 레이아웃 및 공통 컴포넌트 표준화 (Standardization)
현재 개별 구현된 컴포넌트들을 LUSY의 구조적 설계(Atomic Design 기반)로 재편합니다.
*   **Layout 통합**: `MainLayout.jsx`를 LUSY의 표준 레이아웃 엔진으로 교체하고, `AuthContext`와 연동하여 세션 관리 및 권한별 메뉴 노출 로직을 표준화합니다.
*   **Atomic 컴포넌트 전환**: `components/ui/Button` 등 기초 컴포넌트를 LUSY의 Core 컴포넌트로 교체합니다.
*   **복합 컴포넌트(Composite) 최적화**: `FileUpload.jsx` 및 `RichEditor.jsx`를 LUSY에서 제공하는 고도화된 버전으로 업그레이드하여 에러 핸들링과 XSS 필터링 기능을 강화합니다.

#### 단계 3: 데이터 흐름 및 상태 관리 통합 (Integration)
*   **Store 구조화**: `src/store/useCounterStore.js`와 같은 단편적인 상태 관리를 LUSY의 전역 상태 관리 패턴(Zustand 기반 모델링)으로 확장합니다.
*   **API 통신 모듈 표준화**: `axios` 인스턴스를 LUSY의 공통 Interceptor와 결합하여 환경별(Dev, Prod) API 베이스 URL 설정 및 공통 에러 처리를 자동화합니다.

#### 단계 4: 환경별 배포 자동화 (Deployment)
*   **Multi-Mode 빌드**: `package.json`의 스크립트를 LUSY의 배포 규격에 맞춰 `local`, `dev`, `prod`로 정교화합니다.
*   **Vite 환경 변수 정립**: `.env.development`, `.env.production` 등에 정의된 `VITE_API_BASE_URL` 등을 LUSY의 설정 파일과 동기화합니다.

---

### 4. 핵심 도입 체크리스트 (Technical Checklist)

| 구분 | 항목 | 세부 내용 |
| :--- | :--- | :--- |
| **보안** | XSS 방어 | `dangerouslySetInnerHTML` 사용 전면 금지 및 Sanitize 처리 확인 |
| **접근성** | WA 준수 | `SkipNav` 동작 확인 및 모든 Interactive 요소의 키보드 접근성 확보 |
| **성능** | 코드 스플리팅 | LUSY 컴포넌트 로딩 시 `React.lazy`를 통한 번들 크기 최적화 |
| **유지보수** | 정렬 규칙 | `simple-import-sort`를 통한 임포트 구문 표준화 준수 여부 |

---

### 5. 도입 후 기대 효과
1.  **개발 속도 30% 이상 향상**: 검증된 LUSY 컴포넌트 조합으로 화면 개발 기간 단축.
2.  **무결점 보안 확보**: 프레임워크 수준에서의 XSS 및 보안 취약점 사전 차단.
3.  **UI/UX 일관성**: SMEP 플랫폼 전체의 톤앤매너(Look & Feel) 통일.
4.  **인수인계 용이성**: 표준화된 코드 구조로 인한 신규 투입 인력의 빠른 적응.

### 6. 결론
현재 `smep-afe` 프로젝트의 초기 구조는 LUSY를 수용할 준비가 충분히 되어 있습니다. 1단계 환경 설정부터 순차적으로 도입을 진행하되, 특히 보안이 중요한 **에디터와 파일 업로드 모듈**부터 LUSY 표준으로 전환하는 것을 최우선 과제로 권장합니다.

---
**작성일:** 2025-12-18
