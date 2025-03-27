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
import { passwordResetSchemaToken } from "@/types/authSchemas";
import { AuthService } from "@/utils/requests";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function PasswordResetTokenStage({
  onBackToEmailStage,
  onPasswordResetComplete,
}: {
  onBackToEmailStage: () => void;
  onPasswordResetComplete: () => void;
}) {
  const tokenForm = useForm({
    resolver: zodResolver(passwordResetSchemaToken),
    defaultValues: { token: "", password: "", confirmPassword: "" },
  });

  const passwordResetConfirmMutation = useMutation({
    mutationFn: ({ token, password }: { token: string; password: string }) =>
      AuthService.confirmPasswordReset(token, password),
    onSuccess: () => {
      toast.success("Password reset successful. Please log in.");
      onPasswordResetComplete();
    },
    onError: (error: Error) => {
      toast.error((JSON.parse(error.message) as { message: string }).message);
    },
  });
  const onPasswordResetTokenSubmit = (data: {
    token: string;
    password: string;
    confirmPassword: string;
  }) => {
    const { token, password } = data;
    passwordResetConfirmMutation.mutate({ token, password });
  };

  return (
    <Form {...tokenForm}>
      <form
        onSubmit={tokenForm.handleSubmit(onPasswordResetTokenSubmit)}
        className="space-y-6 w-full"
      >
        <FormField
          name="token"
          control={tokenForm.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reset Token</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter reset token"
                  className="bg-card/50 border-border focus:bg-card focus:ring-2 focus:ring-primary transition-colors"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="password"
          control={tokenForm.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter new password"
                  className="bg-card/50 border-border focus:bg-card focus:ring-2 focus:ring-primary transition-colors"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="confirmPassword"
          control={tokenForm.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm New Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Confirm new password"
                  className="bg-card/50 border-border focus:bg-card focus:ring-2 focus:ring-primary transition-colors"
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
          disabled={passwordResetConfirmMutation.isPending}
        >
          {passwordResetConfirmMutation.isPending ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              Resetting Password...
            </>
          ) : (
            "Reset Password"
          )}
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="w-full cursor-pointer"
          onClick={onBackToEmailStage}
        >
          Back to Email Stage
        </Button>
      </form>
    </Form>
  );
}
