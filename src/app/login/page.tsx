'use client';

import AuthPage from '@/components/AuthPage';
import Footer from '@/components/Footer';
import NavBar from '@/components/NavBar';
import { hasCookie } from 'cookies-next/client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  const router = useRouter();
  useEffect(() => {
    if (hasCookie('user')) {
      router.push('/home');
    }
  }, [router]);

  return (
    <>
      <NavBar />
      <main className="flex flex-col min-h-screen w-full items-center justify-center">
        <div className="flex justify-center items-center w-full flex-grow">
          <AuthPage isLogin={true} />
        </div>
        <Footer />
      </main>
    </>
  );
}
