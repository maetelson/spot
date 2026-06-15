import { useEffect, useState } from 'react';
import type { AuthError, Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

// Kakao OAuth via Supabase Auth — PRD §15, §19.2. Session persists across
// reloads (Supabase stores + refreshes the JWT), so returning users skip login.

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const signInWithKakao = async (): Promise<{ error: AuthError | null }> => {
    // Supabase's Kakao provider hard-codes the scope
    // `account_email profile_image profile_nickname` and won't let the client
    // drop account_email. Our personal (non-Biz) app has no email consent item,
    // so Kakao rejects the request with KOE205. We only need identity, so we
    // grab the authorize URL ourselves and rewrite the scope to nickname-only.
    // PKCE state/code_challenge in the URL are left intact, so the redirect
    // callback still completes normally.
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: {
        redirectTo: window.location.origin,
        skipBrowserRedirect: true,
      },
    });
    if (error) return { error };

    const authUrl = data?.url;
    if (!authUrl) return { error: null };

    const url = new URL(authUrl);
    url.searchParams.set('scope', 'profile_nickname');
    window.location.href = url.toString();
    return { error: null };
  };

  const signOut = () => supabase.auth.signOut();

  const user: User | null = session?.user ?? null;
  return { session, user, loading, signInWithKakao, signOut };
}
