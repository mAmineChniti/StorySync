import { PrivacyPolicy } from "@/components/PrivacyPolicy";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { type Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

const PrivacyPolicyLoading = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <Skeleton className="h-12 w-3/4 mx-auto mb-4" />
        <Skeleton className="h-6 w-1/3 mx-auto" />
      </div>

      <Card className="w-full mb-6">
        <CardHeader className="pb-0">
          <Skeleton className="h-8 w-1/2" />
        </CardHeader>
        <CardContent className="p-0">
          <div className="max-h-[calc(100vh-300px)] overflow-y-auto px-6 py-4">
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="mb-6">
                <div className="flex items-center mb-3">
                  <Skeleton className="w-8 h-8 mr-3 rounded-full" />
                  <Skeleton className="h-6 w-1/2" />
                </div>

                <div className="pl-12">
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="text-center text-sm text-muted-foreground">
        <Skeleton className="h-4 w-3/4 mx-auto" />
      </div>
    </div>
  );
};

export default function PrivacyPolicyRoute() {
  return (
    <Suspense fallback={<PrivacyPolicyLoading />}>
      <PrivacyPolicy />
    </Suspense>
  );
}
