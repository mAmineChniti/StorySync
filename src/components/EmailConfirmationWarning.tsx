"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AuthService } from "@/lib/requests";
import { useMutation } from "@tanstack/react-query";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function EmailConfirmationWarning() {
  const router = useRouter();

  const resendConfirmationMutation = useMutation({
    mutationFn: () => AuthService.resendConfirmationEmail(),
    onSuccess: () => {
      toast.success("Confirmation email sent. Please check your inbox.");
    },
    onError: (error: Error) => {
      let errormsg = "";
      if (typeof error.message !== "string")
        errormsg = (JSON.parse(error.message) as { message: string }).message;
      else errormsg = error.message;
      toast.error(errormsg);
    },
  });

  const handleLogout = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    await deleteCookie("user");
    await deleteCookie("access");
    await deleteCookie("refresh");
    router.push("/");
    router.refresh();
  };

  return (
    <div className="flex items-center justify-center p-4 w-full min-h-[calc(100vh-8rem)]">
      <Card className="w-[400px] border-destructive/50">
        <CardHeader className="text-center">
          <CardTitle className="text-destructive">
            Email Not Confirmed
          </CardTitle>
          <CardDescription>
            Your email address has not been confirmed yet.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm break-words text-muted-foreground mb-4">
            Your account will be deleted in 3 days if you do not confirm your
            email. Please check your inbox or spam for the confirmation link or
            request a new one.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button
            variant="default"
            className="w-full cursor-pointer"
            onClick={() => resendConfirmationMutation.mutate()}
            disabled={resendConfirmationMutation.isPending}
          >
            {resendConfirmationMutation.isPending
              ? "Sending..."
              : "Resend Confirmation Email"}
          </Button>
          <Button
            variant="destructive"
            className="w-full cursor-pointer"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
