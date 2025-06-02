'use client';
import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import ClientLayout from '../client-layout';

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

// 登録・決済ページ雛形
export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    const userId = data.user?.id;
    if (userId) {
      await supabase.from('users').insert({ id: userId });
      setUserId(userId);
    }
    setSuccess(true);
    setLoading(false);
  };

  return (
    <ClientLayout>
      <main style={{padding: '2rem', textAlign: 'center'}}>
        <h2>新規登録 & サブスクリプション決済</h2>
        <form style={{margin: '2rem auto', maxWidth: 400}} onSubmit={handleSubmit}>
          <input type="email" placeholder="メールアドレス" required value={email} onChange={e => setEmail(e.target.value)} style={{width: '100%', padding: '0.5rem', marginBottom: '1rem'}} />
          <input type="password" placeholder="パスワード" required value={password} onChange={e => setPassword(e.target.value)} style={{width: '100%', padding: '0.5rem', marginBottom: '1rem'}} />
          <button type="submit" disabled={loading} style={{width: '100%', padding: '0.75rem', background: '#10b981', color: '#fff', border: 'none', borderRadius: '6px'}}>
            {loading ? '登録中...' : '登録して決済へ'}
          </button>
        </form>
        {error && <div style={{color: 'red', marginTop: '1rem'}}>{error}</div>}
        {success && userId && (
          <Elements stripe={stripePromise}>
            <PaymentForm userId={userId} email={email} />
          </Elements>
        )}
      </main>
    </ClientLayout>
  );
}
