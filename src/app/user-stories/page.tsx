'use client';
import ProfileLayout from '@/components/ProfileLayout';
import UserStories from '@/components/UserStories';
import { hasCookie } from 'cookies-next/client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function UserStoriesPage() {
  const router = useRouter();

  useEffect(() => {
    if (!hasCookie('user')) {
      router.push('/login');
    }
  }, [router]);

  return (
    <ProfileLayout>
      <UserStories />
    </ProfileLayout>
  );
}
