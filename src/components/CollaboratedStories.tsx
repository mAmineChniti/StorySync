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
import { env } from "@/env";
import { formatDate, getAccessToken } from "@/lib";
import { type UserStruct } from "@/types/authInterfaces";
import { type StoryDetails, type StoryResponse } from "@/types/storyResponses";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Edit, Eye, Tag, User, Users } from "lucide-react";
import { type ObjectId } from "mongodb";
import { useRouter } from "next/navigation";
import { useState } from "react";

const fetchCollaboratedStories = async (
  page: number,
  limit: number,
): Promise<StoryDetails[]> => {
  const NEXT_PUBLIC_STORY_API_URL = env.NEXT_PUBLIC_STORY_API_URL;
  const authToken = getAccessToken();
  if (!authToken) {
    console.error("No authentication token found");
    return [];
  }

  try {
    const response = await fetch(
      `${NEXT_PUBLIC_STORY_API_URL}/collaborations`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ page, limit }),
      },
    );

    if (!response.ok) {
      return [];
    }

    const data = (await response.json()) as StoryResponse;

    if (!data || !Array.isArray(data.stories)) {
      return [];
    }

    return data.stories;
  } catch (error) {
    console.error("Error fetching collaborated stories:", error);
    return [];
  }
};

const fetchUserProfile = async (
  userId: ObjectId,
): Promise<{ first_name: string; last_name: string }> => {
  const NEXT_PUBLIC_AUTH_API_URL = env.NEXT_PUBLIC_AUTH_API_URL;
  try {
    const response = await fetch(`${NEXT_PUBLIC_AUTH_API_URL}/fetchuser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: userId.toString() }),
    });

    if (!response.ok) {
      console.warn("Failed to fetch user profile");
      return { first_name: "Unknown", last_name: "User" };
    }

    const responseData = (await response.json()) as {
      message: string;
      user: UserStruct;
    };
    return {
      first_name: responseData.user.first_name,
      last_name: responseData.user.last_name,
    };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return { first_name: "Unknown", last_name: "User" };
  }
};

const OwnerInfo = ({ ownerId }: { ownerId: ObjectId }) => {
  const { data: ownerData, isLoading } = useQuery({
    queryKey: ["user", ownerId.toString()],
    queryFn: () => fetchUserProfile(ownerId),
    staleTime: 1000 * 60 * 5,
  });

  return isLoading ? (
    <Skeleton className="h-4 w-20 inline-block" />
  ) : (
    <span>
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
    queryFn: () => fetchCollaboratedStories(currentPage, limit),
  });
  const stories = data ?? [];
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
            There was an error loading your collaborations. Please try again
            later.
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
        <CardTitle className="text-2xl">Collaborations</CardTitle>
        <CardDescription>
          Stories you&apos;re collaborating on with other authors
        </CardDescription>
      </CardHeader>
      <CardContent>
        {stories?.length === 0 ? (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium">No collaborations yet</h3>
            <p className="mt-2 text-gray-500">
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
                      <User className="h-4 w-4 mr-1" />
                      <span>
                        Owner: <OwnerInfo ownerId={story.owner_id} />
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Updated: {formatDate(story.updated_at)}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Contribute
                    </Button>
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-1" />
                      View Story
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
          disabled={currentPage === 1 || isLoading}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        >
          Previous
        </Button>
        <span className="text-lg">Page {currentPage}</span>
        <Button
          className="cursor-pointer"
          disabled={stories.length < limit || isLoading}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </Button>
      </CardFooter>
    </Card>
  );
}
