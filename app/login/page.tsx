'use client';
import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import ClientLayout from '../client-layout';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
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
        <h2>ログイン</h2>
        <form style={{margin: '2rem auto', maxWidth: 400}} onSubmit={handleSubmit}>
          <input type="email" placeholder="メールアドレス" required value={email} onChange={e => setEmail(e.target.value)} style={{width: '100%', padding: '0.5rem', marginBottom: '1rem'}} />
          <input type="password" placeholder="パスワード" required value={password} onChange={e => setPassword(e.target.value)} style={{width: '100%', padding: '0.5rem', marginBottom: '1rem'}} />
          <button type="submit" disabled={loading} style={{width: '100%', padding: '0.75rem', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '6px'}}>
            {loading ? 'ログイン中...' : 'ログイン'}
          </button>
        </form>
        {error && <div style={{color: 'red', marginTop: '1rem'}}>{error}</div>}
        {success && <div style={{color: 'green', marginTop: '1rem'}}>ログイン成功</div>}
      </main>
    </ClientLayout>
  );
}
