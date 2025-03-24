"use client";

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
import { checkAndRefreshToken } from "@/hooks/useTokenRefresh";
import { AuthService } from "@/lib/requests";
import type { LoginResponse } from "@/types/authInterfaces";
import { loginSchema } from "@/types/authSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { setCookie } from "cookies-next/client";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type * as z from "zod";

export default function Login() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: "", password: "" },
  });
  const router = useRouter();

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
          secure: window.location.protocol === "https:",
          expires: new Date(userData.tokens.access_expires_at),
        };

        setCookie("user", JSON.stringify(userData.user), cookieOptions);
        setCookie(
          "access",
          JSON.stringify({
            access_token: userData.tokens.access_token,
            access_created_at: userData.tokens.access_created_at,
            access_expires_at: userData.tokens.access_expires_at,
          }),
          cookieOptions,
        );
        setCookie(
          "refresh",
          JSON.stringify({
            refresh_token: userData.tokens.refresh_token,
            refresh_created_at: userData.tokens.refresh_created_at,
            refresh_expires_at: userData.tokens.refresh_expires_at,
          }),
          cookieOptions,
        );

        setTimeout(
          () => void checkAndRefreshToken(),
          new Date(userData.tokens.access_expires_at).getTime() -
            Date.now() -
            30000,
        );

        router.push("/browse");
      } catch {
        setErrorMessage("Login failed. Please try again.");
      }
    },
    onError: (error) => {
      setErrorMessage(error.message);
      form.reset();
    },
  });

  const onSubmit = (data: z.infer<typeof loginSchema>) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="w-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 w-full"
        >
          <FormField
            name="identifier"
            control={form.control}
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
            control={form.control}
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

          {errorMessage && (
            <div className="text-destructive text-sm font-medium p-2 rounded bg-destructive/10">
              {errorMessage}
            </div>
          )}

          <Button
            type="submit"
            className="w-full h-12 text-base transition-opacity cursor-pointer"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Signing in...
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
