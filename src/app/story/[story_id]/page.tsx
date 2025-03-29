import StoryEditor from "@/components/StoryEditor";
import { Skeleton } from "@/components/ui/skeleton";
import { env } from "@/env";
import { StoryService } from "@/lib/requests";
import { cn } from "@/lib/utils";
import { type Metadata } from "next";
import { Suspense } from "react";

const siteUrl =
  env.NEXT_PUBLIC_SITE_URL || "https://storysync-delta.vercel.app";

export async function generateMetadata({
  params,
}: {
  params: { story_id: string };
}): Promise<Metadata> {
  try {
    const story = await StoryService.getDetails(params.story_id);

    if (!story) {
      return {
        title: "Story Not Found",
        description: "The requested story could not be found.",
      };
    }

    return {
      title: `${story.title} | StorySync`,
      description: story.description || "A story on StorySync",
      openGraph: {
        type: "article",
        title: story.title,
        description: story.description || "A story on StorySync",
        url: `${siteUrl}/story/${params.story_id}`,
        images: [
          {
            url: `/story/${params.story_id}/opengraph-image`,
            width: 1200,
            height: 630,
            alt: story.title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: story.title,
        description: story.description || "A story on StorySync",
        images: [`/story/${params.story_id}/twitter-image`],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Story | StorySync",
      description: "A story on StorySync",
    };
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
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton
                key={i}
                className="w-8 h-8 rounded-sm bg-gray-200 dark:bg-gray-700"
              />
            ))}
          </div>
          <div className="p-4 space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton
                key={i}
                className={cn(
                  "w-full h-5 rounded-sm",
                  { "w-3/4": i === 7 },
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
