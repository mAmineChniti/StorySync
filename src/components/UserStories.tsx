"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib";
import { StoryService } from "@/lib/requests";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BookOpen, Calendar, Edit, Tag, Trash2, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function UserStories() {
  const [currentPage, setCurrentPage] = useState(1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const limit = 5;
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["userStories", currentPage],
    queryFn: () => StoryService.getUserStories(currentPage, limit),
  });

  const mutation = useMutation<void, Error, string>({
    mutationFn: (storyId: string) => StoryService.delete(storyId),
    onSuccess: async () => {
      setErrorMessage(null);
      try {
        await queryClient.invalidateQueries({ queryKey: ["userStories"] });
      } catch {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Failed to refresh stories list",
        );
      }
    },
    onError: (error) => {
      setErrorMessage(error.message);
    },
  });

  const stories = data ?? [];

  const handleDeleteStory = (storyId: string) => {
    mutation.mutate(storyId);
  };

  const handleNextPage = () => setCurrentPage((prev) => prev + 1);
  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

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
                    <Skeleton className="h-4 w-1/2 mr-1" />
                    <Skeleton className="h-4 w-1/2 mr-1" />
                    <Skeleton className="h-4 w-1/2 mr-1" />
                    <Skeleton className="h-4 w-1/2 mr-1" />
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
            {error instanceof Error
              ? error.message
              : "There was an error loading your stories"}
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button className="cursor-pointer" onClick={() => router.refresh()}>
            Retry
          </Button>
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
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <span className="block sm:inline">{errorMessage}</span>
            <button
              className="absolute top-0 right-0 px-3 py-2"
              onClick={() => setErrorMessage(null)}
            >
              ×
            </button>
          </div>
        )}
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
            <Button className="cursor-pointer mt-4">
              Create Your First Story
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {stories.map((story) => (
              <div
                key={story.id}
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
                      className="cursor-pointer"
                      size="sm"
                      onClick={() =>
                        router.push(`/story/${story.id}`)
                      }
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Continue Writing
                    </Button>
                    <Button
                      className="cursor-pointer"
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteStory(story.id)}
                      disabled={mutation.isPending}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      {mutation.isPending ? "Deleting..." : "Delete"}
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
        <Button
          className="cursor-pointer"
          onClick={handleNextPage}
          disabled={stories.length < limit || isLoading}
        >
          Next
        </Button>
      </CardFooter>
    </Card>
  );
}
