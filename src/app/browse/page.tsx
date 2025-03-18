import HomeContent from "@/components/HomeContent";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

const FallBack = () => (
  <div className="flex flex-col flex-1 w-full bg-gray-50 text-gray-900 ">
    <section className="w-full text-center py-12 bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
      <h1 className="text-4xl font-bold tracking-tight">
        <Skeleton className="w-1/2 mx-auto" />
      </h1>
      <p className="mt-4 text-lg max-w-2xl mx-auto">
        <Skeleton className="w-3/4 mx-auto" />
      </p>
    </section>

    <div className="flex flex-col md:flex-row max-w-7xl mx-auto w-full px-4 py-8">
      <aside className="md:block w-full md:w-64 shrink-0 mb-6 md:mb-0 md:mr-8">
        <Card className="sticky top-24">
          <CardHeader>
            <Skeleton className="w-1/2 h-6" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">
                <Skeleton className="w-1/4 h-4" />
              </h3>
              <div className="space-y-2">
                {Array(5)
                  .fill(0)
                  .map((_, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <Skeleton className="w-4 h-4 rounded-full" />
                      <Skeleton className="w-1/2 h-4" />
                    </div>
                  ))}
              </div>
            </div>
            <Skeleton className="w-full h-10" />
          </CardContent>
        </Card>
      </aside>

      <div className="flex-grow flex flex-col">
        <h2 className="text-2xl font-bold mb-6">
          <Skeleton className="w-1/3 h-6" />
        </h2>

        <div className="flex-1 flex flex-col">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
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
                  <CardContent className="flex-grow overflow-hidden space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Skeleton className="w-4 h-4 mr-1" />
                      <Skeleton className="w-1/3 h-4" />
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Skeleton className="w-4 h-4 mr-1" />
                      <Skeleton className="w-1/2 h-4" />
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Skeleton className="w-4 h-4 mr-1" />
                      <Skeleton className="w-1/3 h-4" />
                    </div>
                    <Skeleton className="w-full h-20 mt-2" />
                  </CardContent>
                  <CardFooter className="mt-auto">
                    <Skeleton className="w-full h-10" />
                  </CardFooter>
                </Card>
              ))}
          </div>
          <div className="flex justify-center mt-6">
            <Skeleton className="w-32 h-10" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function Browse() {
  return (
    <Suspense fallback={<FallBack />}>
      <HomeContent />
    </Suspense>
  );
}
