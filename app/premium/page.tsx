'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import ClientLayout from '../client-layout';

export default function Premium() {
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace('/login');
        return;
      }
      const { data: user } = await supabase
        .from('users')
        .select('subscription_status')
        .eq('id', session.user.id)
        .single();
      if (user?.subscription_status === 'active') {
        setIsPremium(true);
      } else {
        router.replace('/register');
      }
      setLoading(false);
    };
    check();
  }, [router]);

  if (loading) return <ClientLayout><main style={{padding: '2rem', textAlign: 'center'}}>読み込み中...</main></ClientLayout>;
  if (!isPremium) return null;
  return (
    <ClientLayout>
      <main style={{padding: '2rem', textAlign: 'center'}}>
        <h2>プレミアム会員限定コンテンツ</h2>
        <p>ここでは会員限定の学習教材や動画が閲覧できます。</p>
      </main>
    </ClientLayout>
  );
}
