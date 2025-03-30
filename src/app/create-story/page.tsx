import { type Metadata } from "next";
import { Suspense } from "react";

import CreateStory from "@/components/CreateStory";
import ProfileLayout from "@/components/ProfileLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Create Story",
};

const CreateStorySkeleton = () => (
  <div className="container mx-auto px-4 py-8">
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="w-1/3 h-10" />
      </div>

      <Card className="w-full">
        <CardHeader>
          <Skeleton className="w-1/2 h-8" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Skeleton className="w-1/3 h-6" />
              <Skeleton className="w-full h-10" />
            </div>
            <div className="space-y-2">
              <Skeleton className="w-1/3 h-6" />
              <Skeleton className="w-full h-10" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="w-1/3 h-6" />
            <Skeleton className="w-full h-32" />
          </div>
          <div className="flex justify-end space-x-4">
            <Skeleton className="w-1/6 h-10" />
            <Skeleton className="w-1/6 h-10" />
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default function CreateStoryPage() {
  return (
    <ProfileLayout>
      <Suspense fallback={<CreateStorySkeleton />}>
        <CreateStory />
      </Suspense>
    </ProfileLayout>
  );
}
