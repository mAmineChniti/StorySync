import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AuthService } from "@/utils/requests";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

export function PasswordResetEmailStage({
  onBackToLogin,
  onResetEmailSent,
}: {
  onBackToLogin: () => void;
  onResetEmailSent: () => void;
}) {
  const passwordResetForm = useForm({
    resolver: zodResolver(
      z.object({
        email: z.string().email("Invalid email address"),
      }),
    ),
    defaultValues: { email: "" },
  });
  const passwordResetInitMutation = useMutation({
    mutationFn: (email: string) => AuthService.initiatePasswordReset(email),
    onSuccess: () => {
      toast.success("Password reset email sent. Check your inbox.");
      onResetEmailSent();
    },
    onError: () => {
      toast.error("Failed to initiate password reset");
    },
  });

  const onPasswordResetEmailSubmit = (data: { email: string }) => {
    passwordResetInitMutation.mutate(data.email);
  };

  return (
    <Form {...passwordResetForm}>
      <form
        onSubmit={passwordResetForm.handleSubmit(onPasswordResetEmailSubmit)}
        className="space-y-6 w-full"
      >
        <FormField
          name="email"
          control={passwordResetForm.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email for Password Reset</FormLabel>
              <FormControl>
                <Input
                  placeholder="example@domain.com"
                  className="bg-card/50 border-border focus:bg-card focus:ring-2 focus:ring-primary transition-colors"
                  autoComplete="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full h-12 text-base transition-opacity cursor-pointer"
          disabled={passwordResetInitMutation.isPending}
        >
          {passwordResetInitMutation.isPending ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              Sending Reset Email...
            </>
          ) : (
            "Send Reset Email"
          )}
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="w-full cursor-pointer"
          onClick={onBackToLogin}
        >
          Back to Login
        </Button>
      </form>
    </Form>
  );
}
