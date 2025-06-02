'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import ClientLayout from '../client-layout';

export default function Logout() {
  const router = useRouter();
  useEffect(() => {
    supabase.auth.signOut().then(() => {
      router.push('/login');
    });
  }, [router]);
  return (
    <ClientLayout>
      <main style={{ padding: '2rem', textAlign: 'center' }}>ログアウト中...</main>
    </ClientLayout>
  );
}
