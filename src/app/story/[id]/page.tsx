'use client';

import Footer from '@/components/Footer';
import NavBar from '@/components/NavBar';
import { hasCookie } from 'cookies-next/client';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const StoryEditor = dynamic(() => import('@/components/StoryEditor'), {
  ssr: false,
});

export default function Story() {
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
        <StoryEditor />
        <Footer />
      </main>
    </>
  );
}
