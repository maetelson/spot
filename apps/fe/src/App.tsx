import { MapPin, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { LoginScreen } from '@/components/auth/LoginScreen';
import { CATEGORIES } from '@/lib/categories';
import { NEIGHBORHOODS } from '@/lib/neighborhoods';

export default function App() {
  const { user, loading, signOut } = useAuth();

  // splash while the session is restored
  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-canvas">
        <span className="text-2xl font-black text-ink">
          spot<span className="text-coral">.</span>
        </span>
      </div>
    );
  }

  if (!user) return <LoginScreen />;

  const meta = user.user_metadata ?? {};
  const nickname: string = meta.name ?? meta.full_name ?? meta.nickname ?? '익명';

  // Authed placeholder home — confirms the full login round-trip.
  // Real SCR-001 map comes next.
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-canvas p-6 text-ink">
      <header className="flex flex-col items-center gap-1">
        <h1 className="text-[40px] font-black leading-none tracking-tight">
          spot<span className="text-coral">.</span>
        </h1>
        <p className="text-sm text-ink-secondary">{nickname}님, 로그인 성공 🎉</p>
      </header>

      <div className="flex flex-wrap justify-center gap-2">
        {CATEGORIES.map((c) => (
          <span
            key={c.id}
            className="rounded-xl bg-fill px-3 py-1.5 text-sm text-ink-secondary"
          >
            {c.emoji} {c.label}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-1.5 text-xs text-ink-tertiary">
        <MapPin className="size-3.5" />
        서울 {NEIGHBORHOODS.length}개 상권 프리셋 로드됨
      </div>

      <button
        type="button"
        onClick={() => void signOut()}
        className="mt-2 flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-sm text-ink-secondary transition active:scale-[0.98]"
      >
        <LogOut className="size-3.5" />
        로그아웃
      </button>
    </div>
  );
}
