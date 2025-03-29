import CollaboratedStories from "@/components/CollaboratedStories";
import ProfileLayout from "@/components/ProfileLayout";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { type Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Collaborations",
};

const CollaborationsSkeleton = () => (
  <div className="container mx-auto px-4 py-8">
    <div className="flex justify-between items-center mb-6">
      <Skeleton className="w-1/4 h-8" />
      <Skeleton className="w-1/6 h-10" />
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array(6)
        .fill(0)
        .map((_, idx) => (
          <Card
            key={idx}
            className="flex flex-col h-fit w-full max-w-[350px] mx-auto hover:shadow-lg transition-shadow duration-300"
          >
            <CardHeader className="pb-2">
              <Skeleton className="w-3/4 h-6" />
            </CardHeader>
            <CardContent className="flex-grow space-y-2">
              <div className="flex items-center text-sm">
                <Skeleton className="w-4 h-4 mr-2" />
                <Skeleton className="w-1/2 h-4" />
              </div>
              <div className="flex items-center text-sm">
                <Skeleton className="w-4 h-4 mr-2" />
                <Skeleton className="w-1/3 h-4" />
              </div>
              <Skeleton className="w-full h-20" />
            </CardContent>
            <CardFooter className="mt-auto flex justify-between">
              <Skeleton className="w-1/3 h-8" />
              <Skeleton className="w-1/3 h-8" />
            </CardFooter>
          </Card>
        ))}
    </div>

    <div className="flex justify-center mt-6 space-x-4">
      <Skeleton className="w-24 h-10" />
      <Skeleton className="w-24 h-10" />
    </div>
  </div>
);

export default function CollaborationsPage() {
  return (
    <ProfileLayout>
      <Suspense fallback={<CollaborationsSkeleton />}>
        <CollaboratedStories />
      </Suspense>
    </ProfileLayout>
  );
}
