"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BookOpen, Calendar, Edit, Tag, Trash2, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

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
import { StoryService } from "@/lib/requests";
import { formatDate } from "@/lib/utils";

export default function MyStories() {
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingStoryId, setDeletingStoryId] = useState<string | undefined>(
    undefined,
  );
  const limit = 5;
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["userStories", currentPage, limit],
    queryFn: () => StoryService.getUserStories(currentPage, limit),
    staleTime: 30 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
  });

  const mutation = useMutation<void, Error, string>({
    mutationFn: (storyId: string) => StoryService.delete(storyId),
    onSuccess: async () => {
      try {
        await queryClient.invalidateQueries({ queryKey: ["userStories"] });
        toast.success("Story deleted successfully");
      } catch (error: unknown) {
        let errormsg = "";
        if (error instanceof Error) {
          errormsg =
            typeof error.message === "string"
              ? error.message
              : (JSON.parse(error.message) as { message: string }).message;
        }
        toast.error(errormsg);
      }
    },
    onError: (error: Error) => {
      let errormsg = "";
      errormsg =
        typeof error.message === "string"
          ? error.message
          : (JSON.parse(error.message) as { message: string }).message;
      toast.error(errormsg);
    },
  });

  const stories = data ?? [];

  const handleDeleteStory = (storyId: string) => {
    setDeletingStoryId(storyId);
    mutation.mutate(storyId);
  };

  const handleNextPage = () => setCurrentPage((previous) => previous + 1);
  const handlePreviousPage = () =>
    setCurrentPage((previous) => Math.max(previous - 1, 1));

  if (isLoading) {
    return (
      <Card className="mx-auto max-w-7xl bg-card text-card-foreground border-border">
        <CardHeader>
          <Skeleton className="h-8 w-2/3 mb-2 bg-muted" />
          <Skeleton className="h-4 w-1/2 bg-muted" />
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {[1, 2].map((index) => (
              <div
                key={index}
                className="flex flex-col gap-4 border-b border-border pb-6 last:border-0"
              >
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                    <Skeleton className="h-8 w-2/3 bg-muted" />
                  </div>
                  <Skeleton className="h-6 w-full mb-4 bg-muted" />
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm text-muted-foreground mb-4">
                    {[1, 2, 3, 4].map((index) => (
                      <Skeleton key={index} className="h-4 w-1/2 bg-muted" />
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-8 w-32 bg-muted" />
                    <Skeleton className="h-8 w-32 bg-muted" />
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
      <Card className="mx-auto max-w-7xl bg-card text-card-foreground border-border">
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription className="text-muted-foreground">
            {error instanceof Error
              ? error.message
              : "There was an error loading your stories"}
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button variant="secondary" onClick={() => router.refresh()}>
            Retry
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-7xl bg-card text-card-foreground border-border">
      <CardHeader>
        <CardTitle className="text-2xl">My Stories</CardTitle>
        <CardDescription className="text-muted-foreground">
          Stories you&apos;ve written and are currently working on
        </CardDescription>
      </CardHeader>
      <CardContent>
        {stories.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No stories yet</h3>
            <p className="mt-2 text-muted-foreground">
              You haven&apos;t created any stories yet. Start writing your first
              story!
            </p>
            <Button
              className="mt-4 cursor-pointer"
              onClick={() => router.push("/create-story")}
            >
              Create Your First Story
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {stories.map((story) => (
              <div
                key={story.id}
                className="flex flex-col gap-4 border-b border-border pb-6 last:border-0"
              >
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold">{story.title}</h3>
                  </div>
                  <p className="text-muted-foreground line-clamp-4 break-words mb-4">
                    {story.description}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center">
                      <Tag className="h-4 w-4 mr-1 flex-shrink-0" />
                      <span className="line-clamp-1">{story.genre}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 flex-shrink-0" />
                      <span>Started: {formatDate(story.created_at)}</span>
                    </div>
                    <div className="flex items-center">
                      <Edit className="h-4 w-4 mr-1 flex-shrink-0" />
                      <span>Updated: {formatDate(story.updated_at)}</span>
                    </div>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1 flex-shrink-0" />
                      <span>
                        {story.collaborators?.length ?? 0} Collaborators
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      size="sm"
                      onClick={() => router.push(`/story/${story.id}`)}
                      className="gap-2 cursor-pointer"
                    >
                      <Edit className="h-4 w-4" />
                      Continue Writing
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteStory(story.id)}
                      disabled={deletingStoryId === story.id}
                      className="gap-2 cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                      {deletingStoryId === story.id ? "Deleting..." : "Delete"}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-between gap-4">
        <Button
          variant="outline"
          className="w-full sm:w-auto border-border"
          onClick={handlePreviousPage}
          disabled={currentPage === 1 || isLoading}
        >
          Previous
        </Button>
        <span className="text-lg">Page {currentPage}</span>
        <Button
          variant="outline"
          className="w-full sm:w-auto border-border"
          onClick={handleNextPage}
          disabled={stories.length < limit || isLoading}
        >
          Next
        </Button>
      </CardFooter>
    </Card>
  );
}
