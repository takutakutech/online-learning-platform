'use client';
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setSession(session);
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <>
      <nav style={{padding: '1rem', borderBottom: '1px solid #eee', marginBottom: '2rem', display: 'flex', gap: '1rem'}}>
        <Link href="/">トップ</Link>
        {session ? (
          <>
            <Link href="/premium">プレミアム</Link>
            <Link href="/logout">ログアウト</Link>
          </>
        ) : (
          <>
            <Link href="/login">ログイン</Link>
            <Link href="/register">新規登録</Link>
          </>
        )}
      </nav>
      {children}
    </>
  );
}
