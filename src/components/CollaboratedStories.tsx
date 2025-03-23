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
import { AuthService, StoryService } from "@/lib/requests";
import { type StoryDetails } from "@/types/storyInterfaces";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Edit, Eye, Tag, User, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const OwnerInfo = ({ ownerId }: { ownerId: string }) => {
  const { data: ownerData, isLoading } = useQuery({
    queryKey: ["user", ownerId],
    queryFn: () => AuthService.getProfile(ownerId),
  });

  return isLoading ? (
    <Skeleton className="h-4 w-20 bg-muted" />
  ) : (
    <span className="line-clamp-1">
      {ownerData?.first_name} {ownerData?.last_name}
    </span>
  );
};

export default function CollaboratedStories() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError } = useQuery<StoryDetails[]>({
    queryKey: ["collaboratedStories", currentPage],
    queryFn: () => StoryService.getCollaboratedStories(currentPage, limit),
    retry: false,
  });

  const stories = data ?? [];

  if (isLoading) {
    return (
      <Card className="bg-card text-card-foreground border-border">
        <CardHeader>
          <Skeleton className="h-8 w-2/3 mb-2 bg-muted" />
          <Skeleton className="h-4 w-1/2 bg-muted" />
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="flex flex-col md:flex-row gap-4 border-b border-border pb-6 last:border-0"
              >
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                    <Skeleton className="h-8 w-2/3 bg-muted" />
                  </div>
                  <Skeleton className="h-6 w-full mb-4 bg-muted" />
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-muted-foreground mb-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center">
                        <Skeleton className="h-4 w-1/2 mr-1 bg-muted" />
                      </div>
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
      <Card className="bg-card text-card-foreground border-border">
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription className="text-muted-foreground">
            There was an error loading your collaborations. Please try again later.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button className="cursor-pointer" variant="secondary" onClick={() => router.refresh()}>
            Retry
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="bg-card text-card-foreground border-border">
      <CardHeader>
        <CardTitle className="text-2xl">Collaborations</CardTitle>
        <CardDescription className="text-muted-foreground">
          Stories you&apos;re collaborating on with other authors
        </CardDescription>
      </CardHeader>
      <CardContent>
        {stories?.length === 0 ? (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No collaborations yet</h3>
            <p className="mt-2 text-muted-foreground">
              You haven&apos;t collaborated on any stories yet. Explore stories
              to find collaboration opportunities!
            </p>
            <Button
              className="mt-4 cursor-pointer"
              onClick={() => router.push("/browse")}
            >
              Explore Stories
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {stories?.map((story) => (
              <div
                key={story.id}
                className="flex flex-col md:flex-row gap-4 border-b border-border pb-6 last:border-0"
              >
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold">{story.title}</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">{story.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center">
                      <Tag className="h-4 w-4 mr-1 flex-shrink-0" />
                      <span className="line-clamp-1">{story.genre}</span>
                    </div>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1 flex-shrink-0" />
                      <span>
                        Owner: <OwnerInfo ownerId={story.owner_id} />
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 flex-shrink-0" />
                      <span>Updated: {formatDate(story.updated_at)}</span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button size="sm" className="gap-2 cursor-pointer">
                      <Edit className="h-4 w-4" />
                      Contribute
                    </Button>
                    <Button size="sm" variant="outline" className="gap-2 border-border cursor-pointer">
                      <Eye className="h-4 w-4" />
                      View Story
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <Button
          variant="outline"
          className="w-full sm:w-auto border-border cursor-pointer"
          disabled={currentPage === 1 || isLoading}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        >
          Previous
        </Button>
        <span className="text-lg">Page {currentPage}</span>
        <Button
          variant="outline"
          className="w-full sm:w-auto border-border cursor-pointer"
          disabled={stories.length < limit || isLoading}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </Button>
      </CardFooter>
    </Card>
  );
}
