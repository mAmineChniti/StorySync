'use client';
import ProfileInfo from '@/components/ProfileInfo';
import ProfileLayout from '@/components/ProfileLayout';
import { hasCookie } from 'cookies-next/client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Profile() {
  const router = useRouter();

  useEffect(() => {
    if (!hasCookie('user')) {
      router.push('/login');
    }
  }, [router]);

  return (
    <ProfileLayout>
      <ProfileInfo />
    </ProfileLayout>
  );
}
