import { type Metadata } from "next";
import { Suspense } from "react";

import StoryEditor from "@/components/StoryEditor";
import { Skeleton } from "@/components/ui/skeleton";
import { StoryService } from "@/lib/requests";
import { cn } from "@/lib/utils";

export async function generateMetadata(properties: {
  params: Promise<{ story_id: string }>;
}): Promise<Metadata> {
  const parameters = await properties.params;
  try {
    const story = await StoryService.getDetails(parameters.story_id);

    if (!story) {
      return {
        title: "Story Not Found",
        description: "The requested story could not be found.",
      };
    }

    return {
      title: `${story.title} | StorySync`,
      description: story.description || "A story on StorySync",
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Story | StorySync",
      description: "A story on StorySync",
    };
  }
}

export async function generateStaticParams() {
  try {
    const storyIds = await StoryService.list(1, 100);
    return storyIds.map((id) => ({ story_id: id }));
  } catch (error) {
    console.error("Failed to generate static params:", error);
    return [];
  }
}

const StoryEditorSkeleton = () => (
  <div className="max-w-screen-md w-full mx-auto mt-16 p-4 sm:p-8 min-h-[80vh] flex flex-col justify-center">
    <div className="w-full shadow-lg dark:shadow-gray-800 rounded-lg">
      <div className="flex flex-col items-center text-center space-y-3 pb-2 p-4">
        <Skeleton className="w-3/4 h-10 mb-1 rounded-md" />
        <div className="flex flex-col items-center space-y-2">
          <Skeleton className="w-1/2 h-4 rounded-sm" />
          <Skeleton className="w-1/3 h-3 rounded-sm" />
          <Skeleton className="w-1/4 h-5 mt-2 rounded-full" />
        </div>
      </div>
      <div className="relative min-h-[40vh] p-4">
        <div className="prose max-w-none border rounded-lg bg-white dark:bg-gray-900">
          <div className="flex flex-wrap gap-2 mb-4 p-2 bg-gray-50 dark:bg-gray-800 rounded-t-lg border-b border-gray-200 dark:border-gray-700">
            {Array.from({ length: 12 }).map((_, index) => (
              <Skeleton
                key={index}
                className="w-8 h-8 rounded-sm bg-gray-200 dark:bg-gray-700"
              />
            ))}
          </div>
          <div className="p-4 space-y-3">
            {Array.from({ length: 8 }).map((_, index) => (
              <Skeleton
                key={index}
                className={cn(
                  "w-full h-5 rounded-sm",
                  { "w-3/4": index === 7 },
                  "bg-gray-100 dark:bg-gray-800",
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function Story() {
  return (
    <div className="flex flex-col flex-1 w-full items-center justify-between">
      <Suspense fallback={<StoryEditorSkeleton />}>
        <StoryEditor skeletonLoading={<StoryEditorSkeleton />} />
      </Suspense>
    </div>
  );
}
