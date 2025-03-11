'use client';

import Footer from '@/components/Footer';
import HomeContent from '@/components/HomeContent';
import NavBar from '@/components/NavBar';
import { hasCookie } from 'cookies-next/client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    if (!hasCookie('user')) {
      router.push('/login');
    }
  }, [router]);

  return (
    <>
      <NavBar />
      <main className="flex flex-col min-h-screen w-full items-center justify-between">
        <HomeContent />
        <Footer />
      </main>
    </>
  );
}
