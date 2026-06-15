# @spot/be — Supabase backend

spot.의 백엔드는 별도 서버가 아니라 **Supabase(BaaS)** 입니다.

- 인증: 카카오 OAuth (Supabase Auth)
- DB: PostgreSQL + Row Level Security
- (선택) 서버 로직: Edge Functions (Deno) — 예: 카카오 REST API 프록시

## 구조

```
supabase/
├── migrations/        DB 스키마·변경 이력 (SQL)
│   └── 0001_init.sql  places 테이블 + RLS 정책
└── functions/         Edge Functions (Deno) — 현재 없음
```

## 스키마 적용

**방법 A (현재 사용 중) — 대시보드:**
Supabase → SQL Editor → `migrations/0001_init.sql` 내용 붙여넣고 **Run**.

**방법 B — Supabase CLI:**
```bash
npx supabase login
npm run link -w @spot/be      # project-ref 연결 (gwylurhjpvjvwnketkra)
npm run db:push -w @spot/be   # 마이그레이션 적용
```
> `supabase/config.toml`은 CLI를 도입할 때 `npx supabase init`이 생성합니다.

## Edge Functions (향후)

카카오 REST API 등 서버에서 호출해야 하는 로직이 생기면 여기에 추가합니다:
```bash
npx supabase functions new <name>
npm run functions:deploy -w @spot/be
```
