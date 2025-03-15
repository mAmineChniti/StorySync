'use client';
import Landing from '@/components/Landing';
import NavBar from '@/components/NavBar';
import { hasCookie } from 'cookies-next/client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
  const router = useRouter();
  useEffect(() => {
    if (hasCookie('user')) {
      router.push('/browse');
    }
  }, [router]);
  return (
    <>
      <NavBar />
      <main className="flex flex-col min-h-screen w-full items-center justify-center">
        <Landing />
      </main>
    </>
  );
}
