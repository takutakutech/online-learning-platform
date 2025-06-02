'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import ClientLayout from '../client-layout';

export default function Free() {
  const [status, setStatus] = useState<'loading' | 'free' | 'premium' | 'guest'>('loading');

  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setStatus('guest');
        return;
      }
      const { data: user } = await supabase
        .from('users')
        .select('subscription_status')
        .eq('id', session.user.id)
        .single();
      if (user?.subscription_status === 'active') {
        setStatus('premium');
      } else {
        setStatus('free');
      }
    };
    check();
  }, []);

  let label = '';
  if (status === 'premium') label = '（有料会員）';
  else if (status === 'free') label = '（無料会員）';
  else if (status === 'guest') label = '（未ログイン）';

  return (
    <ClientLayout>
      <main style={{padding: '2rem', textAlign: 'center'}}>
        <h2>フリーミアムページ {label}</h2>
        <p>このページは無料会員・有料会員どちらも閲覧できます。</p>
        <p>有料会員になるとさらに多くのコンテンツが利用できます。</p>
      </main>
    </ClientLayout>
  );
}
