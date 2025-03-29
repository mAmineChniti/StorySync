import AuthPage from "@/components/AuthPage";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { type Metadata } from "next";
import { Suspense } from "react";

const RegisterSkeleton = () => (
  <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-8">
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle>
          <Skeleton className="h-10 w-2/3 mx-auto" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-6 w-full" />
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>
            <Skeleton className="h-6 w-1/3" />
          </Label>
          <Input disabled placeholder="">
            <Skeleton className="h-10 w-full" />
          </Input>
        </div>
        <div className="space-y-2">
          <Label>
            <Skeleton className="h-6 w-1/3" />
          </Label>
          <Input disabled placeholder="">
            <Skeleton className="h-10 w-full" />
          </Input>
        </div>
        <div className="space-y-2">
          <Label>
            <Skeleton className="h-6 w-1/3" />
          </Label>
          <Input disabled placeholder="">
            <Skeleton className="h-10 w-full" />
          </Input>
        </div>
        <div className="flex flex-col space-y-4">
          <Button disabled className="w-full">
            <Skeleton className="h-10 w-1/2 mx-auto" />
          </Button>
          <div className="flex items-center justify-center">
            <Skeleton className="h-6 w-1/2" />
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

export const metadata: Metadata = {
  title: "Register",
};

export default function RegisterPage() {
  return (
    <Suspense fallback={<RegisterSkeleton />}>
      <AuthPage isLogin={false} />
    </Suspense>
  );
}
