'use client';
import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import ClientLayout from '../client-layout';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  return (
    <ClientLayout>
      <main style={{padding: '2rem', textAlign: 'center'}}>
        <h2>新規登録</h2>
        {success ? (
          <div>
            <h2>登録ありがとうございます！</h2>
            <p>
              入力したメールアドレス宛に認証メールを送信しました。<br />
              メール内のリンクをクリックして認証を完了してください。
            </p>
          </div>
        ) : (
          <form style={{margin: '2rem auto', maxWidth: 400}} onSubmit={handleRegister}>
            <input type="email" placeholder="メールアドレス" required value={email} onChange={e => setEmail(e.target.value)} style={{width: '100%', padding: '0.5rem', marginBottom: '1rem'}} />
            <input type="password" placeholder="パスワード" required value={password} onChange={e => setPassword(e.target.value)} style={{width: '100%', padding: '0.5rem', marginBottom: '1rem'}} />
            <button type="submit" disabled={loading} style={{width: '100%', padding: '0.75rem', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '6px'}}>
              {loading ? '登録中...' : '登録'}
            </button>
          </form>
        )}
        {error && <div style={{color: 'red', marginTop: '1rem'}}>{error}</div>}
      </main>
    </ClientLayout>
  );
}
