import StoryEditor from "@/components/StoryEditor";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Suspense } from "react";

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
        <StoryEditor />
      </Suspense>
    </div>
  );
}
