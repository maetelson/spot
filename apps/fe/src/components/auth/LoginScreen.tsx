import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

// SCR-006 — 온보딩 / 로그인 (PRD §15). 카카오 OAuth 단일 인증.
export function LoginScreen() {
  const { signInWithKakao } = useAuth();
  const [busy, setBusy] = useState(false);

  const handleLogin = async () => {
    setBusy(true);
    const { error } = await signInWithKakao();
    // on success the browser navigates to Kakao, so we only land here on error
    if (error) {
      setBusy(false);
      alert(`로그인 실패: ${error.message}`);
    }
  };

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-14 bg-canvas px-6">
      <div className="flex flex-col items-center gap-3">
        <h1 className="text-[56px] font-black leading-none tracking-tight text-ink">
          spot<span className="text-coral">.</span>
        </h1>
        <p className="text-sm text-ink-secondary">오늘 어느 동네 갈까</p>
      </div>

      <button
        type="button"
        onClick={handleLogin}
        disabled={busy}
        className="flex w-full max-w-xs items-center justify-center gap-2 rounded-xl bg-[#FEE500] px-4 py-3.5 text-[15px] font-semibold text-black/85 transition active:scale-[0.98] disabled:opacity-60"
      >
        <KakaoBubble />
        {busy ? '카카오로 이동 중…' : '카카오 로그인'}
      </button>
    </div>
  );
}

function KakaoBubble() {
  return (
    <svg width="18" height="18" viewBox="0 0 256 256" aria-hidden="true">
      <path
        fill="currentColor"
        d="M128 36C70.6 36 24 72.7 24 118c0 29.3 19.5 55 48.9 69.4-1.6 5.4-5.8 19.7-6.6 22.8-1 3.8 1.4 3.8 2.9 2.8 1.2-.8 18.7-12.7 26.3-17.8 10.6 1.6 21.7 2.4 32.5 2.4 57.4 0 104-36.7 104-82S185.4 36 128 36z"
      />
    </svg>
  );
}
