# SMEP-AFE — 장애 대응 런북 (Runbook)

> **버전**: 1.0.0 | **작성일**: 2026-05-20 | **대상 환경**: NHN Cloud K8s DMZ (운영)
>
> 이 문서는 실제 운영 클러스터 상태(2026-05-20 기준)를 바탕으로 작성되었습니다.  
> **DMZ 배스천(`tipa-prod-dmz-mgmt`)에서 실행합니다.**  
> (내부망 배스천과 별개의 클러스터입니다.)

---

## 목차

1. [서비스 개요](#1-서비스-개요)
2. [빠른 상태 점검 (First Check)](#2-빠른-상태-점검-first-check)
3. [장애 유형별 대응](#3-장애-유형별-대응)
   - [3-1. Pod 다운 / CrashLoopBackOff](#3-1-pod-다운--crashloopbackoff)
   - [3-2. 정적 파일 서비스 장애 (nginx 404/500)](#3-2-정적-파일-서비스-장애-nginx-404500)
   - [3-3. API 프록시 장애 (nginx → Admin BE 연결)](#3-3-api-프록시-장애-nginx--admin-be-연결)
   - [3-4. 관리자 로그인 페이지 장애](#3-4-관리자-로그인-페이지-장애)
   - [3-5. HPA 스케일 이상](#3-5-hpa-스케일-이상)
   - [3-6. 배포 실패 (ArgoCD)](#3-6-배포-실패-argocd)
   - [3-7. 롤백](#3-7-롤백)
4. [nginx 설정 구조 상세](#4-nginx-설정-구조-상세)
5. [smep-ufe vs smep-afe 차이점](#5-smep-ufe-vs-smep-afe-차이점)
6. [주요 명령어 레퍼런스](#6-주요-명령어-레퍼런스)
7. [연락처 및 에스컬레이션](#7-연락처-및-에스컬레이션)

---

## 1. 서비스 개요

### 운영 환경 (실제 kubectl 기준)

| 항목 | 값 |
|------|-----|
| Deployment | `smep-afe-prd` |
| Namespace | `smepfe` (DMZ 클러스터) |
| Replica | 1 (HPA: min 1, max 3, CPU 80%) |
| Service (ClusterIP) | `10.254.153.117:80` |
| 배스천 | `tipa-prod-dmz-mgmt` (**내부망과 다른 클러스터**) |
| 이미지 레지스트리 | NHN NCR or CubeI Flow Hub |
| 배포 방식 | ArgoCD + Helm |
| 서비스 | **관리자** 프론트엔드 (React/Vite 빌드, nginx 서빙) |

> ⚠️ smep-afe는 **관리자 전용** 프론트엔드입니다.  
> 접근 가능 인원이 제한되어 있으며, `smep-admin-prd`(내부망 관리자 BE)와 통신합니다.

### 서비스 트래픽 흐름

```
[관리자 브라우저]
        │
        ▼
[DMZ 클러스터 — tipa-prod-dmz-mgmt 배스천]
  namespace: smepfe
  smep-afe-prd (nginx, port 80)
        │
        ├── 정적 파일 서빙: /usr/share/nginx/html/
        │   컨텍스트: /admin-dev/* 또는 /admin/* → React SPA
        │
        └── API 프록시:
            /admin/api/     → proxy_pass http://smep-admin-dev.smepbe:8080
            /admin-dev/api/ → proxy_pass http://smep-admin-dev.smepbe:8080
            /api/           → proxy_pass http://smep-admin-dev.smepbe:8080 (호환용)
                                │
                                ▼
                [내부망 클러스터 — smepbe namespace]
                smep-admin-prd (ClusterIP: 10.254.162.249:8080)
                Context Path: /admin (prod), /admin-dev (dev)
```

### HPA 현황 (smep-afe vs smep-ufe 비교)

```
NAME           REFERENCE                  TARGETS       MINPODS   MAXPODS   REPLICAS
smep-afe-prd   Deployment/smep-afe-prd    cpu: 1%/80%   1         3         1
smep-ufe-prd   Deployment/smep-ufe-prd    cpu: 0%/80%   1         4         1
```

> 관리자 FE(smep-afe)는 최대 3개, 사용자 FE(smep-ufe)는 최대 4개로 스케일됩니다.

---

## 2. 빠른 상태 점검 (First Check)

**모든 명령어는 DMZ 배스천(`tipa-prod-dmz-mgmt`)에서 실행합니다.**

```bash
# 1. smep-afe-prd Pod 상태
kubectl get pod -n smepfe -l app.kubernetes.io/name=smep-afe -o wide
# 또는 (app 라벨이 다를 경우)
kubectl get pod -n smepfe | grep smep-afe

# 2. Pod 이벤트 확인
kubectl describe pod -n smepfe <AFE_POD> | tail -30

# 3. nginx 프로세스 및 설정 검증
AFE_POD=$(kubectl get pod -n smepfe | grep smep-afe | grep Running | awk '{print $1}' | head -1)
kubectl exec -n smepfe $AFE_POD -- nginx -t

# 4. nginx access/error 로그
kubectl exec -n smepfe $AFE_POD -- tail -50 /var/log/nginx/access.log
kubectl exec -n smepfe $AFE_POD -- tail -50 /var/log/nginx/error.log

# 5. 정적 파일 존재 확인
kubectl exec -n smepfe $AFE_POD -- ls -la /usr/share/nginx/html/

# 6. Admin BE API 프록시 연결 테스트 (DMZ → 내부망)
kubectl exec -n smepfe $AFE_POD -- \
  curl -s --connect-timeout 5 http://smep-admin-dev.smepbe:8080/admin/actuator/health

# 7. HPA 상태
kubectl get hpa smep-afe-prd -n smepfe

# 8. Service 상태
kubectl get svc smep-afe-prd -n smepfe
```

### 정상 상태 기준

```
pod/smep-afe-prd-xxxx   1/1     Running   0
service/smep-afe-prd    ClusterIP   10.254.153.117   80/TCP
nginx -t: nginx: configuration file /etc/nginx/nginx.conf test is successful
Admin BE health: {"status":"UP", "components":{"redis":{"status":"UP"}}}
```

---

## 3. 장애 유형별 대응

---

### 3-1. Pod 다운 / CrashLoopBackOff

#### 증상
- `kubectl get pod -n smepfe` 에서 `0/1 CrashLoopBackOff` 또는 `Error`
- 관리자 페이지 접속 불가

#### 진단

```bash
# Pod 상태 및 재시작 횟수
kubectl get pod -n smepfe | grep smep-afe

# 이전 인스턴스 로그 (종료 후)
kubectl logs -n smepfe <AFE_POD> --previous

# 이벤트 확인
kubectl describe pod -n smepfe <AFE_POD> | grep -A20 "Events:"
```

#### 원인별 조치

| 원인 | 로그/이벤트 키워드 | 조치 |
|------|-------------------|------|
| nginx 설정 오류 | `nginx: [emerg]`, `nginx -t failed` | nginx.conf 수정 후 재배포 |
| 이미지 풀 실패 | `ImagePullBackOff`, `ErrImagePull` | ImagePullSecret 재생성 |
| OOMKilled | `Exit Code: 137`, `OOMKilled` | 메모리 리소스 리밋 증가 |
| 정적 파일 없음 | `open() "/usr/share/nginx/html" failed` | 빌드 이미지 재빌드 |

```bash
# Pod 재시작
kubectl rollout restart deployment/smep-afe-prd -n smepfe
kubectl rollout status deployment/smep-afe-prd -n smepfe

# 이미지 풀 시크릿 재생성
kubectl delete secret ncr-secret -n smepfe 2>/dev/null
kubectl create secret docker-registry ncr-secret \
  --docker-server=<NCR_REGISTRY> \
  --docker-username=<USER> \
  --docker-password=<TOKEN> \
  -n smepfe
kubectl rollout restart deployment/smep-afe-prd -n smepfe
```

---

### 3-2. 정적 파일 서비스 장애 (nginx 404/500)

#### nginx 라우팅 구조 (smep-afe prod)

| 요청 경로 | nginx 처리 | 비고 |
|----------|-----------|------|
| `/admin/api/*` | `proxy_pass smep-admin-dev.smepbe:8080` | 운영 Admin BE API |
| `/admin-dev/api/*` | `proxy_pass smep-admin-dev.smepbe:8080` | 개발 Admin BE API |
| `/admin/actuator/*` | `proxy_pass smep-admin-dev.smepbe:8080` | Actuator 프록시 |
| `/admin-dev/actuator/*` | `proxy_pass smep-admin-dev.smepbe:8080` | Actuator 프록시 |
| `/admin/example` | `proxy_pass smep-admin-dev.smepbe:8080` | 테스트 엔드포인트 |
| `/api/*` | `proxy_pass smep-admin-dev.smepbe:8080` | 호환용 직접 API |
| `/admin/assets/*` | `access_log off;` | 정적 자산 |
| `/admin-dev/assets/*` | `alias /usr/share/nginx/html/assets/` | Vite 빌드 자산 |
| `/admin` | `try_files $uri /index.html` | React SPA fallback (운영) |
| `/admin-dev` | `alias /usr/share/nginx/html/; try_files` | React SPA fallback (개발) |

#### 진단

```bash
AFE_POD=$(kubectl get pod -n smepfe | grep smep-afe | grep Running | awk '{print $1}' | head -1)

# 정적 파일 디렉토리 확인
kubectl exec -n smepfe $AFE_POD -- ls -la /usr/share/nginx/html/
kubectl exec -n smepfe $AFE_POD -- ls /usr/share/nginx/html/assets/ 2>/dev/null | head -10

# index.html 존재 및 내용 확인
kubectl exec -n smepfe $AFE_POD -- test -f /usr/share/nginx/html/index.html && echo "OK" || echo "MISSING"

# nginx error 로그
kubectl exec -n smepfe $AFE_POD -- tail -100 /var/log/nginx/error.log | grep -E "open|failed|denied"

# HTTP 상태 코드 확인
kubectl exec -n smepfe $AFE_POD -- \
  curl -s -o /dev/null -w "%{http_code}" http://localhost/admin-dev/
kubectl exec -n smepfe $AFE_POD -- \
  curl -s -o /dev/null -w "%{http_code}" http://localhost/admin/

# X-Matched-By 헤더로 location block 확인
kubectl exec -n smepfe $AFE_POD -- \
  curl -s -I http://localhost/admin-dev/ | grep -E "HTTP|X-Matched"
```

#### 조치

```bash
# Case 1: 빌드 파일 없음 → 이미지 재빌드 (npm run build:prod) 후 재배포
# Case 2: SPA 라우팅 오류 → try_files 설정 확인 (ArgoCD Helm values nginx configmap)
# Case 3: 임시 조치 — nginx 무중단 reload
kubectl exec -n smepfe $AFE_POD -- nginx -s reload
```

---

### 3-3. API 프록시 장애 (nginx → Admin BE 연결)

#### 증상
- 관리자 로그인 시도 시 `502 Bad Gateway` 또는 `504 Gateway Timeout`
- nginx error 로그: `connect() failed ... (111: Connection refused)` 또는 `upstream timed out`

```bash
AFE_POD=$(kubectl get pod -n smepfe | grep smep-afe | grep Running | awk '{print $1}' | head -1)

# nginx upstream 에러 확인
kubectl exec -n smepfe $AFE_POD -- tail -100 /var/log/nginx/error.log | \
  grep -E "upstream|connect|timeout|refused"

# DMZ → 내부망 Admin BE 연결 테스트
kubectl exec -n smepfe $AFE_POD -- \
  curl -sv --connect-timeout 5 http://smep-admin-dev.smepbe:8080/admin/actuator/health 2>&1

# DNS 해석 확인
kubectl exec -n smepfe $AFE_POD -- \
  nslookup smep-admin-dev.smepbe 2>/dev/null || \
  kubectl exec -n smepfe $AFE_POD -- getent hosts smep-admin-dev.smepbe
```

#### 조치

```bash
# Case 1: Admin BE Pod 장애 → 내부망 배스천(tipa-prod-int-mgmt)에서 확인
# kubectl get pod -n smepbe -l app.kubernetes.io/name=smep-admin (내부망에서)

# Case 2: DMZ → 내부망 네트워크 단절 → 인프라팀 NetworkPolicy 확인

# Case 3: AFE Pod 재시작으로 nginx 커넥션 초기화
kubectl rollout restart deployment/smep-afe-prd -n smepfe
```

---

### 3-4. 관리자 로그인 페이지 장애

관리자 로그인은 smep-afe(FE) → smep-admin(BE)의 MFA 2단계 인증 흐름을 거칩니다.

#### 장애 진단 체크리스트

```bash
AFE_POD=$(kubectl get pod -n smepfe | grep smep-afe | grep Running | awk '{print $1}' | head -1)

# 1단계: AFE nginx 상태 확인
kubectl exec -n smepfe $AFE_POD -- nginx -t

# 2단계: Admin BE 연결 확인
kubectl exec -n smepfe $AFE_POD -- \
  curl -s --connect-timeout 5 http://smep-admin-dev.smepbe:8080/admin/actuator/health | \
  python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('status','?'))"

# 3단계: Step1 로그인 API 직접 테스트 (AFE Pod에서)
kubectl exec -n smepfe $AFE_POD -- \
  curl -s -X POST http://smep-admin-dev.smepbe:8080/admin/api/v1/account/login-step1 \
  -H "Content-Type: application/json" \
  -d '{"loginId":"admin","password":"test"}' | head -c 200

# 4단계: nginx access log에서 로그인 요청 패턴 확인
kubectl exec -n smepfe $AFE_POD -- \
  grep -E "/api/v1/account/login" /var/log/nginx/access.log | tail -20
```

#### 장애 원인 분리 기준

| 증상 | 원인 위치 | 담당 |
|------|----------|------|
| nginx 404 (로그인 페이지 자체 없음) | smep-afe 빌드 파일 | FE 개발팀 |
| nginx 502/504 (API 응답 없음) | smep-afe nginx 프록시 or 내부망 연결 | 인프라팀 |
| HTTP 200 but 로그인 실패 | smep-admin BE 인증 로직 | BE 개발팀 → [smep-admin RUNBOOK](../smep-admin/docs/RUNBOOK.md) 참조 |
| Step2 공동인증서 오류 | MFA 인증서 관리 | 보안/운영팀 |

---

### 3-5. HPA 스케일 이상

#### HPA 설정

```
smep-afe-prd: cpu: 1%/80%, min=1, max=3
```

```bash
# HPA 상태
kubectl get hpa smep-afe-prd -n smepfe -o wide
kubectl describe hpa smep-afe-prd -n smepfe

# Pod CPU/Memory 사용량
kubectl top pod -n smepfe | grep smep-afe

# 수동 스케일 (관리자 FE는 max=3)
kubectl scale deployment smep-afe-prd -n smepfe --replicas=3
```

> 관리자 FE는 일반적으로 트래픽이 적어 CPU 1% 수준이 정상입니다.  
> CPU 급증 시 nginx 워커 프로세스 오류 또는 무한 루프 의심.

---

### 3-6. 배포 실패 (ArgoCD)

```bash
# ArgoCD Application 상태 (DMZ 클러스터)
kubectl get application smep-afe-prd -n argocd

# 상세 이벤트
kubectl describe application smep-afe-prd -n argocd | tail -30

# 강제 재동기화
argocd app sync smep-afe-prd --force

# kubectl로 refresh 트리거
kubectl annotate application smep-afe-prd -n argocd \
  argocd.argoproj.io/refresh="hard" --overwrite
```

---

### 3-7. 롤백

#### ArgoCD를 통한 롤백 (권장)

```bash
# 릴리스 히스토리
argocd app history smep-afe-prd

# 특정 Revision으로 롤백
argocd app rollback smep-afe-prd <REVISION>
```

#### Deployment 롤백

```bash
# 롤백 히스토리
kubectl rollout history deployment/smep-afe-prd -n smepfe

# 직전 버전으로 즉시 롤백
kubectl rollout undo deployment/smep-afe-prd -n smepfe

# 특정 버전으로 롤백
kubectl rollout undo deployment/smep-afe-prd -n smepfe --to-revision=<N>

# 진행 상태 확인
kubectl rollout status deployment/smep-afe-prd -n smepfe
```

> ⚠️ ArgoCD Auto-Sync 활성화 시, Gitea Helm values의 이미지 태그를 수정하여 롤백 권장.

---

## 4. nginx 설정 구조 상세

### smep-afe nginx.conf 핵심 부분

```nginx
# 관리자 API 프록시 (운영)
location ^~ /admin/api/ {
    rewrite ^/admin/(.*)$ /$1 break;
    proxy_pass http://smep-admin-dev.smepbe:8080;
    # X-Matched-By: API-PROXY-ADMIN
}

# 관리자 API 프록시 (개발)
location ^~ /admin-dev/api/ {
    rewrite ^/admin-dev/(.*)$ /$1 break;
    proxy_pass http://smep-admin-dev.smepbe:8080;
    # X-Matched-By: API-PROXY-ADMIN-DEV
}

# Actuator (운영/개발)
location ^~ /admin/actuator/ {
    rewrite ^/admin/(.*)$ /$1 break;
    proxy_pass http://smep-admin-dev.smepbe:8080;
}
location ^~ /admin-dev/actuator/ {
    rewrite ^/admin-dev/(.*)$ /$1 break;
    proxy_pass http://smep-admin-dev.smepbe:8080;
}

# 테스트 엔드포인트
location ^~ /admin/example {
    rewrite ^/admin/(.*)$ /$1 break;
    proxy_pass http://smep-admin-dev.smepbe:8080;
}

# 직접 /api 호환
location ^~ /api/ {
    proxy_pass http://smep-admin-dev.smepbe:8080;
}

# 정적 자산
location /admin/assets/ { access_log off; }
location ^~ /admin-dev/assets/ {
    alias /usr/share/nginx/html/assets/;
    # X-Matched-By: STATIC-ADMIN-DEV-ASSETS
}

# SPA fallback (운영)
location /admin {
    try_files $uri $uri/ /index.html;
    # X-Matched-By: STATIC-ADMIN-FALLBACK
}

# SPA fallback (개발)
location ^~ /admin-dev {
    alias /usr/share/nginx/html/;
    try_files $uri $uri/ /index.html;
    # X-Matched-By: STATIC-ADMIN-DEV-FALLBACK
}
```

### X-Matched-By 헤더 디버그

```bash
AFE_POD=$(kubectl get pod -n smepfe | grep smep-afe | grep Running | awk '{print $1}' | head -1)

# 관리자 SPA 접근 확인
kubectl exec -n smepfe $AFE_POD -- \
  curl -s -I http://localhost/admin-dev/ | grep -E "HTTP|X-Matched"

# 관리자 API 요청 확인
kubectl exec -n smepfe $AFE_POD -- \
  curl -s -I http://localhost/admin/api/test | grep -E "HTTP|X-Matched"

# 개발 API 요청 확인
kubectl exec -n smepfe $AFE_POD -- \
  curl -s -I http://localhost/admin-dev/api/test | grep -E "HTTP|X-Matched"
```

---

## 5. smep-ufe vs smep-afe 차이점

| 항목 | smep-ufe (사용자 FE) | smep-afe (관리자 FE) |
|------|---------------------|---------------------|
| HPA max | 4 | 3 |
| Service IP | 10.254.113.216 | 10.254.153.117 |
| nginx proxy target | `smep-be-dev.smepbe:8080` | `smep-admin-dev.smepbe:8080` |
| Context Path (prod) | `/main`, `/main-dev` | `/admin`, `/admin-dev` |
| API prefix | `/main-dev/api/` | `/admin/api/`, `/admin-dev/api/` |
| BE Service | smep-be-prd (사용자 BE) | smep-admin-prd (관리자 BE) |
| 인증 방식 | Keycloak (외부 IdP) | MFA 2단계 (자체 JWT+공동인증서) |
| 트래픽 규모 | 높음 (일반 사용자) | 낮음 (내부 관리자만) |

---

## 6. 주요 명령어 레퍼런스

```bash
# Pod 이름 변수 설정
AFE_POD=$(kubectl get pod -n smepfe | grep smep-afe | grep Running | awk '{print $1}' | head -1)

# Pod 상태
kubectl get pod -n smepfe | grep smep-afe
kubectl get pod -n smepfe -l app.kubernetes.io/name=smep-afe -o wide

# 로그 스트리밍
kubectl logs -n smepfe -l app.kubernetes.io/name=smep-afe -f

# 로그 (타임스탬프 + 최근 200줄)
kubectl logs -n smepfe $AFE_POD --timestamps=true --tail=200

# 이전 인스턴스 로그
kubectl logs -n smepfe $AFE_POD --previous

# nginx 설정 테스트
kubectl exec -n smepfe $AFE_POD -- nginx -t

# nginx 무중단 reload
kubectl exec -n smepfe $AFE_POD -- nginx -s reload

# nginx access log
kubectl exec -n smepfe $AFE_POD -- tail -f /var/log/nginx/access.log

# nginx error log (관리자 API 오류 집중 확인)
kubectl exec -n smepfe $AFE_POD -- tail -f /var/log/nginx/error.log | \
  grep -E "upstream|connect|timeout"

# Admin BE 연결 테스트
kubectl exec -n smepfe $AFE_POD -- \
  curl -sv --connect-timeout 5 http://smep-admin-dev.smepbe:8080/admin/actuator/health

# 로그인 Step1 테스트
kubectl exec -n smepfe $AFE_POD -- \
  curl -s -X POST http://smep-admin-dev.smepbe:8080/admin/api/v1/account/login-step1 \
  -H "Content-Type: application/json" \
  -d '{"loginId":"admin","password":"test"}'

# Pod 재시작
kubectl rollout restart deployment/smep-afe-prd -n smepfe
kubectl rollout status deployment/smep-afe-prd -n smepfe

# HPA 상태
kubectl get hpa smep-afe-prd -n smepfe -o wide

# 리소스 사용량
kubectl top pod -n smepfe | grep smep-afe

# Deployment 이미지 태그 확인
kubectl get deployment smep-afe-prd -n smepfe \
  -o jsonpath='{.spec.template.spec.containers[0].image}'

# 전체 smepfe namespace 상태 (smep-ufe 포함)
kubectl get all -n smepfe | grep -E "smep-afe|smep-ufe"
```

---

## 7. 연락처 및 에스컬레이션

| 단계 | 조건 | 담당 | 조치 |
|------|------|------|------|
| **1단계** | nginx Pod 재시작으로 해결 | 운영 담당자 | `kubectl rollout restart` |
| **2단계** | 빌드/이미지 문제 | 개발팀 | 이미지 재빌드 + ArgoCD 재배포 |
| **3단계** | Admin BE API 연결 불가 | BE 운영팀 (내부망) | smep-admin-prd 장애 확인 → [smep-admin RUNBOOK](../smep-admin/docs/RUNBOOK.md) |
| **4단계** | MFA 인증 전체 불가 | BE + 보안 담당자 | smep-admin JWT/공동인증서 장애 대응 |
| **5단계** | DMZ ↔ 내부망 네트워크 단절 | 인프라팀 | NHN Cloud VPC/NetworkPolicy 확인 |
| **6단계** | DMZ 클러스터/노드 장애 | NHN Cloud 지원 | NHN Cloud NKS DMZ 클러스터 지원 요청 |

### 관리자 완전 접근 불가 시 체크리스트

```
[관리자 페이지 접속 불가]
        │
        ├── smep-afe Pod Running 확인
        │   kubectl get pod -n smepfe | grep smep-afe
        │
        ├── nginx 정상 동작 확인
        │   kubectl exec -n smepfe $AFE_POD -- nginx -t
        │   kubectl exec -n smepfe $AFE_POD -- curl -s -o /dev/null -w "%{http_code}" http://localhost/admin-dev/
        │
        ├── Admin BE 연결 확인
        │   kubectl exec -n smepfe $AFE_POD -- curl -s http://smep-admin-dev.smepbe:8080/admin/actuator/health
        │
        ├── Admin BE Pod 확인 (내부망 배스천에서)
        │   kubectl get pod -n smepbe | grep smep-admin
        │
        └── 전부 정상인데 로그인 실패 → MFA 인증서 문제 → smep-admin RUNBOOK 3-2 참조
```

---

*이 문서는 실제 운영 클러스터 상태(2026-05-20 기준)를 바탕으로 작성되었습니다.*
