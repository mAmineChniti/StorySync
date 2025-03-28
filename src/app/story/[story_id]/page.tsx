import StoryEditor from "@/components/StoryEditor";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

const StoryEditorSkeleton = () => (
  <div className="w-full max-w-4xl mx-auto p-4">
    <Skeleton className="w-full h-12 mb-4" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Skeleton className="w-full h-64" />
      <Skeleton className="w-full h-64" />
    </div>
    <div className="mt-4 space-y-2">
      <Skeleton className="w-full h-10" />
      <Skeleton className="w-full h-10" />
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
