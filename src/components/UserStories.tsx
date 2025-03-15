import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { env } from '@/env';
import { formatDate, getUserId } from '@/lib';
import { type StoryDetails, type StoryResponse } from '@/types/storyResponses';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BookOpen, Calendar, Edit, Tag, Trash2, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const fetchUserStories = async (
  page: number,
  limit: number,
): Promise<StoryDetails[]> => {
  const NEXT_PUBLIC_STORY_API_URL = env.NEXT_PUBLIC_STORY_API_URL;
  const userId = getUserId();
  if (!userId) {
    throw new Error('User not authenticated');
  }

  try {
    const response = await fetch(
      `${NEXT_PUBLIC_STORY_API_URL}/get-stories-by-user`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId, page, limit }),
      },
    );
    let data = {} as StoryResponse;
    if (response.ok) {
      data = (await response.json()) as StoryResponse;
    }
    return data.stories || [];
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching user stories');
  }
};

const deleteStory = async (storyId: string) => {
  const NEXT_PUBLIC_STORY_API_URL = env.NEXT_PUBLIC_STORY_API_URL;

  const response = await fetch(`${NEXT_PUBLIC_STORY_API_URL}/delete-story`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ story_id: storyId }),
  });

  if (!response.ok) {
    throw new Error('Failed to delete story');
  }
};

export default function UserStories() {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 5;
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['userStories', currentPage],
    queryFn: () => fetchUserStories(currentPage, limit),
  });

  const mutation = useMutation({
    mutationFn: deleteStory,
    onSuccess: async () => {
      try {
        await queryClient.invalidateQueries({ queryKey: ['userStories'] });
      } catch (error) {
        console.error('Error invalidating query:', error);
      }
    },
    onError: (error) => {
      console.error('Error deleting story:', error);
    },
  });

  const stories = data ?? [];

  const handleDeleteStory = (storyId: string) => {
    if (window.confirm('Are you sure you want to delete this story?')) {
      mutation.mutate(storyId);
    }
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-2/3 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="flex flex-col md:flex-row gap-4 border-b pb-6 last:border-0"
              >
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                    <Skeleton className="h-8 w-2/3" />
                  </div>
                  <Skeleton className="h-6 w-full mb-4" />
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Skeleton className="h-4 w-1/2 mr-1" />
                    </div>
                    <div className="flex items-center">
                      <Skeleton className="h-4 w-1/2 mr-1" />
                    </div>
                    <div className="flex items-center">
                      <Skeleton className="h-4 w-1/2 mr-1" />
                    </div>
                    <div className="flex items-center">
                      <Skeleton className="h-4 w-1/2 mr-1" />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-8 w-32" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>
            There was an error loading your stories. Please try again later.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={() => router.refresh()}>Retry</Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">My Stories</CardTitle>
        <CardDescription>
          Stories you&apos;ve written and are currently working on
        </CardDescription>
      </CardHeader>
      <CardContent>
        {stories.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium">No stories yet</h3>
            <p className="mt-2 text-gray-500">
              You haven&apos;t created any stories yet. Start writing your first
              story!
            </p>
            <Button className="mt-4">Create Your First Story</Button>
          </div>
        ) : (
          <div className="space-y-6">
            {stories.map((story) => (
              <div
                key={story.id.toString()}
                className="flex flex-col md:flex-row gap-4 border-b pb-6 last:border-0"
              >
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold">{story.title}</h3>
                  </div>

                  <p className="text-gray-700 mb-4">{story.description}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Tag className="h-4 w-4 mr-1" />
                      <span>{story.genre}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Started: {formatDate(story.created_at)}</span>
                    </div>
                    <div className="flex items-center">
                      <Edit className="h-4 w-4 mr-1" />
                      <span>Updated: {formatDate(story.updated_at)}</span>
                    </div>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      <span>
                        {story.collaborators?.length ?? 0} Collaborators
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      className="cursor-pointer"
                      onClick={() =>
                        router.push(`/story/${story.id.toString()}`)
                      }
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Continue Writing
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="cursor-pointer"
                      onClick={() => handleDeleteStory(story.id.toString())}
                      disabled={mutation.isPending}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      {mutation.isPending ? 'Deleting...' : 'Delete'}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button
          className="cursor-pointer"
          onClick={handlePrevPage}
          disabled={currentPage === 1 || isLoading}
        >
          Previous
        </Button>
        <span className="text-lg">Page {currentPage}</span>
        <Button className="cursor-pointer"
          onClick={handleNextPage}
          disabled={stories.length < limit || isLoading}
        >
          Next
        </Button>
      </CardFooter>
    </Card>
  );
}
