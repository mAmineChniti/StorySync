"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { setCookie } from "cookies-next";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type * as z from "zod";

import { PasswordResetEmailStage } from "@/components/PasswordResetEmailStage";
import { PasswordResetTokenStage } from "@/components/PasswordResetTokenStage";
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
import { AuthService } from "@/lib/requests";
import type { LoginResponse } from "@/types/authInterfaces";
import { loginSchema } from "@/types/authSchemas";

export default function Login() {
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [resetStage, setResetStage] = useState<"email" | "token">("email");
  const router = useRouter();

  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: "", password: "" },
  });

  const loginMutation = useMutation<
    LoginResponse,
    Error,
    z.infer<typeof loginSchema>
  >({
    mutationFn: (data) => AuthService.login(data),
    onSuccess: async (userData) => {
      try {
        const cookieOptions = {
          path: "/",
          sameSite: "lax" as const,
          secure: globalThis.location?.protocol === "https:",
          expires: new Date(userData.tokens.access_expires_at),
        };
        await Promise.all([
          setCookie("user", JSON.stringify(userData.user), cookieOptions),
          setCookie(
            "access",
            JSON.stringify({
              access_token: userData.tokens.access_token,
              access_created_at: userData.tokens.access_created_at,
              access_expires_at: userData.tokens.access_expires_at,
            }),
            cookieOptions,
          ),
          setCookie(
            "refresh",
            JSON.stringify({
              refresh_token: userData.tokens.refresh_token,
              refresh_created_at: userData.tokens.refresh_created_at,
              refresh_expires_at: userData.tokens.refresh_expires_at,
            }),
            {
              path: "/",
              sameSite: "lax" as const,
              secure: globalThis.location.protocol === "https:",
              expires: new Date(userData.tokens.refresh_expires_at),
            },
          ),
        ]);

        if (!userData.user.email_confirmed) {
          router.push("/email-confirmation");
          return;
        }

        router.push("/browse");
      } catch {
        toast.error("Login failed. Please try again.");
      }
    },
    onError: (error) => {
      let errormsg = "";
      errormsg =
        typeof error.message === "string"
          ? error.message
          : (JSON.parse(error.message) as { message: string }).message;
      toast.error(errormsg);
      loginForm.reset();
    },
  });

  const onLoginSubmit = (data: z.infer<typeof loginSchema>) => {
    loginMutation.mutate(data);
  };

  if (isPasswordReset) {
    return (
      <div className="w-full">
        {resetStage === "email" ? (
          <PasswordResetEmailStage
            onBackToLogin={() => setIsPasswordReset(false)}
            onResetEmailSent={() => setResetStage("token")}
          />
        ) : (
          <PasswordResetTokenStage
            onBackToEmailStage={() => setResetStage("email")}
            onPasswordResetComplete={() => setIsPasswordReset(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="w-full">
      <Form {...loginForm}>
        <form
          onSubmit={loginForm.handleSubmit(onLoginSubmit)}
          className="space-y-6 w-full"
        >
          <FormField
            name="identifier"
            control={loginForm.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
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

          <FormField
            name="password"
            control={loginForm.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="bg-card/50 border-border focus:bg-card focus:ring-2 focus:ring-primary transition-colors"
                    autoComplete="current-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="button"
            variant="link"
            className="text-sm text-muted-foreground w-full justify-start px-0 cursor-pointer"
            onClick={() => setIsPasswordReset(true)}
          >
            Forgot Password?
          </Button>
          <Button
            type="submit"
            className="w-full h-12 text-base transition-opacity cursor-pointer"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
