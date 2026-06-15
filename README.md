# spot.

> 거리(미터)가 아닌 **"오늘 어느 동네 갈까"라는 심리적 단위**로, 내가 큐레이션한 장소를
> 조건 필터로 빠르게 결정하는 모바일 우선 PWA. — *저장 앱이 아니라 결정 앱.*

Phase 1.0 (Closed Beta). PRD v2.1 기준. **npm workspaces 모노레포.**

## 스택

| 영역 | 기술 |
|------|------|
| Frontend (`apps/fe`) | React 19 · Vite 8 · TypeScript 6 · Tailwind v4 · shadcn/ui · Lucide |
| 상태 | Zustand (UI) · TanStack Query (서버) |
| PWA | vite-plugin-pwa (Workbox) · idb-keyval |
| Backend (`apps/be`) | Supabase — Auth(카카오 OAuth) · PostgreSQL · RLS · Edge Functions |
| 외부 | 카카오 OAuth · 카카오맵 JS SDK · 카카오 Local |

> PRD는 Vite 7을 명시했지만 신규 프로젝트라 최신 안정 메이저(Vite 8 + plugin-react 6)로 구성했습니다.

## 구조

```
spot/
├── apps/
│   ├── fe/                  프론트엔드 — React PWA
│   │   ├── src/
│   │   │   ├── components/  ui · map · place · layout · auth
│   │   │   ├── hooks/       useAuth · usePlaces · useFilters
│   │   │   ├── lib/         supabase · kakao · neighborhoods · categories · utils
│   │   │   └── types/       place · kakao
│   │   ├── public/          정적 에셋 (favicon, PWA 아이콘)
│   │   └── .env             (gitignored) — .env.example 참고
│   └── be/                  백엔드 — Supabase
│       └── supabase/
│           ├── migrations/  0001_init.sql (places + RLS)
│           └── functions/   Edge Functions (Deno, 향후)
├── docs/SETUP.md            카카오 / Supabase 연결 가이드
└── package.json             루트 (npm workspaces)
```

## 빠른 시작

```bash
cp apps/fe/.env.example apps/fe/.env   # 값 채우기 — docs/SETUP.md 참고
npm install                            # 루트에서 1회 (workspace 전체 설치)
npm run dev                            # http://localhost:5173
```

외부 서비스(카카오 키, Supabase 프로젝트·OAuth·스키마) 연결은 **[docs/SETUP.md](docs/SETUP.md)** 참고.

## 스크립트 (루트에서)

| 명령 | 대상 | 설명 |
|------|------|------|
| `npm run dev` | fe | 개발 서버 |
| `npm run build` | fe | 타입체크 + 프로덕션 빌드 |
| `npm run preview` | fe | 빌드 결과 미리보기 |
| `npm run typecheck` | fe | 타입체크만 |
| `npm run be:push` | be | Supabase 마이그레이션 적용 (CLI) |

## 다음 단계 (구현 대기)

SCR-006 로그인 ✅ → SCR-001 홈 지도 → SCR-002 동네 뷰 → SCR-003 상세 → SCR-004 등록.
