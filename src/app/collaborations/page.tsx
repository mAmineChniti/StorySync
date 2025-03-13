'use client';
import CollaboratedStories from '@/components/CollaboratedStories';
import ProfileLayout from '@/components/ProfileLayout';
import { hasCookie } from 'cookies-next/client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function CollaborationsPage() {
  const router = useRouter();

  useEffect(() => {
    if (!hasCookie('user')) {
      router.push('/login');
    }
  }, [router]);

  return (
    <ProfileLayout>
      <CollaboratedStories />
    </ProfileLayout>
  );
}
