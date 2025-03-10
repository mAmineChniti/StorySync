'use client';

import Footer from '@/components/Footer';
import NavBar from '@/components/NavBar';
import { getCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    if (!getCookie('user')) {
      router.push('/login');
    }
  }, [router]);
  return (
    <>
      <NavBar />
      <main className="flex flex-col min-h-screen w-full items-center justify-center">
        <div className="flex justify-center items-center w-full flex-grow"></div>
        <Footer />
      </main>
    </>
  );
}
