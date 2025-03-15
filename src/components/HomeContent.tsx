'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { env } from '@/env';
import { formatDate, getAccessToken } from '@/lib';
import { type UserStruct } from '@/types/authInterfaces';
import type {
  FetchStoriesByFilterParams,
  StoryDetails,
  StoryResponse,
} from '@/types/storyResponses';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { BookOpen, Calendar, Tag, User } from 'lucide-react';
import { type ObjectId } from 'mongodb';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const fetchStories = async (
  page: number,
  limit: number,
): Promise<StoryDetails[]> => {
  const NEXT_PUBLIC_STORY_API_URL = env.NEXT_PUBLIC_STORY_API_URL;
  const authToken = getAccessToken();
  if (!authToken) throw new Error('No authentication token found');

  try {
    const response = await fetch(`${NEXT_PUBLIC_STORY_API_URL}/get-stories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        page,
        limit,
      }),
    });
    let data = {} as StoryResponse;
    if (response.ok) {
      data = (await response.json()) as StoryResponse;
    }
    return data.stories || [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

const fetchStoriesByFilter = async ({
  genres,
  page = 1,
  limit = 10,
}: FetchStoriesByFilterParams): Promise<StoryDetails[]> => {
  const NEXT_PUBLIC_STORY_API_URL = env.NEXT_PUBLIC_STORY_API_URL;
  const authToken = getAccessToken();
  if (!authToken) throw new Error('No authentication token found');

  try {
    const response = await fetch(
      `${NEXT_PUBLIC_STORY_API_URL}/get-stories-by-filters`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          genres,
          page,
          limit,
        }),
      },
    );
    let data = {} as StoryResponse;
    if (response.ok) {
      data = (await response.json()) as StoryResponse;
    }
    return data.stories || [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

const fetchOwnerName = async (
  ownerId: ObjectId,
): Promise<{ first_name: string; last_name: string }> => {
  const NEXT_PUBLIC_AUTH_API_URL = env.NEXT_PUBLIC_AUTH_API_URL;
  const authToken = getAccessToken();
  if (!authToken) throw new Error('No authentication token found');
  const response = await fetch(`${NEXT_PUBLIC_AUTH_API_URL}/fetchuserbyid`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      id: ownerId.toString(),
    }),
  });
  if (!response.ok) {
    return { first_name: 'Unknown', last_name: 'User' };
  }
  const data = (await response.json()) as {
    message: string;
    user: Partial<UserStruct>;
  };
  return {
    first_name: data.user.first_name ?? 'Unknown',
    last_name: data.user.last_name ?? 'User',
  };
};
const OwnerName = ({ ownerId }: { ownerId: ObjectId }) => {
  const { data, isPending, error } = useQuery({
    queryKey: ['ownerName', ownerId],
    queryFn: () => fetchOwnerName(ownerId),
  });

  if (isPending) return <span className="line-clamp-1">Loading author...</span>;
  if (error || !data)
    return <span className="line-clamp-1">Unknown Author</span>;
  return (
    <span className="line-clamp-1">
      {data.first_name} {data.last_name}
    </span>
  );
};

export default function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const limit = 10;

  const { data, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ['stories', selectedGenres, searchQuery],
      initialPageParam: 1,
      queryFn: async ({ pageParam }) =>
        selectedGenres.length > 0
          ? fetchStoriesByFilter({
              genres: selectedGenres,
              page: pageParam,
              limit,
            })
          : fetchStories(pageParam, limit),
      getNextPageParam: (lastPage, allPages) =>
        lastPage.length === limit ? allPages.length + 1 : undefined,
    });

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', '1');
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [selectedGenres, searchQuery, router, searchParams]);

  const allStories = data?.pages.flat() ?? [];
  const filteredStories = allStories.filter((story) =>
    searchQuery
      ? [story.title, story.description].some(
          (text) =>
            typeof text === 'string' &&
            text.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      : true,
  );

  return (
    <div className="flex flex-col w-full bg-gray-50 text-gray-900 mt-16 min-h-screen">
      <section className="w-full text-center py-12 bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
        <h1 className="text-4xl font-bold tracking-tight">Discover Stories</h1>
        <p className="mt-4 text-lg max-w-2xl mx-auto">
          Browse through our collection of stories and find your next favorite
          read.
        </p>
      </section>

      <div className="flex flex-col md:flex-row max-w-7xl mx-auto w-full px-4 py-8">
        <aside className="md:block w-full md:w-64 shrink-0 mb-6 md:mb-0 md:mr-8">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Filters</CardTitle>
              <div className="mt-4">
                <Input
                  placeholder="Search stories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Genres</h3>
                <div className="space-y-2">
                  {[
                    'Fantasy',
                    'Science Fiction',
                    'Mystery',
                    'Romance',
                    'Horror',
                    'Thriller',
                    'Historical Fiction',
                    'Young Adult',
                    "Children's",
                    'Biography',
                    'Non-fiction',
                    'Poetry',
                    'Drama',
                  ].map((genre) => (
                    <div key={genre} className="flex items-center space-x-2">
                      <Checkbox
                        id={`genre-${genre}`}
                        checked={selectedGenres.includes(genre)}
                        onCheckedChange={() =>
                          setSelectedGenres((prev) =>
                            prev.includes(genre)
                              ? prev.filter((g) => g !== genre)
                              : [...prev, genre],
                          )
                        }
                      />
                      <Label htmlFor={`genre-${genre}`}>{genre}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setSelectedGenres([]);
                  setSearchQuery('');
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        </aside>

        <div className="flex-grow flex flex-col">
          <h2 className="text-2xl font-bold mb-6">
            {isFetching && !data
              ? 'Loading...'
              : `${filteredStories.length} ${filteredStories.length === 1 ? 'Story' : 'Stories'} Found`}
          </h2>

          {isFetching && !data ? (
            <div className="flex justify-center items-center py-12">
              <p className="text-lg text-gray-500">Loading stories...</p>
            </div>
          ) : filteredStories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-gray-500">No stories found.</p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {filteredStories.map((story) => (
                  <Card
                    key={story.id.toString()}
                    className="flex flex-col h-fit w-full max-w-[350px] mx-auto hover:shadow-lg transition-shadow duration-300"
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="line-clamp-2 text-lg">
                        {story.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow overflow-hidden space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <User className="h-4 w-4 mr-1 flex-shrink-0" />
                        <OwnerName ownerId={story.owner_id} />
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Tag className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span className="line-clamp-1">{story.genre}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span>Started: {formatDate(story.created_at)}</span>
                      </div>
                      <p className="text-gray-700 line-clamp-4 mt-2">
                        {story.description}
                      </p>
                    </CardContent>
                    <CardFooter className="mt-auto">
                      <Button
                        className="w-full cursor-pointer"
                        onClick={() =>
                          router.push(`/story/${story.id.toString()}`)
                        }
                      >
                        <BookOpen className="mr-2 h-4 w-4" /> Read Now
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              <div className="flex justify-center mt-6">
                <Button
                  className="cursor-pointer"
                  onClick={() => fetchNextPage()}
                  disabled={!hasNextPage || isFetchingNextPage}
                >
                  {isFetchingNextPage ? 'Loading more...' : 'Load More'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
