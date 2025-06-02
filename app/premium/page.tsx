'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import ClientLayout from '../client-layout';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function PaymentForm({ userId, email }: { userId: string, email: string }) {
  const [loading, setLoading] = useState(false);
  const handleCheckout = async () => {
    setLoading(true);
    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, email }),
    });
    const data = await res.json();
    window.location.href = data.url;
  };
  return (
    <button onClick={handleCheckout} disabled={loading} style={{marginTop: '2rem', padding: '1rem 2rem'}}>
      {loading ? 'リダイレクト中...' : 'カード情報を入力して決済'}
    </button>
  );
}

export default function Premium() {
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace('/login');
        return;
      }
      setUserId(session.user.id);
      setEmail(session.user.email ?? '');
      const { data: user } = await supabase
        .from('users')
        .select('subscription_status')
        .eq('id', session.user.id)
        .single();
      if (user?.subscription_status === 'active') {
        setIsPremium(true);
      } else {
        setIsPremium(false);
      }
      setLoading(false);
    };
    check();
  }, [router]);

  if (loading) return <ClientLayout><main style={{padding: '2rem', textAlign: 'center'}}>読み込み中...</main></ClientLayout>;
  if (isPremium) {
    return (
      <ClientLayout>
        <main style={{padding: '2rem', textAlign: 'center'}}>
          <h2>プレミアム会員限定コンテンツ</h2>
          <p>ここでは会員限定の学習教材や動画が閲覧できます。</p>
        </main>
      </ClientLayout>
    );
  }
  // 非会員は決済ボタンを表示
  return (
    <ClientLayout>
      <main style={{padding: '2rem', textAlign: 'center'}}>
        <h2>プレミアム会員登録</h2>
        <p>プレミアム会員になると限定コンテンツが利用できます。</p>
        {userId && email && (
          <Elements stripe={stripePromise}>
            <PaymentForm userId={userId} email={email} />
          </Elements>
        )}
      </main>
    </ClientLayout>
  );
}
