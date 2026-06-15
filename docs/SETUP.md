# spot. 셋업 가이드

Phase 1.0 로컬 개발 + 외부 서비스(카카오 / Supabase) 연결 절차.

---

## 0. 사전 준비

```bash
cp apps/fe/.env.example apps/fe/.env   # PowerShell: Copy-Item apps/fe/.env.example apps/fe/.env
npm install                            # 루트에서 (npm workspaces 전체 설치)
```

`apps/fe/.env`는 gitignore되어 있고, `VITE_` 접두어가 붙은 값만 클라이언트 번들에 노출됩니다.

---

## 1. 카카오 (Kakao Developers)

> https://developers.kakao.com → 내 애플리케이션

### 1-1. 앱 키 (대시보드 상단 "앱 키")

| 키 | 용도 | 어디에 |
|----|------|--------|
| **JavaScript 키** | 지도 SDK + 키워드 검색(브라우저) | `apps/fe/.env`의 `VITE_KAKAO_JS_KEY` |
| **REST API 키** | OAuth 로그인 (서버측) | Supabase Auth 설정에만 (⚠️ 클라이언트 금지) |

### 1-2. JavaScript SDK 도메인 (지도용)
**앱 → 플랫폼 키 → JavaScript 키 → JavaScript SDK 도메인** 에 추가:
- `http://localhost:5173`
- (배포 후) `https://<your-app>.vercel.app`

### 1-3. 카카오 로그인 — 새 콘솔 기준 위치 주의
- **활성화**: 제품 설정 → 카카오 로그인 → 활성화 ON (먼저 **동의항목**에서 **닉네임** 설정)
- **리다이렉트 URI**: 앱 → 플랫폼 키 → **REST API 키 → 리다이렉트 URI**
  ```
  https://<project-ref>.supabase.co/auth/v1/callback
  ```
- **Client Secret**: 앱 → 플랫폼 키 → **REST API 키 → 클라이언트 시크릿** → 코드 생성 → "사용함"
- **동의항목**: **닉네임(profile_nickname)** 만 켜면 됨. 이메일은 비즈앱이 필요하고 spot.에선 안 쓰므로 `apps/fe` 코드에서 scope를 닉네임만 요청하도록 처리됨.

---

## 2. Supabase

> https://supabase.com → New project (Region: Northeast Asia (Seoul) 권장)

### 2-1. API 키 → `apps/fe/.env`
**Project Settings → API**:
- `Project URL` → `VITE_SUPABASE_URL`  (이 URL의 서브도메인이 `project-ref`)
- `anon public` 키 → `VITE_SUPABASE_ANON_KEY`

### 2-2. 카카오 OAuth 프로바이더 연결
**Authentication → Sign In / Providers → Kakao → Enable**:
- **REST API Key** = 카카오 REST API 키 (1-1)
- **Client Secret Code** = 카카오 Client Secret (1-3)
- 화면의 **Callback URL**을 복사해 카카오 리다이렉트 URI(1-3)에 붙여넣기

**Authentication → URL Configuration**:
- `Site URL` = `http://localhost:5173`
- `Redirect URLs`에 `http://localhost:5173` (+ 배포 도메인) 추가

### 2-3. 스키마 적용
**SQL Editor → New query** 에 [`apps/be/supabase/migrations/0001_init.sql`](../apps/be/supabase/migrations/0001_init.sql) 전체를 붙여넣고 **Run**.
→ `places` 테이블 + RLS 정책 생성. (CLI 방식은 [`apps/be/README.md`](../apps/be/README.md) 참고)

---

## 3. 로컬 실행 (루트에서)

```bash
npm run dev      # http://localhost:5173
npm run build    # 타입체크 + 프로덕션 빌드
npm run preview  # 빌드 결과 미리보기 (SW 동작 확인)
```

---

## 4. 운영 메모

- **Supabase 7일 자동 일시정지(PRD §20.3)**: cron-job.org 등에서 5분 간격으로
  `https://<project-ref>.supabase.co/rest/v1/?apikey=<anon-key>` 핑.
- **배포(Vercel)**: 레포 연결 → **Root Directory를 `apps/fe`로 지정** → Framework: Vite →
  Environment Variables에 `VITE_*` 입력 → Deploy. (`apps/fe/vercel.json`이 SPA 라우팅 처리)
  배포 도메인을 카카오(도메인·리다이렉트)·Supabase(URL Config)에 반드시 추가.
- **PWA 아이콘**: `apps/fe/public/pwa-192x192.png`, `apps/fe/public/pwa-512x512.png` 추가 시
  설치형 아이콘 적용 (예: `npx @vite-pwa/assets-generator`).
