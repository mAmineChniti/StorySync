"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthService, StoryService } from "@/lib/requests";
import { formatDate } from "@/lib/utils";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { BookOpen, Calendar, Tag, User } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const OwnerName = ({ ownerId }: { ownerId: string }) => {
  const { data, isPending, error } = useQuery({
    queryKey: ["ownerName", ownerId],
    queryFn: () => AuthService.getUserName(ownerId),
    staleTime: 60 * 60 * 1000,
    gcTime: 2 * 60 * 60 * 1000,
  });

  if (isPending) return <span className="line-clamp-1">Loading author...</span>;
  if (error)
    return (
      <span className="line-clamp-1 text-destructive/80 dark:text-destructive/70">
        Unknown Author
      </span>
    );
  return (
    <span className="line-clamp-1">
      {data?.first_name} {data?.last_name}
    </span>
  );
};

export default function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const limit = 10;

  const {
    data,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    error,
  } = useInfiniteQuery({
    queryKey: ["stories", selectedGenres, searchQuery, limit],
    initialPageParam: 1,
    staleTime: 30 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    queryFn: async ({ pageParam }) => {
      const result =
        selectedGenres.length > 0
          ? await StoryService.getByFilters({
              genres: selectedGenres,
              page: pageParam,
              limit,
            })
          : await StoryService.list(pageParam, limit);
      return result;
    },
    getNextPageParam: (lastPage, allPages) =>
      lastPage?.length === limit ? allPages.length + 1 : undefined,
  });

  useEffect(() => {
    if (error) {
      let errormsg = "";
      if (typeof error.message !== "string")
        errormsg = (JSON.parse(error.message) as { message: string }).message;
      else errormsg = error.message;
      toast.error(errormsg, {
        action: {
          label: "Retry",
          onClick: () => {
            router.refresh();
          },
        },
      });
    }
  }, [error, router]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [selectedGenres, searchQuery, router, searchParams]);

  const allStories =
    (data?.pages.flat().filter(Boolean) ?? []).length > 0
      ? (data?.pages.flat().filter(Boolean) ?? []).sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        )
      : [];
  const filteredStories = allStories.filter((story) =>
    story && searchQuery
      ? [story.title, story.description].some(
          (text) =>
            typeof text === "string" &&
            text.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      : true,
  );

  const hasActiveFilters = searchQuery || selectedGenres.length > 0;
  const showEmptyState = filteredStories.length === 0 && !isFetching;

  return (
    <div className="flex flex-col flex-1 w-full bg-background text-foreground">
      <section className="w-full text-center py-8 sm:py-12  bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight px-2">
          Discover Stories
        </h1>
        <p className="mt-2 sm:mt-4 text-sm sm:text-lg max-w-2xl mx-auto px-4">
          Browse through our collection of stories and find your next favorite
          read.
        </p>
      </section>

      <div className="flex flex-col md:flex-row max-w-7xl mx-auto w-full px-2 sm:px-4 py-4 sm:py-8">
        <aside className="md:block w-full md:w-64 shrink-0 mb-4 md:mb-0 md:mr-6">
          <Card className="sticky top-24 bg-card text-card-foreground max-h-[calc(100vh-6rem)] overflow-y-auto">
            <CardHeader>
              <CardTitle>Filters</CardTitle>
              <div className="mt-4">
                <Input
                  placeholder="Search stories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-background text-foreground"
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Genres</h3>
                <div className="space-y-2">
                  {[
                    "Fantasy",
                    "Science Fiction",
                    "Mystery",
                    "Romance",
                    "Horror",
                    "Thriller",
                    "Historical Fiction",
                    "Young Adult",
                    "Children's",
                    "Biography",
                    "Non-fiction",
                    "Poetry",
                    "Drama",
                  ].map((genre) => (
                    <div key={genre} className="flex items-center space-x-2">
                      <Checkbox
                        id={`genre-${genre}`}
                        checked={selectedGenres.includes(genre)}
                        onCheckedChange={(checked) =>
                          setSelectedGenres((prev) =>
                            checked
                              ? [...prev, genre]
                              : prev.filter((g) => g !== genre),
                          )
                        }
                        className="text-primary-foreground border-border"
                      />
                      <Label
                        htmlFor={`genre-${genre}`}
                        className="text-foreground text-sm sm:text-base"
                      >
                        {genre}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full border-border text-foreground hover:bg-accent cursor-pointer"
                onClick={() => {
                  setSelectedGenres([]);
                  setSearchQuery("");
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        </aside>

        <div className="flex-grow flex flex-col">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 px-2 sm:px-0">
            {isFetching && !data
              ? "Loading..."
              : `${filteredStories.length} ${filteredStories.length === 1 ? "Story" : "Stories"} Found`}
          </h2>

          {isFetching && !data ? (
            <div className="flex justify-center items-center py-8 sm:py-12">
              <p className="text-muted-foreground text-sm sm:text-base">
                Loading stories...
              </p>
            </div>
          ) : showEmptyState ? (
            <div className="text-center py-8 sm:py-12 space-y-4">
              <p className="text-muted-foreground text-sm sm:text-base">
                {hasActiveFilters
                  ? "No stories match your filters."
                  : "No stories available yet."}
              </p>
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  className="border-border text-foreground hover:bg-accent mx-auto cursor-pointer"
                  onClick={() => {
                    setSelectedGenres([]);
                    setSearchQuery("");
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col">
              <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full">
                {filteredStories.map(
                  (story) =>
                    story && (
                      <Card
                        key={story.id}
                        className="flex flex-col h-fit w-full mx-auto min-[480px]:max-w-none sm:max-w-[350px] hover:shadow-lg transition-shadow duration-300 bg-card text-card-foreground border-border"
                      >
                        <CardHeader className="pb-2">
                          <CardTitle className="line-clamp-2 text-base sm:text-lg">
                            {story.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow overflow-hidden space-y-2">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <User className="h-4 w-4 mr-1 flex-shrink-0" />
                            <OwnerName ownerId={story.owner_id} />
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Tag className="h-4 w-4 mr-1 flex-shrink-0" />
                            <span className="line-clamp-1">{story.genre}</span>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4 mr-1 flex-shrink-0" />
                            <span>Started: {formatDate(story.created_at)}</span>
                          </div>
                          <p className="text-foreground break-words line-clamp-4 mt-2 text-sm sm:text-base">
                            {story.description}
                          </p>
                        </CardContent>
                        <CardFooter className="mt-auto">
                          <Button
                            className="w-full text-sm sm:text-base cursor-pointer"
                            onClick={() => router.push(`/story/${story.id}`)}
                          >
                            <BookOpen className="mr-2 h-4 w-4" /> Read Now
                          </Button>
                        </CardFooter>
                      </Card>
                    ),
                )}
              </div>
              {hasNextPage && (
                <div className="flex justify-center mt-4 sm:mt-6">
                  <Button
                    className="text-sm sm:text-base cursor-pointer"
                    onClick={() => fetchNextPage()}
                    disabled={!hasNextPage || isFetchingNextPage}
                  >
                    {isFetchingNextPage ? "Loading more..." : "Load More"}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
