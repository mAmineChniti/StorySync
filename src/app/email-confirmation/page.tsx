import { type Metadata } from "next";
import { Suspense } from "react";

import EmailConfirmationWarning from "@/components/EmailConfirmationWarning";
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

export const metadata: Metadata = {
  title: "Email Confirmation",
};

const EmailConfirmationSkeleton = () => (
  <div className="flex items-center justify-center p-4 w-full min-h-[calc(100vh-8rem)]">
    <Card className="w-[400px] border-destructive/50">
      <CardHeader className="text-center">
        <CardTitle className="text-destructive">
          <Skeleton className="h-8 w-2/3 mx-auto" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-6 w-full" />
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button disabled className="w-full">
          <Skeleton className="h-6 w-1/2 mx-auto" />
        </Button>
        <Button disabled variant="outline" className="w-full">
          <Skeleton className="h-6 w-1/2 mx-auto" />
        </Button>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button disabled variant="destructive" className="w-1/3">
          <Skeleton className="h-6 w-1/2 mx-auto" />
        </Button>
        <Button disabled className="w-1/3">
          <Skeleton className="h-6 w-1/2 mx-auto" />
        </Button>
      </CardFooter>
    </Card>
  </div>
);

export default function EmailConfirmationPage() {
  return (
    <Suspense fallback={<EmailConfirmationSkeleton />}>
      <EmailConfirmationWarning />
    </Suspense>
  );
}
