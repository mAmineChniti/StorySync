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
import { getCookie } from 'cookies-next/client';
import { BookOpen, Calendar, Tag } from 'lucide-react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { FetchStoriesByFilterParams, StoryDetails, StoryResponse } from '@/types/storyResponses';
import type { Tokens } from '@/types/authInterfaces';
import { env } from '@/env';
const NEXT_PUBLIC_STORY_API_URL = env.NEXT_PUBLIC_STORY_API_URL;

const getAccessToken = (): string | null => {
  const tokenString = getCookie('tokens');
  if (!tokenString) return null;
  try {
    const tokens = JSON.parse(tokenString) as Tokens;
    return tokens.access_token || null;
  } catch (error) {
    console.error('Invalid token format', error);
    return null;
  }
};

const fetchStories = async (page: number, limit: number): Promise<StoryDetails[]> => {
  const authToken = getAccessToken();
  if (!authToken) throw new Error('No authentication token found');

  try {
    const response = await fetch(`${NEXT_PUBLIC_STORY_API_URL}/api/v1/get-stories`, {
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
    if (response.ok) { data = await response.json() as StoryResponse; }
    return data.stories || [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

const fetchStoriesByFilter = async ({ genre, page = 1, limit = 10 }: FetchStoriesByFilterParams): Promise<StoryDetails[]> => {
  const authToken = getAccessToken();
  if (!authToken) throw new Error('No authentication token found');

  try {
    const response = await fetch(`${NEXT_PUBLIC_STORY_API_URL}/api/v1/get-stories-by-filters`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        genre: genre,
        page: page,
        limit: limit,
      }),
    });
    let data = {} as StoryResponse;
    if (response.ok) { data = await response.json() as StoryResponse; }
    return data.stories || [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

const allGenres = ['Fantasy', 'Sci-Fi', 'Mystery', 'Romance', 'Horror', 'Thriller'];

export default function HomeContent() {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const { data: stories = [], isLoading } = useQuery({
    queryKey: ['stories', selectedGenres, searchQuery, currentPage],
    queryFn: async () => {
      if (selectedGenres.length > 0) {
        const results = await Promise.all(selectedGenres.map(genre => fetchStoriesByFilter({ genre, page: currentPage, limit })));
        return results.flat();
      }
      return await fetchStories(currentPage, limit);
    },
  });

  const filteredBooks = stories.filter((book: StoryDetails) =>
    searchQuery
      ? book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  );

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const isLastPage = filteredBooks.length < limit;

  return (
    <div className="flex flex-col w-full bg-gray-50 text-gray-900 mt-16 flex-grow">
      <section className="w-full text-center py-12 bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
        <h1 className="text-4xl font-bold tracking-tight">Discover Stories</h1>
        <p className="mt-4 text-lg max-w-2xl mx-auto">
          Browse through our collection of stories and find your next favorite
          read.
        </p>
      </section>

      <div className="flex flex-col md:flex-row max-w-7xl mx-auto w-full px-4 py-8">
        <Button
          variant="outline"
          className="md:hidden mb-4"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? 'Hide Filters' : 'Show Filters'}
        </Button>

        <aside
          className={`${isSidebarOpen ? 'block' : 'hidden'} md:block w-full md:w-64 shrink-0 mb-6 md:mb-0 md:mr-8`}
        >
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Filters</CardTitle>
              <div className="mt-4">
                <Input
                  placeholder="Search books..."
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
                  {allGenres.map((genre) => (
                    <div key={genre} className="flex items-center space-x-2">
                      <Checkbox
                        id={`genre-${genre}`}
                        checked={selectedGenres.includes(genre)}
                        onCheckedChange={() => toggleGenre(genre)}
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

        <div className="flex-grow">
          <h2 className="text-2xl font-bold mb-6">
            {isLoading
              ? 'Loading...'
              : `${filteredBooks.length} ${filteredBooks.length === 1 ? 'Book' : 'Books'} Found`}
          </h2>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <p className="text-lg text-gray-500">Loading stories...</p>
            </div>
          ) :
            filteredBooks.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg text-gray-500">
                  No books found.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBooks.map((book) => (
                  <Card
                    key={book.id.toString()}
                    className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300"
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="line-clamp-2">{book.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <Tag className="h-4 w-4 mr-1" />
                        <span>{book.genre}</span>
                      </div>
                      <p className="text-gray-700 line-clamp-3">
                        {book.createdAt && (
                          <div className="flex items-center text-sm text-gray-600 mb-4">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>Started: {formatDate(book.createdAt)}</span>
                          </div>
                        )}
                        {book.description}
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full">
                        <BookOpen className="mr-2 h-4 w-4" />
                        Read Now
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
        </div>
      </div>

      <div className="flex justify-center mt-12 space-x-4 mb-4">
        <Button
          variant="outline"
          onClick={handlePrevPage}
          disabled={currentPage === 1 || isLoading}
        >
          Previous
        </Button>
        <span className="flex items-center justify-center text-lg">
          Page {currentPage}
        </span>
        <Button
          variant="outline"
          onClick={handleNextPage}
          disabled={isLastPage || isLoading}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
