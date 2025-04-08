import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex items-center justify-center p-4 w-full min-h-[calc(100vh-8rem)]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">404 - Page Not Found</CardTitle>
          <CardDescription className="text-center text-md">
            Oops! The page you are looking for doesn&apos;t exist.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <Button className="cursor-pointer" asChild>
            <Link href="/">Go back to home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
