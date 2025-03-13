'use client';

import CreateStory from '@/components/CreateStory';
import ProfileLayout from '@/components/ProfileLayout';
import { hasCookie } from 'cookies-next/client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function CreateStoryPage() {
  const router = useRouter();

  useEffect(() => {
    if (!hasCookie('user')) {
      router.push('/login');
    }
  }, [router]);

  return (
    <ProfileLayout>
      <CreateStory />
    </ProfileLayout>
  );
}
